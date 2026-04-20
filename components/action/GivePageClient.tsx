"use client";

import { useEffect, useState } from "react";
import { motion, useInView, useMotionValue, useTransform, animate, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { AIInput } from "@/components/ai/AIInput";
import { ValueExchangeForm } from "@/components/forms/ValueExchangeForm";
import { GlassCard } from "@/components/ui/GlassCard";
import { Eyebrow } from "@/components/ui/Type";
import { useAIGuide } from "@/lib/ai/AIGuideContext";
import paths from "@/content/give/paths.json";
import allocation from "@/content/give/allocation.json";
import faq from "@/content/give/faq.json";

const CHIPS = [
  "what's the difference between tithe and offering?",
  "is my gift tax-deductible?",
  "can I give monthly?",
  "where does the money actually go?",
  "can I give in AUD?",
  "how do I become a vision partner?",
];

const CURRENCIES = ["USD", "AUD", "IDR"] as const;
type Currency = (typeof CURRENCIES)[number];
type PathKey = "tithe" | "offering" | "vision" | "capital";

const IMPACT = [
  { q: "We could give ten dollars. We gave ten dollars. The next year, a hundred. The next year, a thousand. God meets the giver.", name: "Chris & Tara", campus: "Gwinnett" },
  { q: "When I started tithing, everything else in my finances made sense for the first time.", name: "Amira", campus: "Adelaide City" },
  { q: "Our monthly vision partnership is the quietest, most important thing we do as a family.", name: "The Kurniawan family", campus: "Solo" },
];

export function GivePageClient() {
  const { setPageContext } = useAIGuide();
  useEffect(() => setPageContext("give"), [setPageContext]);

  return (
    <main className="bg-cream text-ink-900">
      <GiveHero />
      <FourGivingPaths />
      <GivingForm />
      <TransparencySection />
      <ImpactStories />
      <TaxReceiptInfo />
      <VisionPartnerCTA />
      <GiveFAQ />
    </main>
  );
}

function GiveHero() {
  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-32 sm:px-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 65% 55% at 80% 10%, rgba(204,143,74,0.14), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-[1200px]">
        <Eyebrow>GIVE &middot; GENEROSITY IS WORSHIP</Eyebrow>
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-4 font-display text-ink-900"
          style={{ fontSize: "clamp(2.5rem,6.5vw,5.5rem)", fontWeight: 300, lineHeight: 0.98, letterSpacing: "-0.02em" }}
        >
          Every dollar has a <em className="italic">name</em> on it.
        </motion.h1>
        <p className="mt-6 max-w-[58ch] font-body text-[18px] leading-relaxed text-ink-600">
          Generosity is worship. It&rsquo;s also how 200 campuses, 10,000 leaders, and 200,000 souls
          get built &mdash; one faithful gift at a time.
        </p>
        <div className="mt-10 max-w-[620px]">
          <GlassCard breathe className="p-5">
            <AIInput placeholder="Ask a giving question&hellip;" chips={CHIPS} compact />
          </GlassCard>
        </div>
      </div>
    </section>
  );
}

function FourGivingPaths() {
  return (
    <section className="px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-[1200px]">
        <Eyebrow>FOUR WAYS</Eyebrow>
        <h2 className="mt-3 font-display text-ink-900" style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}>
          Pick the path that fits your <em className="italic">season</em>.
        </h2>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {paths.paths.map((p) => (
            <a
              key={p.key}
              href={`#give-form?path=${p.key}`}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById("give-form");
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                window.dispatchEvent(new CustomEvent("give:set-path", { detail: p.key }));
              }}
              className="group"
            >
              <GlassCard breathe className="flex h-full flex-col p-6 transition-transform group-hover:-translate-y-1">
                <p className="font-ui text-eyebrow uppercase text-warm-700" style={{ letterSpacing: "0.24em" }}>{p.tag}</p>
                <h3 className="mt-3 font-display text-ink-900" style={{ fontSize: 28, fontWeight: 300 }}>{p.label}</h3>
                <p className="mt-3 font-body text-[15px] leading-relaxed text-ink-600">{p.blurb}</p>
                <p className="mt-auto pt-4 font-ui text-eyebrow uppercase text-ink-400" style={{ letterSpacing: "0.2em" }}>{p.scripture}</p>
              </GlassCard>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function GivingForm() {
  const [pathKey, setPathKey] = useState<PathKey>("tithe");
  const [amount, setAmount] = useState<number>(100);
  const [currency, setCurrency] = useState<Currency>("USD");
  const [recurring, setRecurring] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<null | { amount: number; currency: string }>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<PathKey>;
      if (ce.detail) {
        setPathKey(ce.detail);
        const def = paths.paths.find((p) => p.key === ce.detail)?.default ?? 100;
        setAmount(def);
        if (ce.detail === "vision") setRecurring(true);
      }
    };
    window.addEventListener("give:set-path", handler);
    return () => window.removeEventListener("give:set-path", handler);
  }, []);

  async function submit() {
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/give", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          amount,
          currency,
          path: pathKey,
          recurring: recurring ? "monthly" : null,
          email: email || undefined,
          name: name || undefined,
        }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !json.ok) throw new Error(json.error ?? "give-failed");
      setDone({ amount, currency });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  const selectedPath = paths.paths.find((p) => p.key === pathKey);

  if (done) {
    return (
      <section id="give-form" className="px-6 py-24 sm:px-10" style={{ background: "#F7F1E6" }}>
        <div className="mx-auto max-w-[720px] text-center">
          <Eyebrow>THANK YOU</Eyebrow>
          <h2 className="mt-3 font-display text-ink-900" style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}>
            {done.currency} {done.amount.toLocaleString()} <em className="italic">received</em>.
          </h2>
          <p className="mt-5 font-body text-[16px] leading-relaxed text-ink-600">
            A receipt is on its way to your email. Every dollar, tracked, named, prayed over.
          </p>
        </div>
      </section>
    );
  }

  const presets = pathKey === "capital" ? [250, 500, 1000, 2500] : pathKey === "vision" ? [50, 100, 250, 500] : [25, 50, 100, 250];

  return (
    <section id="give-form" className="px-6 py-24 sm:px-10" style={{ background: "#F7F1E6" }}>
      <div className="mx-auto max-w-[780px]">
        <Eyebrow>GIVE NOW</Eyebrow>
        <h2 className="mt-3 font-display text-ink-900" style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}>
          {selectedPath?.label}. <span className="text-ink-400">{selectedPath?.tag}</span>
        </h2>

        <GlassCard breathe className="mt-8 p-7 md:p-10">
          <div className="grid gap-2 sm:grid-cols-4">
            {paths.paths.map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => {
                  setPathKey(p.key as PathKey);
                  setAmount(p.default);
                  setRecurring(p.key === "vision");
                }}
                className={`rounded-xl border px-3 py-2 font-ui text-[13px] uppercase transition-colors ${
                  pathKey === p.key ? "border-warm-500 bg-warm-500/15 text-ink-900" : "border-ink-900/10 bg-white/50 text-ink-600 hover:border-ink-900/20"
                }`}
                style={{ letterSpacing: "0.16em" }}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[200px]">
              <label className="font-ui text-eyebrow uppercase text-ink-600" style={{ letterSpacing: "0.24em" }}>Amount</label>
              <div className="mt-1.5 flex items-center gap-2 rounded-2xl border border-ink-900/10 bg-white/80 px-4 py-3">
                <select value={currency} onChange={(e) => setCurrency(e.target.value as Currency)} className="bg-transparent font-ui text-[15px] text-ink-900 outline-none">
                  {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <input
                  type="number"
                  min={1}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value) || 0)}
                  className="w-full bg-transparent font-display text-[28px] text-ink-900 outline-none"
                  style={{ fontWeight: 300 }}
                />
              </div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {presets.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setAmount(p)}
                className={`rounded-full border px-4 py-1.5 font-ui text-[13px] transition-colors ${
                  amount === p ? "border-warm-500 bg-warm-500/15 text-ink-900" : "border-ink-900/10 bg-white/50 text-ink-600 hover:border-ink-900/20"
                }`}
              >
                {currency} {p.toLocaleString()}
              </button>
            ))}
          </div>

          <label className="mt-6 flex items-center gap-3 font-ui text-[14px] text-ink-700">
            <input type="checkbox" checked={recurring} onChange={(e) => setRecurring(e.target.checked)} className="h-4 w-4 accent-warm-500" />
            Make this a <em className="italic">monthly</em> gift
          </label>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="font-ui text-eyebrow uppercase text-ink-600" style={{ letterSpacing: "0.24em" }}>Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="rounded-2xl border border-ink-900/10 bg-white/80 px-4 py-3 font-ui text-[15px] text-ink-900 placeholder:text-ink-400 outline-none focus:border-warm-500" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-ui text-eyebrow uppercase text-ink-600" style={{ letterSpacing: "0.24em" }}>Email (for receipt)</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="rounded-2xl border border-ink-900/10 bg-white/80 px-4 py-3 font-ui text-[15px] text-ink-900 placeholder:text-ink-400 outline-none focus:border-warm-500" />
            </div>
          </div>

          <p className="mt-6 font-ui text-[12px] text-ink-400">
            Secure payment is coming soon. For now, tell us your intent &mdash; a pastor will reach out with the best way to give in your region.
          </p>

          {error && <p className="mt-3 font-ui text-sm text-warm-700" role="alert">{error}</p>}

          <button
            type="button"
            onClick={submit}
            disabled={submitting || amount <= 0}
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-full bg-ink-900 px-6 py-3 font-ui text-[15px] text-cream transition-transform hover:-translate-y-0.5 disabled:opacity-60"
          >
            {submitting ? "Sending\u2026" : `Pledge ${currency} ${amount.toLocaleString()}${recurring ? " / month" : ""}`}
            <span>&rarr;</span>
          </button>
        </GlassCard>
      </div>
    </section>
  );
}

function AnimatedPercent({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const reduce = useReducedMotion();
  const mv = useMotionValue(0);
  const text = useTransform(mv, (v) => `${Math.round(v)}%`);
  useEffect(() => {
    if (!inView || reduce) return;
    const ctrl = animate(mv, value, { duration: 1.2, ease: [0.25, 0.1, 0.25, 1] });
    return ctrl.stop;
  }, [inView, reduce, value, mv]);
  if (reduce) return <span ref={ref}>{value}%</span>;
  return <motion.span ref={ref}>{text}</motion.span>;
}

function TransparencySection() {
  return (
    <section className="px-6 py-24 sm:px-10 bg-cream">
      <div className="mx-auto max-w-[1200px]">
        <Eyebrow>TRANSPARENCY &middot; AS OF {allocation.asOf.toUpperCase()}</Eyebrow>
        <h2 className="mt-3 font-display text-ink-900" style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}>
          Where every dollar <em className="italic">goes</em>.
        </h2>
        <p className="mt-5 max-w-[58ch] font-body text-[16px] leading-relaxed text-ink-600">
          We publish the allocation in plain numbers. An audited annual report is available on request &mdash; email finance@futures.church.
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-[1fr,1.3fr]">
          <AllocationDonut />
          <div className="flex flex-col gap-3">
            {allocation.slices.map((s) => (
              <div key={s.label} className="flex items-baseline gap-4 border-b border-ink-900/10 pb-3">
                <p className="font-display text-ink-900" style={{ fontSize: 28, fontWeight: 300, minWidth: 90 }}>
                  <AnimatedPercent value={s.percent} />
                </p>
                <div className="flex-1">
                  <p className="font-ui text-[15px] text-ink-900">{s.label}</p>
                  <p className="font-body text-[13px] text-ink-600">{s.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AllocationDonut() {
  const size = 280;
  const radius = 110;
  const stroke = 36;
  const circ = 2 * Math.PI * radius;
  const colors = ["#CC8F4A", "#C8906B", "#A47249", "#6F4E2C", "#3E2C1B", "#8C6B49"];
  let offset = 0;
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const reduce = useReducedMotion();

  return (
    <div className="flex items-center justify-center">
      <svg ref={ref} width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(62,44,27,0.08)" strokeWidth={stroke} />
        {allocation.slices.map((s, i) => {
          const frac = s.percent / 100;
          const len = circ * frac;
          const dash = `${len} ${circ}`;
          const thisOffset = -offset;
          offset += len;
          return (
            <motion.circle
              key={s.label}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={colors[i % colors.length]}
              strokeWidth={stroke}
              strokeDasharray={dash}
              strokeDashoffset={thisOffset}
              initial={reduce ? false : { pathLength: 0, opacity: 0 }}
              animate={inView || reduce ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
              transition={{ duration: 1.1, delay: 0.1 + i * 0.12, ease: [0.25, 0.1, 0.25, 1] }}
            />
          );
        })}
      </svg>
    </div>
  );
}

function ImpactStories() {
  return (
    <section className="px-6 py-24 sm:px-10" style={{ background: "#1B1008", color: "#F7F1E6" }}>
      <div className="mx-auto max-w-[1200px]">
        <Eyebrow className="text-cream/60">IMPACT &middot; REAL FAMILIES</Eyebrow>
        <h2 className="mt-3 font-display" style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}>
          What generosity <em className="italic">does</em>.
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {IMPACT.map((i) => (
            <GlassCard key={i.name} dark className="p-7">
              <p className="font-display italic text-cream" style={{ fontSize: 22, fontWeight: 300, lineHeight: 1.3 }}>&ldquo;{i.q}&rdquo;</p>
              <p className="mt-5 font-ui text-eyebrow uppercase text-cream/60" style={{ letterSpacing: "0.24em" }}>{i.name} &middot; {i.campus}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function TaxReceiptInfo() {
  return (
    <section className="px-6 py-20 sm:px-10 bg-cream">
      <div className="mx-auto max-w-[1000px] grid gap-6 md:grid-cols-3">
        <InfoCard title="US 501(c)(3)" body="Futures Church Inc. EIN on request. Every US gift is fully tax-deductible." />
        <InfoCard title="Australia" body="Giving to Futures Church Ltd. A receipt arrives the moment you give; a statement every July." />
        <InfoCard title="Indonesia" body="Yayasan Futuros. Local receipts issued on request &mdash; email finance@futures.church." />
      </div>
    </section>
  );
}

function InfoCard({ title, body }: { title: string; body: string }) {
  return (
    <GlassCard className="p-6">
      <p className="font-ui text-eyebrow uppercase text-warm-700" style={{ letterSpacing: "0.24em" }}>{title}</p>
      <p className="mt-3 font-body text-[15px] leading-relaxed text-ink-600">{body}</p>
    </GlassCard>
  );
}

function VisionPartnerCTA() {
  return (
    <section className="px-6 py-24 sm:px-10" style={{ background: "#2A1B10", color: "#F7F1E6" }}>
      <div className="mx-auto grid max-w-[1200px] gap-10 md:grid-cols-[1.2fr,1fr]">
        <div>
          <Eyebrow className="text-cream/60">VISION PARTNERS</Eyebrow>
          <h2 className="mt-3 font-display" style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}>
            Build the <em className="italic">next 179</em> campuses with us.
          </h2>
          <p className="mt-5 max-w-[58ch] font-body text-[16px] leading-relaxed text-cream/80">
            A vision partner gives monthly, prays weekly, and carries the burden with us. We&rsquo;ll write you personally, send you the honest numbers, and pray for you by name.
          </p>
        </div>
        <ValueExchangeForm
          dark
          source="give-vision-partner"
          offer="Become a monthly vision partner."
          proofPoints={[
            "Personal email from Ashley or Jane every quarter",
            "Honest numbers, first",
            "Prayed for by name, weekly",
          ]}
          fields={["email", "name", "oneThing"]}
          cta="Count me in"
          outcome="We&rsquo;ll be in touch within 48 hours."
        />
      </div>
    </section>
  );
}

function GiveFAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="px-6 py-24 sm:px-10 bg-cream">
      <div className="mx-auto max-w-[820px]">
        <Eyebrow>QUESTIONS, ANSWERED</Eyebrow>
        <h2 className="mt-3 font-display text-ink-900" style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}>
          Before you <em className="italic">give</em>.
        </h2>
        <ul className="mt-10 divide-y divide-ink-900/10 border-y border-ink-900/10">
          {faq.items.map((item, i) => (
            <li key={item.q}>
              <button type="button" onClick={() => setOpen(open === i ? null : i)} className="flex w-full items-start justify-between gap-4 py-5 text-left">
                <span className="font-display text-ink-900" style={{ fontSize: 20, fontWeight: 300 }}>{item.q}</span>
                <span className="mt-1 font-ui text-ink-400">{open === i ? "\u2212" : "+"}</span>
              </button>
              {open === i && (
                <p className="pb-5 pr-8 font-body text-[15px] leading-relaxed text-ink-600">{item.a}</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
