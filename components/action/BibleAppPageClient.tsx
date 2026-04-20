"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AIInput } from "@/components/ai/AIInput";
import { GlassCard } from "@/components/ui/GlassCard";
import { Eyebrow } from "@/components/ui/Type";
import { useAIGuide } from "@/lib/ai/AIGuideContext";

const CHIPS = [
  "what&rsquo;s in the app?",
  "is Selah inside?",
  "is it free?",
  "does it have audio?",
  "does it work offline?",
  "which Bible translation?",
];

const FEATURES = [
  { t: "Read & listen", b: "Every translation that matters, plus rich audio \u2014 voices that feel like you&rsquo;re being read to, not preached at." },
  { t: "Reading plans", b: "7, 30, 90-day plans written by Ashley, Jane, and the pastoral team. Unflinching, unhurried, shareable with a friend." },
  { t: "Selah inside", b: "Daily pauses. Breath prayers. Small liturgy. Built-in so you never need another mindfulness app." },
];

const TESTIMONIALS = [
  { q: "I deleted four apps after installing this.", name: "Ruth", city: "Melbourne" },
  { q: "My thirteen-year-old asked to have it on her phone. That&rsquo;s a first.", name: "Marco", city: "Atlanta" },
  { q: "The audio alone makes it the best Bible app on my phone.", name: "Nia", city: "Jakarta" },
];

export function BibleAppPageClient() {
  const { setPageContext } = useAIGuide();
  useEffect(() => setPageContext("bible-app"), [setPageContext]);

  return (
    <main className="bg-cream text-ink-900">
      <BibleAppHero />
      <AppFeatures />
      <AppStoreButtons />
      <SelahCrossSell />
      <AppTestimonials />
      <TextMeTheLink />
    </main>
  );
}

function BibleAppHero() {
  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-32 sm:px-10">
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 50% at 70% 20%, rgba(204,143,74,0.14), transparent 70%)" }} />
      <div className="relative mx-auto grid max-w-[1200px] gap-10 md:grid-cols-[1.2fr,1fr] items-center">
        <div>
          <Eyebrow>BIBLE APP &middot; FREE &middot; IOS + ANDROID</Eyebrow>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-4 font-display text-ink-900"
            style={{ fontSize: "clamp(2.5rem,6.5vw,5.5rem)", fontWeight: 300, lineHeight: 0.98, letterSpacing: "-0.02em" }}
          >
            The Bible. <em className="italic">Quieter</em>.
          </motion.h1>
          <p className="mt-6 max-w-[54ch] font-body text-[18px] leading-relaxed text-ink-600">
            Read. Listen. Pause. Futures Bible is the Word with Selah&rsquo;s stillness baked in &mdash; so your morning stops being a scroll.
          </p>
          <div className="mt-10 max-w-[560px]">
            <GlassCard breathe className="p-5">
              <AIInput placeholder="Ask about the app&hellip;" chips={CHIPS} compact />
            </GlassCard>
          </div>
        </div>
        <PhoneMockup />
      </div>
    </section>
  );
}

function PhoneMockup() {
  return (
    <div className="relative mx-auto" style={{ width: 300, height: 600 }}>
      <motion.div
        initial={{ rotate: -4, y: 30, opacity: 0 }}
        animate={{ rotate: -4, y: 0, opacity: 1 }}
        transition={{ duration: 1.1, ease: [0.25, 0.1, 0.25, 1] }}
        className="absolute inset-0 rounded-[44px] border-[10px] border-ink-900 bg-ink-900 shadow-[0_40px_100px_rgba(62,44,27,0.35)]"
      >
        <div className="h-full w-full rounded-[30px] bg-cream p-6 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <p className="font-ui text-eyebrow uppercase text-ink-400" style={{ letterSpacing: "0.24em" }}>TODAY</p>
            <span className="h-2 w-2 rounded-full bg-warm-500" />
          </div>
          <p className="font-display text-ink-900" style={{ fontSize: 26, fontWeight: 300, lineHeight: 1.15 }}>
            Be <em className="italic">still</em>, and know.
          </p>
          <p className="font-ui text-eyebrow uppercase text-ink-400" style={{ letterSpacing: "0.2em" }}>Psalm 46:10</p>
          <div className="mt-2 rounded-2xl border border-ink-900/10 bg-white/70 p-4">
            <p className="font-ui text-eyebrow uppercase text-warm-700" style={{ letterSpacing: "0.24em" }}>SELAH &middot; 3 MIN</p>
            <p className="mt-2 font-body text-[14px] text-ink-700">Breathe. Four in. Six out. The line you keep avoiding \u2014 bring it here.</p>
          </div>
          <div className="mt-auto flex justify-between gap-2">
            {["Read", "Listen", "Selah", "Share"].map((t) => (
              <div key={t} className="flex-1 rounded-xl border border-ink-900/10 bg-white/60 py-2 text-center font-ui text-[11px] text-ink-600">{t}</div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function AppFeatures() {
  return (
    <section className="px-6 py-24 sm:px-10" style={{ background: "#F7F1E6" }}>
      <div className="mx-auto max-w-[1200px]">
        <Eyebrow>INSIDE</Eyebrow>
        <h2 className="mt-3 font-display text-ink-900" style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}>
          Three things, done <em className="italic">beautifully</em>.
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {FEATURES.map((f) => (
            <GlassCard key={f.t} breathe className="p-7">
              <p className="font-display text-ink-900" style={{ fontSize: 26, fontWeight: 300 }}>{f.t}</p>
              <p className="mt-4 font-body text-[15px] leading-relaxed text-ink-600">{f.b}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function AppStoreButtons() {
  return (
    <section className="px-6 py-24 sm:px-10 bg-cream">
      <div className="mx-auto max-w-[1200px] text-center">
        <Eyebrow>DOWNLOAD</Eyebrow>
        <h2 className="mt-3 font-display text-ink-900" style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}>
          Free. <em className="italic">Forever</em>.
        </h2>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
          <StoreBadge label="App Store" sub="iOS 16+" href="https://apps.apple.com/app/futures-church" />
          <StoreBadge label="Google Play" sub="Android 10+" href="https://play.google.com/store/apps/details?id=church.futures.app" />
        </div>
        <p className="mt-6 font-body text-[14px] text-ink-600">On desktop? Scroll down to text yourself a link.</p>
      </div>
    </section>
  );
}

function StoreBadge({ label, sub, href }: { label: string; sub: string; href: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="group">
      <GlassCard className="flex min-w-[240px] items-center gap-4 p-5 transition-transform group-hover:-translate-y-0.5">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink-900 text-cream">
          <span aria-hidden className="font-display" style={{ fontSize: 20, fontWeight: 300 }}>&darr;</span>
        </div>
        <div className="text-left">
          <p className="font-ui text-eyebrow uppercase text-ink-400" style={{ letterSpacing: "0.2em" }}>Get it on</p>
          <p className="font-display text-ink-900" style={{ fontSize: 22, fontWeight: 300 }}>{label}</p>
          <p className="font-body text-[12px] text-ink-600">{sub}</p>
        </div>
      </GlassCard>
    </a>
  );
}

function SelahCrossSell() {
  return (
    <section className="px-6 py-24 sm:px-10" style={{ background: "#1B1008", color: "#F7F1E6" }}>
      <div className="mx-auto grid max-w-[1200px] gap-10 md:grid-cols-[1fr,1fr] items-center">
        <div>
          <Eyebrow className="text-cream/60">SELAH, INSIDE</Eyebrow>
          <h2 className="mt-3 font-display" style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}>
            Why two apps? <em className="italic">Don&rsquo;t</em>.
          </h2>
          <p className="mt-5 max-w-[54ch] font-body text-[16px] leading-relaxed text-cream/80">
            Selah &mdash; the daily pause, scripture + stillness, less phone &mdash; is built into Futures Bible. Same app. Less clutter. More quiet.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/selah" className="inline-flex items-center gap-2 rounded-full border border-cream/20 bg-white/5 px-5 py-2.5 font-ui text-[14px] text-cream">See Selah &rarr;</Link>
          </div>
        </div>
        <GlassCard dark className="p-7">
          <p className="font-display italic text-cream" style={{ fontSize: 24, fontWeight: 300, lineHeight: 1.3 }}>&ldquo;I stopped opening three apps every morning. Now it&rsquo;s just this one.&rdquo;</p>
          <p className="mt-5 font-ui text-eyebrow uppercase text-cream/60" style={{ letterSpacing: "0.24em" }}>Amara &middot; Adelaide</p>
        </GlassCard>
      </div>
    </section>
  );
}

function AppTestimonials() {
  return (
    <section className="px-6 py-24 sm:px-10 bg-cream">
      <div className="mx-auto max-w-[1200px]">
        <Eyebrow>EARLY USERS</Eyebrow>
        <h2 className="mt-3 font-display text-ink-900" style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}>
          A few <em className="italic">quiet mornings</em>.
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <GlassCard key={t.name} className="p-7">
              <p className="font-display italic text-ink-900" style={{ fontSize: 22, fontWeight: 300, lineHeight: 1.3 }}>&ldquo;{t.q}&rdquo;</p>
              <p className="mt-5 font-ui text-eyebrow uppercase text-ink-400" style={{ letterSpacing: "0.24em" }}>{t.name} &middot; {t.city}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function TextMeTheLink() {
  const [email, setEmail] = useState("");
  const [platform, setPlatform] = useState<"ios" | "android">("ios");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/bible-app", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, platform }),
      });
      const json = (await res.json()) as { ok: boolean };
      if (json.ok) setDone(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="px-6 py-24 sm:px-10" style={{ background: "#2A1B10", color: "#F7F1E6" }}>
      <div className="mx-auto max-w-[720px] text-center">
        <Eyebrow className="text-cream/60">EMAIL ME THE LINK</Eyebrow>
        <h2 className="mt-3 font-display" style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}>
          On desktop? We&rsquo;ll <em className="italic">send it</em>.
        </h2>
        {done ? (
          <p className="mt-8 font-body text-[16px] leading-relaxed text-cream/80">Sent. Check your inbox \u2014 tap the link on your phone and you&rsquo;re good.</p>
        ) : (
          <form onSubmit={submit} className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <div className="flex rounded-full border border-cream/15 bg-white/5 p-1">
              {(["ios", "android"] as const).map((p) => (
                <button key={p} type="button" onClick={() => setPlatform(p)} className={`rounded-full px-4 py-1.5 font-ui text-[13px] uppercase ${platform === p ? "bg-warm-500 text-ink-900" : "text-cream/80"}`} style={{ letterSpacing: "0.16em" }}>
                  {p === "ios" ? "iOS" : "Android"}
                </button>
              ))}
            </div>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="w-full max-w-[320px] rounded-full border border-cream/15 bg-white/10 px-5 py-3 font-ui text-[14px] text-cream placeholder:text-cream/40 outline-none focus:border-warm-500" />
            <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 rounded-full bg-warm-500 px-5 py-3 font-ui text-[14px] text-ink-900 transition-transform hover:-translate-y-0.5 disabled:opacity-60">
              {submitting ? "Sending\u2026" : "Send link \u2192"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
