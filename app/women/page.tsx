import type { Metadata } from "next";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { EmailCapture } from "@/components/ui/EmailCapture";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "bU Women",
  description: "bU is Jane Evans' women's movement. A movement for women who are done with small.",
};

export default function WomenPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-28 pb-24 bg-paper overflow-hidden min-h-screen flex items-center">
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-eyebrow text-ember-300 mb-6">Women&apos;s movement</p>
            <h1 className="font-display text-7xl md:text-9xl text-ink-900 mb-8 leading-none">bU.</h1>
            <p className="font-sans text-2xl text-ink-700 leading-relaxed mb-10">
              Jane Evans&apos; movement for women who are done with small — and ready for everything God has for them.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="https://buwomen.com.au" target="_blank" rel="noopener noreferrer">
                <Button variant="ember" size="lg">Visit buwomen.com.au</Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 bg-paper-100">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <ScrollReveal>
              <p className="font-mono text-xs uppercase tracking-eyebrow text-ember-300 mb-4">Founded by Jane Evans</p>
              <h2 className="font-display text-4xl md:text-5xl text-ink-900 mb-6">Know your worth. Walk in your calling.</h2>
              <p className="font-sans text-ink-500 leading-relaxed">
                bU exists for women at every stage — the woman who&apos;s new to faith, the woman who&apos;s been carrying it all for years, the woman who knows there&apos;s more. This is a movement, not a conference. We gather, we grow, we go — together.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <div className="rounded-2xl bg-paper-100 border border-ink-300/50 p-8">
                <p className="font-display text-2xl text-ink-900 leading-snug mb-6">
                  &ldquo;Every woman was made for more than she&apos;s been told. bU is the place where we find out what that is.&rdquo;
                </p>
                <p className="font-mono text-xs text-ember-300 uppercase tracking-eyebrow">— Jane Evans</p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Gathering notify */}
      <section className="py-24 bg-paper">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <ScrollReveal>
            <p className="font-mono text-xs uppercase tracking-eyebrow text-ember-300 mb-4">Next gathering</p>
            <h2 className="font-display text-4xl text-ink-900 mb-4">Be the first to know.</h2>
            <p className="font-sans text-ink-500 mb-8">
              Drop your email and we&apos;ll let you know about upcoming bU gatherings in your region.
            </p>
            <EmailCapture
              source="bu-gathering"
              interests={["women", "bu"]}
              placeholder="Your email address"
              ctaText="Tell me about the next gathering"
              successMessage="You're in. We'll be in touch about upcoming events."
            />
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
