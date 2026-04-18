import type { Metadata } from "next";
import { SelahCountdown } from "@/components/sections/SelahCountdown";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

export const metadata: Metadata = {
  title: "Selah — Biblical Counsel on Demand",
  description:
    "500+ theologians, psychologists, psychiatrists, philosophers, and therapists — all sharing a biblical worldview — in one app. Launching May 15, 2026.",
};

const pillars = [
  { title: "Theologians", desc: "Deep biblical truth from world-class scholars." },
  { title: "Psychologists", desc: "Mental health wisdom grounded in scripture." },
  { title: "Psychiatrists", desc: "Clinical insight with a biblical worldview." },
  { title: "Philosophers", desc: "Thinking clearly about life's hardest questions." },
  { title: "Therapists", desc: "Practical counsel for real life." },
];

export default function SelahPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-night-900 overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 60% at 50% 0%, rgba(42,99,245,0.1) 0%, transparent 70%)" }} />
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <p className="font-mono text-xs uppercase tracking-eyebrow text-ember-300 mb-4">Coming May 15, 2026</p>
          <h1 className="font-display text-7xl md:text-9xl text-paper mb-6 leading-none">Selah.</h1>
          <p className="font-sans text-xl text-paper/60 max-w-2xl mx-auto">
            500+ voices. One biblical worldview. Pastoral counsel and daily help — on demand, in your pocket.
          </p>
        </div>
      </section>

      {/* Countdown + waitlist */}
      <SelahCountdown />

      {/* 500 voices */}
      <section className="py-24 bg-night-900">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <p className="font-mono text-xs uppercase tracking-eyebrow text-ember-300 mb-4 text-center">500+ contributors</p>
            <h2 className="font-display text-4xl md:text-5xl text-paper text-center mb-12">
              Every voice. One worldview.
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {pillars.map((p, i) => (
              <ScrollReveal key={p.title} delay={i * 0.07}>
                <div className="p-5 rounded-2xl bg-ink-800 border border-paper/10 text-center">
                  <h3 className="font-display text-lg text-ember-400 mb-2">{p.title}</h3>
                  <p className="font-sans text-xs text-paper/50 leading-relaxed">{p.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="py-20 bg-night-800">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <ScrollReveal>
            <p className="font-mono text-xs uppercase tracking-eyebrow text-ember-300 mb-4">Pricing</p>
            <h2 className="font-display text-4xl text-paper mb-4">Free 14-day trial.</h2>
            <p className="font-sans text-paper/60 leading-relaxed">
              Start free. Founding list members lock in their pricing for life — whatever we set at launch, that&apos;s your rate forever. Get on the list before May 15.
            </p>
            {/* App store badges — placeholder */}
            <div className="mt-10 flex justify-center gap-4">
              <div className="rounded-xl bg-ink-800 border border-paper/10 px-6 py-3 text-sm font-sans text-paper/40">
                App Store — coming soon
              </div>
              <div className="rounded-xl bg-ink-800 border border-paper/10 px-6 py-3 text-sm font-sans text-paper/40">
                Google Play — coming soon
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
