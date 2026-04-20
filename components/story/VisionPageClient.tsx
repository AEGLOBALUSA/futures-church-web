"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { AIInput } from "@/components/ai/AIInput";
import { GlassCard } from "@/components/ui/GlassCard";
import { Eyebrow } from "@/components/ui/Type";
import { ValueExchangeForm } from "@/components/forms/ValueExchangeForm";
import { useAIGuide } from "@/lib/ai/AIGuideContext";

type Progress = {
  asOf: string;
  campuses: { current: number; target: number; label: string };
  leaders: { current: number; target: number; label: string };
  souls: { current: number; target: number; label: string };
  nextCampuses: { city: string; country: string; year: number }[];
};

const CHIPS = [
  "why these numbers?",
  "where are you opening campuses next?",
  "how do I pray for the vision?",
  "how can I give to the vision?",
  "can I be one of the 10,000 leaders?",
  'what does "200,000 souls" actually mean?',
];

export function VisionPageClient({ data }: { data: Progress }) {
  const { setPageContext } = useAIGuide();
  useEffect(() => setPageContext("vision"), [setPageContext]);

  return (
    <main className="bg-cream text-ink-900">
      <VisionHero data={data} />
      <NumberStoryCards />
      <ProgressBars data={data} />
      <NextCampusesTimeline items={data.nextCampuses} />
      <HundredToTen />
      <VisionPrayerForm />
      <VisionCTA />
    </main>
  );
}

function VisionHero({ data }: { data: Progress }) {
  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-32 sm:px-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 10%, rgba(204,143,74,0.15), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-[1200px]">
        <Eyebrow>THE VISION &middot; 2026 &rarr; 2035</Eyebrow>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-4 font-display text-ink-900"
          style={{
            fontSize: "clamp(2.5rem,7vw,5.75rem)",
            fontWeight: 300,
            lineHeight: 0.98,
            letterSpacing: "-0.02em",
          }}
        >
          Two hundred <em className="italic">campuses</em>. Ten thousand <em className="italic">leaders</em>. Two hundred thousand <em className="italic">souls</em>.
        </motion.h1>
        <p className="mt-6 max-w-[54ch] font-body text-[18px] leading-relaxed text-ink-600">
          A hundred-year family with a ten-year mission.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          <CountUpCard from={data.campuses.current} to={data.campuses.target} label="campuses" />
          <CountUpCard from={0} to={data.leaders.target} label="leaders raised" />
          <CountUpCard from={0} to={data.souls.target} label="souls won to Christ" />
        </div>

        <div className="mt-12 max-w-[620px]">
          <GlassCard breathe className="p-5">
            <AIInput placeholder="Ask about the vision&hellip;" chips={CHIPS} compact />
          </GlassCard>
        </div>
      </div>
    </section>
  );
}

function CountUpCard({ from, to, label }: { from: number; to: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const reduce = useReducedMotion();
  const count = useMotionValue(from);
  const rounded = useTransform(count, (v) => Math.round(v).toLocaleString());
  const [staticValue] = useState(() => to.toLocaleString());

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(count, to, {
      duration: 1.4,
      ease: [0.25, 0.1, 0.25, 1],
    });
    return controls.stop;
  }, [inView, reduce, count, to]);

  return (
    <div ref={ref} className="flex flex-col items-start">
      {reduce ? (
        <span
          className="font-display italic text-ink-900"
          style={{ fontSize: "clamp(48px,9vw,112px)", fontWeight: 300, lineHeight: 0.95 }}
        >
          {staticValue}
        </span>
      ) : (
        <motion.span
          className="font-display italic text-ink-900"
          style={{ fontSize: "clamp(48px,9vw,112px)", fontWeight: 300, lineHeight: 0.95 }}
        >
          {rounded}
        </motion.span>
      )}
      <span className="mt-2 font-ui text-[11px] uppercase tracking-[0.24em] text-warm-700">
        {label}
      </span>
    </div>
  );
}

function NumberStoryCards() {
  const cards = [
    {
      big: "200",
      small: "campuses",
      body: "Two hundred so no city of a million goes without a Futures. Two hundred so the next generation inherits more than we did.",
    },
    {
      big: "10,000",
      small: "leaders",
      body: "Because a church without leaders is a building with a sign. We&rsquo;re raising ten thousand so every campus is led by people who&rsquo;ve been sharpened and sent.",
    },
    {
      big: "200,000",
      small: "souls",
      body: "Because every number has a name. Two hundred thousand is not a metric \u2014 it&rsquo;s two hundred thousand families changed forever.",
    },
  ];
  return (
    <section className="px-6 py-24 sm:px-10" style={{ background: "#F7F1E6" }}>
      <div className="mx-auto max-w-[1200px]">
        <Eyebrow>WHY THE NUMBERS</Eyebrow>
        <h2
          className="mt-3 font-display text-ink-900"
          style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}
        >
          Each number has a <em className="italic">name</em>.
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {cards.map((c) => (
            <GlassCard key={c.big} className="p-7">
              <p
                className="font-display italic text-warm-700"
                style={{ fontSize: 56, fontWeight: 300, lineHeight: 1 }}
              >
                {c.big}
              </p>
              <p className="mt-2 font-ui text-[11px] uppercase tracking-[0.24em] text-ink-600">
                {c.small}
              </p>
              <p
                className="mt-5 font-body text-[15px] leading-relaxed text-ink-600"
                dangerouslySetInnerHTML={{ __html: c.body }}
              />
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProgressBars({ data }: { data: Progress }) {
  const rows = [
    data.campuses,
    data.leaders,
    data.souls,
  ];
  return (
    <section className="px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-[1100px]">
        <Eyebrow>WHERE WE ARE</Eyebrow>
        <h2
          className="mt-3 font-display text-ink-900"
          style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}
        >
          The <em className="italic">scoreboard</em>.
        </h2>
        <p className="mt-3 font-ui text-[11px] uppercase tracking-[0.2em] text-ink-600/70">
          As of {data.asOf}
        </p>
        <div className="mt-10 space-y-8">
          {rows.map((r) => (
            <ProgressRow
              key={r.label}
              label={r.label}
              current={r.current}
              target={r.target}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProgressRow({
  label,
  current,
  target,
}: {
  label: string;
  current: number;
  target: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const reduce = useReducedMotion();
  const pct = Math.min(100, Math.round((current / target) * 100));
  return (
    <div ref={ref}>
      <div className="flex items-baseline justify-between">
        <p
          className="font-display italic text-ink-900"
          style={{ fontSize: 22, fontWeight: 300 }}
        >
          {label}
        </p>
        <p className="font-ui text-[12px] uppercase tracking-[0.22em] text-warm-700">
          {current.toLocaleString()} / {target.toLocaleString()} &middot; {pct}%
        </p>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-ink-900/8">
        <motion.div
          className="h-full rounded-full"
          style={{ background: "#CC8F4A" }}
          initial={{ width: reduce ? `${pct}%` : 0 }}
          animate={inView ? { width: `${pct}%` } : {}}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
        />
      </div>
    </div>
  );
}

function NextCampusesTimeline({ items }: { items: Progress["nextCampuses"] }) {
  const years = useMemo(
    () => Array.from(new Set(items.map((i) => i.year))).sort((a, b) => a - b),
    [items]
  );
  return (
    <section className="px-6 py-24 sm:px-10" style={{ background: "#F7F1E6" }}>
      <div className="mx-auto max-w-[1400px]">
        <Eyebrow>NEXT CAMPUSES</Eyebrow>
        <h2
          className="mt-3 font-display text-ink-900"
          style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}
        >
          Ten cities, <em className="italic">ready</em>.
        </h2>
        <div className="mt-10 space-y-10">
          {years.map((y) => (
            <div key={y}>
              <p
                className="font-display italic text-warm-700"
                style={{ fontSize: 32, fontWeight: 300, lineHeight: 1 }}
              >
                {y}
              </p>
              <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                {items
                  .filter((i) => i.year === y)
                  .map((c) => (
                    <li
                      key={`${c.city}-${c.country}`}
                      className="rounded-[16px] bg-white p-4"
                      style={{ border: "1px solid rgba(20,20,20,0.06)" }}
                    >
                      <p
                        className="font-display italic text-ink-900"
                        style={{ fontSize: 18, fontWeight: 300 }}
                      >
                        {c.city}
                      </p>
                      <p className="mt-1 font-ui text-[11px] uppercase tracking-[0.2em] text-warm-700">
                        {c.country}
                      </p>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HundredToTen() {
  const eras = [
    { year: "1922", line: "One chapel. Twenty-three people. Adelaide." },
    { year: "2026", line: "Twenty-one campuses. Four countries. One family." },
    { year: "2035", line: "Two hundred campuses. Ten thousand leaders. Two hundred thousand souls." },
  ];
  return (
    <section className="px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-[1100px]">
        <Eyebrow>A HUNDRED-YEAR FAMILY, A TEN-YEAR MISSION</Eyebrow>
        <h2
          className="mt-3 font-display text-ink-900"
          style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}
        >
          1922 &rarr; 2026 &rarr; <em className="italic">2035</em>.
        </h2>
        <ol className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {eras.map((e) => (
            <li
              key={e.year}
              className="rounded-[22px] bg-white p-7"
              style={{ border: "1px solid rgba(20,20,20,0.05)" }}
            >
              <p
                className="font-display italic text-warm-700"
                style={{ fontSize: 44, fontWeight: 300, lineHeight: 1 }}
              >
                {e.year}
              </p>
              <p className="mt-4 font-body text-[15px] leading-relaxed text-ink-600">
                {e.line}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function VisionPrayerForm() {
  return (
    <section id="pray" className="px-6 py-24 sm:px-10" style={{ background: "#F7F1E6" }}>
      <div className="mx-auto max-w-[720px]">
        <Eyebrow>PRAY</Eyebrow>
        <h2
          className="mt-3 font-display text-ink-900"
          style={{ fontSize: "clamp(1.75rem,3.6vw,2.5rem)", fontWeight: 300, lineHeight: 1.05 }}
        >
          Join the vision <em className="italic">prayer team</em>.
        </h2>
        <p className="mt-5 font-body text-[16px] leading-relaxed text-ink-600">
          One email a month. One named request per campus or leader. Specific. Actionable. Skippable.
        </p>
        <div className="mt-10">
          <ValueExchangeForm
            source="vision-prayer"
            offer="Join the Futures prayer team for the vision. One prayer request a month, tied to a real campus or leader."
            proofPoints={[
              "One email a month",
              "Always specific, always named",
              "Unsubscribe anytime",
            ]}
            fields={["email"]}
            cta="Add me to the vision prayer team"
            outcome="Your first prayer request arrives on the 1st of next month."
          />
        </div>
      </div>
    </section>
  );
}

function VisionCTA() {
  const tiles = [
    {
      href: "#pray",
      title: "Pray",
      body: "One email a month. A real campus, a real name.",
    },
    {
      href: "/give",
      title: "Give",
      body: "Partner with the vision. Vision Partner tier open.",
    },
    {
      href: "/college",
      title: "Go",
      body: "Become one of the 10,000 \u2014 one year at Global College.",
    },
  ];
  return (
    <section className="px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-[1200px]">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {tiles.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="group block rounded-[22px] bg-white p-7 transition-transform hover:-translate-y-1"
              style={{ border: "1px solid rgba(20,20,20,0.06)" }}
            >
              <p
                className="font-display italic text-ink-900"
                style={{ fontSize: 30, fontWeight: 300 }}
              >
                {t.title}
              </p>
              <p className="mt-3 font-body text-[15px] leading-relaxed text-ink-600">
                {t.body}
              </p>
              <span className="mt-6 inline-block font-ui text-[12px] uppercase tracking-[0.24em] text-warm-700 group-hover:text-ink-900">
                Go &rarr;
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
