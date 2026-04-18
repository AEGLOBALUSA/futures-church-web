"use client";

import { useState, FormEvent } from "react";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { Button } from "@/components/ui/Button";
import { CheckCircle, MapPin, Mail } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [request, setRequest] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/prayer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, request, anonymous: false }),
      });
      setDone(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <section className="relative pt-28 pb-20 bg-paper overflow-hidden">
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <p className="font-mono text-xs uppercase tracking-eyebrow text-ember-300 mb-4">Get in touch</p>
          <h1 className="font-display text-5xl md:text-7xl text-ink-900 mb-6 leading-tight">We&apos;d love to hear from you.</h1>
        </div>
      </section>

      <section className="py-16 bg-paper-100">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16">
            {/* Info */}
            <ScrollReveal>
              <div>
                <p className="font-mono text-xs uppercase tracking-eyebrow text-ember-300 mb-6">HQ — Gwinnett, USA</p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-ember-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-sans text-sm text-ink-700">Duluth, GA, USA</p>
                      <p className="font-sans text-xs text-ink-300">(Gwinnett campus — Ashley & Jane Evans)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-ember-400 mt-0.5 flex-shrink-0" />
                    <a href="mailto:hello@futures.church" className="font-sans text-sm text-ink-700 hover:text-ember-400 transition-colors">
                      hello@futures.church
                    </a>
                  </div>
                </div>

                <p className="font-mono text-xs uppercase tracking-eyebrow text-ember-300 mb-4">HQ — Paradise, Australia</p>
                <div className="flex items-start gap-3 mb-8">
                  <MapPin className="w-4 h-4 text-ember-400 mt-0.5 flex-shrink-0" />
                  <p className="font-sans text-sm text-ink-700">Paradise, SA, Australia</p>
                </div>

                <blockquote className="border-l-2 border-ember-400 pl-4 font-display text-xl text-ink-700 italic">
                  &ldquo;We are rescued to be rescuers.&rdquo;
                </blockquote>
              </div>
            </ScrollReveal>

            {/* Prayer request form */}
            <ScrollReveal delay={0.1}>
              {done ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-16">
                  <CheckCircle className="w-12 h-12 text-ember-400 mb-4" />
                  <h3 className="font-display text-2xl text-ink-900 mb-2">We&apos;re praying.</h3>
                  <p className="font-sans text-ink-500 text-sm">
                    A pastor will reach out if you shared your contact details. You&apos;re not alone.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <p className="font-sans font-medium text-ink-900 mb-4">Send us a prayer request</p>
                  <input
                    type="text"
                    placeholder="Your name (optional)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-paper-100 border border-ink-300 rounded-xl px-4 py-3 font-sans text-sm text-ink-900 placeholder:text-ink-300 outline-none focus:border-ember-400/60"
                  />
                  <input
                    type="email"
                    placeholder="Your email (optional)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-paper-100 border border-ink-300 rounded-xl px-4 py-3 font-sans text-sm text-ink-900 placeholder:text-ink-300 outline-none focus:border-ember-400/60"
                  />
                  <textarea
                    required
                    placeholder="What can we pray for?"
                    value={request}
                    onChange={(e) => setRequest(e.target.value)}
                    rows={5}
                    className="w-full bg-paper-100 border border-ink-300 rounded-xl px-4 py-3 font-sans text-sm text-ink-900 placeholder:text-ink-300 outline-none focus:border-ember-400/60 resize-none"
                  />
                  <Button type="submit" variant="ember" size="lg" className="w-full justify-center" loading={loading}>
                    Send prayer request
                  </Button>
                  <p className="font-sans text-xs text-ink-300 text-center">
                    Your request goes straight to our pastoral team.
                  </p>
                </form>
              )}
            </ScrollReveal>
          </div>
        </div>
      </section>
    </>
  );
}
