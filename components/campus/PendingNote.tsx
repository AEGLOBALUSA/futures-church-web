// A tasteful, unmistakable "awaiting pastor voice" marker.
//
// Renders on public pages wherever a campus hasn't yet returned their answers
// to Futures-Staff-Questionnaire. Designed so:
//   • A visitor reads it as a warm "coming soon" note, not a broken page.
//   • Staff doing QA can see at a glance which sections are still pending.
//   • The placeholder itself names the pastor(s) and the specific thing owed,
//     so whoever fills it in knows exactly what to write.

type PendingNoteProps = {
  /** Short uppercase eyebrow — e.g. "What to expect" */
  label: string;
  /** First-line invitation — e.g. "A note from Tony & Aste, coming soon." */
  heading: string;
  /** What the pastor needs to write, in plain English. */
  prompt: string;
  /** Region tone hex — matches the rest of the page. */
  tone: string;
};

export function PendingNote({ label, heading, prompt, tone }: PendingNoteProps) {
  return (
    <div
      data-pending-voice
      className="rounded-[18px] p-6 sm:p-7"
      style={{
        background: "rgba(253,251,246,0.6)",
        border: `1px dashed ${tone}`,
        color: "#534D44",
      }}
    >
      <div className="flex items-center gap-2">
        <span
          aria-hidden
          className="inline-block h-1.5 w-1.5 rounded-full"
          style={{ background: tone }}
        />
        <p
          className="font-sans"
          style={{
            color: tone,
            fontSize: 10,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          {label} · awaiting pastor voice
        </p>
      </div>
      <p
        className="mt-3 font-display italic"
        style={{
          color: "#1C1A17",
          fontSize: 18,
          fontWeight: 300,
          lineHeight: 1.3,
        }}
      >
        {heading}
      </p>
      <p
        className="mt-2 font-sans"
        style={{ color: "#7A7068", fontSize: 12, lineHeight: 1.55 }}
      >
        <span aria-hidden>[ </span>
        insert answer — {prompt}
        <span aria-hidden> ]</span>
      </p>
    </div>
  );
}
