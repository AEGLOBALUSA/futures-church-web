/**
 * Site-wide content slot registry. Source of truth for every editable
 * copy block on the public site that isn't per-campus.
 *
 * Default owner is "Josh Greenwood (or appointee)" — Josh re-delegates
 * via the admin coverage dashboard. Some slots are pre-assigned where
 * the obvious owner is someone else (e.g. /vision → Jane Evans).
 *
 * Naming: `<page>.<section>.<field>` lowercase-dashed. Stable forever
 * — once a slot id ships with content, never rename it.
 */

export type SlotDefinition = {
  /** Stable, dotted, never renamed once shipped. */
  id: string;
  /** Page route this slot lives on, for the dashboard's "Open" deeplink. */
  page: string;
  /** Human page title for grouping in the dashboard. */
  pageTitle: string;
  /** Field name shown in the badge + dashboard. */
  field: string;
  /** One-sentence guidance shown when the editor opens the slot. */
  guidance?: string;
  /**
   * Visual rendering hint — drives the SlotEditor's typography to match
   * the surrounding page. Editor inherits font + size from this style.
   */
  style: "display-italic-lg" | "display-md" | "body" | "body-lg" | "eyebrow";
  /** "Josh Greenwood (or appointee)" by default; overridden where obvious. */
  defaultOwner: string;
  /** Launch-blocker (1) → nice-to-have (3). */
  priority: 1 | 2 | 3;
  /** Approximate word budget so Josh knows the shape of the ask. */
  wordBudget?: string;
};

const JOSH = "Josh Greenwood (or appointee)";
const ASHLEY_OR_JANE = "Ashley & Jane Evans (or appointee)";

export const SLOT_REGISTRY: SlotDefinition[] = [
  // ── KIDS ───────────────────────────────────────────────────────
  {
    id: "kids.intro.headline",
    page: "/kids",
    pageTitle: "Kids",
    field: "Page headline",
    guidance: "What we want a parent to know in one line. Warm, specific, no jargon.",
    style: "display-md",
    defaultOwner: JOSH,
    priority: 1,
    wordBudget: "5–10 words",
  },
  {
    id: "kids.intro.body",
    page: "/kids",
    pageTitle: "Kids",
    field: "Program description",
    guidance: "What does Sunday morning look like for a 5-year-old? One paragraph. No marketing speak — describe the room.",
    style: "body-lg",
    defaultOwner: JOSH,
    priority: 1,
    wordBudget: "60–90 words",
  },
  {
    id: "kids.safety.line",
    page: "/kids",
    pageTitle: "Kids",
    field: "Safety line",
    guidance: "One sentence on screening + two-deep + check-in. Quiet confidence.",
    style: "body",
    defaultOwner: JOSH,
    priority: 1,
    wordBudget: "20–35 words",
  },

  // ── DREAMERS (YOUTH) ───────────────────────────────────────────
  {
    id: "dreamers.intro.headline",
    page: "/dreamers",
    pageTitle: "Dreamers",
    field: "Page headline",
    style: "display-md",
    defaultOwner: JOSH,
    priority: 1,
    wordBudget: "5–10 words",
  },
  {
    id: "dreamers.intro.body",
    page: "/dreamers",
    pageTitle: "Dreamers",
    field: "Program description",
    guidance: "What's a Friday night look like for a Year 9 girl who's never been? Concrete, specific.",
    style: "body-lg",
    defaultOwner: JOSH,
    priority: 1,
    wordBudget: "60–90 words",
  },

  // ── bU WOMEN ───────────────────────────────────────────────────
  {
    id: "women.intro.headline",
    page: "/women",
    pageTitle: "bU Women",
    field: "Page headline",
    style: "display-md",
    defaultOwner: "Jane Evans (or bU lead)",
    priority: 1,
    wordBudget: "5–10 words",
  },
  {
    id: "women.intro.body",
    page: "/women",
    pageTitle: "bU Women",
    field: "Vision paragraph",
    guidance: "What is bU? Why does it exist? Written in the voice of bU itself, not promotional.",
    style: "body-lg",
    defaultOwner: "Jane Evans (or bU lead)",
    priority: 1,
    wordBudget: "60–100 words",
  },

  // ── SELAH ──────────────────────────────────────────────────────
  {
    id: "selah.intro.headline",
    page: "/selah",
    pageTitle: "Selah",
    field: "Hero line",
    style: "display-md",
    defaultOwner: JOSH,
    priority: 1,
    wordBudget: "5–10 words",
  },
  {
    id: "selah.intro.body",
    page: "/selah",
    pageTitle: "Selah",
    field: "What Selah is",
    guidance: "For someone who's never heard of it: what is Selah, when, where, and why.",
    style: "body-lg",
    defaultOwner: JOSH,
    priority: 1,
    wordBudget: "70–110 words",
  },

  // ── BOOKS ──────────────────────────────────────────────────────
  {
    id: "books.intro.body",
    page: "/books",
    pageTitle: "Books",
    field: "Books page intro",
    guidance: "One paragraph on why Ashley & Jane keep writing. Their voice, not yours.",
    style: "body-lg",
    defaultOwner: ASHLEY_OR_JANE,
    priority: 2,
    wordBudget: "50–80 words",
  },

  // ── BIBLE APP ──────────────────────────────────────────────────
  {
    id: "bible-app.intro.body",
    page: "/bible-app",
    pageTitle: "Bible App",
    field: "App description",
    style: "body-lg",
    defaultOwner: JOSH,
    priority: 2,
    wordBudget: "50–80 words",
  },

  // ── HOMEPAGE ───────────────────────────────────────────────────
  {
    id: "home.hero.tagline",
    page: "/",
    pageTitle: "Home",
    field: "Hero tagline (under H1)",
    guidance: "One line. The thing you'd want a stranger to know about Futures in 8 seconds.",
    style: "body-lg",
    defaultOwner: ASHLEY_OR_JANE,
    priority: 1,
    wordBudget: "12–22 words",
  },

  // ── PLAN A VISIT ───────────────────────────────────────────────
  {
    id: "plan-a-visit.testimonial.signed-story",
    page: "/plan-a-visit",
    pageTitle: "Plan a Visit",
    field: "Signed first-visit story",
    guidance:
      "One real, signed story from a recent first-time visitor. Full name, city, ~150 words, written consent on file. Replaces the placeholder Carla story from the focus group.",
    style: "body-lg",
    defaultOwner: JOSH,
    priority: 1,
    wordBudget: "150–200 words",
  },

  // ── HISTORY ────────────────────────────────────────────────────
  {
    id: "history.recent-milestones",
    page: "/history",
    pageTitle: "History",
    field: "Recent milestones (post-2020)",
    guidance: "Verify and add any milestones from the last 5 years that aren't on the page.",
    style: "body",
    defaultOwner: ASHLEY_OR_JANE,
    priority: 2,
    wordBudget: "Free-form list",
  },

  // ── VISION ─────────────────────────────────────────────────────
  {
    id: "vision.intro.body",
    page: "/vision",
    pageTitle: "Vision",
    field: "Vision opening paragraph",
    guidance: "The one paragraph version of the 200-campus / 10,000-leaders / 200,000-souls vision. Why now, why us.",
    style: "body-lg",
    defaultOwner: ASHLEY_OR_JANE,
    priority: 1,
    wordBudget: "80–120 words",
  },

  // ── GIVE ───────────────────────────────────────────────────────
  {
    id: "give.intro.body",
    page: "/give",
    pageTitle: "Give",
    field: "Generosity paragraph",
    guidance: "Why give to Futures? In Futures' voice — generous, not guilt-inducing.",
    style: "body-lg",
    defaultOwner: JOSH,
    priority: 2,
    wordBudget: "60–90 words",
  },

  // ── CONTACT ────────────────────────────────────────────────────
  {
    id: "contact.intro.body",
    page: "/contact",
    pageTitle: "Contact",
    field: "Contact page lede",
    guidance: "How does someone reach a real human at Futures? Reassuring, low-friction.",
    style: "body-lg",
    defaultOwner: JOSH,
    priority: 2,
    wordBudget: "30–50 words",
  },
];

/** Group slots by page for the dashboard. */
export function groupSlotsByPage(): Map<string, SlotDefinition[]> {
  const map = new Map<string, SlotDefinition[]>();
  for (const slot of SLOT_REGISTRY) {
    const existing = map.get(slot.pageTitle) ?? [];
    existing.push(slot);
    map.set(slot.pageTitle, existing);
  }
  return map;
}

/** Look up a slot definition by id. */
export function slotById(id: string): SlotDefinition | undefined {
  return SLOT_REGISTRY.find((s) => s.id === id);
}

/** All slot definitions for one page route (e.g. "/kids"). */
export function slotsForPage(page: string): SlotDefinition[] {
  return SLOT_REGISTRY.filter((s) => s.page === page);
}
