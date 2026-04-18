import { EmailCapture } from "@/components/ui/EmailCapture";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

export function DailyWordCapture() {
  return (
    <section className="py-24 md:py-32 bg-sky grain-overlay relative overflow-hidden">
      <div className="relative z-10 mx-auto max-w-2xl px-6 sm:px-12 lg:px-20 text-center">
        <ScrollReveal>
          <p className="section-label text-obsidian-900/70 mb-8">05 // DAILY WORD</p>
          <blockquote
            className="font-display text-obsidian-900 leading-[1.1] mb-6"
            style={{ fontSize: "clamp(1.75rem, 4vw, 3.5rem)", fontWeight: 300 }}
          >
            &ldquo;For I know the <em className="not-italic">plans</em> I have for you — plans to prosper you, not to harm you, plans to give you <em className="not-italic">hope</em> and a future.&rdquo;
          </blockquote>
          <p className="font-sans text-xs text-obsidian-900/70 mb-10 tracking-[0.14em] uppercase">
            Jeremiah 29:11
          </p>
          <EmailCapture
            source="daily-word"
            interests={["daily-word"]}
            placeholder="Your email address"
            ctaText="Get the Daily Word"
            successMessage="First devotional lands tomorrow morning."
          />
        </ScrollReveal>
      </div>
    </section>
  );
}
