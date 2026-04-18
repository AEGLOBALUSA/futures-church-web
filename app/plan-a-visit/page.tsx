"use client";

import { useState, FormEvent } from "react";
import { campuses } from "@/lib/content/campuses";
import { Button } from "@/components/ui/Button";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { CheckCircle } from "lucide-react";

const activeCampuses = campuses.filter((c) => c.status === "active");

type Step = 1 | 2 | 3;

export default function PlanAVisitPage() {
  const [step, setStep] = useState<Step>(1);
  const [campusSlug, setCampusSlug] = useState("");
  const [when, setWhen] = useState("");
  const [who, setWho] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          source: "plan-a-visit",
          interests: [campusSlug],
          consent: true,
        }),
      });
      setDone(true);
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center px-4 pt-16">
        <div className="text-center max-w-md">
          <CheckCircle className="w-16 h-16 text-ember-400 mx-auto mb-6" />
          <h1 className="font-display text-4xl text-ink-900 mb-4">You&apos;re all set.</h1>
          <p className="font-sans text-ink-500">
            We&apos;ll be in touch to help you plan your visit to {campuses.find((c) => c.slug === campusSlug)?.name ?? "your campus"}.
            We can&apos;t wait to meet you.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="relative pt-28 pb-20 bg-paper overflow-hidden">
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <p className="font-mono text-xs uppercase tracking-eyebrow text-ember-300 mb-4">First visit</p>
          <h1 className="font-display text-5xl md:text-7xl text-ink-900 mb-6 leading-tight">Plan your visit.</h1>
          <p className="font-sans text-xl text-ink-500 max-w-xl mx-auto">
            Let us know you&apos;re coming. We&apos;ll make sure your first Sunday is everything it should be.
          </p>
        </div>
      </section>

      <section className="py-16 bg-paper-100">
        <div className="mx-auto max-w-xl px-4">
          <ScrollReveal>
            {/* Progress */}
            <div className="flex gap-2 mb-10">
              {([1, 2, 3] as Step[]).map((s) => (
                <div key={s} className={`h-1 flex-1 rounded-full transition-all ${step >= s ? "bg-ember-400" : "bg-paper-100"}`} />
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <div>
                  <h2 className="font-display text-3xl text-ink-900 mb-6">Which campus?</h2>
                  <div className="grid gap-2">
                    {activeCampuses.slice(0, 12).map((campus) => (
                      <button
                        key={campus.slug}
                        type="button"
                        onClick={() => setCampusSlug(campus.slug)}
                        className={`text-left p-4 rounded-xl border transition-all font-sans text-sm ${
                          campusSlug === campus.slug
                            ? "bg-ember-400/15 border-ember-400 text-ink-900"
                            : "bg-paper-100 border-ink-300/50 text-ink-700 hover:border-ink-300"
                        }`}
                      >
                        <span className="font-medium">{campus.name}</span>
                        <span className="text-ink-300 ml-2 text-xs">{campus.city}</span>
                      </button>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="ember"
                    size="lg"
                    className="mt-6 w-full justify-center"
                    disabled={!campusSlug}
                    onClick={() => setStep(2)}
                  >
                    Next
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="font-display text-3xl text-ink-900 mb-6">When are you coming?</h2>
                  <div className="grid gap-3 mb-6">
                    {["This Sunday", "Next Sunday", "I&apos;m flexible"].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setWhen(opt)}
                        className={`text-left p-4 rounded-xl border transition-all font-sans text-sm ${
                          when === opt
                            ? "bg-ember-400/15 border-ember-400 text-ink-900"
                            : "bg-paper-100 border-ink-300/50 text-ink-700 hover:border-ink-300"
                        }`}
                        dangerouslySetInnerHTML={{ __html: opt }}
                      />
                    ))}
                  </div>
                  <h3 className="font-sans text-sm font-medium text-ink-500 mb-3">Who&apos;s coming?</h3>
                  <div className="grid gap-2 mb-6">
                    {["Just me", "Me + partner", "Family with kids", "A group"].map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setWho(opt)}
                        className={`text-left p-3 rounded-xl border transition-all font-sans text-sm ${
                          who === opt
                            ? "bg-ember-400/15 border-ember-400 text-ink-900"
                            : "bg-paper-100 border-ink-300/50 text-ink-700 hover:border-ink-300"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <Button type="button" variant="ghost" onClick={() => setStep(1)}>Back</Button>
                    <Button
                      type="button"
                      variant="ember"
                      className="flex-1 justify-center"
                      disabled={!when || !who}
                      onClick={() => setStep(3)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="font-display text-3xl text-ink-900 mb-6">Last step.</h2>
                  <div className="space-y-4 mb-6">
                    <input
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-paper-100 border border-ink-300 rounded-xl px-4 py-3 font-sans text-sm text-ink-900 placeholder:text-ink-300 outline-none focus:border-ember-400/60"
                    />
                    <input
                      type="email"
                      placeholder="Your email address"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-paper-100 border border-ink-300 rounded-xl px-4 py-3 font-sans text-sm text-ink-900 placeholder:text-ink-300 outline-none focus:border-ember-400/60"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button type="button" variant="ghost" onClick={() => setStep(2)}>Back</Button>
                    <Button
                      type="submit"
                      variant="ember"
                      className="flex-1 justify-center"
                      loading={loading}
                    >
                      Let&apos;s do this
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
