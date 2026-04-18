import type { Metadata } from "next";
import Link from "next/link";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Dreamers",
  description: "Futures Church youth. For the generation that's about to change everything.",
};

export default function DreamersPage() {
  return (
    <>
      {/* Hero — intentionally punchier */}
      <section className="relative pt-32 pb-24 bg-night-900 overflow-hidden min-h-screen flex items-center">
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 70% 40%, rgba(42,99,245,0.18) 0%, transparent 60%)" }} />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <p className="font-mono text-xs uppercase tracking-eyebrow text-ember-300 mb-4">Youth · Futures Church</p>
            <h1 className="font-display text-display-xl text-paper mb-6">
              Dreamers.
            </h1>
            <p className="font-sans text-2xl text-paper/60 max-w-xl mb-10">
              For the generation that&apos;s about to change everything. You&apos;re not the church of the future — you&apos;re the church of right now.
            </p>
            <Link href="/campuses">
              <Button variant="ember" size="lg">Find Dreamers near you</Button>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* What we believe about teenagers */}
      <section className="py-24 bg-night-800">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <p className="font-mono text-xs uppercase tracking-eyebrow text-ember-300 mb-4 text-center">What we believe about teenagers</p>
            <h2 className="font-display text-4xl md:text-5xl text-paper text-center mb-12">You were made for this.</h2>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "You have a voice", desc: "Dreamers is not a quiet zone. Your questions, your doubts, your fire — all welcome." },
              { title: "You have a calling", desc: "We don't believe in waiting until you're older. Leadership starts now." },
              { title: "You have a future", desc: "We are literally named Futures Church. Your generation is the whole point." },
            ].map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 0.08}>
                <div className="p-6 rounded-2xl bg-gradient-to-b from-pulse-500/10 to-ink-800 border border-pulse-500/15">
                  <h3 className="font-display text-2xl text-paper mb-3">{item.title}</h3>
                  <p className="font-sans text-sm text-paper/60 leading-relaxed">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Campus finder CTA */}
      <section className="py-20 bg-night-900 text-center">
        <ScrollReveal>
          <h2 className="font-display text-4xl text-paper mb-6">Find your Dreamers night.</h2>
          <p className="font-sans text-paper/60 mb-8">Every campus runs a Dreamers program. Find the one nearest you.</p>
          <Link href="/campuses">
            <Button variant="ember" size="lg">Find a Campus</Button>
          </Link>
        </ScrollReveal>
      </section>
    </>
  );
}
