/**
 * Voice router — picks which voice(s) Selah speaks with for a given input.
 *
 * Returns a VoiceSignal with scores 0–1 for each voice. Threshold > 0.5
 * includes that voice in the blend. If none cross, default to Pastor.
 *
 * Uses a two-stage strategy:
 *   1. Keyword prior — fast, local, deterministic. Good at the obvious cases.
 *   2. Haiku classifier — slower, semantic, catches the subtle cases the
 *      keyword prior misses. Called only when the prior is ambiguous.
 */

import { Anthropic } from "@anthropic-ai/sdk";
import { PROPHET_VOICE, PROPHET_TRIGGERS } from "./prophet";
import { PASTOR_VOICE, PASTOR_TRIGGERS } from "./pastor";
import { STRATEGIST_VOICE, STRATEGIST_TRIGGERS } from "./strategist";

export type VoiceKey = "prophet" | "pastor" | "strategist";

export type VoiceSignal = {
  prophet: number; // 0–1
  pastor: number;
  strategist: number;
};

export type RouterContext = {
  role?: "member" | "pastor" | "both" | "curious";
  history?: { role: "user" | "assistant"; content: string }[];
};

const CLASSIFIER_SYSTEM = `You are a classifier for Selah, a biblical-worldview pastoral AI with three voices:

  - Prophet: truth-telling, correction, convicting clarity. For leadership drift, sin tolerance, culture compromise, unchecked ambition, avoidance of confrontation.
  - Pastor: gentleness, presence, healing. For grief, burnout, trauma, doubt, loneliness, shame, fear, dryness, questioning.
  - Strategist: apostolic, practical, forward motion. For church planting, team structure, leadership pipelines, hires, vision, multiplication, succession.

Read the user's input (and optional recent history) and return a strict JSON object with three numeric scores between 0 and 1 — one for each voice — representing how strongly each voice fits the input.

Response format (JSON, nothing else):
  { "prophet": 0.0-1.0, "pastor": 0.0-1.0, "strategist": 0.0-1.0 }

Rules:
- Return the raw JSON with no prose, no markdown, no code fences.
- Multiple voices can score high if the input has multiple layers (e.g. confronting a team member while grieving a friendship).
- If the input is purely practical/strategic, Pastor can still score 0.2–0.3 if the person's tone carries weight.
- If the input is pure grief or doubt, Strategist should score near 0.
- Default to Pastor when genuinely ambiguous.`;

function keywordPrior(text: string): VoiceSignal {
  const t = text.toLowerCase();
  const score = (triggers: readonly string[]) => {
    let hits = 0;
    for (const trigger of triggers) {
      if (t.includes(trigger)) hits += 1;
    }
    // Saturating: 0 hits → 0, 1 hit → 0.45, 2 hits → 0.65, 3+ → 0.8
    if (hits === 0) return 0;
    if (hits === 1) return 0.45;
    if (hits === 2) return 0.65;
    return 0.8;
  };

  return {
    prophet: score(PROPHET_TRIGGERS),
    pastor: score(PASTOR_TRIGGERS),
    strategist: score(STRATEGIST_TRIGGERS),
  };
}

function isConfidentPrior(signal: VoiceSignal): boolean {
  // Confident iff at least one voice scores ≥ 0.65 and the gap to the runner-up is ≥ 0.2.
  const vals = [signal.prophet, signal.pastor, signal.strategist].sort((a, b) => b - a);
  return vals[0] >= 0.65 && vals[0] - vals[1] >= 0.2;
}

async function classifyWithHaiku(
  input: string,
  context?: RouterContext,
): Promise<VoiceSignal> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // Graceful degradation in dev without an API key.
    return { prophet: 0, pastor: 0.6, strategist: 0 };
  }

  const client = new Anthropic({ apiKey });
  const historyLines = (context?.history ?? [])
    .slice(-4)
    .map((m) => `${m.role}: ${m.content}`)
    .join("\n");
  const userBlock = historyLines
    ? `Recent history:\n${historyLines}\n\nCurrent message:\n${input}`
    : input;

  try {
    const res = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 100,
      system: CLASSIFIER_SYSTEM,
      messages: [{ role: "user", content: userBlock }],
    });

    const block = res.content.find((c) => c.type === "text");
    if (!block || block.type !== "text") {
      return { prophet: 0, pastor: 0.6, strategist: 0 };
    }

    const parsed = JSON.parse(block.text.trim()) as Partial<VoiceSignal>;
    return {
      prophet: clamp(parsed.prophet ?? 0),
      pastor: clamp(parsed.pastor ?? 0),
      strategist: clamp(parsed.strategist ?? 0),
    };
  } catch {
    // On any failure, default to Pastor.
    return { prophet: 0, pastor: 0.6, strategist: 0 };
  }
}

function clamp(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

/**
 * Public API. Returns a VoiceSignal that the converse route uses to build
 * the hybrid system prompt.
 */
export async function pickVoices(
  input: string,
  context?: RouterContext,
): Promise<VoiceSignal> {
  const prior = keywordPrior(input);
  if (isConfidentPrior(prior)) return prior;
  // Ambiguous — call the semantic classifier.
  return classifyWithHaiku(input, context);
}

/**
 * Builds the voice-layer system prompt from a VoiceSignal.
 * Includes a hybrid coda when more than one voice is active.
 */
export function buildHybridSystemPrompt(signals: VoiceSignal): {
  prompt: string;
  active: VoiceKey[];
} {
  const parts: string[] = [];
  const active: VoiceKey[] = [];

  if (signals.prophet > 0.5) {
    parts.push(PROPHET_VOICE);
    active.push("prophet");
  }
  if (signals.pastor > 0.5) {
    parts.push(PASTOR_VOICE);
    active.push("pastor");
  }
  if (signals.strategist > 0.5) {
    parts.push(STRATEGIST_VOICE);
    active.push("strategist");
  }

  if (parts.length === 0) {
    parts.push(PASTOR_VOICE);
    active.push("pastor");
  }

  if (parts.length > 1) {
    parts.push(
      `You are speaking with multiple voices in harmony. Prophet speaks truth. Pastor holds the person. Strategist names the way forward. Blend them so the person hears one Selah, not three — truth with gentleness, direction with presence.`,
    );
  }

  return { prompt: parts.join("\n\n"), active };
}
