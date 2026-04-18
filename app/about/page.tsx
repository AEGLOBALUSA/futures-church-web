import type { Metadata } from "next";
import Link from "next/link";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { timeline, manifesto, cultures, promises } from "@/lib/content/vision";

export const metadata: Metadata = {
  title: "About",
  description:
    "104 years of history, one clear mission. Learn who Futures Church is, where we came from, and where we're going.",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-28 pb-20 bg-paper overflow-hidden">
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-mono text-xs uppercase tracking-eyebrow text-ember-300 mb-4">
            Founded 1922
          </p>
          <h1 className="font-display text-6xl md:text-8xl text-ink-900 mb-6 leading-none">
            Who we are.
          </h1>
          <p className="font-sans text-xl text-ink-500 max-w-2xl mx-auto">
            A 104-year-old movement with a day-one passion. 21 campuses across 4 countries — with Venezuela launching next. Led by Ashley & Jane Evans since 2000.
          </p>
        </div>
      </section>

      {/* Manifesto */}
      <section className="py-24 bg-paper-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <p className="font-mono text-xs uppercase tracking-eyebrow text-ember-300 mb-6">
              Our manifesto
            </p>
            <blockquote className="font-display text-3xl md:text-5xl text-ink-900 leading-tight">
              &ldquo;{manifesto}&rdquo;
            </blockquote>
          </ScrollReveal>
        </div>
      </section>

      {/* Timeline */}
      <Section eyebrow="Our history" headline="104 years. One mission.">
        <div className="max-w-3xl mx-auto">
          {timeline.map((item, i) => (
            <ScrollReveal key={item.year} delay={i * 0.07}>
              <div className="flex gap-6 mb-10">
                <div className="flex-shrink-0 w-16 text-right">
                  <span className="font-mono text-sm text-ember-400">{item.year}</span>
                </div>
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-ember-400 mt-1" />
                  {i < timeline.length - 1 && (
                    <div className="w-px flex-1 bg-paper-100 mt-2" />
                  )}
                </div>
                <p className="font-sans text-ink-700 leading-relaxed pb-6">{item.event}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      {/* Six cultures */}
      <Section eyebrow="Our culture" headline="Six words. One way of life." className="bg-paper-100">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cultures.map((c, i) => (
            <ScrollReveal key={c.word} delay={i * 0.07}>
              <div className="p-6 rounded-2xl bg-paper-100 border border-ink-300/50">
                <h3 className="font-display text-2xl text-ember-400 mb-2">{c.word}</h3>
                <p className="font-sans text-sm text-ink-500 leading-relaxed">{c.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      {/* Four promises */}
      <Section eyebrow="Our promise" headline="Rescue. Restore. Redeem. Release.">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {promises.map((p, i) => (
            <ScrollReveal key={p.word} delay={i * 0.07}>
              <div className="text-center p-6">
                <h3 className="font-display text-3xl text-ember-400 mb-3">{p.word}</h3>
                <p className="font-sans text-sm text-ink-500 leading-relaxed">{p.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <section className="py-20 bg-paper-100 text-center">
        <ScrollReveal>
          <h2 className="font-display text-4xl text-ink-900 mb-6">Ready to be part of it?</h2>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/campuses"><Button variant="ember" size="lg">Find a Campus</Button></Link>
            <Link href="/plan-a-visit"><Button variant="ghost" size="lg">Plan a Visit</Button></Link>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
