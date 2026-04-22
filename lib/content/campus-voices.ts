// Per-campus voice. Source of truth for the copy that should read like *this
// campus wrote it* — not like headquarters published it. Populated from
// Futures-Staff-Questionnaire responses (archived in content/campuses/_source/).
//
// Every field is optional. When a field is missing, the campus page renders a
// visible "awaiting pastor voice" placeholder instead of generic fill copy.
// That way:
//   • Public visitors never see templated warmth ("greeted at the door — for real").
//   • Staff can see at a glance on the live site which campuses still owe answers.
//   • Authored copy drops in field-by-field without a template rewrite.

export type CampusVoice = {
  // "What to expect" paragraph — under 60 words, in the pastor's voice.
  whatToExpect?: string;

  // Two to three specifics no other campus could claim. One-liners.
  // Example: "the Paradise Roasters coffee van that shows up at 9:15."
  specifics?: string[];

  // One line: what a first-time visit at THIS campus feels like.
  firstTimeLine?: string;

  // Pastor bio in first-person. Voice, not résumé. ~60-100 words.
  pastorBio?: string;

  // Kids ministry — per-campus specifics. What check-in looks like,
  // age groups, room energy. Under 80 words.
  kidsBlock?: string;
};

// All 25 campus slugs registered. Empty object = nothing authored yet = placeholder
// will render on the page. As copy comes back from pastors, fill fields in.
export const campusVoices: Record<string, CampusVoice> = {
  // ── Pilot three ──────────────────────────────────────────────────────────
  paradise: {},
  bali: {},
  gwinnett: {},

  // ── Australia ────────────────────────────────────────────────────────────
  "adelaide-city": {},
  south: {},
  "clare-valley": {},
  salisbury: {},
  "mount-barker": {},
  "victor-harbor": {},
  "copper-coast": {},
  online: {},

  // ── USA (Futures English) ────────────────────────────────────────────────
  kennesaw: {},
  alpharetta: {},
  franklin: {},

  // ── Indonesia ────────────────────────────────────────────────────────────
  cemani: {},
  solo: {},
  samarinda: {},
  langowan: {},

  // ── Futuros (Spanish) ────────────────────────────────────────────────────
  "futuros-duluth": {},
  "futuros-kennesaw": {},
  "futuros-grayson": {},

  // ── Venezuela (launching) ────────────────────────────────────────────────
  "futuros-caracas": {},
  "futuros-maracaibo": {},
  "futuros-valencia": {},
  "futuros-barquisimeto": {},
};

// Ergonomic accessor — returns empty object rather than undefined so callers
// can destructure without guarding.
export function getCampusVoice(slug: string): CampusVoice {
  return campusVoices[slug] ?? {};
}

// Used by staff/build audits — which campuses still have unfilled fields?
// Keep alphabetical by slug so diffs are readable.
export function pendingFields(slug: string): (keyof CampusVoice)[] {
  const v = getCampusVoice(slug);
  const all: (keyof CampusVoice)[] = [
    "whatToExpect",
    "specifics",
    "firstTimeLine",
    "pastorBio",
    "kidsBlock",
  ];
  return all.filter((k) => {
    const val = v[k];
    if (val === undefined || val === null) return true;
    if (Array.isArray(val)) return val.length === 0;
    if (typeof val === "string") return val.trim().length === 0;
    return false;
  });
}
