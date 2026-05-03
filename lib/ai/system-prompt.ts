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
import {
  findNearestCampuses,
  formatNearestCampusesForMilo,
} from "./tools/findNearestCampuses";

export type UserLocation = { lat: number; lng: number };

export type SystemBlock = {
  type: "text";
  text: string;
  cache_control?: { type: "ephemeral" };
};

/**
 * Detect a coarse language code (en/es/id/pt) from an Accept-Language header.
 * We only differentiate the languages our campuses speak. Everyone else gets
 * English. The first language with a quality score wins.
 */
export function detectLanguageFromHeader(header: string | null | undefined): "en" | "es" | "id" | "pt" {
  if (!header) return "en";
  const parts = header
    .toLowerCase()
    .split(",")
    .map((p) => {
      const [lang, qStr] = p.trim().split(";q=");
      return { lang: lang.split("-")[0], q: qStr ? Number(qStr) : 1 };
    })
    .filter((p) => Number.isFinite(p.q))
    .sort((a, b) => b.q - a.q);
  for (const { lang } of parts) {
    if (lang === "es" || lang === "id" || lang === "pt") return lang;
    if (lang === "en") return "en";
  }
  return "en";
}

const GREETING_HINT: Record<"en" | "es" | "id" | "pt", string> = {
  en: "The visitor's browser language is English. Default to English.",
  es: "The visitor's browser language is Spanish. Greet them in Spanish if the conversation hasn't established a language yet (\"Hola\" / \"Bienvenido\"). The Futuros campuses are Duluth (USA), Kennesaw (USA), Grayson (USA — launching), and Caracas / Maracaibo / Valencia / Barquisimeto (Venezuela — launching). They can switch to English mid-conversation.",
  id: "The visitor's browser language is Bahasa Indonesia. Greet them in Bahasa if the conversation hasn't established a language yet (\"Halo\" / \"Selamat datang\"). The Indonesian campuses are Cemani, Solo, Samarinda, Langowan, and Bali. They can switch to English mid-conversation.",
  pt: "The visitor's browser language is Portuguese. Greet warmly in Portuguese (\"Olá\") and let them know we don't have a Portuguese campus yet, but our Online campus + Daily Word work for them, and the closest live church is in Caracas, Venezuela (Spanish).",
};

/**
 * Async — pulls live campus intake data from Supabase. The intake block sits
 * AFTER the static roster + general knowledge so it overrides them when a
 * pastor has filled in real details.
 *
 * Each block is independently cacheable so a fresh intake update only
 * invalidates the intake block, not the personality / general knowledge.
 */
export async function buildSystemBlocks(
  pageContext?: string,
  language: "en" | "es" | "id" | "pt" = "en",
  userLocation?: UserLocation
): Promise<SystemBlock[]> {
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

  // Language hint — last so it sits closest to the user message and primes
  // the response language without polluting the cacheable knowledge blocks.
  if (language !== "en") {
    blocks.push({
      type: "text",
      text: `# Language hint\n${GREETING_HINT[language]}`,
    });
  }

  // User location context — only included when the visitor has shared their
  // coordinates this turn. NEVER cached (precision changes per-visitor) and
  // sits last so it overrides any earlier campus-distance assumptions.
  if (userLocation) {
    const nearest = findNearestCampuses(userLocation.lat, userLocation.lng, 3);
    blocks.push({
      type: "text",
      text:
        `# User location context\n` +
        `The visitor has shared their location this turn. Their three nearest ` +
        `Futures campuses by great-circle distance are:\n\n` +
        `${formatNearestCampusesForMilo(nearest)}\n\n` +
        `Use this to answer location-relevant questions directly. Lead with ` +
        `the closest one, name its distance and service time. When you ` +
        `mention a campus, preserve the [Campus name](/campuses/slug) ` +
        `markdown link form above so the page renders it as clickable. ` +
        `Offer the [plan a visit](/plan-a-visit) link too. Don't ask for ` +
        `their location again — you have it. If the closest is more than ` +
        `200 km away, acknowledge that visiting may not be practical and ` +
        `offer [online church](/watch) instead.`,
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
