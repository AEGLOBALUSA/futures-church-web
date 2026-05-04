import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Connect — Futures Church",
  description:
    "Your next step at Futures — from your first visit to leading others. Seven steps, one family.",
};

const STEPS = [
  {
    n: "01",
    label: "Plan a visit",
    href: "/plan-a-visit",
    description:
      "Start here. Tell us you're coming — we'll save you a seat, tell you where to park, and make sure someone meets you at the door.",
    cta: "Plan my visit →",
  },
  {
    n: "02",
    label: "Connect card",
    href: "/plan-a-visit#connect",
    description:
      "Fill in a connect card after your first Sunday. It's how your campus pastor knows you're here — and it starts the conversation.",
    cta: "Fill it in →",
  },
  {
    n: "03",
    label: "Find a group",
    href: "/groups",
    description:
      "Sunday is the start, not the whole thing. Life groups are where people actually know your name. Find one near you.",
    cta: "Find a group →",
  },
  {
    n: "04",
    label: "Serve",
    href: "/serve",
    description:
      "Every person who walks through our doors deserves the best hour of their week. You help make that happen. Pick a team.",
    cta: "See teams →",
  },
  {
    n: "05",
    label: "Baptism",
    href: "/baptism",
    description:
      "A public declaration that something real happened inside you. If you've given your life to Jesus and haven't been baptised — this is your next step.",
    cta: "Learn more →",
  },
  {
    n: "06",
    label: "Leadership",
    href: "/leaders",
    description:
      "Leadership at Futures is something you grow into. Every great leader in our family started where you are. We develop people on purpose.",
    cta: "Meet our leaders →",
  },
  {
    n: "07",
    label: "College",
    href: "/college",
    description:
      "One year. Alphacrucis-accredited. Built for people who sense God has more for them — and are ready to do something about it.",
    cta: "Explore college →",
  },
];

export default function ConnectPage() {
  return (
    <main className="bg-cream text-ink-900">
      {/* Hero */}
      <section
        className="px-6 pb-16 pt-32 sm:px-10"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(204,143,74,0.14) 0%, transparent 60%), #FDFBF6",
        }}
      >
        <div className="mx-auto max-w-[820px]">
          <p
            className="font-ui uppercase text-warm-600"
            style={{ fontSize: 11, letterSpacing: "0.28em" }}
          >
            Connect
          </p>
          <h1
            className="mt-3 font-display text-ink-900"
            style={{
              fontSize: "clamp(2.5rem,5.6vw,4.5rem)",
              fontWeight: 300,
              lineHeight: 1.02,
            }}
          >
            Your next step.
            <br />
            <em className="italic">Not all of them. Just one.</em>
          </h1>
          <p
            className="mt-6 max-w-[52ch] font-sans text-ink-600"
            style={{ fontSize: 17, lineHeight: 1.65 }}
          >
            Every journey through Futures follows a path — from curious visitor to
            family member to leader. You don&apos;t have to do it all at once. Just take
            the next step.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="px-6 pb-24 sm:px-10">
        <div className="mx-auto max-w-[900px]">
          <div className="relative">
            {/* Vertical connector line */}
            <div
              aria-hidden
              className="absolute left-[27px] top-8 hidden h-[calc(100%-4rem)] w-px sm:block"
              style={{ background: "linear-gradient(to bottom, rgba(28,26,23,0.12) 0%, transparent 100%)" }}
            />

            <ol className="space-y-8">
              {STEPS.map((step) => (
                <li key={step.n} className="flex gap-6 sm:gap-8">
                  {/* Step number bubble */}
                  <div
                    className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-ink-900/15 bg-cream font-ui text-ink-400"
                    style={{ fontSize: 12, letterSpacing: "0.08em" }}
                  >
                    {step.n}
                  </div>

                  {/* Card */}
                  <div className="flex-1 rounded-2xl border border-ink-900/8 bg-white/60 p-6 shadow-sm">
                    <h2
                      className="font-display text-ink-900"
                      style={{ fontSize: "clamp(1.25rem,2.4vw,1.6rem)", fontWeight: 300 }}
                    >
                      {step.label}
                    </h2>
                    <p
                      className="mt-2 max-w-[56ch] font-sans text-ink-600"
                      style={{ fontSize: 15, lineHeight: 1.65 }}
                    >
                      {step.description}
                    </p>
                    <Link
                      href={step.href}
                      className="mt-4 inline-flex items-center gap-1.5 font-ui text-[12px] uppercase tracking-[0.14em] text-warm-600 transition-colors hover:text-warm-700"
                    >
                      {step.cta}
                    </Link>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section
        className="border-t border-ink-900/10 px-6 py-16 sm:px-10"
        style={{ background: "#F7F0E4" }}
      >
        <div className="mx-auto max-w-[640px] text-center">
          <h2
            className="font-display text-ink-900"
            style={{ fontSize: "clamp(1.75rem,3.4vw,2.5rem)", fontWeight: 300, lineHeight: 1.1 }}
          >
            Not sure where you are?
          </h2>
          <p className="mt-4 font-sans text-ink-600" style={{ fontSize: 16, lineHeight: 1.65 }}>
            Ask Milo — our guide knows the campus, the people, and the path.
            Or reach a real person any time.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/plan-a-visit"
              className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-7 py-3.5 font-ui text-[13px] tracking-[0.02em] text-cream transition-colors hover:bg-warm-600"
            >
              Plan a visit <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-ink-900/20 px-7 py-3.5 font-ui text-[13px] tracking-[0.02em] text-ink-900 transition-colors hover:border-warm-500 hover:text-warm-600"
            >
              Talk to someone
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
