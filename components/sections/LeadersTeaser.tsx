import Link from "next/link";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { Button } from "@/components/ui/Button";
import { Instagram } from "lucide-react";

const leaders = [
  {
    name: "Ashley Evans",
    role: "Senior Pastor",
    bio: "Third generation pastor. 26 years leading Futures Church. Building toward 200 campuses, 10,000 leaders, 200,000 souls won to Christ.",
    ig: "https://instagram.com/ashleyevans",
    accent: "bg-violet",
    delay: 0,
  },
  {
    name: "Jane Evans",
    role: "Senior Pastor · Founder, bU",
    bio: "Founder of bU — a women's movement that has gathered thousands across five countries. Pastor, author, champion of every woman who needs to know she belongs.",
    ig: "https://instagram.com/janeevans",
    accent: "bg-pink",
    delay: 0.1,
  },
];

export function LeadersTeaser() {
  return (
    <section className="py-24 md:py-40 bg-obsidian-900">
      <div className="mx-auto max-w-shell px-6 sm:px-12 lg:px-20">
        <ScrollReveal>
          <div className="flex items-start justify-between mb-16 flex-wrap gap-6">
            <div className="max-w-display">
              <p className="section-label text-bone/60 mb-5">02 // SENIOR PASTORS</p>
              <h2
                className="font-display text-bone leading-[0.95] tracking-[-0.015em]"
                style={{ fontSize: "clamp(2.5rem, 5vw, 5rem)", fontWeight: 300 }}
              >
                Ashley <em className="text-lemon not-italic">&amp;</em> Jane Evans
              </h2>
            </div>
            <Link href="/leaders" className="self-end">
              <Button variant="secondary">Meet our leaders →</Button>
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {leaders.map((leader) => (
            <ScrollReveal key={leader.name} delay={leader.delay}>
              <div className="group">
                <div className={`aspect-[4/5] rounded-3xl overflow-hidden relative mb-6 ${leader.accent}`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-display italic text-[16rem] text-bone/20 leading-none" style={{ fontWeight: 200 }}>
                      {leader.name.split(" ")[0][0]}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-display text-3xl md:text-4xl text-bone" style={{ fontWeight: 300 }}>
                      {leader.name}
                    </h3>
                  </div>
                </div>
                <p className="section-label text-bone/60 mb-2">{leader.role.toUpperCase()}</p>
                <p className="font-sans text-body text-bone/80 leading-[1.65] mb-4 max-w-prose">
                  {leader.bio}
                </p>
                <a
                  href={leader.ig}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-bone/60 hover:text-lemon transition-colors"
                >
                  <Instagram className="w-3.5 h-3.5" strokeWidth={1.5} /> Follow
                </a>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
