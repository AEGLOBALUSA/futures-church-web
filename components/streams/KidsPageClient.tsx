"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { AIInput } from "@/components/ai/AIInput";
import { GlassCard } from "@/components/ui/GlassCard";
import { Eyebrow, Hero, Sub } from "@/components/ui/Type";
import { ValueExchangeForm } from "@/components/forms/ValueExchangeForm";
import { useAIGuide } from "@/lib/ai/AIGuideContext";

type KidsData = {
  promise: { title: string; body: string }[];
  byAge: {
    slug: string;
    label: string;
    photo: string;
    what: string;
    timeline: { t: string; d: string }[];
    pastor: string;
  }[];
  thisSunday: { date: string; scripture: string; bigIdea: string; question: string }[];
  team: { name: string; campus: string; photo: string; oneLine: string }[];
  faq: { q: string; a: string }[];
};

const CHIPS = [
  "what happens in kids church this Sunday?",
  "is there something for my 2-year-old?",
  "my kid has special needs — can you help?",
  "what do you teach them?",
  "is the team background-checked?",
  "when can I take a tour of the kids area?",
];

export function KidsPageClient({ data }: { data: KidsData }) {
  const { setPageContext } = useAIGuide();
  useEffect(() => setPageContext("kids"), [setPageContext]);

  return (
    <main className="bg-cream text-ink-900">
      <KidsHero />
      <KidsPromise promise={data.promise} />
      <SundayByAge byAge={data.byAge} />
      <KidsTeamGrid team={data.team} />
      <ThisSundayFeed items={data.thisSunday} />
      <KidsForm />
      <KidsFAQ items={data.faq} />
    </main>
  );
}

function KidsHero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 20% 0%, #F2E6D1 0%, #FDFBF6 50%, #FDFBF6 100%)",
      }}
    >
      <div className="mx-auto max-w-[1440px] px-6 pb-24 pt-28 sm:px-10 sm:pt-36">
        <Eyebrow>KIDS &middot; EVERY CAMPUS &middot; EVERY WEEK</Eyebrow>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-4 max-w-[20ch]"
        >
          <Hero>
            Sundays your kids will <em className="italic">ask</em> to come back to.
          </Hero>
        </motion.div>
        <Sub className="mt-6 max-w-[56ch]">
          Safe, biblical, and genuinely great &mdash; at every Futures campus, every week.
        </Sub>
        <div className="mt-10 max-w-[620px]">
          <GlassCard breathe className="p-6">
            <AIInput placeholder="Ask a parent question&hellip;" chips={CHIPS} compact />
          </GlassCard>
        </div>
      </div>
    </section>
  );
}

function KidsPromise({ promise }: { promise: KidsData["promise"] }) {
  const reduceMotion = useReducedMotion();
  return (
    <section className="px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-[1180px]">
        <Eyebrow>THE PROMISE</Eyebrow>
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          {promise.map((p, i) => (
            <motion.div
              key={p.title}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <GlassCard className="h-full p-7">
                <p
                  className="font-display italic text-ink-900"
                  style={{ fontSize: 26, fontWeight: 300, lineHeight: 1.1 }}
                >
                  {p.title}
                </p>
                <p className="mt-3 font-body text-[15px] leading-relaxed text-ink-600">
                  {p.body}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SundayByAge({ byAge }: { byAge: KidsData["byAge"] }) {
  const [active, setActive] = useState(0);
  const current = byAge[active];
  return (
    <section className="px-6 py-24 sm:px-10" style={{ background: "#F7F1E6" }}>
      <div className="mx-auto max-w-[1180px]">
        <Eyebrow>SUNDAY, BY AGE</Eyebrow>
        <h2
          className="mt-3 font-display text-ink-900"
          style={{ fontSize: "clamp(2rem,4.4vw,3.25rem)", fontWeight: 300, lineHeight: 1.02 }}
        >
          Every age has a <em className="italic">room</em>.
        </h2>

        <div className="mt-10 flex flex-wrap gap-2">
          {byAge.map((a, i) => (
            <button
              key={a.slug}
              type="button"
              onClick={() => setActive(i)}
              className={`rounded-full border px-5 py-2.5 font-ui text-[13px] transition-all ${
                active === i
                  ? "border-ink-900 bg-ink-900 text-cream"
                  : "border-ink-900/15 bg-white/70 text-ink-900 hover:bg-white"
              }`}
              dangerouslySetInnerHTML={{ __html: a.label }}
            />
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] shadow-[0_22px_50px_-28px_rgba(20,20,20,0.35)]">
            <Image
              src={current.photo}
              alt={current.label.replace(/&ndash;/g, "–")}
              fill
              unoptimized
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div>
            <p
              className="font-display italic text-ink-900"
              style={{ fontSize: 28, fontWeight: 300, lineHeight: 1.15 }}
              dangerouslySetInnerHTML={{ __html: current.label }}
            />
            <p className="mt-4 font-body text-[16px] leading-relaxed text-ink-900">
              {current.what}
            </p>
            <ol className="mt-6 space-y-3">
              {current.timeline.map((t, i) => (
                <li key={t.t} className="flex gap-4">
                  <span className="flex-shrink-0 font-ui text-[11px] uppercase tracking-[0.2em] text-warm-700">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="font-ui text-[13px] font-medium text-ink-900">{t.t}</p>
                    <p className="font-body text-[14px] text-ink-600">{t.d}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-6 font-ui text-[12px] uppercase tracking-[0.2em] text-ink-600">
              Lead pastor
            </p>
            <p className="mt-1 font-display italic text-ink-900" style={{ fontSize: 20, fontWeight: 300 }}>
              {current.pastor}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function KidsTeamGrid({ team }: { team: KidsData["team"] }) {
  return (
    <section className="px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-[1180px]">
        <Eyebrow>THE TEAM</Eyebrow>
        <h2
          className="mt-3 font-display text-ink-900"
          style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}
        >
          Real faces. Real <em className="italic">names</em>.
        </h2>
        <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-3">
          {team.map((t) => (
            <div
              key={`${t.name}-${t.campus}`}
              className="overflow-hidden rounded-[20px] bg-white shadow-[0_14px_34px_-22px_rgba(20,20,20,0.25)]"
              style={{ border: "1px solid rgba(20,20,20,0.05)" }}
            >
              <div className="relative aspect-square w-full overflow-hidden">
                <Image src={t.photo} alt={t.name} fill unoptimized sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" />
              </div>
              <div className="p-5">
                <p className="font-display italic text-ink-900" style={{ fontSize: 20, fontWeight: 300 }}>
                  {t.name}
                </p>
                <p className="mt-1 font-ui text-[11px] uppercase tracking-[0.2em] text-warm-700">
                  {t.campus}
                </p>
                <p className="mt-3 font-body text-[13px] text-ink-600">{t.oneLine}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ThisSundayFeed({ items }: { items: KidsData["thisSunday"] }) {
  return (
    <section className="px-6 py-24 sm:px-10" style={{ background: "#F7F1E6" }}>
      <div className="mx-auto max-w-[900px]">
        <Eyebrow>THIS SUNDAY &middot; AND THE LAST FEW</Eyebrow>
        <h2
          className="mt-3 font-display text-ink-900"
          style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}
        >
          What we <em className="italic">taught</em> them.
        </h2>
        <div className="mt-10 flex flex-col gap-4">
          {items.map((s) => (
            <GlassCard key={s.date} className="p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <p className="font-ui text-[12px] uppercase tracking-[0.2em] text-ink-600">
                  {s.date}
                </p>
                <p className="font-ui text-[12px] text-warm-700">{s.scripture}</p>
              </div>
              <p
                className="mt-2 font-display italic text-ink-900"
                style={{ fontSize: 22, fontWeight: 300, lineHeight: 1.2 }}
              >
                {s.bigIdea}
              </p>
              <p className="mt-3 font-body text-[14px] text-ink-600">
                <span className="font-ui text-[11px] uppercase tracking-[0.22em] text-warm-700">At dinner:</span>{" "}
                {s.question}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function KidsForm() {
  return (
    <section className="px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-[560px]">
        <ValueExchangeForm
          source="kids-newsletter"
          offer="Every Monday we send parents what we taught their kids on Sunday, plus three questions to ask over dinner."
          proofPoints={["Three sentences long", "Monday morning", "You'll look like a hero"]}
          fields={["email", "kidsAges"]}
          cta="Send me Monday's letter"
          outcome="You'll get this coming Monday's first."
        />
      </div>
    </section>
  );
}

function KidsFAQ({ items }: { items: KidsData["faq"] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="px-6 py-24 sm:px-10" style={{ background: "#F7F1E6" }}>
      <div className="mx-auto max-w-[780px]">
        <Eyebrow>PARENTS ASK</Eyebrow>
        <h2
          className="mt-3 font-display text-ink-900"
          style={{ fontSize: "clamp(1.75rem,3.6vw,2.5rem)", fontWeight: 300, lineHeight: 1.05 }}
        >
          Five answers before you <em className="italic">arrive</em>.
        </h2>
        <ul className="mt-10 divide-y divide-ink-900/10 rounded-[22px] bg-white/70 shadow-[0_18px_40px_-28px_rgba(20,20,20,0.25)]">
          {items.map((f, i) => {
            const isOpen = open === i;
            return (
              <li key={f.q}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="font-display italic text-ink-900" style={{ fontSize: 18, fontWeight: 300 }}>
                    {f.q}
                  </span>
                  <span className={`font-ui text-[14px] text-ink-600 transition-transform ${isOpen ? "rotate-45" : ""}`}>+</span>
                </button>
                {isOpen && (
                  <div
                    className="px-6 pb-6 font-body text-[15px] leading-relaxed text-ink-600"
                    dangerouslySetInnerHTML={{ __html: f.a }}
                  />
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
