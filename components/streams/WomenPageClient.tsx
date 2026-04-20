"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { AIInput } from "@/components/ai/AIInput";
import { GlassCard } from "@/components/ui/GlassCard";
import { Eyebrow, Sub } from "@/components/ui/Type";
import { ValueExchangeForm } from "@/components/forms/ValueExchangeForm";
import { useAIGuide } from "@/lib/ai/AIGuideContext";

// Placeholder imagery for the bU Women page. All crop params go through
// Unsplash's CDN — nothing is downloaded locally. Swap to real photography
// from the Futures comms team one URL at a time.
//
// Diversity intent (matches content/faces.json _meta.diversityIntent): bU is
// global. Hero collage reads African-American + Venezuelan + white-Australian.
// Podcast guests span African-American, Indonesian, Latina, white, Asian-
// Australian. When swapping to real photography, preserve that spread.
const BU_IMG = {
  // Hero collage — lead face is African-American woman, secondary frames are
  // Venezuelan and white-Australian.
  heroLead:     "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=900&h=1200&fit=crop&crop=faces&auto=format&q=85",
  heroSecondA:  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=600&fit=crop&crop=faces&auto=format&q=85",
  heroSecondB:  "https://images.unsplash.com/photo-1548142813-c348350df52b?w=600&h=600&fit=crop&crop=faces&auto=format&q=85",
  // Jane herself stays as she is (white-Australian lead pastor) — the ring
  // around her on the page communicates the multi-ethnic team.
  janePortrait: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=1000&fit=crop&crop=faces&auto=format&q=85",
  janeWriting:  "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=600&fit=crop&auto=format&q=85",
  // Wide gathering shot with visibly diverse crowd.
  gatheringWide:"https://images.unsplash.com/photo-1524673450801-b5aa9b621b76?w=1600&h=600&fit=crop&auto=format&q=80",
  // Circle scene tilted toward Indonesia so the locator copy lands beside a
  // Global South face.
  circleScene:  "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1200&h=900&fit=crop&auto=format&q=85",
  // Podcast guest rotation: African-American, Indonesian, Latina, white,
  // Asian-Australian — in that order so rows 1,6,11… stay Black-led.
  podcastA:     "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=160&h=160&fit=crop&crop=faces&auto=format&q=85",
  podcastB:     "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=160&h=160&fit=crop&crop=faces&auto=format&q=85",
  podcastC:     "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&h=160&fit=crop&crop=faces&auto=format&q=85",
  podcastD:     "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&h=160&fit=crop&crop=faces&auto=format&q=85",
  podcastE:     "https://images.unsplash.com/photo-1541534401786-2077eed87a74?w=160&h=160&fit=crop&crop=faces&auto=format&q=85",
};

type WomenData = {
  manifesto: string[];
  gatherings: { date: string; city: string; country: string; venue: string; status: string }[];
  circles: { city: string; campus: string; leader: string; cadence: string }[];
  books: { title: string; subtitle: string; cover: string }[];
  podcast: { ep: number; title: string; duration: string }[];
};

const CHIPS = [
  "when's the next bU gathering in my city?",
  "tell me about Jane",
  "I'm new to bU — where do I start?",
  "is there a bU circle at my campus?",
  "how do I bring bU to my city?",
  "what's Jane speaking on this month?",
];

export function WomenPageClient({ data }: { data: WomenData }) {
  const { setPageContext } = useAIGuide();
  useEffect(() => setPageContext("women"), [setPageContext]);

  return (
    <main className="bg-cream text-ink-900">
      <BUHero />
      <BUManifesto paragraphs={data.manifesto} />
      <GlobalGatheringCalendar gatherings={data.gatherings} />
      <BUCircleLocator circles={data.circles} />
      <JaneBooksAndMessages books={data.books} />
      <BUValueExchange />
      <BUPodcastFeed podcast={data.podcast} />
    </main>
  );
}

function BUHero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 70% 20%, #F2E6D1 0%, #E8C9A6 40%, #FDFBF6 85%)",
        }}
      />
      <div className="relative mx-auto max-w-[1440px] px-6 pb-28 pt-32 sm:px-10 sm:pt-40">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end lg:gap-16">
          <div>
            <Eyebrow>bU WOMEN &middot; LED BY JANE EVANS</Eyebrow>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <h1
                className="mt-4 font-display text-ink-900"
                style={{
                  fontSize: "clamp(3rem,9vw,7rem)",
                  fontWeight: 300,
                  lineHeight: 0.95,
                  letterSpacing: "-0.02em",
                }}
              >
                be you. become <em className="italic">her</em>.
              </h1>
            </motion.div>
            <Sub className="mt-6 max-w-[52ch]">
              A global movement for women who are done living small.
            </Sub>
            <div className="mt-10 max-w-[620px]">
              <GlassCard breathe className="p-6">
                <AIInput placeholder="Ask Jane anything&hellip;" chips={CHIPS} compact />
              </GlassCard>
            </div>
          </div>

          {/* Right-column portrait collage — three overlapping frames that
              ground the copy in real faces without blocking the AI input. */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative hidden aspect-[4/5] w-full lg:block"
            aria-hidden
          >
            <div
              className="absolute left-0 top-0 h-[78%] w-[64%] overflow-hidden rounded-[26px]"
              style={{ boxShadow: "0 30px 60px -28px rgba(20,20,20,0.45)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={BU_IMG.heroLead}
                alt=""
                className="h-full w-full object-cover"
                style={{ filter: "saturate(0.95)" }}
              />
            </div>
            <div
              className="absolute right-0 top-[12%] h-[38%] w-[44%] overflow-hidden rounded-[22px]"
              style={{ boxShadow: "0 22px 48px -24px rgba(20,20,20,0.4)", border: "3px solid #FDFBF6" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={BU_IMG.heroSecondA} alt="" className="h-full w-full object-cover" />
            </div>
            <div
              className="absolute bottom-0 right-[4%] h-[42%] w-[48%] overflow-hidden rounded-[22px]"
              style={{ boxShadow: "0 22px 48px -24px rgba(20,20,20,0.4)", border: "3px solid #FDFBF6" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={BU_IMG.heroSecondB} alt="" className="h-full w-full object-cover" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function BUManifesto({ paragraphs }: { paragraphs: string[] }) {
  return (
    <section className="px-6 py-28 sm:px-10" style={{ background: "#FDFBF6" }}>
      <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-14 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:items-start md:gap-16">
        {/* Portrait column — a single tall frame plus one smaller writing
            still-life, so the letter reads like it's from a real desk. */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative"
        >
          <div
            className="relative aspect-[4/5] w-full overflow-hidden rounded-[24px]"
            style={{ boxShadow: "0 26px 54px -28px rgba(20,20,20,0.4)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={BU_IMG.janePortrait} alt="Jane Evans" className="h-full w-full object-cover" />
          </div>
          <div
            className="absolute -bottom-6 -right-4 hidden h-[38%] w-[55%] overflow-hidden rounded-[18px] md:block"
            style={{ boxShadow: "0 22px 48px -24px rgba(20,20,20,0.4)", border: "3px solid #FDFBF6" }}
            aria-hidden
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={BU_IMG.janeWriting} alt="" className="h-full w-full object-cover" />
          </div>
        </motion.div>

        <div>
          <Eyebrow>A LETTER FROM JANE</Eyebrow>
          <div className="mt-6 space-y-6">
            {paragraphs.map((p, i) => (
              <p
                key={i}
                className="font-display italic text-ink-900"
                style={{
                  fontSize: "clamp(22px,2.6vw,30px)",
                  fontWeight: 300,
                  lineHeight: 1.4,
                }}
              >
                {p}
              </p>
            ))}
          </div>
          <p className="mt-8 font-ui text-[13px] uppercase tracking-[0.22em] text-warm-700">
            &mdash; Jane Evans
          </p>
        </div>
      </div>
    </section>
  );
}

function GlobalGatheringCalendar({ gatherings }: { gatherings: WomenData["gatherings"] }) {
  const [country, setCountry] = useState<string>("all");
  const countries = useMemo(
    () => ["all", ...Array.from(new Set(gatherings.map((g) => g.country)))],
    [gatherings],
  );
  const filtered = gatherings.filter((g) => country === "all" || g.country === country);
  return (
    <section className="px-6 py-24 sm:px-10" style={{ background: "#F7F1E6" }}>
      <div className="mx-auto max-w-[1100px]">
        {/* Wide atmospheric banner — hundreds of hands in a room — sets the
            mood before the calendar grid gets tactical. */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative mb-12 aspect-[16/6] w-full overflow-hidden rounded-[22px]"
          style={{ boxShadow: "0 26px 54px -30px rgba(20,20,20,0.4)" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={BU_IMG.gatheringWide} alt="" className="h-full w-full object-cover" aria-hidden />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, rgba(28,26,23,0) 40%, rgba(28,26,23,0.55) 100%)" }}
          />
          <p
            className="absolute bottom-5 left-6 font-display italic text-cream"
            style={{ fontSize: "clamp(18px,2.4vw,26px)", fontWeight: 300 }}
          >
            one room, twenty cities, same Jesus.
          </p>
        </motion.div>

        <Eyebrow>GLOBAL GATHERINGS</Eyebrow>
        <h2
          className="mt-3 font-display text-ink-900"
          style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}
        >
          A room in <em className="italic">every time zone</em>.
        </h2>

        <div className="mt-8 flex flex-wrap gap-2">
          {countries.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCountry(c)}
              className={`rounded-full border px-4 py-2 font-ui text-[13px] transition ${
                country === c
                  ? "border-ink-900 bg-ink-900 text-cream"
                  : "border-ink-900/10 bg-white/70 text-ink-900 hover:bg-white"
              }`}
            >
              {c === "all" ? "All countries" : c}
            </button>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {filtered.map((g) => (
            <GlassCard key={`${g.date}-${g.city}`} className="p-6">
              <div className="flex items-baseline justify-between">
                <p className="font-ui text-[12px] uppercase tracking-[0.2em] text-warm-700">
                  {new Date(`${g.date}T00:00:00`).toLocaleDateString(undefined, {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <span className={`rounded-full px-2.5 py-0.5 font-ui text-[11px] ${
                  g.status === "open"
                    ? "bg-warm-500/20 text-warm-700"
                    : "bg-ink-900/10 text-ink-600"
                }`}>
                  {g.status}
                </span>
              </div>
              <p
                className="mt-2 font-display italic text-ink-900"
                style={{ fontSize: 26, fontWeight: 300, lineHeight: 1.1 }}
              >
                {g.city}
              </p>
              <p className="mt-1 font-body text-[14px] text-ink-600">
                {g.venue} &middot; {g.country}
              </p>
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new Event("futures:open-dock"));
                }}
                className="mt-5 font-ui text-[13px] text-warm-700 hover:underline"
              >
                Reserve a seat &rarr;
              </button>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}

function BUCircleLocator({ circles }: { circles: WomenData["circles"] }) {
  const [query, setQuery] = useState("");
  const match = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return circles.find(
      (c) => c.city.toLowerCase().includes(q) || c.campus.toLowerCase().includes(q),
    );
  }, [circles, query]);

  return (
    <section className="px-6 py-24 sm:px-10">
      <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] md:items-center md:gap-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          className="order-2 md:order-1"
        >
          <div
            className="relative aspect-[4/3] w-full overflow-hidden rounded-[24px]"
            style={{ boxShadow: "0 26px 54px -28px rgba(20,20,20,0.4)" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={BU_IMG.circleScene} alt="" className="h-full w-full object-cover" aria-hidden />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{ background: "linear-gradient(180deg, rgba(28,26,23,0) 55%, rgba(28,26,23,0.45) 100%)" }}
            />
            <p
              className="absolute bottom-4 left-5 font-display italic text-cream"
              style={{ fontSize: 18, fontWeight: 300 }}
            >
              a circle in Langowan · Tuesday night.
            </p>
          </div>
        </motion.div>

        <div className="order-1 md:order-2">
        <Eyebrow>CIRCLES</Eyebrow>
        <h2
          className="mt-3 font-display text-ink-900"
          style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}
        >
          Every campus has a <em className="italic">circle</em>.
        </h2>
        <GlassCard className="mt-8 p-6">
          <label htmlFor="bu-locator" className="font-ui text-eyebrow uppercase text-ink-600">
            Your city
          </label>
          <input
            id="bu-locator"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Adelaide, Atlanta, Bali&hellip;"
            className="mt-2 w-full rounded-2xl border border-ink-900/10 bg-white/80 px-4 py-3 font-ui text-[15px] text-ink-900 placeholder:text-ink-400 outline-none focus:border-warm-500"
          />
          {match ? (
            <div className="mt-6 rounded-2xl border border-warm-500/30 bg-warm-500/5 p-5">
              <p className="font-display italic text-ink-900" style={{ fontSize: 22, fontWeight: 300 }}>
                {match.city} &middot; {match.campus}
              </p>
              <p className="mt-1 font-body text-[14px] text-ink-600">
                Led by {match.leader} &middot; {match.cadence}
              </p>
            </div>
          ) : query.trim() ? (
            <div className="mt-6 rounded-2xl border border-ink-900/10 bg-white/60 p-5">
              <p className="font-display italic text-ink-900" style={{ fontSize: 20, fontWeight: 300 }}>
                No circle near {query} yet.
              </p>
              <p className="mt-2 font-body text-[14px] text-ink-600">
                Start one? We&rsquo;ll send you a simple guide and connect you with a regional lead.
              </p>
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event("futures:open-dock"))}
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-ink-900 px-5 py-2.5 font-ui text-[13px] text-cream"
              >
                Start a circle &rarr;
              </button>
            </div>
          ) : (
            <p className="mt-4 font-ui text-[13px] text-ink-600">
              Type a city to find the nearest circle.
            </p>
          )}
        </GlassCard>
        </div>
      </div>
    </section>
  );
}

function JaneBooksAndMessages({ books }: { books: WomenData["books"] }) {
  return (
    <section className="px-6 py-24 sm:px-10" style={{ background: "#F7F1E6" }}>
      <div className="mx-auto max-w-[1100px]">
        <Eyebrow>BOOKS &amp; MESSAGES</Eyebrow>
        <h2
          className="mt-3 font-display text-ink-900"
          style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}
        >
          Words you can <em className="italic">carry</em>.
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {books.map((b) => (
            <article
              key={b.title}
              className="overflow-hidden rounded-[20px] bg-white shadow-[0_18px_40px_-22px_rgba(20,20,20,0.3)]"
              style={{ border: "1px solid rgba(20,20,20,0.05)" }}
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden">
                <Image src={b.cover} alt={b.title} fill unoptimized sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
              </div>
              <div className="p-5">
                <p className="font-display italic text-ink-900" style={{ fontSize: 24, fontWeight: 300, lineHeight: 1.1 }}>
                  {b.title}
                </p>
                <p className="mt-2 font-body text-[14px] text-ink-600">{b.subtitle}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function BUValueExchange() {
  return (
    <section className="px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-[560px]">
        <ValueExchangeForm
          source="women-newsletter"
          offer="Jane writes one letter a month to the bU family. Honest, fierce, funny, scripture-rooted."
          proofPoints={["Written by Jane personally", "One letter a month", "Unsubscribe anytime"]}
          fields={["email", "city"]}
          cta="Send me Jane's letter"
          outcome="You'll get the next letter on the 1st."
        />
      </div>
    </section>
  );
}

function BUPodcastFeed({ podcast }: { podcast: WomenData["podcast"] }) {
  const guestAvatars = [
    BU_IMG.podcastA,
    BU_IMG.podcastB,
    BU_IMG.podcastC,
    BU_IMG.podcastD,
    BU_IMG.podcastE,
  ];
  return (
    <section className="px-6 py-24 sm:px-10" style={{ background: "#F7F1E6" }}>
      <div className="mx-auto max-w-[780px]">
        <Eyebrow>THE bU PODCAST</Eyebrow>
        <h2
          className="mt-3 font-display text-ink-900"
          style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}
        >
          Recent <em className="italic">episodes</em>.
        </h2>
        <ul className="mt-10 divide-y divide-ink-900/10 rounded-[22px] bg-white/70">
          {podcast.map((p, i) => {
            const avatar = guestAvatars[i % guestAvatars.length];
            return (
              <li key={p.ep} className="flex items-center justify-between gap-4 px-6 py-5">
                <div className="flex min-w-0 items-center gap-4">
                  <div
                    className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full"
                    style={{ boxShadow: "0 0 0 2px #FDFBF6, 0 6px 16px -6px rgba(20,20,20,0.3)" }}
                    aria-hidden
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={avatar} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-ui text-[11px] uppercase tracking-[0.2em] text-warm-700">
                      EP {p.ep}
                    </p>
                    <p
                      className="mt-1 truncate font-display italic text-ink-900"
                      style={{ fontSize: 19, fontWeight: 300 }}
                    >
                      {p.title}
                    </p>
                  </div>
                </div>
                <p className="flex-shrink-0 font-ui text-[13px] text-ink-600">{p.duration}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
