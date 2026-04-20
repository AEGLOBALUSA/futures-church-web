/**
 * Selah safety classifier — IN-MESSAGE ONLY.
 *
 * Design principles (locked):
 *   1. Never pings a human. No webhook. No pastor alert. No moderator inbox.
 *   2. Never logs the triggering message content.
 *   3. Deterministic pre-filter runs BEFORE the model, so we surface
 *      real-world help instantly instead of letting the model be cute.
 *   4. Works with just a country code — no precise geo-IP required.
 *
 * Categories:
 *   - self_harm     suicidal ideation, self-injury, overdose
 *   - harm_to_other active violence toward someone else
 *   - abuse         active abuse being disclosed (physical, sexual, domestic)
 *   - medical       active medical emergency (bleeding, unconscious, OD)
 *   - psychosis     acute disorganisation + distress
 *
 * Triggers are kept *broad* on purpose — better a false positive that
 * surfaces a hotline than a false negative that doesn't.
 */

export type CrisisCategory =
  | "self_harm"
  | "harm_to_other"
  | "abuse"
  | "medical"
  | "psychosis";

export type CrisisResult =
  | { triggered: false }
  | { triggered: true; category: CrisisCategory };

// Regexes must be tight enough to avoid catching obvious theological use —
// e.g. "die to self" is not self_harm; "kill the old man" is not violence.
const SELF_HARM = [
  /\b(kill(?:ing)?|hurt(?:ing)?|harm(?:ing)?)\s+(my)?self\b/i,
  /\b(end|take)\s+(my|it|everything)\s*(life|all)?\b/i,
  /\bi\s*want\s*to\s*(die|disappear|not\s*exist|be\s*gone)\b/i,
  /\bsuicid(e|al)\b/i,
  /\bnot\s*(worth|want)\s*(living|being\s*here|existing)\b/i,
  /\bcutting\s*(myself|again)\b/i,
  /\boverdos(e|ing|ed)\b/i,
  /\b(pills|razor|rope|gun)\s+(to|for)\s+(myself|end)\b/i,
  /\bbetter\s*off\s*(dead|without\s*me|if\s*i)\b/i,
];

const HARM_TO_OTHER = [
  /\b(kill(?:ing)?|hurt(?:ing)?|attack(?:ing)?)\s+(him|her|them|my\s+(?:wife|husband|kid|child|partner|mum|mom|dad))\b/i,
  /\bi('?m|\s+am)?\s+going\s+to\s+(kill|hurt|shoot|stab)\b/i,
];

const ABUSE = [
  /\bhe(?:'s| is)?\s*(hit|hitting|beating|raping|forcing|touching)\s*me\b/i,
  /\bshe(?:'s| is)?\s*(hit|hitting|beating|forcing)\s*me\b/i,
  /\b(raped|rape|sexual(?:ly)?\s*assault(?:ed)?)\b/i,
  /\b(domestic\s*violence|abusive\s*(?:husband|wife|partner|dad|mum|mom|parent))\b/i,
  /\bhe(?:'s| is)?\s*touching\s*(?:my|the)\s*(kid|child|son|daughter)\b/i,
];

const MEDICAL = [
  /\bbleed(?:ing)?\s*(a\s*lot|heavily|out|bad(?:ly)?)\b/i,
  /\bcan('?t| not)\s*(breathe|wake)\b/i,
  /\b(unconscious|passed\s*out|overdos(?:ed|ing))\b/i,
  /\bchest\s*pain\b.*\b(can'?t\s*breathe|arm|left)\b/i,
];

const PSYCHOSIS = [
  /\bvoices\s+(are\s+)?(telling|commanding)\s+me\s+to\s+(hurt|kill)\b/i,
  /\bthey('?re|\s+are)\s+(all\s+)?(after|watching|hunting)\s+me\b/i,
];

const RULES: Array<{ category: CrisisCategory; patterns: RegExp[] }> = [
  { category: "self_harm", patterns: SELF_HARM },
  { category: "harm_to_other", patterns: HARM_TO_OTHER },
  { category: "abuse", patterns: ABUSE },
  { category: "medical", patterns: MEDICAL },
  { category: "psychosis", patterns: PSYCHOSIS },
];

export function classifyCrisis(input: string): CrisisResult {
  const text = input ?? "";
  for (const { category, patterns } of RULES) {
    if (patterns.some((p) => p.test(text))) return { triggered: true, category };
  }
  return { triggered: false };
}

/**
 * The reply we stream back when a crisis trigger fires. Warm, plain, true.
 * Never claims to be a human. Names real services. Never asks to "connect"
 * the user to a Futures pastor — Selah is self-contained.
 */
export function crisisResponse(category: CrisisCategory, countryHint?: string): string {
  const lines = CRISIS_OPENERS[category];
  const resources = crisisResources(countryHint);
  return `${lines}\n\n${resources}\n\nI can stay here with you — but I'm an AI, not a human. What you're carrying is real, and a real person on the other end of one of those numbers is trained for exactly this. Please call. I'll still be here after.`;
}

const CRISIS_OPENERS: Record<CrisisCategory, string> = {
  self_harm:
    "I'm taking what you just said seriously. If any part of you is thinking about ending your life or hurting yourself, I want you to talk to a person right now — not to me.",
  harm_to_other:
    "I want to sit with you, but if you're thinking about hurting someone, this needs a human on the other end — right now.",
  abuse:
    "What you're describing is not okay, and you shouldn't have to carry it alone. There are people trained to help — please reach them now.",
  medical:
    "This sounds like a medical emergency. Please call emergency services or get to a hospital immediately — I'll wait.",
  psychosis:
    "I'm hearing how distressing this is, and I'm not the right help for what you're going through. Please talk to a person trained for this right now.",
};

function crisisResources(countryHint?: string): string {
  const c = (countryHint ?? "").toUpperCase();
  // Default: show all three primary lines. Emphasise the one matching country.
  const usa = "988 (US · call or text, 24/7)";
  const aus = "Lifeline 13 11 14 (Australia · 24/7)";
  const uk = "Samaritans 116 123 (UK · 24/7)";
  if (c === "US") return `**${usa}**\n${aus}\n${uk}\nOr your local emergency number.`;
  if (c === "AU") return `**${aus}**\n${usa}\n${uk}\nOr your local emergency number.`;
  if (c === "GB" || c === "UK")
    return `**${uk}**\n${usa}\n${aus}\nOr your local emergency number.`;
  return `${usa}\n${aus}\n${uk}\nOr your local emergency number.`;
}
