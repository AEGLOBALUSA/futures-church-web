"use client";

import { useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { AIInput } from "@/components/ai/AIInput";
import { GlassCard } from "@/components/ui/GlassCard";
import { Eyebrow } from "@/components/ui/Type";
import { useAIGuide } from "@/lib/ai/AIGuideContext";
import { campuses } from "@/lib/content/campuses";

type Pillar = { title: string; body: string };
type Belief = { title: string; body: string };
type WorshipCard = { title: string; body: string; photo: string };
type SeniorPastor = {
  slug: string;
  name: string;
  role: string;
  oneLine: string;
  quote: string;
  photo: string;
};

type AboutData = {
  pillars: Pillar[];
  beliefs: Belief[];
  worshipCards: WorshipCard[];
  seniorPastors: SeniorPastor[];
};

const CHIPS = [
  "what does Futures believe?",
  "who leads the church?",
  "how is Futures different?",
  "is Futures a denomination?",
  "show me a typical Sunday",
  "how do I get involved?",
];

export function AboutPageClient({ data }: { data: AboutData }) {
  const { setPageContext } = useAIGuide();
  useEffect(() => setPageContext("about"), [setPageContext]);

  return (
    <main className="bg-cream text-ink-900">
      <AboutHero />
      <FamilyOfChurches />
      <ThreePillars pillars={data.pillars} />
      <MeetTheSeniorPastors pastors={data.seniorPastors} />
      <WhatWeBelieve beliefs={data.beliefs} />
      <HowWeWorship cards={data.worshipCards} />
      <AboutCrossLinks />
    </main>
  );
}

function AboutHero() {
  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-32 sm:px-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 20% 10%, rgba(204,143,74,0.14), transparent 70%), radial-gradient(ellipse 50% 40% at 80% 80%, rgba(204,143,74,0.10), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-[1200px]">
        <Eyebrow>ABOUT FUTURES</Eyebrow>
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-4 font-display text-ink-900"
          style={{
            fontSize: "clamp(2.75rem,7vw,6rem)",
            fontWeight: 300,
            lineHeight: 0.98,
            letterSpacing: "-0.02em",
          }}
        >
          A home for <em className="italic">everyone</em>.
        </motion.h1>
        <p className="mt-6 max-w-[54ch] font-body text-[18px] leading-relaxed text-ink-600">
          Every race. Every age. Every stage. One family, one vision, one Futures.
        </p>
        <div className="mt-10 max-w-[620px]">
          <GlassCard breathe className="p-5">
            <AIInput placeholder="Ask Ezra anything about Futures&hellip;" chips={CHIPS} compact />
          </GlassCard>
        </div>
      </div>
    </section>
  );
}

function FamilyOfChurches() {
  const active = campuses.filter((c) => c.status !== "online");
  const countryGroups = useMemo(() => {
    const map = new Map<string, number>();
    active.forEach((c) => map.set(c.country, (map.get(c.country) ?? 0) + 1));
    return Array.from(map.entries());
  }, [active]);

  return (
    <section className="px-6 py-24 sm:px-10" style={{ background: "#F7F1E6" }}>
      <div className="mx-auto max-w-[1200px]">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center">
          <div>
            <Eyebrow>FAMILY OF CHURCHES</Eyebrow>
            <h2
              className="mt-3 font-display text-ink-900"
              style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}
            >
              Twenty-one churches. <em className="italic">Four countries</em>. One family.
            </h2>
            <p className="mt-5 font-body text-[16px] leading-relaxed text-ink-600">
              Twenty-one local churches running as one family under Ashley &amp; Jane Evans. Paradise, Gwinnett, Bali, Caracas &mdash; different accents, same table.
            </p>
            <ul className="mt-8 grid grid-cols-2 gap-y-3 font-body text-[14px] text-ink-600">
              {countryGroups.map(([country, n]) => (
                <li key={country} className="flex items-baseline gap-3">
                  <span
                    className="font-display italic text-warm-700"
                    style={{ fontSize: 22, fontWeight: 300, lineHeight: 1 }}
                  >
                    {n}
                  </span>
                  <span>{country}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/campuses"
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-ink-900 px-6 py-3 font-ui text-[14px] text-cream transition-transform hover:-translate-y-0.5"
            >
              See every campus &rarr;
            </Link>
          </div>

          <AmbientMap />
        </div>
      </div>
    </section>
  );
}

function AmbientMap() {
  const plotted = campuses.filter(
    (c) => typeof c.lat === "number" && typeof c.lng === "number"
  );
  return (
    <div
      className="relative aspect-[4/3] overflow-hidden rounded-[22px] border border-ink-900/5 bg-cream"
      aria-label="Map of Futures campuses across Australia, the United States, Indonesia, and Venezuela"
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(204,143,74,0.08) 0%, transparent 70%)",
        }}
      />
      {plotted.map((c) => {
        const x = ((c.lng! + 180) / 360) * 100;
        const y = ((90 - c.lat!) / 180) * 100;
        const launching = c.status === "launching";
        return (
          <span
            key={c.slug}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${x}%`,
              top: `${y}%`,
            }}
          >
            <span
              className="block h-2.5 w-2.5 rounded-full"
              style={{
                background: launching ? "rgba(204,143,74,0.5)" : "#CC8F4A",
                boxShadow: "0 0 0 6px rgba(204,143,74,0.12)",
                animation: launching ? "glass-breathe 3s ease-in-out infinite" : "glass-breathe 6s ease-in-out infinite",
              }}
            />
          </span>
        );
      })}
      <div className="absolute bottom-3 left-4 font-ui text-[10px] uppercase tracking-[0.2em] text-ink-600/70">
        ambient &middot; not to scale
      </div>
    </div>
  );
}

function ThreePillars({ pillars }: { pillars: Pillar[] }) {
  return (
    <section className="px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-[1200px]">
        <Eyebrow>WHAT HOLDS US</Eyebrow>
        <h2
          className="mt-3 font-display text-ink-900"
          style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}
        >
          Rooted. Raised. <em className="italic">Released</em>.
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {pillars.map((p) => (
            <GlassCard key={p.title} className="p-7">
              <p
                className="font-display italic text-ink-900"
                style={{ fontSize: 24, fontWeight: 300 }}
              >
                {p.title}
              </p>
              <p className="mt-4 font-body text-[15px] leading-relaxed text-ink-600">
                {p.body}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function MeetTheSeniorPastors({ pastors }: { pastors: SeniorPastor[] }) {
  return (
    <section className="px-6 py-24 sm:px-10" style={{ background: "#F7F1E6" }}>
      <div className="mx-auto max-w-[1200px]">
        <Eyebrow>GLOBAL SENIOR PASTORS</Eyebrow>
        <h2
          className="mt-3 font-display text-ink-900"
          style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}
        >
          Ashley &amp; <em className="italic">Jane Evans</em>.
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          {pastors.map((p) => (
            <article
              key={p.slug}
              className="overflow-hidden rounded-[22px] bg-white shadow-[0_18px_40px_-22px_rgba(20,20,20,0.25)]"
              style={{ border: "1px solid rgba(20,20,20,0.05)" }}
            >
              <div className="relative aspect-[5/4] w-full overflow-hidden">
                <Image
                  src={p.photo}
                  alt={p.name}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="p-7">
                <p
                  className="font-display text-ink-900"
                  style={{ fontSize: 28, fontWeight: 300, lineHeight: 1.05 }}
                >
                  {p.name}
                </p>
                <p className="mt-1 font-ui text-[11px] uppercase tracking-[0.24em] text-warm-700">
                  {p.role}
                </p>
                <p className="mt-4 font-body text-[15px] leading-relaxed text-ink-600">
                  {p.oneLine}
                </p>
                <blockquote className="mt-5 border-l-2 border-warm-500 pl-4 font-display italic text-ink-900" style={{ fontSize: 18, fontWeight: 300, lineHeight: 1.4 }}>
                  &ldquo;{p.quote}&rdquo;
                </blockquote>
                <Link
                  href={`/leaders#${p.slug}`}
                  className="mt-6 inline-flex items-center gap-2 font-ui text-[13px] uppercase tracking-[0.2em] text-warm-700 hover:text-ink-900"
                >
                  Read more &rarr;
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhatWeBelieve({ beliefs }: { beliefs: Belief[] }) {
  return (
    <section className="px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-[1100px]">
        <Eyebrow>WHAT WE BELIEVE</Eyebrow>
        <h2
          className="mt-3 font-display text-ink-900"
          style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}
        >
          The short version. <em className="italic">Five paragraphs</em>.
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
          {beliefs.map((b) => (
            <div
              key={b.title}
              className="rounded-[18px] bg-white p-6"
              style={{ border: "1px solid rgba(20,20,20,0.06)" }}
            >
              <p className="font-ui text-[11px] uppercase tracking-[0.24em] text-warm-700">
                {b.title}
              </p>
              <p className="mt-3 font-body text-[15px] leading-relaxed text-ink-600">
                {b.body}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-10">
          <a
            href="/statement-of-faith.pdf"
            className="inline-flex items-center gap-2 font-ui text-[13px] uppercase tracking-[0.2em] text-warm-700 hover:text-ink-900"
          >
            Read the full statement of faith &rarr;
          </a>
        </p>
      </div>
    </section>
  );
}

function HowWeWorship({ cards }: { cards: WorshipCard[] }) {
  return (
    <section className="px-6 py-24 sm:px-10" style={{ background: "#F7F1E6" }}>
      <div className="mx-auto max-w-[1200px]">
        <Eyebrow>HOW WE WORSHIP</Eyebrow>
        <h2
          className="mt-3 font-display text-ink-900"
          style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}
        >
          Music. Message. <em className="italic">Communion</em>. Baptism.
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <article
              key={c.title}
              className="overflow-hidden rounded-[20px] bg-white"
              style={{ border: "1px solid rgba(20,20,20,0.06)" }}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={c.photo}
                  alt={c.title}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <p
                  className="font-display italic text-ink-900"
                  style={{ fontSize: 22, fontWeight: 300 }}
                >
                  {c.title}
                </p>
                <p
                  className="mt-3 font-body text-[14px] leading-relaxed text-ink-600"
                  dangerouslySetInnerHTML={{ __html: c.body }}
                />
              </div>
            </article>
          ))}
        </div>
        <p className="mt-10">
          <Link
            href="/watch"
            className="inline-flex items-center gap-2 font-ui text-[13px] uppercase tracking-[0.2em] text-warm-700 hover:text-ink-900"
          >
            Watch a recent service &rarr;
          </Link>
        </p>
      </div>
    </section>
  );
}

function AboutCrossLinks() {
  const tiles: { href: string; title: string; body: string }[] = [
    { href: "/campuses", title: "Visit a campus", body: "Find your closest Futures and plan a first Sunday." },
    { href: "/leaders", title: "Meet the whole team", body: "Twenty-one campuses, every pastor, every face." },
    { href: "/vision", title: "See our vision", body: "Two hundred campuses. Ten thousand leaders. Where we&rsquo;re going." },
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
                style={{ fontSize: 26, fontWeight: 300 }}
              >
                {t.title}
              </p>
              <p
                className="mt-3 font-body text-[15px] leading-relaxed text-ink-600"
                dangerouslySetInnerHTML={{ __html: t.body }}
              />
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
