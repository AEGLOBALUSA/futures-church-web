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

const EXPECT_TILES = [
  {
    t: "Parking",
    b: "Plenty of free spots at every campus. Pull in near the main entrance \u2014 a host will wave you in.",
    p: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=1200&q=80&auto=format&fit=crop",
  },
  {
    t: "Entrance",
    b: "A warm welcome desk. Quick hello, no quiz. You&rsquo;ll know exactly where to go.",
    p: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=80&auto=format&fit=crop",
  },
  {
    t: "Kids check-in",
    b: "Digital check-in, matching security tags, background-checked volunteers. Your kids will be happy.",
    p: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1200&q=80&auto=format&fit=crop",
  },
  {
    t: "Where to sit",
    b: "Anywhere. Front row, back row, the couch. Stay for coffee after \u2014 we&rsquo;re not in a hurry.",
    p: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=1200&q=80&auto=format&fit=crop",
  },
];

const FAQ: { q: string; a: string }[] = [
  { q: "What should I wear?", a: "Come as you are. Jeans and a t-shirt is fine. So is a suit. We really mean it." },
  { q: "Will people pressure me?", a: "No. You&rsquo;ll be welcomed, not cornered. Nobody&rsquo;s making you sing, give, or sign anything." },
  { q: "What&rsquo;s the service like?", a: "Worship, teaching, prayer. About seventy-five minutes. You can leave anytime and we won&rsquo;t chase." },
  { q: "Is there anything for my kids?", a: "Yes \u2014 all ages, every Sunday, background-checked team, with parents-first security." },
  { q: "Do I have to give money?", a: "No. You&rsquo;re our guest. Giving is for the family, and even then it&rsquo;s always optional." },
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
      <ThreeStepForm />
      <WhatToExpect />
      <FirstTimeFAQ />
      <PreVisitTestimonials />
      <VisitAlternatives />
    </main>
  );
}

function PlanAVisitHero() {
  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-32 sm:px-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 20% 10%, rgba(204,143,74,0.14), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-[1200px]">
        <Eyebrow>PLAN A VISIT &middot; EVERY CAMPUS</Eyebrow>
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-4 font-display text-ink-900"
          style={{
            fontSize: "clamp(2.5rem,6.5vw,5.5rem)",
            fontWeight: 300,
            lineHeight: 0.98,
            letterSpacing: "-0.02em",
          }}
        >
          Come visit. We&rsquo;ve been <em className="italic">expecting</em> you.
        </motion.h1>
        <p className="mt-6 max-w-[54ch] font-body text-[18px] leading-relaxed text-ink-600">
          Tell us a few things and we&rsquo;ll save you a seat &mdash; and meet you at the door.
        </p>
        <div className="mt-10 max-w-[620px]">
          <GlassCard breathe className="p-5">
            <AIInput placeholder="Ask a first-visit question&hellip;" chips={CHIPS} compact />
          </GlassCard>
        </div>
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
                    <p
                      className="mt-16 max-w-[46ch] font-display italic text-ink-700"
                      style={{ fontSize: "clamp(1.1rem, 2vw, 1.25rem)", fontWeight: 300, lineHeight: 1.3 }}
                    >
                      If you&rsquo;re still reading, you&rsquo;re probably coming. Let&rsquo;s make it easy.
                    </p>
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
  return (
    <section className="px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-[1200px]">
        <Eyebrow>WHAT TO EXPECT</Eyebrow>
        <h2
          className="mt-3 font-display text-ink-900"
          style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}
        >
          From the carpark to the <em className="italic">couch</em>.
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {EXPECT_TILES.map((t) => (
            <article
              key={t.t}
              className="overflow-hidden rounded-[20px] bg-white"
              style={{ border: "1px solid rgba(20,20,20,0.05)" }}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={t.p}
                  alt={t.t}
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
                  {t.t}
                </p>
                <p
                  className="mt-3 font-body text-[14px] leading-relaxed text-ink-600"
                  dangerouslySetInnerHTML={{ __html: t.b }}
                />
              </div>
            </article>
          ))}
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
        <Eyebrow>FIRST-TIME QUESTIONS</Eyebrow>
        <h2
          className="mt-3 font-display text-ink-900"
          style={{ fontSize: "clamp(1.75rem,3.6vw,2.5rem)", fontWeight: 300, lineHeight: 1.05 }}
        >
          The ones we <em className="italic">always</em> get.
        </h2>
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
        <Eyebrow>FIRST-TIME VOICES</Eyebrow>
        <h2
          className="mt-3 font-display text-ink-900"
          style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}
        >
          Real. Specific. <em className="italic">Short</em>.
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="rounded-[22px] bg-white p-7"
              style={{ border: "1px solid rgba(20,20,20,0.06)" }}
            >
              <blockquote
                className="font-display italic text-ink-900"
                style={{ fontSize: 22, fontWeight: 300, lineHeight: 1.25 }}
              >
                &ldquo;{t.q}&rdquo;
              </blockquote>
              <figcaption className="mt-5 font-ui text-[11px] uppercase tracking-[0.22em] text-warm-700">
                {t.name} &middot; {t.campus}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function VisitAlternatives() {
  return (
    <section className="px-6 py-24 sm:px-10" style={{ background: "#F7F1E6" }}>
      <div className="mx-auto max-w-[820px] text-center">
        <Eyebrow>CAN&rsquo;T COME THIS WEEK?</Eyebrow>
        <h2
          className="mt-3 font-display text-ink-900"
          style={{ fontSize: "clamp(1.75rem,3.6vw,2.5rem)", fontWeight: 300, lineHeight: 1.05 }}
        >
          Start with a <em className="italic">watch</em>.
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
      </div>
    </section>
  );
}
