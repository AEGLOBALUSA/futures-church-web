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

  // True when the content above is editor-drafted scaffolding awaiting
  // pastor review (not yet confirmed by the campus). Renders a visible
  // "Draft · pending pastor review" ribbon on the live page so the status
  // is unmistakable to visitors and staff.
  isDraft?: boolean;
};

// All 25 campus slugs registered. Empty object = nothing authored yet = placeholder
// will render on the page. As copy comes back from pastors, fill fields in.
export const campusVoices: Record<string, CampusVoice> = {
  // ── Pilot three ──────────────────────────────────────────────────────────
  //
  // The three pilots below are editor-drafted scaffolding (isDraft: true).
  // They establish three distinct voice patterns — understated Australian
  // (Paradise), warm Indonesian welcome (Bali), direct Southern US
  // (Gwinnett) — while avoiding fabricated personal detail that the
  // pastors haven't confirmed. Replace each field with real answers from
  // content/campuses/_source/<slug>.md once the questionnaire returns.
  //
  paradise: {
    isDraft: true,
    whatToExpect:
      "Paradise sits up in the Adelaide foothills and Sunday mornings move at an unhurried pace. People drift in, grab a coffee, find a row. The worship is honest, the preaching is plain, and nothing about the room feels performed. This congregation has been gathering here since 1922 — something steady about that.",
    specifics: [
      "A century at the same postcode — Paradise was Futures' first campus, and you can feel the quiet depth of that.",
      "Coffee stays on well after the final song — no one's in a rush to leave.",
      "Understated Aussie cadence from the stage — nothing shouty, nothing slick, nothing you'd need to translate to a mate.",
    ],
    firstTimeLine:
      "Come as you are, park out front, say hello to whoever's at the door — then take a seat and get your bearings. No one will chase you.",
    kidsBlock:
      "Kids check in at the welcome desk on the way through — we'll need a parent's phone and anything we should know about allergies or pickup. Age groups run from nursery through Year 6. Rooms are bright, appropriately loud, always safe. Pickup is through the same door you came in — same card, same lanyard.",
  },
  bali: {
    isDraft: true,
    whatToExpect:
      "Futures Bali gathers in Denpasar — a room of Balinese and Indonesian believers, with plenty of expats and visitors in the mix. Worship leans into both Indonesian and English across our services. The pace is warm, unhurried, and generous with time. Sundays here feel like family you didn't know you had.",
    specifics: [
      "Services run in Bahasa Indonesia, with English threaded through — nobody is left outside the room.",
      "The island runs on different time — we start when we start, and we finish when the stories do.",
      "Expect to meet someone from three different countries before you leave.",
    ],
    firstTimeLine:
      "Come as you are — in the Bali heat, that usually means sandals and a smile. Someone will greet you in whichever language works.",
    kidsBlock:
      "Kids check in at the entrance when you arrive — a parent signs them in, and the same parent signs them out. Age groups run from toddlers through pre-teens, in Bahasa Indonesia with English support where needed. The rooms are bright, energetic, and safe. Parents can expect to enjoy the service without interruption.",
  },
  gwinnett: {
    isDraft: true,
    whatToExpect:
      "Futures Gwinnett meets in Duluth, and the room carries the whole of suburban Atlanta — every age, every background, genuinely every walk. Worship is direct, the teaching is practical, and the coffee is strong. If you've been turned off by church before, come anyway. This room tends to surprise people.",
    specifics: [
      "The parking lot tells the whole story — every state plate, every age of car, every decade of life.",
      "Kids ministry is one of the loudest, warmest rooms on the entire property.",
      "Southern warmth without Southern performance — people actually mean it when they ask how you are.",
    ],
    firstTimeLine:
      "Pull in, grab a cup at the café, let someone hold the door. Nobody's going to make a big deal of you being new, but they will notice you.",
    kidsBlock:
      "Kids check in at the main entrance the first time, and after that you scan a tag to drop off and pick up. Age groups run from nursery through 5th grade, each with their own room and their own leaders. Sundays in the kids wing are loud, bright, and air-conditioned within an inch of their life.",
  },

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
