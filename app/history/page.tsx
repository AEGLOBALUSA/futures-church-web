import type { Metadata } from "next";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { timeline } from "@/lib/content/vision";

export const metadata: Metadata = {
  title: "History",
  description: "From a 1922 Smith Wigglesworth crusade in Adelaide to 21 campuses across 4 countries — with Venezuela launching next. The story of Futures Church.",
};

export default function HistoryPage() {
  return (
    <>
      <section className="relative pt-28 pb-20 bg-paper overflow-hidden">
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <p className="font-mono text-xs uppercase tracking-eyebrow text-ember-300 mb-4">Our history</p>
          <h1 className="font-display text-6xl md:text-8xl text-ink-900 mb-6 leading-none">104 years.</h1>
          <p className="font-sans text-xl text-ink-500 max-w-xl mx-auto">
            From a Pentecostal crusade in 1922 Adelaide to a global movement. The names have changed. The fire hasn&apos;t.
          </p>
        </div>
      </section>

      <section className="py-24 bg-paper-100">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {timeline.map((item, i) => (
            <ScrollReveal key={item.year} delay={i * 0.07}>
              <div className="flex gap-8 mb-16 group">
                <div className="flex-shrink-0 text-right w-16">
                  <span className="font-display text-4xl text-ember-400/60 group-hover:text-ember-400 transition-colors">
                    {item.year}
                  </span>
                </div>
                <div className="flex-shrink-0 flex flex-col items-center pt-3">
                  <div className="w-3 h-3 rounded-full bg-ember-400 ring-4 ring-ember-400/20" />
                  {i < timeline.length - 1 && <div className="w-px flex-1 bg-paper-100 mt-3" />}
                </div>
                <div className="pb-8">
                  <p className="font-sans text-ink-700 text-lg leading-relaxed">{item.event}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Name lineage */}
      <section className="py-20 bg-paper">
        <div className="mx-auto max-w-3xl px-4">
          <ScrollReveal>
            <p className="font-mono text-xs uppercase tracking-eyebrow text-ember-300 mb-8 text-center">The name lineage</p>
            <div className="flex flex-wrap items-center justify-center gap-3 text-center">
              {[
                "Adelaide Assembly of God",
                "Klemzig AOG",
                "Paradise Assembly of God",
                "Paradise Community Church",
                "Influencers Church",
                "Futures Church",
              ].map((name, i, arr) => (
                <span key={name} className="flex items-center gap-3">
                  <span className={`font-sans text-sm ${i === arr.length - 1 ? "text-ember-400 font-medium" : "text-ink-300"}`}>
                    {name}
                  </span>
                  {i < arr.length - 1 && <span className="text-ink-300/60">→</span>}
                </span>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
