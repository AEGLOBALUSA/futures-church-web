// Composed Milo system prompt — assembles personality + knowledge + roster
// from lib/ai/milo-knowledge.ts. Two shapes are exported:
//
//   SYSTEM_PROMPT — single string, for OpenAI and any caller that wants the
//     full system prompt as one chunk.
//
//   buildSystemBlocks() — array of content blocks with cache_control on the
//     stable parts, for Anthropic prompt caching (10× cheaper on cache hits).

import {
  buildCampusRoster,
  buildCampusIntakeBlock,
  buildMiloKnowledge,
  buildPageContext,
  MILO_PERSONALITY,
} from "./milo-knowledge";
import { buildEventsKnowledgeForMilo } from "@/lib/events/server";

export type SystemBlock = {
  type: "text";
  text: string;
  cache_control?: { type: "ephemeral" };
};

/**
 * Async — pulls live campus intake data from Supabase. The intake block sits
 * AFTER the static roster + general knowledge so it overrides them when a
 * pastor has filled in real details.
 *
 * Each block is independently cacheable so a fresh intake update only
 * invalidates the intake block, not the personality / general knowledge.
 */
export async function buildSystemBlocks(pageContext?: string): Promise<SystemBlock[]> {
  const blocks: SystemBlock[] = [
    { type: "text", text: MILO_PERSONALITY },
    {
      type: "text",
      text: `# Current campus roster (source of truth — use these names and pastors)\n${buildCampusRoster()}`,
      cache_control: { type: "ephemeral" },
    },
    {
      type: "text",
      text: buildMiloKnowledge(),
      cache_control: { type: "ephemeral" },
    },
  ];

  // Intake block — only added when at least one campus has filled in data.
  // Failure to load doesn't break Milo; he just falls back to static roster.
  try {
    const intakeBlock = await buildCampusIntakeBlock();
    if (intakeBlock) {
      blocks.push({
        type: "text",
        text: intakeBlock,
        cache_control: { type: "ephemeral" },
      });
    }
  } catch (err) {
    console.error("buildCampusIntakeBlock failed", err);
  }

  // Events block — upcoming events across all campuses, next 30 days.
  // This block invalidates the most often (events change weekly), so we keep
  // it last and small so the cache hit rate on the bigger blocks stays high.
  try {
    const eventsBlock = await buildEventsKnowledgeForMilo();
    if (eventsBlock) {
      blocks.push({
        type: "text",
        text: eventsBlock,
        cache_control: { type: "ephemeral" },
      });
    }
  } catch (err) {
    console.error("buildEventsKnowledgeForMilo failed", err);
  }

  if (pageContext) {
    blocks.push({
      type: "text",
      text: `# Page context\n${buildPageContext(pageContext)}`,
    });
  }
  return blocks;
}

// Synchronous string form for OpenAI / legacy callers — no intake data.
// (OpenAI doesn't have prompt caching; saving a DB roundtrip is fine here.)
export function buildStaticSystemPrompt(pageContext?: string): string {
  const parts = [
    MILO_PERSONALITY,
    `# Current campus roster (source of truth — use these names and pastors)\n${buildCampusRoster()}`,
    buildMiloKnowledge(),
  ];
  if (pageContext) parts.push(`# Page context\n${buildPageContext(pageContext)}`);
  return parts.join("\n\n");
}

export const SYSTEM_PROMPT = buildStaticSystemPrompt();

// Suggested home-page chip prompts.
export const SUGGESTED_PROMPTS = [
  "Where is my nearest campus?",
  "Tell me about Ashley and Jane Evans",
  "What is Selah — and when does it launch?",
  "I'm new — what happens on a Sunday?",
  "Can someone pray for me?",
  "Tell me about the vision for 200 campuses",
  "What's the women's movement at Futures?",
  "Is there something for my teenagers?",
];
