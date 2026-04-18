import type { Metadata } from "next";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { EmailCapture } from "@/components/ui/EmailCapture";

export const metadata: Metadata = {
  title: "Daily Word",
  description: "A daily devotional from the Futures Church team. Free, 2 minutes, life-changing.",
};

// CMS-replaceable placeholder
const todaysWord = {
  reference: "Philippians 4:13",
  verse: "I can do all this through him who gives me strength.",
  reflection: "There is no challenge God calls you to that He hasn't already equipped you for. The same power that raised Jesus from the dead is alive in you today. Walk in it.",
  date: new Date().toLocaleDateString("en-AU", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
};

export default function DailyWordPage() {
  return (
    <>
      <section className="relative pt-28 pb-20 bg-paper overflow-hidden">
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <p className="font-mono text-xs uppercase tracking-eyebrow text-ember-300 mb-4">Futures Daily Word</p>
          <h1 className="font-display text-6xl md:text-7xl text-ink-900 mb-6 leading-none">Start every day right.</h1>
          <p className="font-sans text-xl text-ink-500 max-w-xl mx-auto">
            A daily devotional from the Futures team. 2 minutes. Life-changing. Free — forever.
          </p>
        </div>
      </section>

      {/* Today's word */}
      <section className="py-20 bg-paper-100">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="rounded-3xl bg-gradient-to-b from-paper-100 to-paper-200 border border-ink-300/50 p-10 md:p-16 text-center">
              <p className="font-mono text-xs uppercase tracking-eyebrow text-ember-300 mb-6">
                {todaysWord.date}
              </p>
              <blockquote className="font-display text-3xl md:text-4xl text-ink-900 leading-snug mb-4">
                &ldquo;{todaysWord.verse}&rdquo;
              </blockquote>
              <p className="font-mono text-sm text-ember-400 mb-8">{todaysWord.reference}</p>
              <p className="font-sans text-ink-700 leading-relaxed text-lg">
                {todaysWord.reflection}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Subscribe */}
      <section className="py-20 bg-paper">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <ScrollReveal>
            <p className="font-mono text-xs uppercase tracking-eyebrow text-ember-300 mb-4">Subscribe</p>
            <h2 className="font-display text-4xl text-ink-900 mb-4">Get it in your inbox.</h2>
            <p className="font-sans text-ink-500 mb-8">
              Every morning. No spam. Just the Word.
            </p>
            <EmailCapture
              source="daily-word"
              interests={["daily-word"]}
              placeholder="Your email address"
              ctaText="Subscribe free"
              successMessage="First devotional lands tomorrow morning."
            />
            <p className="font-sans text-xs text-ink-300 mt-4">
              Or visit{" "}
              <a href="https://futuresdailyword.com" target="_blank" rel="noopener noreferrer" className="text-ember-400 hover:underline">
                futuresdailyword.com
              </a>
            </p>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
