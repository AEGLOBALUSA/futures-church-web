import type { Metadata } from "next";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { Play } from "lucide-react";

export const metadata: Metadata = {
  title: "Watch",
  description: "Sermons from Futures Church — watch the latest message or browse our series.",
};

// CMS-replaceable placeholder data
const latestSeries = [
  { title: "More", speaker: "Ashley Evans", episodes: 4, thumb: null },
  { title: "No More Fear", speaker: "Ashley Evans", episodes: 6, thumb: null },
  { title: "Foundations", speaker: "Various", episodes: 8, thumb: null },
  { title: "Family First", speaker: "Jane Evans", episodes: 5, thumb: null },
  { title: "The 200 Vision", speaker: "Ashley Evans", episodes: 3, thumb: null },
  { title: "Presence", speaker: "Various", episodes: 7, thumb: null },
];

export default function WatchPage() {
  return (
    <>
      <section className="relative pt-28 pb-20 bg-paper overflow-hidden">
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <p className="font-mono text-xs uppercase tracking-eyebrow text-ember-300 mb-4">Watch</p>
          <h1 className="font-display text-6xl md:text-8xl text-ink-900 mb-6 leading-none">Latest message.</h1>
        </div>
      </section>

      {/* Latest sermon embed placeholder */}
      <section className="py-12 bg-paper">
        <div className="mx-auto max-w-4xl px-4">
          <ScrollReveal>
            <div className="aspect-video rounded-2xl bg-paper-100 border border-ink-300/50 flex items-center justify-center relative overflow-hidden">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-ember-400/20 border border-ember-400/30 flex items-center justify-center mx-auto mb-4">
                  <Play className="w-6 h-6 text-ember-400 ml-1" />
                </div>
                <p className="font-sans text-ink-500 text-sm">Latest sermon — video coming soon</p>
                <p className="font-mono text-xs text-ink-300/60 mt-1">Replace with YouTube/Vimeo embed</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Series grid */}
      <section className="py-16 bg-paper-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <p className="font-mono text-xs uppercase tracking-eyebrow text-ember-300 mb-10">Series</p>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {latestSeries.map((series, i) => (
              <ScrollReveal key={series.title} delay={i * 0.06}>
                <div className="group cursor-pointer rounded-xl bg-paper-100 border border-ink-300/50 hover:border-ember-400/30 overflow-hidden transition-all">
                  <div className="aspect-video bg-gradient-to-b from-paper-200 to-paper-300 flex items-center justify-center relative">
                    <Play className="w-5 h-5 text-ink-300/60 group-hover:text-ember-400 transition-colors" />
                  </div>
                  <div className="p-3">
                    <p className="font-sans text-xs font-medium text-ink-700 leading-snug">{series.title}</p>
                    <p className="font-sans text-[10px] text-ink-300 mt-0.5">{series.speaker} · {series.episodes} parts</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
