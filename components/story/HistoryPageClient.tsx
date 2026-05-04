"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { AIInput } from "@/components/ai/AIInput";
import { GlassCard } from "@/components/ui/GlassCard";
import { Eyebrow } from "@/components/ui/Type";
import { ValueExchangeForm } from "@/components/forms/ValueExchangeForm";
import { useAIGuide } from "@/lib/ai/AIGuideContext";
import { SlotEditor } from "@/components/edit/SlotEditor";

type TimelineItem = {
  decade: string;
  label: string;
  headline: string;
  paragraphs: string[];
  photo: string;
};

type GalleryItem = {
  id: string;
  year: string;
  caption: string;
  photo: string;
  placeholder: boolean;
};

type FamilyTreeItem = {
  gen: number;
  name: string;
  years: string;
  contribution: string;
  placeholder: boolean;
};

type HistoryData = {
  timeline: TimelineItem[];
  gallery: GalleryItem[];
  familyTree: FamilyTreeItem[];
};

const CHIPS = [
  "who started Futures?",
  "what happened in 1922?",
  "when did you go international?",
  "tell me about the Evans family history",
  "what's the most important moment in the story?",
  "what's next in the story?",
];

export function HistoryPageClient({ data }: { data: HistoryData }) {
  const { setPageContext } = useAIGuide();
  useEffect(() => setPageContext("history"), [setPageContext]);

  return (
    <main className="bg-cream text-ink-900">
      <HistoryHero />
      <TimelineScrub items={data.timeline} />
      <DecadeCards items={data.timeline} />
      <FoundingFamilyTree items={data.familyTree} />
      <PivotalMomentsGallery items={data.gallery} />
      <CurrentEraSection />
      <HistoryPrayerForm />
      <HistoryCrossLinks />
    </main>
  );
}

function HistoryHero() {
  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-32 sm:px-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 15% 20%, rgba(204,143,74,0.12), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-[1200px]">
        <Eyebrow>SINCE 1922 &middot; ADELAIDE &middot; FOURTH GENERATION</Eyebrow>
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-4 font-display text-ink-900"
          style={{
            fontSize: "clamp(2.5rem,6.5vw,5.75rem)",
            fontWeight: 300,
            lineHeight: 0.98,
            letterSpacing: "-0.02em",
          }}
        >
          A hundred years of saying <em className="italic">come home</em>.
        </motion.h1>
        <p className="mt-6 max-w-[54ch] font-body text-[18px] leading-relaxed text-ink-600">
          From one Adelaide chapel in 1922 to twenty-one campuses today.
        </p>
        <div className="mt-4 max-w-[58ch]">
          <SlotEditor id="history.recent-milestones">
            {/* Empty by default — Ashley/Jane add post-2020 milestones here. */}
            <></>
          </SlotEditor>
        </div>
        <div className="mt-10 max-w-[620px]">
          <GlassCard breathe className="p-5">
            <AIInput placeholder="Ask about the Futures story&hellip;" chips={CHIPS} compact />
          </GlassCard>
        </div>
      </div>
    </section>
  );
}

function TimelineScrub({ items }: { items: TimelineItem[] }) {
  const [active, setActive] = useState(0);
  return (
    <section className="px-6 py-20 sm:px-10" style={{ background: "#F7F1E6" }}>
      <div className="mx-auto max-w-[1400px]">
        <Eyebrow>THE TIMELINE</Eyebrow>
        <h2
          className="mt-3 font-display text-ink-900"
          style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}
        >
          A century, <em className="italic">in moments</em>.
        </h2>
        <div className="mt-10 overflow-x-auto pb-4">
          <div className="relative flex min-w-max items-center gap-0">
            <div
              aria-hidden
              className="absolute left-6 right-6 top-[26px] h-px bg-warm-500/40"
            />
            {items.map((it, i) => {
              const activeItem = i === active;
              return (
                <button
                  key={it.decade}
                  type="button"
                  onClick={() => setActive(i)}
                  className="relative z-10 flex w-[132px] flex-shrink-0 flex-col items-center px-4"
                >
                  <span
                    className="h-[14px] w-[14px] rounded-full transition-transform"
                    style={{
                      background: activeItem ? "#CC8F4A" : "#FFFCF7",
                      border: "2px solid #CC8F4A",
                      transform: activeItem ? "scale(1.2)" : "scale(1)",
                    }}
                  />
                  <span
                    className={`mt-4 font-display ${activeItem ? "text-ink-900" : "text-ink-600/70"} italic`}
                    style={{ fontSize: 22, fontWeight: 300, lineHeight: 1 }}
                  >
                    {it.decade}
                  </span>
                  <span className="mt-1 font-ui text-[10px] uppercase tracking-[0.2em] text-warm-700">
                    {it.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-[1.1fr_1fr] md:items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[22px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={items[active].decade}
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={items[active].photo}
                  alt={items[active].label}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>
          </div>
          <div>
            <p className="font-ui text-[11px] uppercase tracking-[0.24em] text-warm-700">
              {items[active].decade} &middot; {items[active].label}
            </p>
            <h3
              className="mt-3 font-display text-ink-900"
              style={{ fontSize: "clamp(1.5rem,3vw,2rem)", fontWeight: 300, lineHeight: 1.1 }}
              dangerouslySetInnerHTML={{ __html: items[active].headline }}
            />
            <div className="mt-5 space-y-4 font-body text-[15px] leading-relaxed text-ink-600">
              {items[active].paragraphs.map((p, i) => (
                <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DecadeCards({ items }: { items: TimelineItem[] }) {
  return (
    <section className="px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-[1200px]">
        <Eyebrow>DECADE BY DECADE</Eyebrow>
        <h2
          className="mt-3 font-display text-ink-900"
          style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}
        >
          The <em className="italic">long</em> version.
        </h2>
        <div className="mt-10 space-y-5">
          {items.map((it) => (
            <article
              key={it.decade}
              className="grid grid-cols-1 overflow-hidden rounded-[22px] bg-white md:grid-cols-[220px_1fr]"
              style={{ border: "1px solid rgba(20,20,20,0.05)" }}
            >
              <div className="flex items-center justify-center p-8" style={{ background: "#F7F1E6" }}>
                <div className="text-center">
                  <p
                    className="font-display italic text-warm-700"
                    style={{ fontSize: 44, fontWeight: 300, lineHeight: 1 }}
                  >
                    {it.decade}
                  </p>
                  <p className="mt-2 font-ui text-[10px] uppercase tracking-[0.24em] text-ink-600">
                    {it.label}
                  </p>
                </div>
              </div>
              <div className="p-7">
                <h3
                  className="font-display text-ink-900"
                  style={{ fontSize: 22, fontWeight: 300, lineHeight: 1.1 }}
                  dangerouslySetInnerHTML={{ __html: it.headline }}
                />
                <div className="mt-4 space-y-3 font-body text-[15px] leading-relaxed text-ink-600">
                  {it.paragraphs.map((p, i) => (
                    <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FoundingFamilyTree({ items }: { items: FamilyTreeItem[] }) {
  return (
    <section className="px-6 py-24 sm:px-10" style={{ background: "#F7F1E6" }}>
      <div className="mx-auto max-w-[1200px]">
        <Eyebrow>THE FAMILY LINE</Eyebrow>
        <h2
          className="mt-3 font-display text-ink-900"
          style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}
        >
          Four generations of <em className="italic">Evans</em>.
        </h2>
        <ol className="mt-10 space-y-4 md:space-y-0 md:grid md:grid-cols-4 md:gap-4">
          {items.map((it) => (
            <li
              key={it.gen}
              className="relative rounded-[20px] bg-white p-6"
              style={{ border: "1px solid rgba(20,20,20,0.06)" }}
            >
              <span
                className="font-display italic text-warm-700"
                style={{ fontSize: 40, fontWeight: 300, lineHeight: 1 }}
              >
                G{it.gen}
              </span>
              <p
                className="mt-4 font-display text-ink-900"
                style={{ fontSize: 20, fontWeight: 300, lineHeight: 1.1 }}
                dangerouslySetInnerHTML={{ __html: it.name }}
              />
              <p className="mt-1 font-ui text-[11px] uppercase tracking-[0.2em] text-warm-700">
                {it.years}
              </p>
              <p className="mt-4 font-body text-[14px] leading-relaxed text-ink-600">
                {it.contribution}
              </p>
              {it.placeholder && (
                <span className="absolute right-3 top-3 rounded-full bg-ink-900/10 px-2 py-0.5 font-ui text-[9px] uppercase tracking-[0.18em] text-ink-600">
                  for review
                </span>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function PivotalMomentsGallery({ items }: { items: GalleryItem[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (openIdx === null) return;
    const prev = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenIdx(null);
      if (e.key === "ArrowRight") setOpenIdx((i) => (i === null ? 0 : (i + 1) % items.length));
      if (e.key === "ArrowLeft")
        setOpenIdx((i) => (i === null ? 0 : (i - 1 + items.length) % items.length));
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      prev?.focus?.();
    };
  }, [openIdx, items.length]);

  return (
    <section className="px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-[1400px]">
        <Eyebrow>PIVOTAL MOMENTS</Eyebrow>
        <h2
          className="mt-3 font-display text-ink-900"
          style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}
        >
          The <em className="italic">days</em> that shaped us.
        </h2>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((g, i) => (
            <button
              key={g.id}
              type="button"
              onClick={() => setOpenIdx(i)}
              className="group relative aspect-[4/3] overflow-hidden rounded-[16px]"
              style={{ border: "1px solid rgba(20,20,20,0.06)" }}
            >
              <Image
                src={g.photo}
                alt={g.caption}
                fill
                unoptimized
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <span
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-ink-900/60 via-transparent to-transparent"
              />
              <span className="absolute bottom-3 left-3 font-ui text-[11px] uppercase tracking-[0.2em] text-cream">
                {g.year}
              </span>
              {g.placeholder && (
                <span className="absolute right-2 top-2 rounded-full bg-ink-900/70 px-2 py-0.5 font-ui text-[9px] uppercase tracking-[0.18em] text-cream">
                  archive
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {openIdx !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={items[openIdx].caption}
            ref={dialogRef}
            tabIndex={-1}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/85 p-4 outline-none"
            onClick={() => setOpenIdx(null)}
          >
            <div
              className="relative max-h-full w-full max-w-[1100px]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[20px]">
                <Image
                  src={items[openIdx].photo}
                  alt={items[openIdx].caption}
                  fill
                  unoptimized
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
              <div className="mt-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-ui text-[11px] uppercase tracking-[0.24em] text-warm-500">
                    {items[openIdx].year}
                  </p>
                  <p className="mt-1 font-body text-[16px] text-cream">{items[openIdx].caption}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpenIdx(null)}
                  className="rounded-full border border-cream/25 px-4 py-2 font-ui text-[12px] text-cream hover:bg-cream/10"
                >
                  Close &times;
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function CurrentEraSection() {
  const stats = [
    { k: "21", l: "Campuses" },
    { k: "4", l: "Countries" },
    { k: "~20K", l: "Weekend attendance" },
    { k: "500", l: "Voices shaping Selah" },
  ];
  return (
    <section className="px-6 py-24 sm:px-10" style={{ background: "#F7F1E6" }}>
      <div className="mx-auto max-w-[1200px]">
        <Eyebrow>THE CURRENT ERA</Eyebrow>
        <h2
          className="mt-3 font-display text-ink-900"
          style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}
        >
          Where we are <em className="italic">today</em>.
        </h2>
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s) => (
            <GlassCard key={s.l} className="p-6 text-center">
              <p
                className="font-display italic text-ink-900"
                style={{ fontSize: 48, fontWeight: 300, lineHeight: 1 }}
              >
                {s.k}
              </p>
              <p className="mt-3 font-ui text-[11px] uppercase tracking-[0.22em] text-warm-700">
                {s.l}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function HistoryPrayerForm() {
  return (
    <section className="px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-[720px]">
        <Eyebrow>THE PRAYER CHAIN</Eyebrow>
        <h2
          className="mt-3 font-display text-ink-900"
          style={{ fontSize: "clamp(1.75rem,3.6vw,2.5rem)", fontWeight: 300, lineHeight: 1.05 }}
        >
          Pray for the <em className="italic">next</em> hundred.
        </h2>
        <p className="mt-5 font-body text-[16px] leading-relaxed text-ink-600">
          One email a month. One prayer request, tied to a real campus or leader. No filler, no pitch.
        </p>
        <div className="mt-10">
          <ValueExchangeForm
            source="history-prayer"
            offer="Join the Futures prayer chain. One email a month, tied to a real campus or leader."
            proofPoints={[
              "One email a month",
              "Specific and actionable",
              "Unsubscribe anytime",
            ]}
            fields={["email"]}
            cta="Add me to the prayer chain"
            outcome="Your first prayer request arrives on the 1st."
          />
        </div>
      </div>
    </section>
  );
}

function HistoryCrossLinks() {
  const tiles: { href: string; title: string; body: string }[] = [
    { href: "/leaders", title: "Meet today&rsquo;s pastors", body: "Every campus. Every face. Every story." },
    { href: "/vision", title: "See where we&rsquo;re going", body: "Two hundred campuses. Ten thousand leaders." },
    { href: "/campuses", title: "Visit a campus", body: "Find your closest Futures and plan a first Sunday." },
  ];
  return (
    <section className="px-6 py-24 sm:px-10" style={{ background: "#F7F1E6" }}>
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
                dangerouslySetInnerHTML={{ __html: t.title }}
              />
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
