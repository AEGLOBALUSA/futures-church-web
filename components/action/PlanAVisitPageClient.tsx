"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { AIInput } from "@/components/ai/AIInput";
import { GlassCard } from "@/components/ui/GlassCard";
import { Eyebrow } from "@/components/ui/Type";
import { useAIGuide } from "@/lib/ai/AIGuideContext";
import { campuses, type Campus } from "@/lib/content/campuses";
import { CampusFaces } from "@/components/action/plan-a-visit/CampusFaces";
import { VisitFears } from "@/components/action/plan-a-visit/VisitFears";
import { CampusPastorIntro } from "@/components/action/plan-a-visit/CampusPastorIntro";
import { getCampusIntro } from "@/lib/content/campus-intros";
import { getCampusFaceEntry } from "@/lib/content/campus-faces";

const CHIPS = [
  "what's a first visit like?",
  "where do I park?",
  "what do I wear?",
  "what about my kids?",
  "will anyone know I'm new?",
  "can someone meet me at the door?",
];

// Hero rotation \u2014 three warm "first Sunday" frames from the curated library.
// Sourced locally so they ship with the site (no Unsplash hot-link).
const HERO_FRAMES = [
  { url: "/photos/hero/hero_5.jpg",  alt: "Futures Church \u2014 family on a Sunday morning" },
  { url: "/photos/hero/hero_31.jpg", alt: "Futures Church \u2014 Sunday together" },
  { url: "/photos/hero/hero_30.jpg", alt: "Futures Church \u2014 community after the service" },
];

// "From the carpark to the couch." A 4-tile arrival journey, lead tile is
// the largest (the moment of pulling in). All photos are local from the
// curated library \u2014 no stock.
const EXPECT_TILES: { t: string; b: string; p: string; lead?: boolean }[] = [
  {
    t: "Pulling in",
    b: "Free parking at every campus. Pull near the main entrance and a host will wave you in. Late is fine \u2014 no one rushes you.",
    p: "/photos/hero/hero_30.jpg",
    lead: true,
  },
  {
    t: "At the door",
    b: "Warm welcome desk, quick hello, no quiz. A host will walk you to the room if you want.",
    p: "/photos/hero/hero_12.jpg",
  },
  {
    t: "Kids check-in",
    b: "Digital check-in, matching security tags, background-checked volunteers. Your kids are in good hands — and you'll know exactly where they are.",
    p: "/photos/hero/hero_8.jpg",
  },
  {
    t: "Where to sit",
    b: "Anywhere. Front row, back row, the couch. Stay for coffee after \u2014 we're not in a hurry.",
    p: "/photos/hero/hero_16.jpg",
  },
];

// Map a campus name to a warm tone \u2014 used for the testimonial initial circles
// so each card's accent matches the campus's region tone (Adelaide warm-cream,
// USA mustard, Indonesia clay, etc.).
const CAMPUS_TONE: Record<string, string> = {
  "Paradise": "#C8906B",
  "Adelaide City": "#C8906B",
  "Mount Barker": "#C8906B",
  "Salisbury": "#C8906B",
  "Gwinnett": "#AC9B25",
  "Kennesaw": "#AC9B25",
  "Alpharetta": "#AC9B25",
  "Franklin": "#AC9B25",
  "Bali": "#C45236",
  "Solo": "#C45236",
  "Cemani": "#C45236",
};

// Hybrid FAQ \u2014 3 universal + 3 real-fears. Composition is deliberate:
// the panel's "real fears" set (kid screams / cry / asked if saved) won
// strongly with skeptics + dechurched, but anxious parents and older
// returners destabilised on a 100% emotional set. Mixing keeps both
// audiences. Western-coded identity question dropped for ESL safety.
const FAQ: { q: string; a: string }[] = [
  { q: "What should I wear?", a: "Come as you are. Jeans and a t-shirt is fine. So is a suit. We really mean it." },
  { q: "What if my kid screams?", a: "Our kids&rsquo; team has done this thousands of times. If you need to step out, the lobby has couches, coffee, and the whole service on screens." },
  { q: "Is there anything for my kids?", a: "Yes \u2014 all ages, every Sunday, background-checked team, with parents-first security." },
  { q: "How long is the service?", a: "About 80 to 90 minutes. Worship, a message, then coffee if you want to stay." },
  { q: "Can I just watch first?", a: "Absolutely. Start with /watch and come visit when you&rsquo;re ready \u2014 no judgement either way." },
];

const TESTIMONIALS = [
  { q: "I walked in thinking I&rsquo;d leave early. I stayed for coffee after.", name: "Lauren", campus: "Adelaide City" },
  { q: "Pastor James texted me the day before. I almost cried.", name: "Michael", campus: "Gwinnett" },
  { q: "My four-year-old asked when we could go back.", name: "Sarah", campus: "Paradise" },
];

export function PlanAVisitPageClient() {
  const { setPageContext } = useAIGuide();
  useEffect(() => setPageContext("plan-a-visit"), [setPageContext]);

  return (
    <main className="bg-cream text-ink-900">
      <PlanAVisitHero />
      <VisitPromiseStrip />
      <ThreeStepForm />
      <WhatToExpect />
      <FirstTimeFAQ />
      <PreVisitTestimonials />
      <VisitAlternatives />
    </main>
  );
}

function PlanAVisitHero() {
  // Cross-fade between three "first Sunday" frames every ~6 seconds, with a
  // gentle Ken Burns drift on each. Same rhythm as the home hero so the site
  // feels coherent.
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => {
      setFrame((f) => (f + 1) % HERO_FRAMES.length);
    }, 6000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-28 sm:px-10 sm:pt-32">
      {/* Ambient warm wash behind everything — same gradient family as the rest of the site. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 25% 12%, rgba(204,143,74,0.16), transparent 70%)",
        }}
      />

      <div className="relative mx-auto grid max-w-[1280px] items-center gap-10 lg:grid-cols-[5fr_6fr] lg:gap-14">
        {/* Photo column — Ken-Burns rotation, full warmth. Order-2 on mobile so the
            text leads, order-1 on desktop so the eye lands on faces first. */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative order-2 overflow-hidden rounded-[28px] border border-ink-900/5 lg:order-1"
          style={{
            aspectRatio: "5 / 6",
            boxShadow: "0 40px 80px -32px rgba(20,20,20,0.32)",
          }}
        >
          {HERO_FRAMES.map((f, i) => (
            <div
              key={f.url}
              className={`pa-frame absolute inset-0 transition-opacity duration-[1100ms] ease-in-out ${
                i === frame ? "is-active" : ""
              }`}
              style={{ opacity: i === frame ? 1 : 0 }}
            >
              <Image
                src={f.url}
                alt={f.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover object-center"
                style={{ filter: "saturate(0.94) brightness(0.97)" }}
                priority={i === 0}
                unoptimized
              />
            </div>
          ))}
          {/* Warm bottom-left vignette so the right-column eyebrow doesn't feel competed-with. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(247,241,230,0.05) 0%, rgba(200,150,117,0.18) 60%, rgba(140,90,60,0.28) 100%)",
            }}
          />
        </motion.div>

        {/* Content column — eyebrow, headline, AI pill. */}
        <div className="order-1 lg:order-2">
          <Eyebrow>PLAN A VISIT &middot; EVERY CAMPUS</Eyebrow>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-4 font-display text-ink-900"
            style={{
              fontSize: "clamp(2.5rem,6.5vw,5.5rem)",
              fontWeight: 300,
              lineHeight: 0.98,
              letterSpacing: "-0.02em",
            }}
          >
            Plan a <em className="italic">visit</em>.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-6 max-w-[54ch] font-body text-[18px] leading-relaxed text-ink-600"
          >
            Tell us a few things and your campus pastor will text you Saturday morning &mdash; so you know who to look for at the door.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-9 max-w-[620px]"
          >
            <GlassCard breathe className="p-5">
              <AIInput placeholder="Ask a first-visit question&hellip;" chips={CHIPS} compact />
            </GlassCard>
            <p className="mt-4 font-ui text-[11px] uppercase tracking-[0.22em] text-ink-500">
              Or fill the three-step plan below — takes about 60 seconds.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Subtle Ken Burns — same shape as the home hero so motion feels familial.
          Auto-disabled by the global prefers-reduced-motion + html.save-data hooks
          in globals.css. */}
      <style jsx>{`
        .pa-frame.is-active :global(img) {
          animation: paKb 14s ease-in-out alternate infinite;
        }
        @keyframes paKb {
          0%   { transform: scale(1.0)  translate(0, 0); }
          100% { transform: scale(1.06) translate(-1.2%, -0.8%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .pa-frame.is-active :global(img) { animation: none !important; }
        }
      `}</style>
    </section>
  );
}

// Three quiet "won't/never" promises, sat between the hero and the form so
// anxious first-timers see the safety floor before they're asked for anything.
// Phrased as the pastor's wife asked — what we WON'T do, plus the Saturday
// text that's coming whether they like it or not (they'll like it).
const VISIT_PROMISES: { eyebrow: string; line: string }[] = [
  { eyebrow: "No spotlight", line: "We won't ask you to stand, raise a hand, or fill out a card." },
  { eyebrow: "No collection", line: "We don't ask guests to give. Giving is for our church family — you're our guest." },
  { eyebrow: "One Saturday text", line: "Your campus pastor will text Saturday so you know who to look for." },
];

function VisitPromiseStrip() {
  return (
    <section
      aria-label="What you won't experience as a first-time visitor"
      className="relative px-6 pb-6 pt-2 sm:px-10"
    >
      <div className="mx-auto max-w-[1280px]">
        <motion.ul
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-5"
        >
          {VISIT_PROMISES.map((p, idx) => (
            <motion.li
              key={p.eyebrow}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.08 * idx, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex items-start gap-4 rounded-2xl border border-ink-900/8 bg-cream-200/60 px-5 py-4 backdrop-blur-sm"
            >
              <span
                aria-hidden
                className="mt-1 block size-1.5 shrink-0 rounded-full"
                style={{ background: "#CC8F4A" }}
              />
              <span className="flex-1">
                <span className="block font-ui text-[10px] uppercase tracking-[0.24em] text-warm-700">
                  {p.eyebrow}
                </span>
                <span className="mt-1.5 block font-body text-[14.5px] leading-relaxed text-ink-700">
                  {p.line}
                </span>
              </span>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}

type FormState = {
  campusSlug: string;
  visitOption: "this-sunday" | "next-sunday" | "other";
  customDate: string;
  adults: number;
  kidsAges: string;
  mobilityNotes: string;
  name: string;
  contactKind: "email" | "phone";
  email: string;
  phone: string;
};

function nextSunday(offset: 0 | 7): string {
  const d = new Date();
  const day = d.getDay();
  const add = ((7 - day) % 7) + offset;
  d.setDate(d.getDate() + (add === 0 ? 7 + offset : add));
  return d.toISOString().slice(0, 10);
}

function ThreeStepForm() {
  const plotted = useMemo(
    () => campuses.filter((c) => c.status !== "online"),
    []
  );
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [suggested, setSuggested] = useState<Campus[]>([]);
  const [state, setState] = useState<FormState>({
    campusSlug: "",
    visitOption: "this-sunday",
    customDate: "",
    adults: 1,
    kidsAges: "",
    mobilityNotes: "",
    name: "",
    contactKind: "email",
    email: "",
    phone: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<null | { campusName: string }>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedCampus = plotted.find((c) => c.slug === state.campusSlug);

  function detectNearest() {
    if (typeof navigator === "undefined" || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const ranked = plotted
          .filter((c) => typeof c.lat === "number" && typeof c.lng === "number")
          .map((c) => ({
            c,
            d:
              Math.pow(c.lat! - latitude, 2) +
              Math.pow(c.lng! - longitude, 2),
          }))
          .sort((a, b) => a.d - b.d)
          .slice(0, 3)
          .map((x) => x.c);
        setSuggested(ranked);
        if (!state.campusSlug) setState((s) => ({ ...s, campusSlug: ranked[0]?.slug ?? "" }));
      },
      () => {
        // user declined; show nothing, full list still below
      }
    );
  }

  const resolvedDate = useMemo(() => {
    if (state.visitOption === "this-sunday") return nextSunday(0);
    if (state.visitOption === "next-sunday") return nextSunday(7);
    return state.customDate;
  }, [state.visitOption, state.customDate]);

  async function submit() {
    setError(null);
    setSubmitting(true);
    try {
      const payload = {
        campusSlug: state.campusSlug,
        campusName: selectedCampus?.name ?? state.campusSlug,
        visitDate: resolvedDate,
        adults: state.adults,
        kidsAges: state.kidsAges || undefined,
        mobilityNotes: state.mobilityNotes || undefined,
        name: state.name || undefined,
        email: state.contactKind === "email" ? state.email : undefined,
        phone: state.contactKind === "phone" ? state.phone : undefined,
      };
      const res = await fetch("/api/visit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !json.ok) throw new Error(json.error ?? "submit-failed");
      setDone({ campusName: payload.campusName });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    const faceEntry = getCampusFaceEntry(state.campusSlug);
    const locale = faceEntry?.locale ?? "en";
    const intro = getCampusIntro(state.campusSlug, locale);
    const saturdayLine =
      intro?.saturday_text_line ??
      "Your campus pastor will text you Saturday morning.";
    return (
      <section className="px-6 py-24 sm:px-10" style={{ background: "#F7F1E6" }}>
        <div className="mx-auto max-w-[720px] text-center">
          <Eyebrow>A SEAT IS YOURS</Eyebrow>
          <h2
            className="mt-3 font-display text-ink-900"
            style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}
          >
            See you at <em className="italic">{done.campusName}</em>.
          </h2>
          <p className="mt-5 font-body text-[16px] leading-relaxed text-ink-600">
            {saturdayLine}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 py-24 sm:px-10" style={{ background: "#F7F1E6" }}>
      <div className="mx-auto max-w-[780px]">
        <div className="mb-6 flex items-center justify-between">
          <Eyebrow>STEP {step} OF 3</Eyebrow>
          <StepperDots step={step} />
        </div>

        <GlassCard breathe className="p-7 md:p-10">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <h2
                  className="font-display text-ink-900"
                  style={{ fontSize: "clamp(1.5rem,3vw,2rem)", fontWeight: 300, lineHeight: 1.05 }}
                >
                  Which <em className="italic">campus</em>?
                </h2>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={detectNearest}
                    className="rounded-full bg-warm-500/15 px-4 py-2 font-ui text-[13px] text-warm-700 hover:bg-warm-500/25"
                  >
                    Detect my nearest &rarr;
                  </button>
                </div>
                {suggested.length > 0 && (
                  <div className="mt-6">
                    <p className="font-ui text-[10px] uppercase tracking-[0.2em] text-ink-600/70">
                      Closest to you
                    </p>
                    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                      {suggested.map((c) => (
                        <CampusChip
                          key={c.slug}
                          campus={c}
                          active={state.campusSlug === c.slug}
                          onClick={() => setState((s) => ({ ...s, campusSlug: c.slug }))}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <div className="mt-6">
                  <label className="font-ui text-[10px] uppercase tracking-[0.2em] text-ink-600/70">
                    Or pick any campus
                  </label>
                  <select
                    value={state.campusSlug}
                    onChange={(e) => setState((s) => ({ ...s, campusSlug: e.target.value }))}
                    className="mt-2 h-12 w-full rounded-full border border-ink-900/10 bg-white px-4 font-body text-[15px] text-ink-900 focus:border-warm-500 focus:outline-none"
                  >
                    <option value="">Select a campus&hellip;</option>
                    {plotted.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name} &mdash; {c.city}
                      </option>
                    ))}
                  </select>
                </div>
                {state.campusSlug && selectedCampus && (
                  <>
                    <CampusPastorIntro
                      campusSlug={state.campusSlug}
                      campusName={
                        getCampusFaceEntry(state.campusSlug)?.campus_name ??
                        selectedCampus.name
                      }
                      locale={
                        getCampusFaceEntry(state.campusSlug)?.locale ?? "en"
                      }
                    />
                    <CampusFaces campusSlug={state.campusSlug} />
                    <VisitFears />
                  </>
                )}

                <FormNav
                  onBack={undefined}
                  onNext={() => state.campusSlug && setStep(2)}
                  nextDisabled={!state.campusSlug}
                  nextLabel="When are you coming?"
                />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <h2
                  className="font-display text-ink-900"
                  style={{ fontSize: "clamp(1.5rem,3vw,2rem)", fontWeight: 300, lineHeight: 1.05 }}
                >
                  When are you <em className="italic">coming</em>?
                </h2>
                <div className="mt-6 space-y-3">
                  {(
                    [
                      ["this-sunday", `This Sunday (${nextSunday(0)})`],
                      ["next-sunday", `Next Sunday (${nextSunday(7)})`],
                      ["other", "Another date"],
                    ] as const
                  ).map(([val, label]) => (
                    <label
                      key={val}
                      className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition-colors ${
                        state.visitOption === val
                          ? "border-warm-500 bg-warm-500/10"
                          : "border-ink-900/10 bg-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="visit-option"
                        checked={state.visitOption === val}
                        onChange={() => setState((s) => ({ ...s, visitOption: val }))}
                        className="h-4 w-4 accent-warm-500"
                      />
                      <span className="font-body text-[15px] text-ink-900">{label}</span>
                    </label>
                  ))}
                  {state.visitOption === "other" && (
                    <input
                      type="date"
                      value={state.customDate}
                      onChange={(e) => setState((s) => ({ ...s, customDate: e.target.value }))}
                      className="h-12 w-full rounded-full border border-ink-900/10 bg-white px-4 font-body text-[15px] text-ink-900 focus:border-warm-500 focus:outline-none"
                    />
                  )}
                </div>
                <FormNav
                  onBack={() => setStep(1)}
                  onNext={() =>
                    resolvedDate && setStep(3)
                  }
                  nextDisabled={!resolvedDate}
                  nextLabel="Who&rsquo;s coming?"
                />
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <h2
                  className="font-display text-ink-900"
                  style={{ fontSize: "clamp(1.5rem,3vw,2rem)", fontWeight: 300, lineHeight: 1.05 }}
                >
                  Who&rsquo;s <em className="italic">coming</em>?
                </h2>
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="font-ui text-[10px] uppercase tracking-[0.2em] text-ink-600/70">
                      Your name
                    </span>
                    <input
                      value={state.name}
                      onChange={(e) => setState((s) => ({ ...s, name: e.target.value }))}
                      className="mt-2 h-12 w-full rounded-full border border-ink-900/10 bg-white px-4 font-body text-[15px] focus:border-warm-500 focus:outline-none"
                    />
                  </label>
                  <label className="block">
                    <span className="font-ui text-[10px] uppercase tracking-[0.2em] text-ink-600/70">
                      Adults
                    </span>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={state.adults}
                      onChange={(e) =>
                        setState((s) => ({ ...s, adults: Number(e.target.value) || 1 }))
                      }
                      className="mt-2 h-12 w-full rounded-full border border-ink-900/10 bg-white px-4 font-body text-[15px] focus:border-warm-500 focus:outline-none"
                    />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="font-ui text-[10px] uppercase tracking-[0.2em] text-ink-600/70">
                      Kids&rsquo; ages (optional)
                    </span>
                    <input
                      value={state.kidsAges}
                      placeholder="e.g. 4, 7, 11"
                      onChange={(e) => setState((s) => ({ ...s, kidsAges: e.target.value }))}
                      className="mt-2 h-12 w-full rounded-full border border-ink-900/10 bg-white px-4 font-body text-[15px] focus:border-warm-500 focus:outline-none"
                    />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="font-ui text-[10px] uppercase tracking-[0.2em] text-ink-600/70">
                      Anything we should know? (optional)
                    </span>
                    <textarea
                      rows={3}
                      placeholder="Wheelchair access, hearing loop, anxious first-timer\u2026"
                      value={state.mobilityNotes}
                      onChange={(e) => setState((s) => ({ ...s, mobilityNotes: e.target.value }))}
                      className="mt-2 w-full rounded-2xl border border-ink-900/10 bg-white px-4 py-3 font-body text-[15px] focus:border-warm-500 focus:outline-none"
                    />
                  </label>

                  <div className="sm:col-span-2">
                    <div className="flex gap-2">
                      {(["email", "phone"] as const).map((k) => (
                        <button
                          key={k}
                          type="button"
                          onClick={() => setState((s) => ({ ...s, contactKind: k }))}
                          className="rounded-full px-4 py-1.5 font-ui text-[12px] uppercase tracking-[0.2em] transition-colors"
                          style={{
                            background: state.contactKind === k ? "#141210" : "rgba(20,20,20,0.05)",
                            color: state.contactKind === k ? "#FFFCF7" : "rgba(20,20,20,0.7)",
                          }}
                        >
                          {k}
                        </button>
                      ))}
                    </div>
                    {state.contactKind === "email" ? (
                      <input
                        type="email"
                        placeholder="you@example.com"
                        value={state.email}
                        onChange={(e) => setState((s) => ({ ...s, email: e.target.value }))}
                        className="mt-3 h-12 w-full rounded-full border border-ink-900/10 bg-white px-4 font-body text-[15px] focus:border-warm-500 focus:outline-none"
                      />
                    ) : (
                      <input
                        type="tel"
                        placeholder="+1 555 123 4567"
                        value={state.phone}
                        onChange={(e) => setState((s) => ({ ...s, phone: e.target.value }))}
                        className="mt-3 h-12 w-full rounded-full border border-ink-900/10 bg-white px-4 font-body text-[15px] focus:border-warm-500 focus:outline-none"
                      />
                    )}
                  </div>
                </div>
                {error && (
                  <p className="mt-4 font-body text-[13px] text-red-600">{error}</p>
                )}
                <FormNav
                  onBack={() => setStep(2)}
                  onNext={submit}
                  nextDisabled={
                    submitting ||
                    (state.contactKind === "email" ? !state.email : !state.phone)
                  }
                  nextLabel={submitting ? "Saving your seat\u2026" : "Save my seat"}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      </div>
    </section>
  );
}

function StepperDots({ step }: { step: 1 | 2 | 3 }) {
  return (
    <div className="flex gap-2">
      {[1, 2, 3].map((i) => (
        <span
          key={i}
          className="h-1.5 w-10 rounded-full transition-colors"
          style={{ background: i <= step ? "#CC8F4A" : "rgba(20,20,20,0.1)" }}
        />
      ))}
    </div>
  );
}

function CampusChip({
  campus,
  active,
  onClick,
}: {
  campus: Campus;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-2xl border p-3 text-left transition-colors"
      style={{
        borderColor: active ? "#CC8F4A" : "rgba(20,20,20,0.08)",
        background: active ? "rgba(204,143,74,0.08)" : "#FFFFFF",
      }}
    >
      <p className="font-display italic text-ink-900" style={{ fontSize: 18, fontWeight: 300 }}>
        {campus.name}
      </p>
      <p className="mt-1 font-ui text-[10px] uppercase tracking-[0.2em] text-warm-700">
        {campus.city}
      </p>
    </button>
  );
}

function FormNav({
  onBack,
  onNext,
  nextDisabled,
  nextLabel,
}: {
  onBack?: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  nextLabel: string;
}) {
  return (
    <div className="mt-10 flex items-center justify-between">
      <button
        type="button"
        onClick={onBack}
        disabled={!onBack}
        className="font-ui text-[13px] uppercase tracking-[0.22em] text-ink-600 hover:text-ink-900 disabled:opacity-30"
      >
        &larr; Back
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled}
        className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-6 py-3 font-ui text-[14px] font-medium text-cream transition-transform hover:-translate-y-0.5 disabled:opacity-40"
      >
        <span dangerouslySetInnerHTML={{ __html: nextLabel }} /> &rarr;
      </button>
    </div>
  );
}

function WhatToExpect() {
  // Editorial 1 + 3 layout — the lead tile is the moment of arrival, the
  // others stack alongside it as the unfolding rest of the morning.
  const lead = EXPECT_TILES.find((t) => t.lead) ?? EXPECT_TILES[0];
  const rest = EXPECT_TILES.filter((t) => t !== lead);

  return (
    <section className="relative overflow-hidden px-6 py-24 sm:px-10">
      {/* Warm wash so the section sits inside the same gradient family as the hero —
          no more sterile white-on-cream. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 80% 30%, rgba(204,143,74,0.12), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-[1280px]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Eyebrow>WHAT TO EXPECT</Eyebrow>
          <h2
            className="mt-3 font-display text-ink-900"
            style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}
          >
            From the front gate to the coffee after.
          </h2>
        </motion.div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:gap-10">
          {/* Lead tile — the arrival moment. Glass-card body so the page warmth
              flows through the cards instead of stopping at white panels. */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <GlassCard breathe className="overflow-hidden p-0">
              <article>
                <div className="relative aspect-[5/4] w-full overflow-hidden lg:aspect-[6/5]">
                  <Image
                    src={lead.p}
                    alt={lead.t}
                    fill
                    unoptimized
                    sizes="(max-width: 1024px) 100vw, 56vw"
                    className="object-cover"
                    style={{ filter: "saturate(0.96)" }}
                  />
                  {/* Warm campus-tone wash mixed in soft-light so the photo sits inside
                      the same color family as the page. */}
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background: "rgba(200,144,107,0.18)",
                      mixBlendMode: "soft-light",
                    }}
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(180deg, transparent 55%, rgba(28,26,23,0.22) 100%)",
                    }}
                  />
                </div>
                <div className="p-7 lg:p-9">
                  <p className="font-ui text-[10px] uppercase tracking-[0.24em] text-warm-700">
                    Step one
                  </p>
                  <p
                    className="mt-2 font-display italic text-ink-900"
                    style={{ fontSize: "clamp(1.65rem, 2.6vw, 2.1rem)", fontWeight: 300, lineHeight: 1.1 }}
                  >
                    {lead.t}
                  </p>
                  <p
                    className="mt-4 max-w-[44ch] font-body text-[16px] leading-relaxed text-ink-600"
                    dangerouslySetInnerHTML={{ __html: lead.b }}
                  />
                </div>
              </article>
            </GlassCard>
          </motion.div>

          {/* Three smaller tiles, stacked vertically on desktop. Glass cards too. */}
          <div className="flex flex-col gap-5 lg:gap-6">
            {rest.map((t, idx) => (
              <motion.div
                key={t.t}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.7, delay: 0.1 + idx * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <GlassCard className="group flex gap-4 overflow-hidden p-3 transition-transform hover:-translate-y-0.5">
                  <div className="relative aspect-square w-[110px] shrink-0 overflow-hidden rounded-[14px] sm:w-[140px]">
                    <Image
                      src={t.p}
                      alt={t.t}
                      fill
                      unoptimized
                      sizes="140px"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      style={{ filter: "saturate(0.96)" }}
                    />
                    {/* Same warm soft-light wash on each thumb so the row feels familial. */}
                    <div
                      aria-hidden
                      className="absolute inset-0"
                      style={{
                        background: "rgba(200,144,107,0.16)",
                        mixBlendMode: "soft-light",
                      }}
                    />
                  </div>
                  <div className="flex flex-col justify-center pr-3">
                    <p
                      className="font-display italic text-ink-900"
                      style={{ fontSize: "clamp(1.05rem, 1.5vw, 1.2rem)", fontWeight: 300, lineHeight: 1.15 }}
                    >
                      {t.t}
                    </p>
                    <p
                      className="mt-1.5 font-body text-[13.5px] leading-snug text-ink-600"
                      dangerouslySetInnerHTML={{ __html: t.b }}
                    />
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FirstTimeFAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="px-6 py-24 sm:px-10" style={{ background: "#F7F1E6" }}>
      <div className="mx-auto max-w-[820px]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Eyebrow>FIRST-TIME QUESTIONS</Eyebrow>
          <h2
            className="mt-3 font-display text-ink-900"
            style={{ fontSize: "clamp(1.75rem,3.6vw,2.5rem)", fontWeight: 300, lineHeight: 1.05 }}
          >
            The ones we always get.
          </h2>
        </motion.div>
        <div className="mt-8 divide-y divide-ink-900/10 border-y border-ink-900/10">
          {FAQ.map((it, i) => {
            const isOpen = open === i;
            return (
              <div key={it.q}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                >
                  <span
                    className="font-display italic text-ink-900"
                    style={{ fontSize: 20, fontWeight: 300 }}
                  >
                    {it.q}
                  </span>
                  <span className="font-ui text-[18px] text-warm-700">{isOpen ? "\u2212" : "+"}</span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <p
                        className="pb-6 font-body text-[15px] leading-relaxed text-ink-600"
                        dangerouslySetInnerHTML={{ __html: it.a }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PreVisitTestimonials() {
  return (
    <section className="px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-[1200px]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Eyebrow>FIRST-TIME VOICES</Eyebrow>
          <h2
            className="mt-3 font-display text-ink-900"
            style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}
          >
            What people said after their first Sunday.
          </h2>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, idx) => {
            const tone = CAMPUS_TONE[t.campus] ?? "#C8906B";
            const initial = t.name.charAt(0).toUpperCase();
            return (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.75,
                  delay: idx * 0.1,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
              >
                <GlassCard
                  breathe
                  className="relative overflow-hidden p-7 sm:p-8"
                  style={{
                    boxShadow: `0 24px 48px -32px ${tone}40, inset 0 0 0 1px rgba(255,255,255,0.5)`,
                  }}
                >
                  {/* Soft campus-tone glow in the corner so each card carries its
                      campus's warmth without overwhelming the cream wash. */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -right-12 -top-12 size-44 rounded-full blur-2xl"
                    style={{ background: `${tone}40` }}
                  />
                  {/* Decorative quote mark — branded campus tone, large + faint */}
                  <span
                    aria-hidden
                    className="absolute right-5 top-2 font-display italic"
                    style={{
                      color: tone,
                      opacity: 0.22,
                      fontSize: 100,
                      lineHeight: 1,
                      fontWeight: 300,
                    }}
                  >
                    &ldquo;
                  </span>

                  <blockquote
                    className="relative font-display italic text-ink-900"
                    style={{ fontSize: 21, fontWeight: 300, lineHeight: 1.3 }}
                  >
                    &ldquo;{t.q}&rdquo;
                  </blockquote>

                  <figcaption className="relative mt-7 flex items-center gap-3.5">
                    <span
                      aria-hidden
                      className="flex size-11 shrink-0 items-center justify-center rounded-full font-display italic"
                      style={{
                        background: tone,
                        color: "#FDFBF6",
                        fontSize: 18,
                        fontWeight: 300,
                        boxShadow: `0 8px 18px -10px ${tone}80`,
                      }}
                    >
                      {initial}
                    </span>
                    <span>
                      <span
                        className="block font-display italic text-ink-900"
                        style={{ fontSize: 16, fontWeight: 300 }}
                      >
                        {t.name}
                      </span>
                      <span className="mt-0.5 block font-ui text-[10px] uppercase tracking-[0.24em] text-ink-500">
                        First Sunday &middot; {t.campus}
                      </span>
                    </span>
                  </figcaption>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function VisitAlternatives() {
  return (
    <section className="px-6 py-24 sm:px-10" style={{ background: "#F7F1E6" }}>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        className="mx-auto max-w-[820px] text-center"
      >
        <Eyebrow>CAN&rsquo;T COME THIS WEEK?</Eyebrow>
        <h2
          className="mt-3 font-display text-ink-900"
          style={{ fontSize: "clamp(1.75rem,3.6vw,2.5rem)", fontWeight: 300, lineHeight: 1.05 }}
        >
          Start with a watch.
        </h2>
        <p className="mx-auto mt-5 max-w-[48ch] font-body text-[16px] leading-relaxed text-ink-600">
          No pressure. Pick a recent service and meet the family from your couch first.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/watch"
            className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-6 py-3 font-ui text-[14px] text-cream hover:-translate-y-0.5 transition-transform"
          >
            Watch a recent service &rarr;
          </Link>
          <Link
            href="/campuses"
            className="inline-flex items-center gap-2 rounded-full border border-ink-900/10 px-6 py-3 font-ui text-[14px] text-ink-900 hover:border-warm-500"
          >
            Browse every campus &rarr;
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
