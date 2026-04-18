import type { Metadata } from "next";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Give",
  description: "Generosity is part of who we are. Give to Futures Church.",
};

export default function GivePage() {
  const giveUrl = process.env.NEXT_PUBLIC_GIVE_URL ?? "#";

  return (
    <>
      <section className="relative pt-28 pb-20 bg-paper overflow-hidden">
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <p className="font-mono text-xs uppercase tracking-eyebrow text-ember-300 mb-4">Generosity</p>
          <h1 className="font-display text-6xl md:text-8xl text-ink-900 mb-6 leading-none">Give generously.</h1>
          <p className="font-sans text-xl text-ink-500 max-w-xl mx-auto">
            Generosity is one of our six culture words — not because we need money, but because generosity transforms the giver. Every dollar given here builds campuses, trains leaders, and wins souls.
          </p>
        </div>
      </section>

      <section className="py-20 bg-paper-100">
        <div className="mx-auto max-w-2xl px-4">
          <ScrollReveal>
            <div className="rounded-3xl bg-paper-100 border border-ink-300/50 p-10 text-center">
              <h2 className="font-display text-4xl text-ink-900 mb-4">Give online</h2>
              <p className="font-sans text-ink-500 mb-8">
                Secure giving via our trusted payment partner. One-time or recurring — every amount matters.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href={giveUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="ember" size="lg">Give now</Button>
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-20 bg-paper text-center">
        <ScrollReveal>
          <blockquote className="font-display text-3xl md:text-4xl text-ink-700 max-w-2xl mx-auto px-4">
            &ldquo;Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.&rdquo;
          </blockquote>
          <p className="font-mono text-sm text-ember-400 mt-6">2 Corinthians 9:7</p>
        </ScrollReveal>
      </section>
    </>
  );
}
