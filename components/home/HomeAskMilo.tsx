"use client";

// HomeAskMilo — example questions section from the Claude Design draft.
// Shows 7 clickable question cards that pre-fill the Milo input on click.
// Lives between HomeMoments and HomePastors.

import Link from "next/link";

const EXAMPLES = [
  { q: "I'm new — where would I even sit?",         meta: "FIRST-TIME VISITOR" },
  { q: "What time does Sunday start in Bali?",        meta: "SERVICE TIMES" },
  { q: "Can my kids come? They're 4 and 9.",          meta: "KIDS CHURCH" },
  { q: "I'm not sure I believe any of this anymore.", meta: "HONEST QUESTION" },
  { q: "How do I get baptised?",                      meta: "NEXT STEPS" },
  { q: "Find the campus closest to me.",              meta: "NEAREST CAMPUS" },
  { q: "Tell me the story — who started this church?", meta: "HISTORY · 1922" },
  ];

export function HomeAskMilo() {
    function handleAsk(q: string) {
          // Scroll to hero and pre-fill Milo input via custom event
      const event = new CustomEvent("milo:prefill", { detail: { text: q } });
          window.dispatchEvent(event);
          window.scrollTo({ top: 0, behavior: "smooth" });
    }

  return (
        <section
                aria-labelledby="ask-milo-heading"
                className="mx-auto max-w-[1440px] px-6 py-20 sm:px-10 lg:px-16"
              >
              <div className="mb-12">
                      <p
                                  className="font-sans"
                                  style={{
                                                color: "#8A8178",
                                                fontSize: 11,
                                                letterSpacing: "0.22em",
                                                textTransform: "uppercase",
                                  }}
                                >
                                — Ask Milo
                      </p>p>
                      <h2
                                  id="ask-milo-heading"
                                  className="mt-4 font-display"
                                  style={{
                                                color: "#1C1A17",
                                                fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)",
                                                fontWeight: 300,
                                                lineHeight: 1.15,
                                                maxWidth: "22ch",
                                  }}
                                >
                                The questions you&rsquo;d{" "}
                                <em className="italic">never</em>em> ask out loud
                                &nbsp;&mdash; answered like a friend.
                      </h2>h2>
                      <p
                                  className="mt-4 font-sans"
                                  style={{ color: "#534D44", fontSize: 16, maxWidth: "52ch", lineHeight: 1.6 }}
                                >
                                No sign-up. No tracker. No weird marketing. Just a real conversation
                                about a real Sunday.
                      </p>p>
              </div>div>
        
              <div
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
                                                                boxShadow: "0 2px 8px -4px rgba(20,20,20,0.08)",
                                                }}
                                              >
                                              <p
                                                              className="font-display italic"
                                                              style={{ color: "#1C1A17", fontSize: 16, lineHeight: 1.45 }}
                                                            >
                                                            &ldquo;{ex.q}&rdquo;
                                              </p>p>
                                              <p
                                                              className="mt-3 font-sans"
                                                              style={{
                                                                                color: "#C8906B",
                                                                                fontSize: 11,
                                                                                letterSpacing: "0.18em",
                                                                                textTransform: "uppercase",
                                                              }}
                                                            >
                                                {ex.meta} → ASK MILO
                                              </p>p>
                                  </button>button>
                                ))}
              </div>div>
        
              <div className="mt-10">
                      <Link
                                  href="/how-milo-works"
                                  className="font-sans text-sm"
                                  style={{ color: "#8A8178", borderBottom: "1px dashed rgba(138,129,120,0.4)" }}
                                >
                                How Milo works →
                      </Link>Link>
              </div>div>
        </section>section>
      );
}
</section>
