// A tasteful, unmistakable "awaiting pastor voice" marker.
//
// Design intent: clearly labelled as *not yet written* without reading like
// debug syntax. An editorial "coming soon" note — dashed tone-coloured border,
// quiet typography, pastor's name present, and a soft italic line describing
// what's been asked of them. Visible to visitors as a warm placeholder. Visible
// to staff during QA as an unmistakable signal that this section is pending.

type PendingNoteProps = {
  /** Short uppercase eyebrow — e.g. "What to expect" */
  label: string;
  /** First-line invitation — e.g. "A note from Tony & Aste, coming soon." */
  heading: string;
  /** What the pastor has been asked to write, in plain English. */
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
        background: "rgba(253,251,246,0.7)",
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
          {label} · coming soon
        </p>
      </div>
      <p
        className="mt-4 font-display italic"
        style={{
          color: "#1C1A17",
          fontSize: 20,
          fontWeight: 300,
          lineHeight: 1.3,
        }}
      >
        {heading}
      </p>
      <p
        className="mt-3 font-sans"
        style={{ color: "#7A7068", fontSize: 12.5, lineHeight: 1.6, fontStyle: "italic" }}
      >
        We&rsquo;ve asked for {prompt}
      </p>
    </div>
  );
}
