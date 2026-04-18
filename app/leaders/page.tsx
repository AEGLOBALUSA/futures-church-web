import type { Metadata } from "next";
import { Instagram } from "lucide-react";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { leaders } from "@/lib/content/leaders";

export const metadata: Metadata = {
  title: "Leaders",
  description: "Senior Pastors Ashley & Jane Evans — leading Futures Church since 2000.",
};

export default function LeadersPage() {
  return (
    <>
      <section className="relative pt-28 pb-20 bg-paper overflow-hidden">
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <p className="font-mono text-xs uppercase tracking-eyebrow text-ember-300 mb-4">Senior Pastors</p>
          <h1 className="font-display text-5xl md:text-7xl text-ink-900 mb-6 leading-tight">
            Ashley & Jane Evans
          </h1>
          <p className="font-sans text-xl text-ink-500 max-w-xl mx-auto">
            Married, in ministry, and building a global movement together. Senior Pastors of Futures Church since 2000.
          </p>
        </div>
      </section>

      {leaders.map((leader, i) => (
        <section
          key={leader.id}
          className={`py-24 md:py-32 ${i % 2 === 0 ? "bg-paper" : "bg-paper-100"}`}
        >
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className={`flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-12 md:gap-20 items-center`}>
              {/* Portrait */}
              <ScrollReveal className="w-full md:w-2/5 flex-shrink-0">
                <div className="aspect-[4/5] rounded-3xl bg-gradient-to-b from-paper-200 to-paper-300 border border-ink-300/50 overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-display text-9xl text-white/5">{leader.name[0]}</span>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 p-6">
                    <p className="font-mono text-xs uppercase tracking-eyebrow text-ember-300">{leader.title}</p>
                    <h2 className="font-display text-3xl text-ink-900">{leader.name}</h2>
                  </div>
                </div>
              </ScrollReveal>

              {/* Bio */}
              <ScrollReveal delay={0.1} className="flex-1">
                <p className="font-mono text-xs uppercase tracking-eyebrow text-ember-300 mb-4">{leader.title}</p>
                <h2 className="font-display text-4xl md:text-5xl text-ink-900 mb-8">{leader.name}</h2>
                <div className="space-y-4">
                  {leader.bio.split("\n\n").map((para, j) => (
                    <p key={j} className="font-sans text-ink-700 leading-relaxed">
                      {para}
                    </p>
                  ))}
                </div>

                {leader.books.length > 0 && (
                  <div className="mt-8">
                    <p className="font-mono text-xs uppercase tracking-eyebrow text-ember-300 mb-3">Books</p>
                    <ul className="space-y-1">
                      {leader.books.map((book) => (
                        <li key={book} className="font-sans text-sm text-ink-500">— {book}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <a
                  href={leader.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-8 text-sm text-ink-300 hover:text-ember-400 transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                  Follow {leader.name.split(" ")[0]} on Instagram
                </a>
              </ScrollReveal>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
