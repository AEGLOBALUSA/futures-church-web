"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AIInput } from "@/components/ai/AIInput";
import { GlassCard } from "@/components/ui/GlassCard";
import { Eyebrow } from "@/components/ui/Type";
import { useAIGuide } from "@/lib/ai/AIGuideContext";
import teamsData from "@/content/contact/teams.json";
import { campuses } from "@/lib/content/campuses";

const CHIPS = [
  "I need prayer.",
  "how do I contact my campus?",
  "I&rsquo;m a pastor \u2014 can we partner?",
  "how do I give stock or crypto?",
  "press inquiry",
  "I&rsquo;m in crisis right now.",
];

type Team = { key: string; label: string; email: string; sla: string; blurb: string };
const TEAMS = teamsData.teams as Team[];

export function ContactPageClient() {
  const { setPageContext } = useAIGuide();
  useEffect(() => setPageContext("contact"), [setPageContext]);

  return (
    <main className="bg-cream text-ink-900">
      <ContactHero />
      <EmergencyBanner />
      <RoutedContactForm />
      <CampusSpecificContact />
      <ResponseTimePromises />
    </main>
  );
}

function ContactHero() {
  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-32 sm:px-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 55% 50% at 15% 15%, rgba(204,143,74,0.12), transparent 70%)" }}
      />
      <div className="relative mx-auto max-w-[1200px]">
        <Eyebrow>CONTACT &middot; A HUMAN WILL REPLY</Eyebrow>
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-4 font-display text-ink-900"
          style={{ fontSize: "clamp(2.5rem,6.5vw,5.5rem)", fontWeight: 300, lineHeight: 0.98, letterSpacing: "-0.02em" }}
        >
          Tell us what&rsquo;s <em className="italic">on your heart</em>.
        </motion.h1>
        <p className="mt-6 max-w-[58ch] font-body text-[18px] leading-relaxed text-ink-600">
          Start by asking &mdash; our AI will route you to the right team. Or pick a team below. Every note is read by a human within the SLA.
        </p>
        <div className="mt-10 max-w-[620px]">
          <GlassCard breathe className="p-5">
            <AIInput placeholder="Tell us what you need&hellip;" chips={CHIPS} compact />
          </GlassCard>
        </div>
      </div>
    </section>
  );
}

function EmergencyBanner() {
  return (
    <section className="px-6 sm:px-10">
      <div className="mx-auto max-w-[1200px]">
        <div className="rounded-3xl border border-warm-700/30 bg-warm-300/15 p-6 md:p-8">
          <Eyebrow className="text-warm-700">IF YOU&rsquo;RE IN CRISIS</Eyebrow>
          <p className="mt-3 font-display text-ink-900" style={{ fontSize: "clamp(1.25rem,2.4vw,1.6rem)", fontWeight: 300, lineHeight: 1.25 }}>
            Please don&rsquo;t message us &mdash; call now.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <CrisisLine label="US / Canada" number="988" />
            <CrisisLine label="Australia" number="13 11 14" />
            <CrisisLine label="Indonesia" number="119 ext 8" />
          </div>
          <p className="mt-4 font-body text-[14px] text-ink-600">
            Then, when you&rsquo;re safe, email <a className="underline" href="mailto:care@futures.church">care@futures.church</a> &mdash; we&rsquo;ll walk with you from there.
          </p>
        </div>
      </div>
    </section>
  );
}

function CrisisLine({ label, number }: { label: string; number: string }) {
  return (
    <a href={`tel:${number.replace(/\s/g, "")}`} className="block rounded-2xl border border-ink-900/10 bg-white/70 p-4 transition-colors hover:border-warm-500">
      <p className="font-ui text-eyebrow uppercase text-ink-600" style={{ letterSpacing: "0.24em" }}>{label}</p>
      <p className="mt-1 font-display text-ink-900" style={{ fontSize: 28, fontWeight: 300 }}>{number}</p>
    </a>
  );
}

function RoutedContactForm() {
  const [team, setTeam] = useState<string>("pastoral");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [campus, setCampus] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<null | { sla: string }>(null);
  const [error, setError] = useState<string | null>(null);

  const selected = TEAMS.find((t) => t.key === team)!;

  async function submit() {
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ team, name: name || undefined, email, campus: campus || undefined, message }),
      });
      const json = (await res.json()) as { ok: boolean; sla?: string; error?: string };
      if (!res.ok || !json.ok) throw new Error(json.error ?? "contact-failed");
      setDone({ sla: json.sla ?? selected.sla });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <section className="px-6 py-24 sm:px-10" style={{ background: "#F7F1E6" }}>
        <div className="mx-auto max-w-[720px] text-center">
          <Eyebrow>RECEIVED</Eyebrow>
          <h2 className="mt-3 font-display text-ink-900" style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}>
            A human will reply within <em className="italic">{done.sla}</em>.
          </h2>
          <p className="mt-5 font-body text-[16px] leading-relaxed text-ink-600">
            Keep an eye on your inbox &mdash; we send from a real address, no bots.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 py-24 sm:px-10" style={{ background: "#F7F1E6" }}>
      <div className="mx-auto max-w-[1100px] grid gap-8 md:grid-cols-[1fr,1.3fr]">
        <div>
          <Eyebrow>CHOOSE A TEAM</Eyebrow>
          <h2 className="mt-3 font-display text-ink-900" style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}>
            We route to <em className="italic">people</em>, not an inbox.
          </h2>
          <ul className="mt-8 flex flex-col gap-2">
            {TEAMS.map((t) => (
              <li key={t.key}>
                <button
                  type="button"
                  onClick={() => setTeam(t.key)}
                  className={`w-full rounded-2xl border px-4 py-3 text-left transition-colors ${
                    team === t.key ? "border-warm-500 bg-warm-500/10" : "border-ink-900/10 bg-white/50 hover:border-ink-900/20"
                  }`}
                >
                  <p className="font-ui text-[15px] text-ink-900">{t.label}</p>
                  <p className="mt-0.5 font-body text-[13px] text-ink-600">{t.blurb}</p>
                  <p className="mt-1 font-ui text-eyebrow uppercase text-ink-400" style={{ letterSpacing: "0.2em" }}>Reply within {t.sla}</p>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <GlassCard breathe className="p-7 md:p-10">
          <p className="font-ui text-eyebrow uppercase text-warm-700" style={{ letterSpacing: "0.24em" }}>WRITING TO: {selected.label.toUpperCase()}</p>
          <p className="mt-2 font-body text-[14px] text-ink-600">{selected.blurb}</p>
          <div className="mt-6 grid gap-4">
            <Field label="Your name" value={name} onChange={setName} placeholder="Optional" />
            <Field label="Email" value={email} onChange={setEmail} placeholder="you@example.com" type="email" required />
            <div className="flex flex-col gap-1.5">
              <label className="font-ui text-eyebrow uppercase text-ink-600" style={{ letterSpacing: "0.24em" }}>Campus (optional)</label>
              <select value={campus} onChange={(e) => setCampus(e.target.value)} className="rounded-2xl border border-ink-900/10 bg-white/80 px-4 py-3 font-ui text-[15px] text-ink-900 outline-none focus:border-warm-500">
                <option value="">Not sure / not yet</option>
                {campuses.filter((c) => c.status !== "online").map((c) => (
                  <option key={c.slug} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-ui text-eyebrow uppercase text-ink-600" style={{ letterSpacing: "0.24em" }}>Your message</label>
              <textarea rows={5} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell us what&rsquo;s on your heart&hellip;" className="resize-y rounded-2xl border border-ink-900/10 bg-white/80 px-4 py-3 font-ui text-[15px] text-ink-900 placeholder:text-ink-400 outline-none focus:border-warm-500" />
            </div>
            {error && <p className="font-ui text-sm text-warm-700" role="alert">{error}</p>}
            <button
              type="button"
              onClick={submit}
              disabled={submitting || !email || !message}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-ink-900 px-6 py-3 font-ui text-[15px] text-cream transition-transform hover:-translate-y-0.5 disabled:opacity-60"
            >
              {submitting ? "Sending\u2026" : `Send \u2014 reply within ${selected.sla}`}
              <span>&rarr;</span>
            </button>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}

function Field({ label, value, onChange, placeholder, type = "text", required }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; required?: boolean }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-ui text-eyebrow uppercase text-ink-600" style={{ letterSpacing: "0.24em" }}>{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required={required} className="rounded-2xl border border-ink-900/10 bg-white/80 px-4 py-3 font-ui text-[15px] text-ink-900 placeholder:text-ink-400 outline-none focus:border-warm-500" />
    </div>
  );
}

function CampusSpecificContact() {
  return (
    <section className="px-6 py-24 sm:px-10 bg-cream">
      <div className="mx-auto max-w-[1200px]">
        <Eyebrow>CAMPUS CONTACTS</Eyebrow>
        <h2 className="mt-3 font-display text-ink-900" style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}>
          Write to a <em className="italic">local</em> pastor.
        </h2>
        <p className="mt-4 max-w-[58ch] font-body text-[16px] leading-relaxed text-ink-600">
          For anything campus-specific &mdash; a visit, a service question, a need &mdash; the fastest route is the campus directly.
        </p>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {campuses.filter((c) => c.status !== "online").slice(0, 12).map((c) => (
            <GlassCard key={c.slug} className="p-5">
              <p className="font-display text-ink-900" style={{ fontSize: 22, fontWeight: 300 }}>{c.name}</p>
              <p className="mt-1 font-body text-[13px] text-ink-600">{c.city}, {c.country}</p>
              <a href={`mailto:${c.slug}@futures.church`} className="mt-3 inline-block font-ui text-[13px] text-warm-700 underline">{c.slug}@futures.church</a>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function ResponseTimePromises() {
  return (
    <section className="px-6 py-20 sm:px-10" style={{ background: "#1B1008", color: "#F7F1E6" }}>
      <div className="mx-auto max-w-[1200px]">
        <Eyebrow className="text-cream/60">OUR PROMISE</Eyebrow>
        <h2 className="mt-3 font-display" style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}>
          A <em className="italic">human</em> replies. Every time.
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {TEAMS.slice(0, 4).map((t) => (
            <GlassCard key={t.key} dark className="p-5">
              <p className="font-ui text-eyebrow uppercase text-cream/60" style={{ letterSpacing: "0.24em" }}>{t.label}</p>
              <p className="mt-2 font-display" style={{ fontSize: 24, fontWeight: 300 }}>{t.sla}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
