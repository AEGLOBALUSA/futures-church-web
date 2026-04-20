/**
 * R.I.S.E. Series theme embeddings.
 *
 * Pre-loaded so the AI can pull in the current season's framing
 * when a user's input matches the theme's triggers.
 */

export type RiseTheme = {
  week: number;
  title: string;
  scripture: string[];
  insight: string;
  triggers: string[];
};

export const RISE_THEMES: RiseTheme[] = [
  {
    week: 1,
    title: "First Love",
    scripture: ["Revelation 2:4-5", "Deuteronomy 8:11-14"],
    insight:
      "Keep first love alive through daily dependence. Revelation 2 is not a rebuke of activity but of affection that has gone cold while the work continued.",
    triggers: ["dryness", "drift", "fatigue", "first love", "cold", "going through the motions"],
  },
  {
    week: 2,
    title: "Rhythms of Renewal",
    scripture: ["Hebrews 4", "Matthew 4:4"],
    insight:
      "Sabbath and prayer are weapons, not luxuries. The rhythms that renew are the ones we refuse to surrender when life accelerates.",
    triggers: ["burnout", "sabbath", "rhythm", "rest", "overwhelmed", "no time to pray"],
  },
  {
    week: 5,
    title: "Innovation & Ancient",
    scripture: ["Acts 2:42-47"],
    insight:
      "Innovation must come from formation. Ancient tables, shared communion, new forms — the early church is not a museum piece, it is a pattern for reform.",
    triggers: ["innovation", "multiplication", "new thing", "reform", "renewal", "planting"],
  },
  {
    week: 10,
    title: "Leadership Development",
    scripture: ["2 Timothy 2:2"],
    insight:
      "Multiplication over management. Raise leaders who raise leaders. Paul's pattern is four generations deep in a single verse — Paul, Timothy, faithful men, others also.",
    triggers: ["leadership-pipeline", "succession", "raise up", "mentoring", "hiring"],
  },
];

/**
 * Pick R.I.S.E. themes that match a given input's triggers.
 * Used by the converse route to inject theme context into the system prompt.
 */
export function matchRiseThemes(input: string): RiseTheme[] {
  const t = input.toLowerCase();
  return RISE_THEMES.filter((theme) =>
    theme.triggers.some((trigger) => t.includes(trigger)),
  );
}

/**
 * Format a set of matched themes as a system-prompt fragment.
 */
export function formatThemesForPrompt(themes: RiseTheme[]): string {
  if (themes.length === 0) return "";
  const lines = themes.map(
    (t) =>
      `- "${t.title}" (R.I.S.E. Week ${t.week}): ${t.insight} Scripture anchors: ${t.scripture.join(", ")}.`,
  );
  return `The current R.I.S.E. Series theme(s) relevant to this person's question:\n${lines.join("\n")}\n\nIf it fits naturally, you may draw the theme in. Do not force it.`;
}
