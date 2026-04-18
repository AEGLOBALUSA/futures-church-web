import type { Metadata } from "next";
import Link from "next/link";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { visionStats, cultures, promises, manifesto } from "@/lib/content/vision";

export const metadata: Metadata = {
  title: "Vision",
  description: "200 campuses. 10,000 leaders. 200,000 souls. This is where we're going.",
};

export default function VisionPage() {
  return (
    <>
      <section className="relative pt-32 pb-24 bg-night-900 overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(255,163,26,0.12) 0%, transparent 70%)" }} />
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <p className="font-mono text-xs uppercase tracking-eyebrow text-ember-300 mb-4">The vision</p>
          <h1 className="font-display text-6xl md:text-9xl text-paper mb-8 leading-none">200 campuses.</h1>
          <p className="font-sans text-xl text-paper/60 max-w-xl mx-auto">
            The mission is specific. 200 campuses. 10,000 leaders. 200,000 souls won to Christ. We know where we&apos;re going.
          </p>
        </div>
      </section>

      {/* Stats */}
      <Section eyebrow="Where we are · Where we&apos;re going" className="bg-night-800">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {visionStats.map((s, i) => (
            <ScrollReveal key={s.label} delay={i * 0.08}>
              <div className="text-center p-6 rounded-2xl bg-ink-800 border border-paper/10">
                <p className="font-display text-5xl text-ember-400 mb-2">{s.value}</p>
                <p className="font-mono text-xs uppercase tracking-eyebrow text-paper/50 mb-1">{s.label}</p>
                <p className="font-sans text-xs text-paper/30">{s.sub}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      {/* Manifesto */}
      <section className="py-24 bg-night-900">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <ScrollReveal>
            <p className="font-mono text-xs uppercase tracking-eyebrow text-ember-300 mb-6">Our manifesto</p>
            <blockquote className="font-display text-3xl md:text-5xl text-paper leading-tight">&ldquo;{manifesto}&rdquo;</blockquote>
          </ScrollReveal>
        </div>
      </section>

      {/* Cultures */}
      <Section eyebrow="Our culture" headline="Six words. One way of life." className="bg-night-800">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cultures.map((c, i) => (
            <ScrollReveal key={c.word} delay={i * 0.07}>
              <div className="p-6 rounded-2xl bg-ink-800 border border-paper/10">
                <h3 className="font-display text-2xl text-ember-400 mb-2">{c.word}</h3>
                <p className="font-sans text-sm text-paper/60 leading-relaxed">{c.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      {/* Promises */}
      <Section eyebrow="Our promise" headline="Four words that define us.">
        <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {promises.map((p, i) => (
            <ScrollReveal key={p.word} delay={i * 0.07}>
              <div className="text-center p-6">
                <h3 className="font-display text-3xl text-ember-400 mb-3">{p.word}</h3>
                <p className="font-sans text-sm text-paper/60 leading-relaxed">{p.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      <section className="py-20 bg-night-800 text-center">
        <ScrollReveal>
          <h2 className="font-display text-4xl text-paper mb-6">Be part of the mission.</h2>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/campuses"><Button variant="ember" size="lg">Find Your Campus</Button></Link>
            <Link href="/give"><Button variant="ghost" size="lg">Give</Button></Link>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
