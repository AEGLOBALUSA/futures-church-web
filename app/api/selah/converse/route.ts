/**
 * /api/selah/converse — the main Selah streaming endpoint.
 *
 * =============================================================================
 *  ZERO-RETENTION COVENANT
 * =============================================================================
 *  This route does not write user message content to any database, log file,
 *  analytics event, or error tracker. No transcript ever leaves the user's
 *  session. No human — not Ashley, not a moderator, not a pastor — ever sees
 *  a conversation.
 *
 *  The only things we emit:
 *    - response headers with the active voices + themes + whether the safety
 *      classifier fired (boolean only, no category, no content).
 *    - aggregate counters in memory for rate limiting (count only, no text).
 *
 *  If you add logging of any kind, it MUST exclude `userText`, `history`,
 *  and the streamed response body. If in doubt, don't log.
 * =============================================================================
 *
 * Pipeline:
 *   1. Parse payload (message + optional history + optional user context).
 *   2. Rate-limit check — returns a warm message if exceeded (never a 429).
 *   3. Safety classifier — deterministic regex pass BEFORE the model sees
 *      anything. If it fires, stream back crisis resources directly and skip
 *      the model entirely. No human is pinged.
 *   4. Voice router → VoiceSignal via keyword prior, then Haiku classifier
 *      if the prior is ambiguous.
 *   5. Build layered system prompt.
 *   6. Stream response via Vercel AI SDK + Claude Sonnet 4.6.
 *
 * Runtime: nodejs (Anthropic SDK is used for the Haiku classifier).
 */

import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { pickVoices, buildHybridSystemPrompt } from "@/lib/selah/voices/router";
import { CLARIFIER_INSTRUCTIONS } from "@/lib/selah/clarifier";
import { BIBLE_FIRST_INSTRUCTIONS } from "@/lib/selah/bibleFirst";
import { matchRiseThemes, formatThemesForPrompt } from "@/lib/selah/rise/themes";
import { classifyCrisis, crisisResponse } from "@/lib/selah/safety";
import { acquireLimit } from "@/lib/selah/rateLimit";

export const runtime = "nodejs";
export const maxDuration = 60;

type IncomingMessage = { role: "user" | "assistant"; content: string };
type UserContext = { role?: "member" | "pastor" | "both" | "curious" };
type Payload = {
  message: string;
  history?: IncomingMessage[];
  context?: UserContext;
  sessionId?: string;
};

const BASE_IDENTITY = `You are Selah.

Selah is a biblical-worldview pastoral companion. You sit alongside real pastoral care, real therapy, and a person's own doctor — never replacing any of them.

You are never a therapist, never a crisis line, and never a substitute for a real pastor. If a conversation drifts into acute crisis, urgent medical risk, or disclosure of active abuse, pause the normal flow and point the person to real-time help (988 in the US, 13 11 14 in Australia, 116 123 in the UK/Samaritans).

Hard rules:
  - Do not diagnose.
  - Do not prescribe medication, doses, or treatment plans.
  - Do not give specific medical, legal, or financial advice.
  - Do not promise outcomes.
  - Do not recommend specific churches, therapists, or products.
  - Never claim to be a human. If asked, say plainly: "I'm Selah — an AI companion grounded in Scripture."
  - Never generate content outside Selah's pastoral scope (no code, no homework help, no political takes).
  - Never collect payment, passwords, or ID numbers.
  - Never promise to connect the user to a real person — Selah is self-contained. If they need a human, tell them how to find one (their local church, a counselor, a crisis line). Don't summon one.

Length: usually under 220 words per turn. Shorter when the Clarifier asks a single question.`;

function textStreamOf(text: string): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(text));
      controller.close();
    },
  });
  return new Response(stream, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}

function getClientIp(req: Request): string {
  const xf = req.headers.get("x-forwarded-for") ?? "";
  const first = xf.split(",")[0]?.trim();
  return first || req.headers.get("x-real-ip") || "unknown";
}

function getCountryHint(req: Request): string | undefined {
  return (
    req.headers.get("x-country") ??
    req.headers.get("cf-ipcountry") ??
    req.headers.get("x-vercel-ip-country") ??
    req.headers.get("x-nf-geo")?.match(/"country":"([A-Z]{2})"/)?.[1] ??
    undefined
  );
}

export async function POST(req: Request) {
  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const userText = (body.message ?? "").trim();
  if (!userText) return new Response("Empty message", { status: 400 });

  const history = (body.history ?? [])
    .filter((m) => m && typeof m.content === "string" && m.content.trim())
    .slice(-8);

  const sessionId = (body.sessionId ?? "anon").slice(0, 64);
  const ip = getClientIp(req);

  // --- Rate limiting (warm message, not 429) ---
  const gate = acquireLimit({ sessionId, ip });
  if (!gate.ok) {
    const r = textStreamOf(gate.warmMessage);
    r.headers.set("x-selah-limited", "1");
    return r;
  }

  // --- Safety classifier (in-message only, never pings a human) ---
  const crisis = classifyCrisis(userText);
  if (crisis.triggered) {
    const country = getCountryHint(req);
    const reply = crisisResponse(crisis.category, country);
    gate.release();
    const r = textStreamOf(reply);
    r.headers.set("x-selah-safety", "1"); // boolean only — never the category
    return r;
  }

  // --- Voice routing ---
  const signals = await pickVoices(userText, {
    role: body.context?.role,
    history,
  });
  const { prompt: voicePrompt, active } = buildHybridSystemPrompt(signals);

  // --- R.I.S.E. theme match ---
  const themes = matchRiseThemes(userText);
  const themeFragment = formatThemesForPrompt(themes);

  // --- Composed system prompt ---
  const system = [
    BASE_IDENTITY,
    CLARIFIER_INSTRUCTIONS,
    BIBLE_FIRST_INSTRUCTIONS,
    voicePrompt,
    themeFragment,
  ]
    .filter(Boolean)
    .join("\n\n---\n\n");

  const messages = [
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: "user" as const, content: userText },
  ];

  const result = await streamText({
    model: anthropic("claude-sonnet-4-5"),
    system,
    messages,
    temperature: 0.55,
    maxOutputTokens: 700,
    // IMPORTANT: no onFinish/onError handler that captures content.
    // Any telemetry goes to counters only (see rateLimit.ts).
    onFinish: () => gate.release(),
  });

  const headers = new Headers();
  headers.set("x-selah-voices", active.join(","));
  if (themes.length > 0) {
    headers.set("x-selah-themes", themes.map((t) => t.title).join(","));
  }

  const streamResponse = result.toTextStreamResponse();
  headers.forEach((v, k) => streamResponse.headers.set(k, v));
  return streamResponse;
}
