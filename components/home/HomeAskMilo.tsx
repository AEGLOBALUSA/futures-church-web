"use client";

// HomeAskMilo — example questions section from the Claude Design draft.
// Shows 7 clickable question cards that pre-fill the Milo input on click.
// Lives between HomeMoments and HomePastors.

import Link from "next/link";

const EXAMPLES = [
  { q: "I'm new — where would I even sit?", meta: "FIRST-TIME VISITOR" },
  { q: "What time does Sunday start in Bali?", meta: "SERVICE TIMES" },
  { q: "Can my kids come? They're 4 and 9.", meta: "KIDS CHURCH" },
  { q: "I'm not sure I believe any of this anymore.", meta: "HONEST QUESTION" },
  { q: "How do I get baptised?", meta: "NEXT STEPS" },
  { q: "Find the campus closest to me.", meta: "NEAREST CAMPUS" },
  { q: "Tell me the story — who started this church?", meta: "HISTORY · 1922" },
];

export function HomeAskMilo() {
  function handleAsk(q: string) {
    const event = new CustomEvent("milo:prefill", { detail: { text: q } });
    window.dispatchEvent(event);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <section
      aria-labelledby="ask-milo-heading"
      className="mx-auto max-w-[1440px] px-6 py-20 sm:px-10 lg:px-16"
    >
      <p
        className="font-sans text-xs uppercase"
        style={{ color: "#C8906B", letterSpacing: "0.18em" }}
      >
        Ask Milo
      </p>
      <h2
        id="ask-milo-heading"
        className="mt-4 font-display"
        style={{
          color: "#1C1A17",
          fontSize: "clamp(2rem, 4vw, 2.75rem)",
          fontWeight: 300,
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
        }}
      >
        {"What's on your mind?"}
      </h2>
      <p
        className="mt-4 font-sans"
        style={{ color: "#8A8178", fontSize: 16, maxWidth: 480 }}
      >
        Our AI guide knows Futures Church inside out. Tap a question to start — or ask your own.
      </p>

      <div
        className="mt-10"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 12,
        }}
      >
        {EXAMPLES.map((ex) => (
          <button
            key={ex.q}
            type="button"
            onClick={() => handleAsk(ex.q)}
            className="group rounded-2xl p-5 text-left transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: "rgba(255,253,248,0.7)",
              border: "1px solid rgba(28,26,23,0.08)",
              cursor: "pointer",
            }}
          >
            <p
              className="font-display italic"
              style={{ color: "#1C1A17", fontSize: 16 }}
            >
              &ldquo;{ex.q}&rdquo;
            </p>
            <p
              className="mt-3 font-sans"
              style={{
                color: "#C8906B",
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              {ex.meta} &#8594; ASK MILO
            </p>
          </button>
        ))}
      </div>

      <div className="mt-10">
        <Link
          href="/how-milo-works"
          className="font-sans text-sm"
          style={{ color: "#8A8178", borderBottom: "1px dashed rgba(138,129,120,0.4)" }}
        >
          How Milo works &#8594;
        </Link>
      </div>
    </section>
  );
}
