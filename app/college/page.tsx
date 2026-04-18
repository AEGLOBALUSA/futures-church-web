import type { Metadata } from "next";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { EmailCapture } from "@/components/ui/EmailCapture";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Futures Global College",
  description: "Outthink. Outbuild. Outlead. One-year leadership program. September 2026 intake.",
};

const subjects = [
  "Biblical Foundations of Leadership",
  "Church Planting & Multiplication",
  "Preaching & Communication",
  "Leading Teams & Culture",
  "Financial Stewardship",
  "Pastoral Care & Counselling",
  "Mission & Evangelism",
  "Personal Development & Calling",
];

const electives = [
  "Digital Ministry & Media",
  "Women in Leadership",
  "Cross-Cultural Mission",
];

export default function CollegePage() {
  return (
    <>
      <section className="relative pt-28 pb-24 bg-paper overflow-hidden min-h-[70vh] flex items-center">
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <p className="font-mono text-xs uppercase tracking-eyebrow text-ember-300 mb-4">Futures Global College</p>
          <h1 className="font-display text-6xl md:text-8xl text-ink-900 mb-6 leading-none">
            Outthink.<br />Outbuild.<br />Outlead.
          </h1>
          <p className="font-sans text-xl text-ink-500 max-w-xl mx-auto mb-8">
            One-year leadership program at the intersection of biblical depth, ministry skill, and real-world impact. September 2026 intake now open.
          </p>
          <a href="https://futuresglobal.college" target="_blank" rel="noopener noreferrer">
            <Button variant="ember" size="lg">Visit futuresglobal.college</Button>
          </a>
        </div>
      </section>

      {/* Program overview */}
      <section className="py-24 bg-paper-100">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <p className="font-mono text-xs uppercase tracking-eyebrow text-ember-300 mb-4 text-center">The program</p>
            <h2 className="font-display text-4xl text-ink-900 text-center mb-12">8 core subjects. 3 electives.</h2>
          </ScrollReveal>
          <div className="grid md:grid-cols-2 gap-4 mb-10">
            {subjects.map((s, i) => (
              <ScrollReveal key={s} delay={i * 0.05}>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-paper-100 border border-ink-300/50">
                  <span className="font-mono text-xs text-ember-400 mt-0.5 flex-shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-sans text-sm text-ink-700">{s}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <p className="font-mono text-xs uppercase tracking-eyebrow text-ink-300 mb-4 text-center">Plus 3 electives</p>
          <div className="grid md:grid-cols-3 gap-4">
            {electives.map((e, i) => (
              <ScrollReveal key={e} delay={i * 0.06}>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-paper-100/60 border border-ink-300/50">
                  <span className="font-mono text-xs text-ink-300 mt-0.5 flex-shrink-0">E{i + 1}</span>
                  <span className="font-sans text-sm text-ink-500">{e}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Apply CTA */}
      <section className="py-24 bg-paper">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <ScrollReveal>
            <p className="font-mono text-xs uppercase tracking-eyebrow text-ember-300 mb-4">September 2026 intake</p>
            <h2 className="font-display text-4xl text-ink-900 mb-4">Ready to be trained for the mission?</h2>
            <p className="font-sans text-ink-500 mb-8">
              Get the prospectus and be first in line for the 2026 intake.
            </p>
            <EmailCapture
              source="college-prospectus"
              interests={["college", "leadership"]}
              placeholder="Your email address"
              ctaText="Send me the prospectus"
              successMessage="Prospectus on its way. See you in September."
            />
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
