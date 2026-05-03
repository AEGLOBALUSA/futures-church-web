import { streamText } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { promptFor } from "@/lib/ai/systemPrompts";
import { detectLanguageFromHeader } from "@/lib/ai/system-prompt";
import type { AIGuideContextName } from "@/lib/ai/AIGuideContext";

export const runtime = "edge";

type IncomingMessage = {
  role: "user" | "assistant";
  content: string;
};

type Payload = {
  message: string;
  context?: AIGuideContextName;
  history?: IncomingMessage[];
  /**
   * Visitor coordinates from a one-tap geolocation prompt. Used this turn
   * only — never stored, never logged at precision.
   */
  userLocation?: { lat: number; lng: number };
};

function isValidCoords(loc: unknown): loc is { lat: number; lng: number } {
  if (!loc || typeof loc !== "object") return false;
  const o = loc as { lat?: unknown; lng?: unknown };
  return (
    typeof o.lat === "number" &&
    typeof o.lng === "number" &&
    o.lat >= -90 &&
    o.lat <= 90 &&
    o.lng >= -180 &&
    o.lng <= 180
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

  const context = (body.context ?? "other") as AIGuideContextName;
  const history = (body.history ?? [])
    .filter((m) => m && typeof m.content === "string" && m.content.trim())
    .slice(-10);

  const messages = [
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: "user" as const, content: userText },
  ];

  const language = detectLanguageFromHeader(req.headers.get("accept-language"));
  const userLocation = isValidCoords(body.userLocation) ? body.userLocation : undefined;
  const system = await promptFor(context, language, userLocation);
  const result = await streamText({
    model: anthropic("claude-sonnet-4-6"),
    system,
    messages,
    temperature: 0.7,
    maxOutputTokens: 600,
  });

  return result.toTextStreamResponse();
}
