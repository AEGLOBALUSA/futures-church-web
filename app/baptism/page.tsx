import type { Metadata } from "next";
import { ValueExchangeForm } from "@/components/forms/ValueExchangeForm";

export const metadata: Metadata = {
  title: "Baptism — Futures Church",
  description:
    "Ready to be baptised? Find upcoming dates across our campuses and register your interest.",
};

const WHAT_TO_EXPECT = [
  {
    q: "What is baptism?",
    a: "Baptism is a public declaration — in water — that Jesus has changed your life. It's not what saves you; it's how you say to everyone watching: I belong to him.",
  },
  {
    q: "What actually happens?",
    a: "PLACEHOLDER — Describe the Futures baptism service. Full immersion? Pool? Ocean? Who leads it? What does the service look like?",
  },
  {
    q: "Do I need to prepare?",
    a: "PLACEHOLDER — Describe any preparation required. Is there a conversation with a pastor first? A baptism class? How long does preparation take?",
  },
  {
    q: "What should I wear?",
    a: "PLACEHOLDER — What to wear. What Futures provides (towel, change area, etc.).",
  },
  {
    q: "Can I invite people?",
    a: "Absolutely. Bring your family, your friends, your whole small group. Baptism is a celebration — the more the better.",
  },
  {
    q: "What about child dedications?",
    a: "PLACEHOLDER — Describe Futures child dedication. Who it's for, what happens, how it differs from baptism, upcoming dates.",
  },
];

export default function BaptismPage() {
  return (
    <main className="bg-cream text-ink-900">
      {/* Hero */}
      <section
        className="px-6 pb-16 pt-32 sm:px-10"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(204,143,74,0.12) 0%, transparent 60%), #FDFBF6",
        }}
      >
        <div className="mx-auto max-w-[820px]">
          <p className="font-ui uppercase text-warm-600" style={{ fontSize: 11, letterSpacing: "0.28em" }}>
            Baptism
          </p>
          <h1
            className="mt-3 font-display text-ink-900"
            style={{ fontSize: "clamp(2.5rem,5.6vw,4.5rem)", fontWeight: 300, lineHeight: 1.02 }}
          >
            Something real happened.
            <br />
            <em className="italic">Tell everyone.</em>
          </h1>
          <p className="mt-6 max-w-[52ch] font-sans text-ink-600" style={{ fontSize: 17, lineHeight: 1.65 }}>
            Baptism is one of the most significant moments in a person&apos;s faith journey. It&apos;s not a
            private decision — it&apos;s a public one. And it&apos;s one of our favourite Sundays of the year.
          </p>
        </div>
      </section>

      {/* Upcoming dates */}
      <section className="border-t border-ink-900/10 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-[900px]">
          <p className="font-ui uppercase text-warm-600" style={{ fontSize: 11, letterSpacing: "0.28em" }}>
            Upcoming dates
          </p>
          <h2
            className="mt-3 font-display text-ink-900"
            style={{ fontSize: "clamp(1.75rem,3.4vw,2.5rem)", fontWeight: 300 }}
          >
            Baptism Sundays — 2026
          </h2>

          {/* PLACEHOLDER: Replace with real dates from Section F of staff questionnaire */}
          <div className="mt-8 rounded-2xl border border-dashed border-warm-400/60 bg-warm-50/50 p-8 text-center">
            <p className="font-ui text-[12px] uppercase tracking-[0.2em] text-warm-600">
              ⚠ Staff action required
            </p>
            <p className="mt-2 font-sans text-ink-600" style={{ fontSize: 15 }}>
              Add upcoming baptism dates here — complete <strong>Section F</strong> of the staff questionnaire.
            </p>
          </div>
        </div>
      </section>

      {/* What to expect */}
      <section className="border-t border-ink-900/10 px-6 py-16 sm:px-10" style={{ background: "#F7F0E4" }}>
        <div className="mx-auto max-w-[900px]">
          <p className="font-ui uppercase text-warm-600" style={{ fontSize: 11, letterSpacing: "0.28em" }}>
            What to expect
          </p>
          <h2
            className="mt-3 font-display text-ink-900"
            style={{ fontSize: "clamp(1.75rem,3.4vw,2.5rem)", fontWeight: 300 }}
          >
            Everything you need to know.
          </h2>

          <div className="mt-10 space-y-6">
            {WHAT_TO_EXPECT.map((item) => (
              <div key={item.q} className="rounded-xl border border-ink-900/10 bg-cream p-6">
                <h3 className="font-display text-ink-900" style={{ fontSize: 18, fontWeight: 400 }}>
                  {item.q}
                </h3>
                <p
                  className={`mt-2 font-sans ${item.a.startsWith("PLACEHOLDER") ? "text-warm-600 italic" : "text-ink-600"}`}
                  style={{ fontSize: 15, lineHeight: 1.65 }}
                >
                  {item.a.startsWith("PLACEHOLDER") ? `⚠ ${item.a}` : item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Register interest */}
      <section className="border-t border-ink-900/10 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-[640px]">
          <p className="font-ui uppercase text-warm-600" style={{ fontSize: 11, letterSpacing: "0.28em" }}>
            Ready to take the step
          </p>
          <h2
            className="mt-3 font-display text-ink-900"
            style={{ fontSize: "clamp(1.75rem,3.4vw,2.5rem)", fontWeight: 300, lineHeight: 1.1 }}
          >
            Register your interest.
          </h2>
          <p className="mt-4 font-sans text-ink-600" style={{ fontSize: 16, lineHeight: 1.65 }}>
            Let us know you&apos;re ready. Your campus pastor will reach out to walk through next steps
            with you personally.
          </p>
          <div className="mt-8">
            <ValueExchangeForm
              offer="Tell us you're ready — we'll take it from here."
              proofPoints={["Same-day response from your campus pastor", "No pressure, no rush"]}
              fields={["email", "name", "phone"]}
              cta="I'm ready"
              outcome="Your campus pastor will be in touch today."
              source="baptism-interest"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
