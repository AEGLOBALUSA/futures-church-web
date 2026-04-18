import type { Metadata } from "next";
import Link from "next/link";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { Button } from "@/components/ui/Button";

function KidsGamesPlaceholder() {
  return (
    <div className="rounded-2xl bg-gradient-to-b from-ember-400/10 to-paper-200 border border-ember-400/20 p-10 text-center">
      <div className="inline-flex items-center rounded-full bg-ember-400/15 border border-ember-400/20 px-4 py-1.5 mb-4">
        <span className="font-mono text-xs text-ember-400 uppercase tracking-eyebrow">Coming soon</span>
      </div>
      <h3 className="font-display text-3xl text-ink-900 mb-3">Kids Bible Games</h3>
      <p className="font-sans text-ink-500 max-w-sm mx-auto">
        Interactive Bible games for kids — designed by the Futures Kids team. Coming to this page soon.
      </p>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Kids",
  description: "Safe, biblical, and genuinely great Sundays for every kid at Futures Church.",
};

export default function KidsPage() {
  return (
    <>
      <section className="relative pt-28 pb-20 bg-paper overflow-hidden">
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <p className="font-mono text-xs uppercase tracking-eyebrow text-ember-300 mb-4">Kids · Futures Church</p>
          <h1 className="font-display text-6xl md:text-8xl text-ink-900 mb-6 leading-none">Kids love it here.</h1>
          <p className="font-sans text-xl text-ink-500 max-w-xl mx-auto">
            Safe rooms, brilliant leaders, and biblical truth made accessible for every age. Your kids will ask to come back.
          </p>
        </div>
      </section>

      {/* Trust pillars */}
      <section className="py-20 bg-paper-100">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Safe", desc: "Every Kids leader is screened, trained, and accredited. Your child is protected — always." },
              { title: "Biblical", desc: "We take the Word seriously. Kids leave knowing who God is, who they are, and why it matters." },
              { title: "Fun", desc: "Games, music, creativity. Kids ministry here is something children genuinely look forward to." },
            ].map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 0.08}>
                <div className="p-6 rounded-2xl bg-paper-100 border border-ink-300/50">
                  <h3 className="font-display text-3xl text-ember-400 mb-3">{item.title}</h3>
                  <p className="font-sans text-sm text-ink-500 leading-relaxed">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Bible games placeholder */}
      <section className="py-20 bg-paper">
        <div className="mx-auto max-w-2xl px-4">
          <ScrollReveal>
            <KidsGamesPlaceholder />
          </ScrollReveal>
        </div>
      </section>

      <section className="py-16 bg-paper-100 text-center">
        <ScrollReveal>
          <h2 className="font-display text-4xl text-ink-900 mb-6">Bring your kids this Sunday.</h2>
          <Link href="/plan-a-visit">
            <Button variant="ember" size="lg">Plan a Visit</Button>
          </Link>
        </ScrollReveal>
      </section>
    </>
  );
}
