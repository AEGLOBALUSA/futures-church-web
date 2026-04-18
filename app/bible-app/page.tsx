import type { Metadata } from "next";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Bible App",
  description: "Futures Church on YouVersion — reading plans, daily verses, and more.",
};

export default function BibleAppPage() {
  const bibleUrl = process.env.NEXT_PUBLIC_BIBLE_APP_URL ?? "https://bible.com";

  return (
    <>
      <section className="relative pt-28 pb-20 bg-paper overflow-hidden">
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <p className="font-mono text-xs uppercase tracking-eyebrow text-ember-300 mb-4">YouVersion</p>
          <h1 className="font-display text-5xl md:text-7xl text-ink-900 mb-6 leading-tight">Read. Every day.</h1>
          <p className="font-sans text-xl text-ink-500 max-w-xl mx-auto mb-8">
            The Word of God — in your pocket. Follow Futures Church on YouVersion and join our reading plans.
          </p>
          <a href={bibleUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="ember" size="lg">Open Bible App</Button>
          </a>
        </div>
      </section>

      <section className="py-20 bg-paper-100">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <p className="font-mono text-xs uppercase tracking-eyebrow text-ember-300 mb-4 text-center">Reading plans</p>
            <h2 className="font-display text-4xl text-ink-900 text-center mb-12">Futures plans on YouVersion</h2>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "No More Fear", days: 7, desc: "A 7-day plan based on Ashley Evans' book. Perfect for anyone ready to step out of fear and into faith." },
              { title: "From Scarcity to Supply", days: 5, desc: "5 days on the biblical principles of supernatural provision. Your breakthrough starts in the Word." },
              { title: "Futures 21 Days", days: 21, desc: "The church-wide plan that thousands of Futures people complete together each year." },
            ].map((plan, i) => (
              <ScrollReveal key={plan.title} delay={i * 0.08}>
                <div className="rounded-2xl bg-paper-100 border border-ink-300/50 p-6">
                  <p className="font-mono text-xs text-ember-300 uppercase tracking-eyebrow mb-2">{plan.days}-day plan</p>
                  <h3 className="font-display text-xl text-ink-900 mb-3">{plan.title}</h3>
                  <p className="font-sans text-sm text-ink-500 leading-relaxed mb-4">{plan.desc}</p>
                  <a href={bibleUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="sm" className="w-full justify-center">Start plan</Button>
                  </a>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
