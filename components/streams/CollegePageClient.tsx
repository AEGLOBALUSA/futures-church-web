"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Eyebrow, Hero, Sub } from "@/components/ui/Type";
import { ValueExchangeForm } from "@/components/forms/ValueExchangeForm";
import { useAIGuide } from "@/lib/ai/AIGuideContext";
import { getAudience, type Audience } from "@/lib/audience";
import { analytics } from "@/lib/analytics";

type CtaLink = { label: string; href: string };

type CollegeData = {
  hero: {
    eyebrow: string;
    tagline?: string;
    headline: string;
    sub: string;
    subVariants?: { A: string; B: string; C: string };
    detail?: string;
    primaryCta?: CtaLink;
    primaryCtaPreQuiz?: CtaLink;
    urgencyChips?: { kind: string; label: string }[];
    secondaryActions?: CtaLink[];
    facts: { value: string; label: string }[];
    accreditation: { label: string; name: string; logo: string };
  };
  family: {
    eyebrow: string;
    headline: string;
    body: string;
  };
  personas: {
    eyebrow: string;
    headline: string;
    items: {
      slug: string;
      label: string;
      photo?: string;
      copy: string;
      ctaOverride?: CtaLink;
    }[];
  };
  hook: {
    eyebrow: string;
    headline: string;
    sub: string;
    cta?: string;
    sessions: { title: string; length: string; forPersona?: string; blurb?: string; thumb: string; vimeo: string }[];
  };
  facultyIntro: {
    eyebrow: string;
    headline: string;
    body: string;
  };
  whyNow: {
    eyebrow: string;
    headline: string;
    stat: { value: string; label: string };
    image: string;
    body: string;
  };
  streams: {
    slug: string;
    title: string;
    tagline?: string;
    hours: string;
    commitment?: string;
    pitch: string;
    for: string;
    cta: { label: string; href: string };
  }[];
  programme: {
    eyebrow: string;
    headline: string;
    sub?: string;
    core: { n: string; title: string; tagline: string; isNew?: boolean }[];
    electives: { title: string; blurb: string }[];
    outcomes: string[];
    outcomesEyebrow?: string;
    outcomesHeadline?: string;
    outcomesStrip?: string;
    credentialNote?: string;
    yearTwoNote: string;
  };
  faculty: { name: string; discipline: string; bio: string; photo: string }[];
  experience: { t: string; label: string }[];
  outcomes: {
    stats: { label: string; value: string }[];
    alumni: { name: string; now: string; quote: string }[];
  };
  tuition: { year1: number; year2: number; currency: string; notes: string[] };
  enrollment: {
    eyebrow: string;
    headline: string;
    infoNights?: { label: string; date: string }[];
    earlyBird: string;
    close: string;
    sub: string;
    paths?: { stream: string; heading: string; copy: string; cta: string }[];
    onlineNote?: string;
    infoNightNote?: string;
  };
  online: {
    eyebrow: string;
    headline: string;
    includes: string[];
    excludes: string[];
    launch: string;
    cta: { label: string; href: string };
  };
  closing?: string;
  closingCta?: CtaLink;
  alumniProof?: {
    published: boolean;
    name: string;
    cohort: string;
    role: string;
    photo: string;
    quote: string;
    outcome: string;
  };
  scarcity?: {
    enabled: boolean;
    capacityPerCampus: number;
    remaining: { adelaide: number | null; atlanta: number | null };
  };
  faq: { q: string; a: string }[];
};

const STAGE_ONE_KEY = "futures-college-stage-one";

const CHIPS = [
  "which stream is right for me?",
  "what are the 8 subjects?",
  "is it accredited?",
  "how much does it really cost?",
  "when does the 2026 cohort start?",
  "can I visit the campus?",
];

export function CollegePageClient({
  data,
  usAccreditationSlot,
}: {
  data: CollegeData;
  usAccreditationSlot?: React.ReactNode;
}) {
  const { setPageContext } = useAIGuide();
  useEffect(() => setPageContext("college"), [setPageContext]);

  const [stageOneComplete, setStageOneComplete] = useState(false);
  useEffect(() => {
    try {
      setStageOneComplete(localStorage.getItem(STAGE_ONE_KEY) === "1");
    } catch {}
  }, []);

  function markStageOne() {
    setStageOneComplete(true);
    try {
      localStorage.setItem(STAGE_ONE_KEY, "1");
    } catch {}
  }

  return (
    <main className="bg-cream text-ink-900 pb-16 sm:pb-20">
      <StickyCtaBar />
      <CollegeHero hero={data.hero} />
      <ClaimBlock />
      <TryBeforeBuy />
      <FreeSessions hook={data.hook} />
      <PersonaSection personas={data.personas} />
      <WeGetResults />
      <NoFluff />
      <WhyNowRetirementCliff />
      <ThreeStreams streams={data.streams} />
      <FacultyFeatured />
      <TimesWeLiveIn />
      <YearOneProgramme programme={data.programme} />
      <FacultyWall facultyIntro={data.facultyIntro} faculty={data.faculty} />
      <RealStories />
      <TuitionAndAid tuition={data.tuition} />
      <EnrollmentWindow enrollment={data.enrollment} />
      {data.closing && (
        <ClosingStatement closing={data.closing} cta={data.closingCta} />
      )}
      <CollegeFAQ faq={data.faq} />
      <CollegeApplyStageOne onSubmit={markStageOne} />
      <SingleSubjectCTA />
      <KeyDates />
      <VisitBooking />
      {stageOneComplete && <CollegeApplyStageTwo />}
      <StickyFooterBar />
    </main>
  );
}

/* --------------------------------- HERO --------------------------------- */

// Photo paths follow the brief's 5-photo hero rotation slots (§2 of punch-list).
// Slot 0 holds an existing real portrait so a face lands at 0.0s on first paint
// even before the /photos/college/hero/ assets are uploaded.
// When real assets land at the paths below they will appear automatically.
const COLLEGE_FRAMES = [
  { url: "/photos/pastors/ashley.jpg",                   alt: "Ashley Evans — Global Senior Pastor" },
  { url: "/photos/college/hero/01_student_formation.jpg", alt: "Student mid-formation — am I the right age?" },
  { url: "/photos/college/hero/02_cohort_hallway.jpg",    alt: "Cohort in a hallway, mid-laugh — will I belong?" },
  { url: "/photos/college/hero/03_lecture_intensity.jpg", alt: "Lecture in session — will I be challenged?" },
  { url: "/photos/college/hero/04_mentor_moment.jpg",     alt: "Mentor moment — will I be loved?" },
  { url: "/photos/college/hero/05_deployment.jpg",        alt: "Graduate deployed — on a stage, in a youth room, on a worship platform" },
];

function ScrollCue({ reducedMotion }: { reducedMotion: boolean | null }) {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    function onScroll() {
      if (window.scrollY > 80) setHidden(true);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (hidden) return null;
  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: reducedMotion ? 0 : 3 }}
      className="absolute bottom-8 right-8 z-20 hidden sm:flex flex-col items-center gap-2"
      aria-hidden
    >
      <span className="font-ui text-[10px] uppercase tracking-[0.24em] text-ink-700/70">Scroll</span>
      <motion.span
        animate={reducedMotion ? undefined : { y: [0, 6, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        className="text-ink-700/70"
      >
        ↓
      </motion.span>
    </motion.div>
  );
}

function CollegeHero({ hero }: { hero: CollegeData["hero"] }) {
  const reducedMotion = useReducedMotion();
  const [frameIndex, setFrameIndex] = useState(0);
  const [recede, setRecede] = useState(false);

  // Trigger recede at 1.0s after mount
  useEffect(() => {
    if (reducedMotion) {
      setRecede(true);
      return;
    }
    const t = window.setTimeout(() => setRecede(true), 1000);
    return () => window.clearTimeout(t);
  }, [reducedMotion]);

  // Photo crossfade rotation — only after recede has happened
  useEffect(() => {
    if (reducedMotion) return;
    const id = window.setInterval(() => {
      setFrameIndex((i) => (i + 1) % COLLEGE_FRAMES.length);
    }, 8000);
    return () => window.clearInterval(id);
  }, [reducedMotion]);

  const sub = hero.sub;
  const chips = hero.urgencyChips ?? [
    { kind: "info", label: "Alphacrucis-accredited" },
    { kind: "info", label: "Semester One · September 2026" },
    { kind: "deadline", label: "Early-bird closes 29 May" },
  ];

  return (
    <section
      id="apply"
      className="relative overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at 20% 30%, #F7F1E6 0%, #F2E6D1 38%, #E8C9A6 72%, #C89675 100%)",
      }}
    >
      {/* Rotating photos — render all, animate opacity to crossfade */}
      <div aria-hidden className="absolute inset-0">
        {COLLEGE_FRAMES.map((f, i) => {
          const isActive = i === frameIndex;
          const targetOpacity = reducedMotion
            ? (i === 0 ? 0.7 : 0)
            : recede
              ? (isActive ? 0.55 : 0)
              : (i === 0 ? 1 : 0);
          return (
            <div
              key={f.url}
              className="absolute inset-0"
              style={{
                opacity: targetOpacity,
                transition: reducedMotion ? "none" : "opacity 1200ms cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <Image
                src={f.url}
                alt={f.alt}
                fill
                sizes="100vw"
                className="object-cover object-center"
                style={{ filter: "saturate(0.85) brightness(0.95)" }}
                priority={i === 0}
                unoptimized
              />
            </div>
          );
        })}

        {/* Bottom gradient — fades in with recede for text legibility */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, rgba(247,241,230,0.0) 30%, rgba(247,241,230,0.55) 70%, rgba(247,241,230,0.78) 100%)",
            opacity: recede ? 1 : 0,
            transition: reducedMotion ? "none" : "opacity 600ms ease-out",
          }}
        />
        {/* Original 115deg gradient — keep for warmth, dims with recede */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(115deg, rgba(247,241,230,0.55) 0%, rgba(242,230,209,0.4) 40%, rgba(232,201,166,0.3) 70%, rgba(200,150,117,0.25) 100%)",
          }}
        />
      </div>

      {/* warm orbs — kept */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute rounded-full blur-3xl" style={{ top: "-15%", left: "-10%", width: "70vw", height: "70vw", background: "#EAD0B1", opacity: 0.45 }} />
        <div className="absolute rounded-full blur-3xl" style={{ bottom: "-20%", right: "-10%", width: "60vw", height: "60vw", background: "#D9B089", opacity: 0.35 }} />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-6 pb-28 pt-32 sm:px-10 sm:pt-40">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: reducedMotion ? 0 : 1.2 }}
        >
          <Eyebrow>{hero.eyebrow}</Eyebrow>
        </motion.div>

        {/* Headline — primary opening line */}
        <motion.p
          initial={reducedMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: reducedMotion ? 0 : 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-5 max-w-[28ch] font-display text-ink-900"
          style={{ fontSize: "clamp(1.75rem,3.6vw,2.75rem)", fontWeight: 300, lineHeight: 1.18, letterSpacing: "-0.01em" }}
        >
          {hero.headline}
        </motion.p>

        {/* Sub — second */}
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: reducedMotion ? 0 : 1.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Sub className="mt-6 max-w-[56ch]">
            <span dangerouslySetInnerHTML={{ __html: sub }} />
          </Sub>
        </motion.div>

        {/* CTAs + chips + accreditation — third */}
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: reducedMotion ? 0 : 2.4, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {/* Urgency chips */}
          <div className="mt-10 flex flex-wrap gap-2">
            {chips.map((chip) =>
              chip.kind === "deadline" ? (
                <span key={chip.label} className="rounded-full px-4 py-1.5 font-ui text-[11px] uppercase tracking-[0.18em]" style={{ background: "#D43F2B", color: "#FDFBF6", border: "1px solid #B8351F" }}>
                  {chip.label}
                </span>
              ) : chip.label.toLowerCase().includes("accredit") ? (
                <span key={chip.label} className="rounded-full px-4 py-1.5 font-ui text-[11px] uppercase tracking-[0.18em]" style={{ background: "#C89A3C", color: "#FDFBF6", border: "1px solid #B5892F" }}>
                  {chip.label}
                </span>
              ) : (
                <span key={chip.label} className="rounded-full px-4 py-1.5 font-ui text-[11px] uppercase tracking-[0.18em] text-ink-900" style={{ background: "rgba(28,26,23,0.08)", border: "1px solid rgba(28,26,23,0.12)" }}>
                  {chip.label}
                </span>
              ),
            )}
          </div>

          {/* CTAs */}
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#founders-circle"
              onClick={() => analytics.applyIntent({ source: "hero_founders" })}
              className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-ui text-[13px] tracking-[0.02em] transition-all hover:-translate-y-0.5"
              style={{
                background: "#A83D2E",
                color: "#FDFBF6",
                boxShadow: "0 16px 36px -12px rgba(168,61,46,0.55), inset 0 1.5px 0 rgba(255,255,255,0.28)",
              }}
            >
              Claim $500 off →
            </a>
            <a
              href="#free-sessions"
              className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-ui text-[13px] tracking-[0.02em] transition-all hover:-translate-y-0.5"
              style={{
                background: "rgba(28,26,23,0.08)",
                color: "#1C1A17",
                border: "1px solid rgba(28,26,23,0.15)",
              }}
            >
              Watch a free session →
            </a>
          </div>

          {/* Accreditation */}
          <div className="mt-8 flex items-center gap-4">
            <p className="font-ui text-[11px] uppercase tracking-[0.24em] text-warm-700">{hero.accreditation.label}</p>
            <div className="relative h-8 w-40">
              <Image src={hero.accreditation.logo} alt={hero.accreditation.name} fill unoptimized sizes="160px" className="object-contain object-left" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <ScrollCue reducedMotion={reducedMotion} />
    </section>
  );
}

/* ------------------------------ CLAIM BLOCK (B) ------------------------- */

function ClaimBlock() {
  const [emailInputs, setEmailInputs] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});

  function handleClaim(tileId: string, e: React.FormEvent) {
    e.preventDefault();
    // In production this would POST to an email service. For now, mark as submitted.
    setSubmitted((s) => ({ ...s, [tileId]: true }));
    analytics.applyIntent({ source: `claim_${tileId}` });
  }

  const EARLY_BIRD_CLOSE = new Date("2026-05-29T23:59:59");
  const daysLeft = Math.max(0, Math.ceil((EARLY_BIRD_CLOSE.getTime() - Date.now()) / 86400000));
  const spotsLeft = 47; // Static — update when real tracking is in place.

  return (
    <section id="founders-circle" className="px-6 py-16 sm:px-10" style={{ background: "#F7F0E4" }}>
      <span id="claim-block" aria-hidden style={{ position: "absolute" }} />
      <div className="mx-auto max-w-[1200px]">
        <p className="font-ui text-[11px] tracking-[0.06em] text-warm-700">Claim something today</p>
        <h2
          className="mt-3 font-display text-ink-900"
          style={{ fontSize: "clamp(1.75rem,3.2vw,2.5rem)", fontWeight: 300, lineHeight: 1.08 }}
        >
          You don&rsquo;t have to apply to get something <em className="italic">real</em>.
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Tile 1 — Founder's Circle */}
          <div
            className="relative flex flex-col overflow-hidden rounded-[22px] p-7"
            style={{ background: "#1C1A17", border: "1px solid rgba(200,154,60,0.35)" }}
          >
            <p className="font-ui text-[10px] uppercase tracking-[0.22em]" style={{ color: "#C89A3C" }}>
              Founder&rsquo;s Circle · First 100 only
            </p>
            <p className="mt-3 font-display italic" style={{ fontSize: 22, fontWeight: 300, lineHeight: 1.2, color: "#FDFBF6" }}>
              $500 off the 2026 intake
            </p>
            <p className="mt-3 font-body text-[14px] leading-relaxed" style={{ color: "rgba(253,251,246,0.72)" }}>
              Apply before 29 May with code <strong className="font-ui font-semibold" style={{ color: "#C89A3C" }}>FOUNDER500</strong>. {spotsLeft} of 100 spots remaining.
            </p>
            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between font-ui text-[11px] uppercase tracking-[0.18em]" style={{ color: "rgba(253,251,246,0.5)" }}>
                <span>{spotsLeft} remaining</span>
                <span>{daysLeft} days left</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full" style={{ background: "rgba(253,251,246,0.15)" }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: `${((100 - spotsLeft) / 100) * 100}%`, background: "#C89A3C" }}
                />
              </div>
            </div>
            <a
              href="#apply-form"
              onClick={() => analytics.applyIntent({ source: "founders_circle" })}
              className="mt-8 inline-flex w-fit items-center gap-2 rounded-full px-5 py-2.5 font-ui text-[12px] uppercase tracking-[0.18em] transition-all hover:-translate-y-0.5"
              style={{ background: "#C89A3C", color: "#14120F" }}
            >
              Apply now →
            </a>
          </div>

          {/* Tile 2 — Free first subject */}
          <div
            className="flex flex-col rounded-[22px] p-7"
            style={{ background: "#EDE4D3", border: "1px solid rgba(20,20,20,0.07)" }}
          >
            <p className="font-ui text-[10px] uppercase tracking-[0.22em]" style={{ color: "#A83D2E" }}>
              Free · No commitment
            </p>
            <p className="mt-3 font-display italic text-ink-900" style={{ fontSize: 22, fontWeight: 300, lineHeight: 1.2 }}>
              Claim your free first subject
            </p>
            <p className="mt-3 font-body text-[14px] leading-relaxed text-ink-600">
              Take Subject 01 — <em>What&rsquo;s Wrong with the Church</em> — on us. One full lecture. Yours to keep, no strings attached.
            </p>
            {submitted["free-subject"] ? (
              <p className="mt-6 font-ui text-[13px]" style={{ color: "#4E5D3F" }}>
                ✓ Check your inbox — it&rsquo;s on its way.
              </p>
            ) : (
              <form onSubmit={(e) => handleClaim("free-subject", e)} className="mt-6 flex flex-col gap-3">
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={emailInputs["free-subject"] ?? ""}
                  onChange={(ev) => setEmailInputs((s) => ({ ...s, "free-subject": ev.target.value }))}
                  className="w-full rounded-xl border border-ink-900/15 bg-white px-4 py-2.5 font-body text-[14px] text-ink-900 outline-none focus:border-ink-900/40"
                />
                <button
                  type="submit"
                  className="rounded-full px-5 py-2.5 font-ui text-[12px] uppercase tracking-[0.18em] text-cream transition-all hover:-translate-y-0.5"
                  style={{ background: "#A83D2E" }}
                >
                  Send it to me →
                </button>
              </form>
            )}
          </div>

          {/* Tile 3 — Gift a subject */}
          <div
            className="flex flex-col rounded-[22px] p-7"
            style={{ background: "#EDE4D3", border: "1px solid rgba(20,20,20,0.07)" }}
          >
            <p className="font-ui text-[10px] uppercase tracking-[0.22em]" style={{ color: "#4E5D3F" }}>
              Gift · Pay it forward
            </p>
            <p className="mt-3 font-display italic text-ink-900" style={{ fontSize: 22, fontWeight: 300, lineHeight: 1.2 }}>
              Gift a subject to someone you love
            </p>
            <p className="mt-3 font-body text-[14px] leading-relaxed text-ink-600">
              Know someone who&rsquo;s been quietly searching? Send them Subject 01, free, with a personal note from you. Takes 30 seconds.
            </p>
            {submitted["gift-subject"] ? (
              <p className="mt-6 font-ui text-[13px]" style={{ color: "#4E5D3F" }}>
                ✓ Gift sent. They&rsquo;ll receive it with your name on it.
              </p>
            ) : (
              <form onSubmit={(e) => handleClaim("gift-subject", e)} className="mt-6 flex flex-col gap-3">
                <input
                  type="email"
                  required
                  placeholder="their@email.com"
                  value={emailInputs["gift-subject"] ?? ""}
                  onChange={(ev) => setEmailInputs((s) => ({ ...s, "gift-subject": ev.target.value }))}
                  className="w-full rounded-xl border border-ink-900/15 bg-white px-4 py-2.5 font-body text-[14px] text-ink-900 outline-none focus:border-ink-900/40"
                />
                <button
                  type="submit"
                  className="rounded-full px-5 py-2.5 font-ui text-[12px] uppercase tracking-[0.18em] text-cream transition-all hover:-translate-y-0.5"
                  style={{ background: "#4E5D3F" }}
                >
                  Send the gift →
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------- TRY BEFORE BUY (C) ----------------------------- */

function TryBeforeBuy() {
  return (
    <section className="px-6 py-16 sm:px-10" style={{ background: "#F7F1E6" }}>
      <div className="mx-auto max-w-[900px]">
        <p className="font-ui text-[11px] tracking-[0.06em] text-warm-700">Try before you buy</p>
        <h2
          className="mt-3 font-display text-ink-900"
          style={{ fontSize: "clamp(1.75rem,3.4vw,2.5rem)", fontWeight: 300, lineHeight: 1.1 }}
        >
          But before you do — find out which one really connects with you. <em className="italic">For free. No email required.</em>
        </h2>
        <p className="mt-5 font-body text-[16px] leading-relaxed text-ink-600" style={{ maxWidth: "58ch" }}>
          We&rsquo;ve put three real lectures from the college online. Not trailers — the actual thing. Pick the one that meets you where you are. If it lands, the rest of the year is built on the same DNA.
        </p>
        <a
          href="#free-sessions"
          className="mt-7 inline-flex items-center gap-2 font-ui text-[13px] tracking-[0.04em] text-warm-700 hover:text-ink-900 transition-colors"
        >
          See the three free sessions →
        </a>
      </div>
    </section>
  );
}

/* ------------------------------ FAMILY SECTION (kept, not rendered) ----- */

function FamilySection({ family }: { family: CollegeData["family"] }) {
  return (
    <section className="px-6 py-20 sm:px-10" style={{ background: "#F2E6D1" }}>
      <div className="mx-auto max-w-[900px] text-center">
        <p className="font-ui text-[11px] tracking-[0.06em] text-warm-700"
          dangerouslySetInnerHTML={{ __html: family.eyebrow }}
        />
        <h2
          className="mt-3 font-display text-ink-900"
          style={{ fontSize: "clamp(1.75rem,3.6vw,2.75rem)", fontWeight: 300, lineHeight: 1.1 }}
        >
          {family.headline}
        </h2>
        <p
          className="mx-auto mt-5 max-w-[54ch] font-body text-[16px] leading-relaxed text-ink-600"
          dangerouslySetInnerHTML={{ __html: family.body }}
        />
      </div>
    </section>
  );
}

/* ------------------------------ PERSONA SECTION (D) --------------------- */

function PersonaSection({ personas }: { personas: CollegeData["personas"] }) {
  return (
    <section id="personas" className="px-6 py-24 sm:px-10" style={{ background: "#F7F0E4" }}>
      <div className="mx-auto max-w-[1200px]">
        <p className="font-ui text-[11px] tracking-[0.06em] text-warm-700"
          dangerouslySetInnerHTML={{ __html: personas.eyebrow }}
        />
        <h2
          className="mt-3 font-display text-ink-900"
          style={{ fontSize: "clamp(2rem,4.4vw,3.25rem)", fontWeight: 300, lineHeight: 1.02 }}
        >
          {personas.headline}
        </h2>
        <p className="mt-4 font-body text-[16px] leading-relaxed text-ink-600" style={{ maxWidth: "54ch" }}>
          There&rsquo;s a version of this course built with you in mind. See if one of these sounds like the sentence you&rsquo;ve been saying to yourself.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {personas.items.map((p, i) => {
            const href = p.ctaOverride?.href ?? "#apply-form";
            const ctaLabel = p.ctaOverride?.label ?? "This sounds like me \u2192";
            return (
              <motion.a
                key={p.slug}
                href={href}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.65,
                  delay: i * 0.06,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="group flex flex-col overflow-hidden rounded-[20px] transition-transform hover:-translate-y-1"
                style={{
                  background: "#EDE4D3",
                  border: "1px solid rgba(20,20,20,0.06)",
                  boxShadow: "0 14px 32px -22px rgba(20,20,20,0.25)",
                }}
              >
                {p.photo && p.photo !== "placeholder" ? (
                  <div className="relative aspect-[4/5] w-full overflow-hidden">
                    <Image
                      src={p.photo}
                      alt={p.label}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                      className="object-cover"
                      style={{ objectPosition: "center 30%" }}
                    />
                  </div>
                ) : null}
                <div className="flex flex-1 flex-col p-4 sm:p-6">
                  <p
                    className="font-ui text-[10px] uppercase"
                    style={{
                      color: "#A83D2E",
                      letterSpacing: "0.06em",
                      fontWeight: 600,
                    }}
                    dangerouslySetInnerHTML={{ __html: p.label }}
                  />
                  <p
                    className="mt-3 font-display italic"
                    style={{
                      fontSize: 15,
                      fontWeight: 300,
                      lineHeight: 1.4,
                      color: "#14120F",
                    }}
                    dangerouslySetInnerHTML={{ __html: p.copy }}
                  />
                  <p
                    className="mt-auto pt-5 font-ui text-[11px]"
                    style={{ color: "#A83D2E" }}
                  >
                    <span
                      className="group-hover:underline underline-offset-4"
                      dangerouslySetInnerHTML={{ __html: ctaLabel }}
                    />
                  </p>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ----------------------- WHY NOW — COMPACT PULL QUOTE (G) --------------- */

function WhyNowCompact() {
  return (
    <section className="px-6 py-20 sm:px-10" style={{ background: "#14120F", color: "#FDFBF6" }}>
      <div className="mx-auto max-w-[900px]">
        <p className="font-ui text-[11px] tracking-[0.06em]" style={{ color: "#C89A3C" }}>
          Why now
        </p>
        <div className="mt-6 space-y-3 font-display italic" style={{ fontSize: "clamp(1.4rem,2.8vw,2rem)", fontWeight: 300, lineHeight: 1.2 }}>
          <p>The next ten years will reshape every institution on the planet.</p>
          <p style={{ color: "#E8C9A6" }}>Those who act first will lead what comes next.</p>
          <p>For the Church, that window is now.</p>
        </div>
      </div>
    </section>
  );
}

/* ----------------------- WHY NOW RETIREMENT CLIFF (G) ------------------- */

function WhyNowRetirementCliff() {
  return (
    <section className="px-6 py-28 sm:px-10" style={{ background: "#1C1A17", color: "#FDFBF6" }}>
      <div className="mx-auto max-w-[1200px]">
        <p className="font-ui text-[11px] tracking-[0.06em]" style={{ color: "#C89A3C" }}>
          Why now
        </p>
        <h2
          className="mt-4 font-display"
          style={{ fontSize: "clamp(2rem,4.4vw,3.25rem)", fontWeight: 300, lineHeight: 1.02 }}
        >
          A generation of pastors is leaving the field.
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-[20px] p-7" style={{ background: "rgba(253,251,246,0.06)", border: "1px solid rgba(253,251,246,0.1)" }}>
            <p className="font-display italic" style={{ fontSize: 52, fontWeight: 300, color: "#C89A3C", lineHeight: 1 }}>50%</p>
            <p className="mt-3 font-ui text-[12px] uppercase tracking-[0.18em] opacity-70">of US pastors are 55 or older</p>
            <p className="mt-4 font-body text-[14px] leading-relaxed opacity-60">The retirement cliff is real. Barna and Lifeway have both tracked it. The pipeline behind them is thin.</p>
          </div>
          <div className="rounded-[20px] p-7" style={{ background: "rgba(253,251,246,0.06)", border: "1px solid rgba(253,251,246,0.1)" }}>
            <p className="font-display italic" style={{ fontSize: 52, fontWeight: 300, color: "#C89A3C", lineHeight: 1 }}>10 yr</p>
            <p className="mt-3 font-ui text-[12px] uppercase tracking-[0.18em] opacity-70">window — the roles that need filling, now</p>
            <p className="mt-4 font-body text-[14px] leading-relaxed opacity-60">Senior pastors. Campus pastors. Youth leaders. Kids directors. Board members. Communicators. Builders. Not in a decade. Now.</p>
          </div>
          <div className="rounded-[20px] p-7" style={{ background: "rgba(253,251,246,0.06)", border: "1px solid rgba(253,251,246,0.1)" }}>
            <p className="font-display italic" style={{ fontSize: 52, fontWeight: 300, color: "#C89A3C", lineHeight: 1 }}>1,200+</p>
            <p className="mt-3 font-ui text-[12px] uppercase tracking-[0.18em] opacity-70">leaders raised by Futures so far</p>
            <p className="mt-4 font-body text-[14px] leading-relaxed opacity-60">Futures&rsquo; answer: not by accident. On purpose. One year at a time. Building the next generation of every one of those roles.</p>
          </div>
        </div>

        <p
          className="mt-14 font-display italic"
          style={{ fontSize: "clamp(1.3rem,2.4vw,1.75rem)", fontWeight: 300, lineHeight: 1.3, color: "#E8C9A6", maxWidth: "58ch" }}
        >
          &ldquo;The Church that leads the next decade will be the one that started training its leaders this one.&rdquo;
        </p>
        <p className="mt-3 font-ui text-[11px] uppercase tracking-[0.18em] opacity-50">
          Sources: Barna Group, Lifeway Research, Hartford Institute for Religion Research
        </p>
      </div>
    </section>
  );
}

/* ------------------------------ WE GET RESULTS -------------------------- */

function WeGetResults() {
  return (
    <section className="px-6 py-24 sm:px-10" style={{ background: "#F7F1E6" }}>
      <div className="mx-auto max-w-[1200px]">
        <p className="font-ui text-[11px] tracking-[0.06em] text-warm-700">Track record</p>
        <h2
          className="mt-3 font-display text-ink-900"
          style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}
        >
          We get <em className="italic">results</em>.
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div
            className="rounded-[20px] p-8"
            style={{ background: "white", border: "1px solid rgba(20,20,20,0.06)", boxShadow: "0 14px 32px -22px rgba(20,20,20,0.2)" }}
          >
            <p className="font-display italic text-ink-900" style={{ fontSize: 64, fontWeight: 300, lineHeight: 1, color: "#A83D2E" }}>1,200+</p>
            <p className="mt-3 font-ui text-[12px] uppercase tracking-[0.18em] text-ink-600">Leaders raised across 21 campuses</p>
            <p className="mt-3 font-body text-[14px] leading-relaxed text-ink-500">Into pulpits, worship rooms, youth halls, board rooms, and businesses built on Kingdom values.</p>
          </div>
          <div
            className="rounded-[20px] p-8"
            style={{ background: "white", border: "1px solid rgba(20,20,20,0.06)", boxShadow: "0 14px 32px -22px rgba(20,20,20,0.2)" }}
          >
            <p className="font-display italic text-ink-900" style={{ fontSize: 64, fontWeight: 300, lineHeight: 1, color: "#A83D2E" }}>94%</p>
            <p className="mt-3 font-ui text-[12px] uppercase tracking-[0.18em] text-ink-600">Placement rate — Internship stream graduates</p>
            <p className="mt-3 font-body text-[14px] leading-relaxed text-ink-500">Deployed into active ministry roles within six months of completing the year.</p>
          </div>
          <div
            className="rounded-[20px] p-8"
            style={{ background: "white", border: "1px solid rgba(20,20,20,0.06)", boxShadow: "0 14px 32px -22px rgba(20,20,20,0.2)" }}
          >
            <p className="font-display italic text-ink-900" style={{ fontSize: 64, fontWeight: 300, lineHeight: 1, color: "#A83D2E" }}>80,000+</p>
            <p className="mt-3 font-ui text-[12px] uppercase tracking-[0.18em] text-ink-600">People reached through Futures-trained leaders</p>
            <p className="mt-3 font-body text-[14px] leading-relaxed text-ink-500">Through campuses planted, churches built, and communities transformed by graduates of this programme.</p>
          </div>
        </div>

        <p className="mt-10 font-body text-[16px] leading-relaxed text-ink-900" style={{ maxWidth: "64ch" }}>
          This isn&rsquo;t a programme that hopes you&rsquo;ll find your calling. It&rsquo;s a programme that has deployed thousands of people into theirs — and has been doing it for 35 years.
        </p>
        <p className="mt-4 font-body text-[15px] leading-relaxed text-ink-600" style={{ maxWidth: "64ch" }}>
          <strong className="font-medium text-ink-900">Don&rsquo;t take our word for it.</strong> Read the stories →
        </p>
      </div>
    </section>
  );
}

/* -------------------------------- NO FLUFF ------------------------------ */

function NoFluff() {
  return (
    <section className="px-6 py-20 sm:px-10" style={{ background: "#1C1A17", color: "#FDFBF6" }}>
      <div className="mx-auto max-w-[900px]">
        <p className="font-ui text-[11px] tracking-[0.06em]" style={{ color: "#C89A3C" }}>What you&rsquo;re signing up for</p>
        <h2
          className="mt-4 font-display"
          style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}
        >
          No fluff. No filler. <em className="italic">A deep dive.</em>
        </h2>
        <p className="mt-5 font-body text-[17px] leading-relaxed" style={{ color: "rgba(253,251,246,0.72)", maxWidth: "58ch" }}>
          This is not a podcast. It&rsquo;s not a leadership conference. It&rsquo;s not a six-week study group dressed up as a college.
        </p>
        <div className="mt-8 space-y-5 font-body text-[16px] leading-relaxed" style={{ color: "rgba(253,251,246,0.72)", maxWidth: "58ch" }}>
          <p>Eight subjects, taught by people who actually built the thing. Real assessments. Real placement. Real outcomes you can point to a year later.</p>
          <p>You&rsquo;ll be stretched theologically. You&rsquo;ll be sharpened practically. You&rsquo;ll be deployed pastorally. By the end of year one, you won&rsquo;t just understand church — you&rsquo;ll be ready to lead one.</p>
          <p>If you want easy, this isn&rsquo;t it. If you want real, you&rsquo;ve found it.</p>
        </div>
        <a
          href="#programme"
          className="mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 font-ui text-[12px] uppercase tracking-[0.18em] transition-all hover:-translate-y-0.5"
          style={{ background: "rgba(253,251,246,0.1)", border: "1px solid rgba(253,251,246,0.25)", color: "#FDFBF6" }}
        >
          See the eight subjects →
        </a>
      </div>
    </section>
  );
}

/* ----------------------------- FREE SESSIONS (E) ------------------------ */

function FreeSessions({ hook }: { hook: CollegeData["hook"] }) {
  const [audience, setAudience] = useState<Audience | undefined>(undefined);
  const [pendingSession, setPendingSession] = useState<typeof hook.sessions[0] | null>(null);
  useEffect(() => {
    setAudience(getAudience());
  }, []);

  // Per panel Action 14: cold = ungated inline play; warm = email wall.
  // Until ESP-modal lands, warm visitors are nudged to the apply form (which
  // already collects email + course book) instead of straight-to-Vimeo.
  const isWarm = audience === "warm";

  return (
    <section id="free-sessions" className="px-6 py-28 sm:px-10" style={{ background: "#F7F0E4" }}>
      <div className="mx-auto max-w-[1200px]">
        <div className="flex flex-wrap items-baseline gap-3">
          <p className="font-ui text-[11px] tracking-[0.06em] text-warm-700">{hook.eyebrow}</p>
          {isWarm && (
            <span
              className="rounded-full px-3 py-1 font-ui text-[10px] uppercase tracking-[0.18em]"
              style={{
                background: "rgba(168,61,46,0.08)",
                color: "#A83D2E",
                border: "1px solid rgba(168,61,46,0.2)",
              }}
            >
              Welcome back
            </span>
          )}
        </div>
        <h2
          className="mt-3 font-display text-ink-900"
          style={{ fontSize: "clamp(2rem,4.4vw,3.25rem)", fontWeight: 300, lineHeight: 1.02 }}
          dangerouslySetInnerHTML={{ __html: hook.headline }}
        />
        <p className="mt-5 max-w-[54ch] font-body text-[16px] text-ink-600">{hook.sub}</p>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {hook.sessions.map((s, i) => (
            <motion.button
              key={s.vimeo}
              type="button"
              onClick={() => setPendingSession(s)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
              className="group flex flex-col overflow-hidden rounded-[22px] bg-white text-left shadow-[0_18px_40px_-22px_rgba(20,20,20,0.3)]"
              style={{ border: "1px solid rgba(20,20,20,0.05)" }}
            >
              <div className="relative aspect-video w-full overflow-hidden">
                <Image
                  src={s.thumb}
                  alt={s.title}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(180deg, rgba(28,26,23,0) 55%, rgba(28,26,23,0.55) 100%)" }}
                />
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  aria-hidden
                >
                  <span
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-cream/95 text-ink-900 shadow-[0_10px_24px_-10px_rgba(20,20,20,0.45)] transition-transform duration-300 group-hover:scale-110"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 translate-x-[1px]">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </div>
                <p className="absolute left-4 top-4 rounded-full bg-cream/90 px-3 py-1 font-ui text-[11px] uppercase tracking-[0.22em] text-ink-900">
                  {s.length}
                </p>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p
                  className="font-display italic text-ink-900"
                  style={{ fontSize: 22, fontWeight: 300, lineHeight: 1.2 }}
                  dangerouslySetInnerHTML={{ __html: s.title }}
                />
                {s.forPersona && (
                  <p className="mt-2 font-ui text-[11px] uppercase tracking-[0.2em]" style={{ color: "#A83D2E" }}>
                    {s.forPersona}
                  </p>
                )}
                {s.blurb && (
                  <p className="mt-3 font-body text-[14px] leading-relaxed text-ink-600">
                    {s.blurb}
                  </p>
                )}
                <p className="mt-5 font-ui text-[12px] uppercase tracking-[0.22em] text-warm-700">
                  {isWarm
                    ? `Unlock by email — ${s.length} →`
                    : `Watch — ${s.length} →`}
                </p>
              </div>
            </motion.button>
          ))}
        </div>

        {hook.cta && (
          <p className="mt-8 font-body text-[14px] text-ink-600">{hook.cta}</p>
        )}
      </div>

      {pendingSession && (
        <SessionUrgencyOverlay
          session={pendingSession}
          audience={audience ?? "cold"}
          onClose={() => setPendingSession(null)}
        />
      )}
    </section>
  );
}

function SessionUrgencyOverlay({
  session,
  audience,
  onClose,
}: {
  session: { title: string; length: string; vimeo: string };
  audience: Audience;
  onClose: () => void;
}) {
  const closeDate = new Date("2026-05-29T23:59:59");
  const daysLeft = Math.max(0, Math.ceil((closeDate.getTime() - Date.now()) / 86400000));
  const applicantCount = 127; // hardcoded — wire to real counter later

  function handleWatch() {
    analytics.sessionUnlock({ audience, sessionId: session.vimeo });
    window.open(`https://vimeo.com/${session.vimeo}`, "_blank", "noopener,noreferrer");
    onClose();
  }

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center px-4"
      style={{ background: "rgba(20,18,15,0.72)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Session details"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative w-full max-w-[480px] rounded-[22px] p-7"
        style={{ background: "#FDFBF6", boxShadow: "0 30px 80px -20px rgba(0,0,0,0.5)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-ink-600 transition-colors hover:bg-ink-900/10 hover:text-ink-900"
        >
          ×
        </button>

        <p className="font-ui text-[10px] uppercase tracking-[0.22em] text-warm-700">You&rsquo;re about to watch</p>
        <p
          className="mt-2 font-display italic text-ink-900"
          style={{ fontSize: 24, fontWeight: 300, lineHeight: 1.2 }}
        >
          {session.title}
        </p>
        <p className="mt-1 font-ui text-[11px] uppercase tracking-[0.18em] text-ink-500">{session.length} · Free</p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded-xl px-4 py-3" style={{ background: "rgba(168,61,46,0.08)" }}>
            <p className="font-display italic" style={{ fontSize: 22, fontWeight: 300, color: "#A83D2E" }}>{daysLeft}</p>
            <p className="mt-1 font-ui text-[10px] uppercase tracking-[0.16em] text-ink-600">Days until early-bird closes</p>
          </div>
          <div className="rounded-xl px-4 py-3" style={{ background: "rgba(78,93,63,0.08)" }}>
            <p className="font-display italic" style={{ fontSize: 22, fontWeight: 300, color: "#4E5D3F" }}>{applicantCount}</p>
            <p className="mt-1 font-ui text-[10px] uppercase tracking-[0.16em] text-ink-600">People already applied for 2026</p>
          </div>
        </div>

        <p className="mt-6 font-body text-[14px] leading-relaxed text-ink-700">
          This session is free. There&rsquo;s no catch. But the seats behind it are filling. Watch — then decide.
        </p>

        <button
          onClick={handleWatch}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 font-ui text-[12px] uppercase tracking-[0.18em] text-cream transition-all hover:-translate-y-0.5"
          style={{
            background: "#A83D2E",
            boxShadow: "0 16px 36px -12px rgba(168,61,46,0.5), inset 0 1.5px 0 rgba(255,255,255,0.28)",
          }}
        >
          Watch now →
        </button>
      </motion.div>
    </div>
  );
}

/* ------------------------------- WHY NOW (kept for data, not rendered) --- */

function WhyNow({ whyNow }: { whyNow: CollegeData["whyNow"] }) {
  return (
    <section className="px-6 py-28 sm:px-10" style={{ background: "#1C1A17", color: "#FDFBF6" }}>
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="font-ui text-[11px] tracking-[0.06em]" style={{ color: "#D9B089" }}>
            {whyNow.eyebrow}
          </p>
          <h2
            className="mt-4 font-display"
            style={{ fontSize: "clamp(2rem,4.4vw,3.25rem)", fontWeight: 300, lineHeight: 1.02 }}
            dangerouslySetInnerHTML={{ __html: whyNow.headline }}
          />
          <p className="mt-8 max-w-[54ch] font-body text-[16px] leading-relaxed opacity-85">
            {whyNow.body}
          </p>
          {whyNow.stat && (
            <div className="mt-10 flex items-baseline gap-5 border-t pt-6" style={{ borderColor: "rgba(253,251,246,0.15)" }}>
              <p
                className="font-display"
                style={{ fontSize: "clamp(2.2rem,3.8vw,3rem)", fontWeight: 300, color: "#C89A3C", lineHeight: 1 }}
                dangerouslySetInnerHTML={{ __html: whyNow.stat.value }}
              />
              <p
                className="max-w-[36ch] font-ui text-[12px] uppercase tracking-[0.18em] opacity-70"
                dangerouslySetInnerHTML={{ __html: whyNow.stat.label }}
              />
            </div>
          )}
        </div>
        <div
          className="relative aspect-[4/5] w-full overflow-hidden rounded-[22px]"
          style={{ boxShadow: "0 30px 60px -28px rgba(0,0,0,0.6)" }}
        >
          <Image
            src={whyNow.image}
            alt="A conversation at the campus café"
            fill
            unoptimized
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, transparent 55%, rgba(28,26,23,0.55) 100%)" }}
          />
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- THREE STREAMS (H) ------------------------ */

function ThreeStreams({ streams }: { streams: CollegeData["streams"] }) {
  return (
    <section id="streams" className="px-6 py-28 sm:px-10" style={{ background: "#F7F1E6" }}>
      <div className="mx-auto max-w-[1200px]">
        <p className="font-ui text-[11px] tracking-[0.06em] text-warm-700">Three streams</p>
        <h2
          className="mt-3 font-display text-ink-900"
          style={{ fontSize: "clamp(2rem,4.4vw,3.25rem)", fontWeight: 300, lineHeight: 1.02 }}
        >
          Three <em className="italic">streams</em>.
        </h2>
        <p className="mt-5 max-w-[54ch] font-body text-[16px] text-ink-600">
          Three ways in. Pick the depth that matches where you are in your calling.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {streams.map((s, i) => (
            <motion.article
              key={s.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex flex-col rounded-[22px] bg-white p-8 shadow-[0_18px_40px_-22px_rgba(20,20,20,0.3)]"
              style={{ border: "1px solid rgba(20,20,20,0.05)" }}
            >
              <p className="font-ui text-[11px] uppercase tracking-[0.24em] text-warm-700">
                {s.hours}
              </p>
              <p
                className="mt-3 font-display italic text-ink-900"
                style={{ fontSize: 36, fontWeight: 300, lineHeight: 1 }}
              >
                {s.title}
              </p>
              {s.tagline && (
                <p className="mt-1 font-body text-[15px] text-warm-700">{s.tagline}</p>
              )}
              <p className="mt-4 font-body text-[15px] leading-relaxed text-ink-900">
                {s.pitch}
              </p>
              <p className="mt-3 font-body text-[14px] leading-relaxed text-ink-600">
                {s.for}
              </p>
              {s.commitment && (
                <p className="mt-4 font-ui text-[11px] uppercase tracking-[0.18em] text-ink-600 opacity-75"
                  dangerouslySetInnerHTML={{ __html: s.commitment }}
                />
              )}
              <a
                href={s.cta.href}
                className="mt-8 inline-flex w-fit items-center gap-2 rounded-full px-5 py-2.5 font-ui text-[13px] text-cream transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: "linear-gradient(160deg, #D4987A 0%, #B87248 100%)",
                  boxShadow: "0 16px 36px -10px rgba(180,100,55,0.45), inset 0 1.5px 0 rgba(255,255,255,0.38), inset 0 0 0 1px rgba(255,255,255,0.12)",
                }}
              >
                {s.cta.label} →
              </a>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------- FACULTY FEATURED (I) ----------------------- */

function FacultyFeatured() {
  return (
    <section className="px-6 py-24 sm:px-10" style={{ background: "#F2E6D1" }}>
      <div className="mx-auto max-w-[1100px]">
        <p className="font-ui text-[11px] tracking-[0.06em] text-warm-700">Faculty</p>
        <h2
          className="mt-3 font-display text-ink-900"
          style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}
        >
          Taught by people who&rsquo;ve <em className="italic">built it</em>.
        </h2>
        <p className="mt-5 max-w-[62ch] font-body text-[16px] leading-relaxed text-ink-600">
          Futures College isn&rsquo;t theology taught by career academics. It&rsquo;s leadership formation built by the people who planted twenty-one campuses across four countries — and are still planting more. You&rsquo;ll learn from practitioners. You&rsquo;ll be mentored by pastors whose churches are alive and growing. You&rsquo;ll build your framework alongside people who are actually doing the work today.
        </p>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div
            className="flex flex-col rounded-[22px] bg-white p-8 shadow-[0_18px_40px_-22px_rgba(20,20,20,0.2)]"
            style={{ border: "1px solid rgba(20,20,20,0.06)" }}
          >
            <div className="flex items-start gap-5">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full" style={{ background: "#EDE4D3" }}>
                <div className="flex h-full w-full items-center justify-center">
                  <span className="font-display italic" style={{ fontSize: 24, fontWeight: 300, color: "#A83D2E" }}>J</span>
                </div>
              </div>
              <div>
                <p className="font-ui text-[12px] font-medium text-ink-900">Ps Jane Evans</p>
                <p className="mt-0.5 font-ui text-[11px] uppercase tracking-[0.18em] text-warm-700">College President</p>
              </div>
            </div>
            <p className="mt-5 font-body text-[15px] leading-relaxed text-ink-600">
              Thirty-five years building churches, releasing leaders, and watching people step into the calling they were made for. Jane doesn&rsquo;t teach theory. She teaches what she&rsquo;s lived.
            </p>
          </div>
          <div
            className="flex flex-col rounded-[22px] bg-white p-8 shadow-[0_18px_40px_-22px_rgba(20,20,20,0.2)]"
            style={{ border: "1px solid rgba(20,20,20,0.06)" }}
          >
            <div className="flex items-start gap-5">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full" style={{ background: "#EDE4D3" }}>
                <div className="flex h-full w-full items-center justify-center">
                  <span className="font-display italic" style={{ fontSize: 24, fontWeight: 300, color: "#A83D2E" }}>A</span>
                </div>
              </div>
              <div>
                <p className="font-ui text-[12px] font-medium text-ink-900">Ps Ashley Evans</p>
                <p className="mt-0.5 font-ui text-[11px] uppercase tracking-[0.18em] text-warm-700">Global Senior Pastor</p>
              </div>
            </div>
            <p className="mt-5 font-body text-[15px] leading-relaxed text-ink-600">
              The calling they were made for. Thirty-five years of actually building — and releasing people into the life they were built for. The Futures family is his life&rsquo;s work.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- TIMES WE LIVE IN (J) --------------------- */

function TimesWeLiveIn() {
  return (
    <section className="px-6 py-20 sm:px-10" style={{ background: "#14120F", color: "#FDFBF6" }}>
      <div className="mx-auto max-w-[900px]">
        <p className="font-ui text-[11px] tracking-[0.06em]" style={{ color: "#C89A3C" }}>
          The times we live in
        </p>
        <div className="mt-8 space-y-5 font-body text-[17px] leading-relaxed" style={{ color: "rgba(253,251,246,0.82)" }}>
          <p>AI is rewriting every institution. The Church included. The question isn&rsquo;t whether it changes — it&rsquo;s whether you&rsquo;ll lead the change or be swept up by it.</p>
          <p>Trust in institutions is collapsing. Authority is decentralising. Cultural fragmentation is the water we&rsquo;re all swimming in. The leaders who hold theology and skill in the same hand will define what comes next.</p>
          <p>The next ten years will be defined by leaders who act first. Not loudest. First.</p>
        </div>
        <p
          className="mt-10 font-display italic"
          style={{ fontSize: "clamp(1.3rem,2.2vw,1.6rem)", fontWeight: 300, color: "#E8C9A6", lineHeight: 1.3 }}
        >
          Out<em>think</em>. Out<em>build</em>. Out<em>lead</em>.
        </p>
        <p
          className="mt-2 font-display italic"
          style={{ fontSize: "clamp(1.1rem,1.8vw,1.3rem)", fontWeight: 300, opacity: 0.55, lineHeight: 1.3 }}
        >
          Those who act first will lead what comes next.
        </p>
      </div>
    </section>
  );
}

/* --------------------------- YEAR ONE PROGRAMME (K) --------------------- */

function YearOneProgramme({ programme }: { programme: CollegeData["programme"] }) {
  return (
    <section id="programme" className="px-6 py-28 sm:px-10" style={{ background: "#F7F1E6" }}>
      <div className="mx-auto max-w-[1200px]">
        <p className="font-ui text-[11px] tracking-[0.06em] text-warm-700">{programme.eyebrow}</p>
        <h2
          className="mt-3 font-display text-ink-900"
          style={{ fontSize: "clamp(2rem,4.4vw,3.25rem)", fontWeight: 300, lineHeight: 1.02 }}
          dangerouslySetInnerHTML={{ __html: programme.headline }}
        />
        {programme.sub && (
          <p className="mt-5 max-w-[60ch] font-body text-[16px] text-ink-600">{programme.sub}</p>
        )}

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {programme.core.map((c, i) => (
            <motion.div
              key={c.n}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, delay: i * 0.05, ease: [0.25, 0.1, 0.25, 1] }}
              className="rounded-[20px] bg-white p-6 shadow-[0_14px_32px_-22px_rgba(20,20,20,0.25)]"
              style={{ border: "1px solid rgba(20,20,20,0.05)" }}
            >
              <div className="flex items-center justify-between">
                <p className="font-ui text-[11px] uppercase tracking-[0.24em] text-warm-700">
                  Subject {c.n}
                </p>
                {c.isNew && (
                  <span
                    className="rounded-full px-2.5 py-0.5 font-ui text-[9px] uppercase tracking-[0.18em]"
                    style={{ background: "#4E5D3F", color: "#FDFBF6" }}
                  >
                    New
                  </span>
                )}
              </div>
              <p
                className="mt-3 font-display italic text-ink-900"
                style={{ fontSize: 20, fontWeight: 300, lineHeight: 1.15 }}
                dangerouslySetInnerHTML={{ __html: c.title }}
              />
              <p className="mt-3 font-body text-[14px] leading-relaxed text-ink-600">
                {c.tagline}
              </p>
            </motion.div>
          ))}
        </div>

        {programme.outcomesStrip && (
          <div
            className="mt-10 rounded-[18px] px-6 py-5"
            style={{ background: "#14120F", color: "#FDFBF6" }}
          >
            <p
              className="font-display italic"
              style={{ fontSize: "clamp(1rem,1.8vw,1.25rem)", fontWeight: 300, lineHeight: 1.35 }}
              dangerouslySetInnerHTML={{ __html: `After year one, ${programme.outcomesStrip}` }}
            />
          </div>
        )}

        <div className="mt-16">
          <p className="font-ui text-[11px] tracking-[0.06em] text-warm-700">
            Electives — pick one
          </p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {programme.electives.map((e) => (
              <div
                key={e.title}
                className="rounded-[18px] p-6"
                style={{ background: "rgba(253,251,246,0.7)", border: "1px solid rgba(20,20,20,0.08)" }}
              >
                <p className="font-display italic text-ink-900" style={{ fontSize: 22, fontWeight: 300 }}>
                  {e.title}
                </p>
                <p
                  className="mt-2 font-body text-[14px] leading-relaxed text-ink-600"
                  dangerouslySetInnerHTML={{ __html: e.blurb }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-[1.2fr,1fr]">
          <div>
            <p className="font-ui text-[11px] tracking-[0.06em] text-warm-700">
              {programme.outcomesEyebrow ?? "What you\u2019ll carry out"}
            </p>
            {programme.outcomesHeadline && (
              <p
                className="mt-2 font-display italic text-ink-900"
                style={{ fontSize: 22, fontWeight: 300 }}
              >
                {programme.outcomesHeadline}
              </p>
            )}
            <ul className="mt-4 space-y-3">
              {programme.outcomes.map((o) => (
                <li key={o} className="flex gap-3 font-body text-[15px] text-ink-900">
                  <span className="mt-[9px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-warm-500" />
                  <span dangerouslySetInnerHTML={{ __html: o }} />
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-5">
            <div
              className="rounded-[20px] p-6"
              style={{ background: "rgba(253,251,246,0.7)", border: "1px solid rgba(20,20,20,0.08)" }}
            >
              <p className="font-ui text-[11px] tracking-[0.06em] text-warm-700">
                Year two
              </p>
              <p
                className="mt-3 font-display italic text-ink-900"
                style={{ fontSize: 20, fontWeight: 300, lineHeight: 1.25 }}
                dangerouslySetInnerHTML={{ __html: programme.yearTwoNote }}
              />
            </div>
            {programme.credentialNote && (
              <div
                className="rounded-[20px] p-6"
                style={{ background: "rgba(253,251,246,0.7)", border: "1px solid rgba(20,20,20,0.08)" }}
              >
                <p
                  className="font-body text-[14px] leading-relaxed text-ink-600"
                  dangerouslySetInnerHTML={{ __html: programme.credentialNote }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- FACULTY (L) ---------------------------- */

function FacultyWall({
  facultyIntro,
  faculty,
}: {
  facultyIntro: CollegeData["facultyIntro"];
  faculty: CollegeData["faculty"];
}) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faculty" className="px-6 py-28 sm:px-10" style={{ background: "#F7F1E6" }}>
      <div className="mx-auto max-w-[1200px]">
        <p className="font-ui text-[11px] tracking-[0.06em] text-warm-700">{facultyIntro.eyebrow}</p>
        <h2
          className="mt-3 font-display text-ink-900"
          style={{ fontSize: "clamp(2rem,4.4vw,3.25rem)", fontWeight: 300, lineHeight: 1.02 }}
          dangerouslySetInnerHTML={{ __html: facultyIntro.headline }}
        />
        <p className="mt-5 max-w-[60ch] font-body text-[16px] text-ink-600">
          {facultyIntro.body}
        </p>
        <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-6" style={{ maxWidth: "1080px" }}>
          {faculty.map((f, i) => {
            const initials = f.name
              .split(/\s+/)
              .map((w) => w[0])
              .slice(0, 2)
              .join("")
              .toUpperCase();
            const hasPhoto = !!f.photo && !f.photo.endsWith("placeholder");
            return (
              <button
                key={f.name}
                type="button"
                onClick={() => setOpen(i)}
                className="group overflow-hidden rounded-[18px] bg-white text-left shadow-[0_14px_30px_-20px_rgba(20,20,20,0.25)]"
                style={{ border: "1px solid rgba(20,20,20,0.05)" }}
              >
                <div
                  className="relative aspect-[3/4] w-full overflow-hidden"
                  style={!hasPhoto ? { background: "#EDE4D3" } : undefined}
                >
                  {hasPhoto ? (
                    <Image
                      src={f.photo}
                      alt={f.name}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 50vw, 17vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span
                        className="font-display"
                        style={{ color: "#A83D2E", fontSize: "clamp(48px,8vw,96px)", fontWeight: 300, letterSpacing: "-0.02em" }}
                      >
                        {initials}
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p
                    className="font-display italic text-ink-900"
                    style={{ fontSize: 17, fontWeight: 300, lineHeight: 1.2 }}
                  >
                    {f.name}
                  </p>
                  <p
                    className="mt-1 font-ui text-[11px] uppercase tracking-[0.2em] text-warm-700"
                    dangerouslySetInnerHTML={{ __html: f.discipline }}
                  />
                </div>
              </button>
            );
          })}
        </div>
        <p className="mt-6 font-body text-[14px] text-ink-600">
          Subject lecturers announced through 2026.
        </p>
      </div>
      {open !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/70 p-4"
          onClick={() => setOpen(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[520px] overflow-hidden rounded-[22px] bg-cream"
          >
            <div className="relative aspect-[4/3] w-full" style={!faculty[open].photo || faculty[open].photo.endsWith("placeholder") ? { background: "#EDE4D3" } : undefined}>
              {faculty[open].photo && !faculty[open].photo.endsWith("placeholder") ? (
                <Image
                  src={faculty[open].photo}
                  alt={faculty[open].name}
                  fill
                  unoptimized
                  sizes="100vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span
                    className="font-display"
                    style={{ color: "#A83D2E", fontSize: 140, fontWeight: 300 }}
                  >
                    {faculty[open].name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="p-6">
              <p className="font-display italic text-ink-900" style={{ fontSize: 26, fontWeight: 300 }}>
                {faculty[open].name}
              </p>
              <p
                className="mt-1 font-ui text-[12px] uppercase tracking-[0.2em] text-warm-700"
                dangerouslySetInnerHTML={{ __html: faculty[open].discipline }}
              />
              <p className="mt-4 font-body text-[15px] leading-relaxed text-ink-900">
                {faculty[open].bio}
              </p>
              <button
                type="button"
                onClick={() => setOpen(null)}
                className="mt-6 rounded-full bg-ink-900 px-5 py-2.5 font-ui text-[13px] text-cream"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* --------------------------- CAMPUS EXPERIENCE (kept, not rendered) ----- */

function CampusExperience({ experience }: { experience: CollegeData["experience"] }) {
  return (
    <section className="px-6 py-28 sm:px-10" style={{ background: "#F7F1E6" }}>
      <div className="mx-auto max-w-[900px]">
        <p className="font-ui text-[11px] tracking-[0.06em] text-warm-700">Campus experience</p>
        <h2
          className="mt-3 font-display text-ink-900"
          style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}
        >
          A day in the <em className="italic">life</em>.
        </h2>
        <p className="mt-5 max-w-[58ch] font-body text-[16px] text-ink-600">
          Every student is embedded at a local Futures campus for practicum. Real responsibilities,
          real mentors, real rhythm.
        </p>
        <ol className="mt-10 space-y-5">
          {experience.map((e) => (
            <li key={e.t} className="flex items-baseline gap-6 border-b border-ink-900/10 pb-5">
              <span className="w-16 flex-shrink-0 font-ui text-[13px] uppercase tracking-[0.2em] text-warm-700">
                {e.t}
              </span>
              <span
                className="font-display italic text-ink-900"
                style={{ fontSize: 20, fontWeight: 300 }}
                dangerouslySetInnerHTML={{ __html: e.label }}
              />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------- OUTCOMES (kept, not rendered) ----------- */

function CollegeOutcomes({ outcomes }: { outcomes: CollegeData["outcomes"] }) {
  return (
    <section className="px-6 py-28 sm:px-10" style={{ background: "#F7F1E6" }}>
      <div className="mx-auto max-w-[1100px]">
        <p className="font-ui text-[11px] tracking-[0.06em] text-warm-700">In their words</p>
        <h2
          className="mt-3 font-display text-ink-900"
          style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}
        >
          In their <em className="italic">words</em>.
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {outcomes.stats.map((s) => (
            <GlassCard key={s.label} className="p-6 text-center">
              <p
                className="font-display text-warm-700"
                style={{ fontSize: 44, fontWeight: 300, lineHeight: 1 }}
              >
                {s.value}
              </p>
              <p className="mt-2 font-ui text-[12px] uppercase tracking-[0.2em] text-ink-600">
                {s.label}
              </p>
            </GlassCard>
          ))}
        </div>
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
          {outcomes.alumni.map((a) => (
            <GlassCard key={a.name} className="p-6">
              <p
                className="font-display italic text-ink-900"
                style={{ fontSize: 22, fontWeight: 300 }}
                dangerouslySetInnerHTML={{ __html: `&ldquo;${a.quote}&rdquo;` }}
              />
              <p className="mt-4 font-ui text-[12px] uppercase tracking-[0.2em] text-warm-700">
                {a.name}
              </p>
              <p className="mt-1 font-body text-[14px] text-ink-600">{a.now}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- TUITION & AID (N) ------------------------- */

function TuitionAndAid({ tuition }: { tuition: CollegeData["tuition"] }) {
  return (
    <section id="tuition" className="px-6 py-28 sm:px-10" style={{ background: "#F7F0E4" }}>
      <div className="mx-auto max-w-[1100px]">
        <div
          className="mb-8 flex flex-wrap items-center gap-3 rounded-[14px] px-5 py-4"
          style={{ background: "rgba(200,154,60,0.12)", border: "1px solid rgba(200,154,60,0.35)" }}
        >
          <span className="font-ui text-[11px] font-semibold uppercase tracking-[0.2em]" style={{ color: "#C89A3C" }}>
            Founder&rsquo;s Circle
          </span>
          <span className="font-body text-[14px] text-ink-700">
            Code <strong className="font-medium">FOUNDER500</strong> — $500 off the 2026 intake. First 100 applicants. Closes 29 May.
          </span>
          <a href="#founders-circle" className="ml-auto font-ui text-[11px] uppercase tracking-[0.18em] text-warm-700 hover:text-ink-900 transition-colors">
            Claim it →
          </a>
        </div>
        {/* Compact fee strip */}
        <div
          className="mb-12 flex flex-wrap items-center justify-between gap-4 rounded-[18px] px-6 py-5"
          style={{ background: "#EDE4D3", border: "1px solid rgba(20,20,20,0.08)" }}
        >
          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2">
            <span className="font-display italic text-ink-900" style={{ fontSize: 22, fontWeight: 300 }}>
              ${tuition.year1.toLocaleString()}
              <span className="ml-2 font-ui text-[11px] uppercase tracking-[0.2em] text-warm-700">Year one</span>
            </span>
            <span className="font-ui text-[11px] uppercase tracking-[0.2em] text-ink-600">
              Need-based aid up to 60%
            </span>
            <span className="font-ui text-[11px] uppercase tracking-[0.2em] text-ink-600">
              Merit up to 40%
            </span>
            <span className="font-ui text-[11px] uppercase tracking-[0.2em] text-ink-600">
              Sponsored: 25–100%
            </span>
          </div>
          <span
            className="font-ui text-[11px] uppercase tracking-[0.2em]"
            style={{ color: "#A83D2E" }}
          >
            Typical out-of-pocket · $6,800 / year
          </span>
        </div>

        <p className="font-ui text-[11px] tracking-[0.06em] text-warm-700">Tuition &amp; aid</p>
        <h2
          className="mt-3 font-display text-ink-900"
          style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}
        >
          The <em className="italic">cost</em>, honestly.
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <GlassCard className="p-8">
            <p className="font-ui text-[11px] uppercase tracking-[0.2em] text-ink-600">Year one</p>
            <p className="mt-2 font-display text-ink-900" style={{ fontSize: 44, fontWeight: 300 }}>
              ${tuition.year1.toLocaleString()}
            </p>
            <p className="mt-1 font-ui text-[12px] text-ink-600">{tuition.currency}</p>
          </GlassCard>
          <GlassCard className="p-8">
            <p className="font-ui text-[11px] uppercase tracking-[0.2em] text-ink-600">Year two</p>
            <p className="mt-2 font-display text-ink-900" style={{ fontSize: 44, fontWeight: 300 }}>
              ${tuition.year2.toLocaleString()}
            </p>
            <p className="mt-1 font-ui text-[12px] text-ink-600">{tuition.currency}</p>
          </GlassCard>
        </div>
        <ul className="mt-8 space-y-3 font-body text-[15px] text-ink-600">
          {tuition.notes.map((n) => (
            <li key={n} className="flex gap-3">
              <span className="mt-[9px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-warm-500" />
              <span>{n}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* --------------------------- ENROLLMENT WINDOW (O) ---------------------- */

function EnrollmentWindow({ enrollment }: { enrollment: CollegeData["enrollment"] }) {
  const closeDate = new Date(`${enrollment.close}T23:59:59`);
  const earlyDate = new Date(`${enrollment.earlyBird}T23:59:59`);

  function fmt(d: Date) {
    return d.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
  }

  return (
    <section className="px-6 py-28 sm:px-10" style={{ background: "#1C1A17", color: "#FDFBF6" }}>
      <div className="mx-auto max-w-[1100px]">
        <p className="font-ui text-[11px] tracking-[0.06em]" style={{ color: "#D9B089" }}>
          {enrollment.eyebrow}
        </p>
        <h2
          className="mt-4 font-display italic"
          style={{ fontSize: "clamp(2rem,4.4vw,3.25rem)", fontWeight: 300, lineHeight: 1.02 }}
          dangerouslySetInnerHTML={{ __html: enrollment.headline }}
        />
        <p className="mt-5 max-w-[54ch] font-body text-[16px] opacity-85"
          dangerouslySetInnerHTML={{ __html: enrollment.sub }}
        />

        <div className="mt-10 grid max-w-[520px] grid-cols-1 gap-5 sm:grid-cols-2">
          <div
            className="rounded-2xl p-6"
            style={{ background: "rgba(253,251,246,0.06)", border: "1px solid rgba(253,251,246,0.14)" }}
          >
            <p className="font-ui text-[11px] uppercase tracking-[0.22em] opacity-70">Early-bird closes</p>
            <p className="mt-3 font-display italic" style={{ fontSize: 24, fontWeight: 300, lineHeight: 1.15 }}>
              {fmt(earlyDate)}
            </p>
          </div>
          <div
            className="rounded-2xl p-6"
            style={{ background: "rgba(253,251,246,0.06)", border: "1px solid rgba(253,251,246,0.14)" }}
          >
            <p className="font-ui text-[11px] uppercase tracking-[0.22em] opacity-70">Enrollment closes</p>
            <p className="mt-3 font-display italic" style={{ fontSize: 24, fontWeight: 300, lineHeight: 1.15 }}>
              {fmt(closeDate)}
            </p>
          </div>
        </div>

        {enrollment.infoNights && enrollment.infoNights.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-3">
            {enrollment.infoNights.map((n) => (
              <div
                key={n.label}
                className="rounded-xl px-5 py-3"
                style={{ background: "rgba(253,251,246,0.06)", border: "1px solid rgba(253,251,246,0.14)" }}
              >
                <p className="font-ui text-[11px] uppercase tracking-[0.22em] opacity-70">{n.label}</p>
                <p className="mt-1 font-display italic" style={{ fontSize: 18, fontWeight: 300 }}>{n.date}</p>
              </div>
            ))}
          </div>
        )}

        {enrollment.paths && enrollment.paths.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {enrollment.paths.map((p) => (
              <div
                key={p.stream}
                className="flex flex-col rounded-[20px] p-6"
                style={{ background: "rgba(253,251,246,0.06)", border: "1px solid rgba(253,251,246,0.14)" }}
              >
                <p className="font-ui text-[11px] uppercase tracking-[0.22em] opacity-70">{p.stream}</p>
                <p
                  className="mt-2 font-display italic"
                  style={{ fontSize: 22, fontWeight: 300, lineHeight: 1.1 }}
                >
                  {p.heading}
                </p>
                <p className="mt-3 font-body text-[14px] leading-relaxed opacity-75">{p.copy}</p>
                <a
                  href="#apply-form"
                  className="mt-6 inline-flex w-fit items-center gap-1 rounded-full px-4 py-2 font-ui text-[12px] transition-all hover:-translate-y-0.5"
                  style={{ background: "#FDFBF6", color: "#1C1A17" }}
                >
                  {p.cta} →
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="#apply-form"
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-ui text-[13px]"
              style={{ background: "#FDFBF6", color: "#1C1A17" }}
            >
              Come for the degree &rarr;
            </a>
            <a
              href="#apply-form"
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-ui text-[13px]"
              style={{ border: "1px solid rgba(253,251,246,0.4)", color: "#FDFBF6" }}
            >
              Come just to learn
            </a>
            <a
              href="#apply-form"
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-ui text-[13px]"
              style={{ border: "1px solid rgba(253,251,246,0.4)", color: "#FDFBF6" }}
            >
              Come live it
            </a>
          </div>
        )}

        {(enrollment.onlineNote || enrollment.infoNightNote) && (
          <div className="mt-8 flex flex-wrap gap-6">
            {enrollment.onlineNote && (
              <a href="#online-waitlist" className="font-body text-[14px] opacity-60 hover:opacity-100 transition-opacity"
                dangerouslySetInnerHTML={{ __html: enrollment.onlineNote + " →" }}
              />
            )}
            {enrollment.infoNightNote && (
              <a href="#apply" className="font-body text-[14px] opacity-60 hover:opacity-100 transition-opacity"
                dangerouslySetInnerHTML={{ __html: enrollment.infoNightNote + " →" }}
              />
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/* ----------------------------- FUTURES ONLINE (kept, not rendered) ------ */

function FuturesOnline({ online }: { online: CollegeData["online"] }) {
  return (
    <section id="online-waitlist" className="px-6 py-28 sm:px-10" style={{ background: "#F7F1E6" }}>
      <div className="mx-auto max-w-[1100px]">
        <p className="font-ui text-[11px] tracking-[0.06em] text-warm-700">
          {online.eyebrow}
        </p>
        <h2
          className="mt-3 font-display text-ink-900"
          style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}
          dangerouslySetInnerHTML={{ __html: online.headline }}
        />
        <p className="mt-5 font-ui text-[12px] uppercase tracking-[0.22em] text-warm-700">
          {online.launch}
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          <GlassCard className="p-6">
            <p className="font-ui text-[11px] uppercase tracking-[0.22em] text-warm-700">Includes</p>
            <ul className="mt-4 space-y-2">
              {online.includes.map((x) => (
                <li key={x} className="flex gap-3 font-body text-[15px] text-ink-900">
                  <span className="mt-[9px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-warm-500" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </GlassCard>
          <GlassCard className="p-6">
            <p className="font-ui text-[11px] uppercase tracking-[0.22em] text-warm-700">Does not include</p>
            <ul className="mt-4 space-y-2">
              {online.excludes.map((x) => (
                <li key={x} className="flex gap-3 font-body text-[15px] text-ink-600">
                  <span className="mt-[9px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-ink-900/20" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </GlassCard>
        </div>

        <div className="mt-10 max-w-[560px]">
          <ValueExchangeForm
            source="college-online-waitlist"
            offer="Join the Futures Online waitlist. Be first in when it opens in 2026."
            proofPoints={[
              "All 8 core subjects, self-paced",
              "Full notes + community access",
              "First cohort pricing",
            ]}
            fields={["email"]}
            cta={online.cta.label}
            outcome="We&rsquo;ll email you the moment enrollment opens."
          />
        </div>
      </div>
    </section>
  );
}

/* ---------------------------- CLOSING STATEMENT ------------------------- */

function ClosingStatement({
  closing,
  cta,
}: {
  closing: string;
  cta?: CtaLink;
}) {
  // Pre-quiz, route to apply form. Post-quiz, route to /quiz. JSON drives.
  const action =
    cta ?? { label: "Apply before 29 May \u2192", href: "#apply-form" };

  return (
    <section className="px-6 py-28 sm:px-10" style={{ background: "#1C1A17" }}>
      <div className="mx-auto max-w-[860px] text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          className="font-display italic"
          style={{
            fontSize: "clamp(1.5rem,3.4vw,2.5rem)",
            fontWeight: 300,
            lineHeight: 1.35,
            color: "#E8C9A6",
          }}
          dangerouslySetInnerHTML={{ __html: closing }}
        />
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-10 flex justify-center"
        >
          <a
            href={action.href}
            onClick={() =>
              analytics.applyIntent({ source: "closing_manifesto" })
            }
            className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-ui text-[13px] tracking-[0.02em] transition-all hover:-translate-y-0.5"
            style={{
              background: "#A83D2E",
              color: "#FDFBF6",
              boxShadow:
                "0 16px 36px -12px rgba(168,61,46,0.55), inset 0 1.5px 0 rgba(255,255,255,0.28)",
            }}
            dangerouslySetInnerHTML={{ __html: action.label }}
          />
        </motion.div>
      </div>
    </section>
  );
}

/* ---------------------------------- FAQ (P) ----------------------------- */

function CollegeFAQ({ faq }: { faq: CollegeData["faq"] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <section id="faq" className="px-6 py-28 sm:px-10" style={{ background: "#F7F1E6" }}>
      <div className="mx-auto max-w-[900px]">
        <p className="font-ui text-[11px] tracking-[0.06em] text-warm-700">Good questions</p>
        <h2
          className="mt-3 font-display text-ink-900"
          style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}
        >
          Here&rsquo;s what people ask before they say <em className="italic">yes</em>.
        </h2>
        <ul className="mt-10 divide-y divide-ink-900/10">
          {faq.map((f, i) => {
            const open = openIdx === i;
            return (
              <li key={f.q}>
                <button
                  type="button"
                  onClick={() => setOpenIdx(open ? null : i)}
                  className="flex w-full items-start justify-between gap-6 py-5 text-left"
                  aria-expanded={open}
                >
                  <span
                    className="font-display italic text-ink-900"
                    style={{ fontSize: 20, fontWeight: 300, lineHeight: 1.25 }}
                    dangerouslySetInnerHTML={{ __html: f.q }}
                  />
                  <span
                    className="mt-1 flex-shrink-0 font-ui text-[20px] text-warm-700 transition-transform"
                    style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
                    aria-hidden
                  >
                    +
                  </span>
                </button>
                {open && (
                  <div
                    className="pb-6 pr-10 font-body text-[15px] leading-relaxed text-ink-600"
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

/* ------------------------------ APPLY FORMS (Q) ------------------------- */

function CollegeApplyStageOne({ onSubmit }: { onSubmit: () => void }) {
  return (
    <section id="apply-form" className="px-6 py-24 sm:px-10" style={{ background: "#F7F1E6" }}>
      <div className="mx-auto max-w-[560px]">
        <ValueExchangeForm
          source="college-interest"
          offer="Get the full course book + an invite to the next virtual open house."
          proofPoints={[
            "Everything you need before you apply",
            "Zero commitment",
            "Book + open house calendar",
          ]}
          fields={["email", "lifeStage"]}
          cta="Send me the book"
          outcome="The book lands in your inbox within 90 seconds. Open house invite follows."
          onSuccess={onSubmit}
        />
      </div>
    </section>
  );
}

/* --------------------------- SINGLE SUBJECT CTA (Q) --------------------- */

function SingleSubjectCTA() {
  return (
    <section className="px-6 py-10 sm:px-10" style={{ background: "#F7F1E6" }}>
      <div className="mx-auto max-w-[560px] text-center">
        <p className="font-body text-[15px] text-ink-600">
          Not ready for a full year?{" "}
          <a href="#apply-form" className="font-medium text-warm-700 underline underline-offset-4 hover:text-ink-900">
            Start with one subject →
          </a>
          {"  "}Or{" "}
          <button
            className="font-medium text-warm-700 underline underline-offset-4 hover:text-ink-900"
            onClick={() => {
              document.getElementById("claim-block")?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            gift a subject to someone you love
          </button>
          .
        </p>
      </div>
    </section>
  );
}

const VISIT_DAYS = Array.from({ length: 14 }).map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + 7 + i);
  return d.toISOString().slice(0, 10);
});

function VisitBooking() {
  const [selected, setSelected] = useState<string | null>(null);
  const days = useMemo(() => VISIT_DAYS, []);
  return (
    <section id="campus-visit" className="px-6 py-24 sm:px-10" style={{ background: "#F7F1E6" }}>
      <div className="mx-auto max-w-[900px]">
        <p className="font-ui text-[11px] tracking-[0.06em] text-warm-700">Come see it</p>
        <h2
          className="mt-3 font-display text-ink-900"
          style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}
        >
          Pick a <em className="italic">day</em>.
        </h2>
        <div className="mt-10 grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-7">
          {days.map((d) => {
            const date = new Date(`${d}T00:00:00`);
            const active = selected === d;
            return (
              <button
                key={d}
                type="button"
                onClick={() => setSelected(d)}
                className={`rounded-2xl border p-3 text-center transition ${
                  active
                    ? "border-ink-900 bg-ink-900 text-cream"
                    : "border-ink-900/10 bg-white/70 text-ink-900 hover:bg-white"
                }`}
              >
                <p className="font-ui text-[10px] uppercase tracking-[0.2em] opacity-70">
                  {date.toLocaleDateString(undefined, { weekday: "short" })}
                </p>
                <p className="mt-1 font-display italic" style={{ fontSize: 22, fontWeight: 300 }}>
                  {date.getDate()}
                </p>
                <p className="font-ui text-[10px] opacity-70">
                  {date.toLocaleDateString(undefined, { month: "short" })}
                </p>
              </button>
            );
          })}
        </div>
        {selected && (
          <div className="mt-8 max-w-[520px]">
            <ValueExchangeForm
              source="college-visit"
              offer={`Book your campus tour for ${new Date(`${selected}T00:00:00`).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}.`}
              proofPoints={["60-min walkthrough + Q&A", "Meet a current student", "Coffee on us"]}
              fields={["name", "email"]}
              cta="Confirm visit"
              outcome="We'll email you a calendar invite within a few hours."
            />
            <p className="mt-3 font-ui text-[12px] text-ink-600">
              Google Calendar invite wires up post-launch &middot; confirmation is captured now.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

/* ---------------------------- TWO-PATH BAR (kept, not rendered) --------- */

function TwoPathBar() {
  const [path, setPath] = useState<"prospective" | "current" | null>(null);

  return (
    <div
      className="border-b border-ink-900/10 px-6 py-4 sm:px-10"
      style={{ background: "#F7F1E6" }}
    >
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-3">
        <span className="font-ui text-[11px] uppercase tracking-[0.2em] text-ink-500">I am</span>
        <button
          onClick={() => setPath("prospective")}
          className={`rounded-full px-4 py-1.5 font-ui text-[11px] uppercase tracking-[0.18em] transition-colors ${
            path === "prospective"
              ? "bg-ink-900 text-cream"
              : "border border-ink-900/15 text-ink-600 hover:border-ink-900/30"
          }`}
        >
          Prospective student
        </button>
        <button
          onClick={() => setPath("current")}
          className={`rounded-full px-4 py-1.5 font-ui text-[11px] uppercase tracking-[0.18em] transition-colors ${
            path === "current"
              ? "bg-ink-900 text-cream"
              : "border border-ink-900/15 text-ink-600 hover:border-ink-900/30"
          }`}
        >
          Current student
        </button>
        {path === "current" && (
          <span className="ml-2 rounded-xl border border-dashed border-warm-400/60 bg-warm-50/60 px-4 py-1.5 font-ui text-[11px] text-warm-600">
            ⚠ Student portal coming — complete <strong>Section L</strong> of staff questionnaire for portal URL.
          </span>
        )}
        {path === "prospective" && (
          <a
            href="#apply-form"
            className="ml-2 rounded-full bg-warm-600 px-4 py-1.5 font-ui text-[11px] uppercase tracking-[0.18em] text-cream transition-colors hover:bg-warm-700"
          >
            Get the course book →
          </a>
        )}
      </div>
    </div>
  );
}

/* --------------------------- ACADEMIC CALENDAR (kept, not rendered) ------ */

function AcademicCalendar() {
  return (
    <section className="border-t border-ink-900/10 px-6 py-16 sm:px-10" style={{ background: "#F7F1E6" }}>
      <div className="mx-auto max-w-[900px]">
        <p className="font-ui text-[11px] uppercase tracking-[0.28em] text-warm-600">Academic calendar</p>
        <h2
          className="mt-3 font-display text-ink-900"
          style={{ fontSize: "clamp(1.75rem,3.4vw,2.5rem)", fontWeight: 300, lineHeight: 1.1 }}
        >
          Key dates.
        </h2>

        <div className="mt-6 rounded-xl border border-dashed border-warm-400/60 bg-warm-50/50 px-5 py-4">
          <p className="font-ui text-[11px] uppercase tracking-[0.2em] text-warm-600">⚠ Staff action required</p>
          <p className="mt-1 font-sans text-ink-500" style={{ fontSize: 13 }}>
            Add term dates, assessment deadlines, orientation day, and chapel schedule — complete <strong>Section L</strong> of the staff questionnaire.
          </p>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { label: "Orientation", date: "PLACEHOLDER — Week of Sept 2026", tag: "Semester 1" },
            { label: "Term 1 begins", date: "PLACEHOLDER — exact date needed", tag: "Semester 1" },
            { label: "Assessment 1 due", date: "PLACEHOLDER — exact date needed", tag: "Semester 1" },
            { label: "Mid-semester break", date: "PLACEHOLDER — exact date needed", tag: "Semester 1" },
            { label: "Term 2 begins", date: "PLACEHOLDER — exact date needed", tag: "Semester 2" },
            { label: "Graduation & commissioning", date: "PLACEHOLDER — Month 2027", tag: "End of year" },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-dashed border-warm-400/50 bg-warm-50/40 p-5"
            >
              <span
                className="rounded-full px-2.5 py-0.5 font-ui text-[10px] uppercase tracking-[0.16em]"
                style={{ background: "rgba(28,26,23,0.07)", color: "#6B5E4E" }}
              >
                {item.tag}
              </span>
              <p className="mt-2 font-display text-ink-900" style={{ fontSize: 16, fontWeight: 400 }}>
                {item.label}
              </p>
              <p className="mt-1 font-ui text-[11px] italic text-warm-600">{item.date}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------- STUDENT HANDBOOK (kept, not rendered) ------- */

function StudentHandbook() {
  return (
    <section className="border-t border-ink-900/10 px-6 py-16 sm:px-10" style={{ background: "#F7F0E4" }}>
      <div className="mx-auto max-w-[640px]">
        <p className="font-ui text-[11px] uppercase tracking-[0.28em] text-warm-600">Student handbook</p>
        <h2
          className="mt-3 font-display text-ink-900"
          style={{ fontSize: "clamp(1.75rem,3.4vw,2.5rem)", fontWeight: 300, lineHeight: 1.1 }}
        >
          Everything you need to know.
        </h2>
        <p className="mt-4 font-sans text-ink-600" style={{ fontSize: 16, lineHeight: 1.65 }}>
          Policies, expectations, schedules, pastoral support structures, assessment rubrics —
          all in one place. Download before your first day.
        </p>
        <div className="mt-8">
          <ValueExchangeForm
            offer="Enter your details and we'll send the 2026 student handbook directly to your inbox."
            proofPoints={["Updated for 2026 cohort", "Includes assessment guides + pastoral support contacts"]}
            fields={["name", "email"]}
            cta="Download the handbook"
            outcome="The handbook PDF will arrive in your inbox within a few minutes."
            source="college-handbook"
          />
        </div>
        <p className="mt-3 font-ui text-[11px] text-warm-600">
          ⚠ Handbook PDF pending — complete <strong>Section L</strong> of the staff questionnaire.
        </p>
      </div>
    </section>
  );
}

/* --------------------------- VIRTUAL OPEN HOUSE (kept, not rendered) ---- */

function VirtualOpenHouse() {
  return (
    <section className="border-t border-ink-900/10 px-6 py-16 sm:px-10" style={{ background: "#F7F1E6" }}>
      <div className="mx-auto max-w-[900px]">
        <p className="font-ui text-[11px] uppercase tracking-[0.28em] text-warm-600">Virtual open house</p>
        <h2
          className="mt-3 font-display text-ink-900"
          style={{ fontSize: "clamp(1.75rem,3.4vw,2.5rem)", fontWeight: 300, lineHeight: 1.1 }}
        >
          Join us online.
          <br />
          <em className="italic">No travel required.</em>
        </h2>
        <p className="mt-4 max-w-[52ch] font-sans text-ink-600" style={{ fontSize: 16, lineHeight: 1.65 }}>
          60 minutes. Hear from Ashley and Jane. Meet current students. Ask anything.
          We run these monthly — pick a session that works for you.
        </p>

        <div className="mt-6 rounded-xl border border-dashed border-warm-400/60 bg-warm-50/50 px-5 py-4">
          <p className="font-ui text-[11px] uppercase tracking-[0.2em] text-warm-600">⚠ Staff action required</p>
          <p className="mt-1 font-sans text-ink-500" style={{ fontSize: 13 }}>
            Add Calendly (or equivalent) booking link for virtual open house sessions — complete <strong>Section L</strong> of the staff questionnaire.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {["Session 1 · May 2026", "Session 2 · June 2026", "Session 3 · July 2026"].map((label) => (
            <div
              key={label}
              className="rounded-2xl border border-dashed border-warm-400/50 bg-warm-50/40 p-6"
            >
              <p className="font-display text-ink-900" style={{ fontSize: 16, fontWeight: 400 }}>
                {label}
              </p>
              <p className="mt-2 font-ui text-[11px] italic text-warm-600">Date & time — PLACEHOLDER</p>
              <span className="mt-4 inline-block font-ui text-[11px] uppercase tracking-[0.16em] text-warm-500">
                ⚠ Booking link pending
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------- ADMISSIONS CHAT (kept, not rendered) -------- */

function AdmissionsChat() {
  return (
    <section className="border-t border-ink-900/10 px-6 py-12 sm:px-10" style={{ background: "#F7F0E4" }}>
      <div className="mx-auto max-w-[900px]">
        <div className="flex flex-col gap-6 rounded-2xl border border-ink-900/10 bg-white/60 p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-ui text-[11px] uppercase tracking-[0.2em] text-warm-600">Admissions</p>
            <h3
              className="mt-2 font-display text-ink-900"
              style={{ fontSize: "clamp(1.25rem,2.4vw,1.75rem)", fontWeight: 300 }}
            >
              Talk to a real person.
            </h3>
            <p className="mt-2 max-w-[44ch] font-sans text-ink-600" style={{ fontSize: 15, lineHeight: 1.6 }}>
              Our admissions team is available Monday–Friday, 9am–5pm ACST.
              Typical response time: under 2 hours.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:shrink-0 sm:items-end">
            <a
              href="mailto:college@futures.church"
              className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-6 py-2.5 font-ui text-[12px] tracking-[0.02em] text-cream transition-colors hover:bg-warm-600"
            >
              Email admissions →
            </a>
            <span className="rounded-xl border border-dashed border-warm-400/60 bg-warm-50/60 px-4 py-2 text-center font-ui text-[11px] text-warm-600">
              ⚠ Live chat widget pending — complete <strong>Section L</strong>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------- STICKY FOOTER BAR -------------------------- */

function StickyCtaBar() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 600);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const closeDate = new Date("2026-05-29T23:59:59");
  const daysLeft = Math.max(0, Math.ceil((closeDate.getTime() - Date.now()) / 86400000));
  return (
    <div
      className={`fixed top-0 inset-x-0 z-40 transition-transform duration-300 ${visible ? "translate-y-0" : "-translate-y-full"}`}
      style={{ background: "#1C1A17", color: "#FDFBF6", boxShadow: "0 8px 24px -12px rgba(0,0,0,0.4)" }}
    >
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-3 px-6 py-2.5 sm:px-10">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-ui text-[11px] uppercase tracking-[0.16em]">
          <span style={{ color: "#C89A3C" }} className="font-semibold">$500 off</span>
          <span className="opacity-50">·</span>
          <span>Code <strong className="font-medium" style={{ color: "#C89A3C" }}>FOUNDER500</strong></span>
          <span className="opacity-50 hidden sm:inline">·</span>
          <span className="opacity-70 hidden sm:inline">{daysLeft} days left</span>
        </div>
        <a
          href="#founders-circle"
          className="rounded-full px-4 py-1.5 font-ui text-[11px] uppercase tracking-[0.16em] transition-all hover:-translate-y-0.5"
          style={{ background: "#C89A3C", color: "#14120F" }}
        >
          Apply →
        </a>
      </div>
    </div>
  );
}

// Photo paths follow the punch-list §6 environmental-portrait direction.
// Set `photo` once real assets land at /photos/college/stories/<slug>.jpg —
// the render falls back to initial avatars while photo is undefined.
//   hannah-k.jpg — direction: on a worship platform, mid-rehearsal or service
//   marcus-t.jpg — direction: with his youth group
//   priya-n.jpg  — direction: at her desk in her marketing role, Bible visible
//   daniel-r.jpg — direction: on a Sunday at his Atlanta campus
const REAL_STORIES: Array<{
  name: string;
  role: string;
  stream: string;
  quote: string;
  photo?: string;
}> = [
  {
    name: "Hannah K.",
    role: "Worship Director · Adelaide",
    stream: "Internship",
    quote: "I came in thinking I'd learn to lead worship. I left being deployed to lead a team. There's a difference, and Futures knows it.",
  },
  {
    name: "Marcus T.",
    role: "Youth Pastor · Brisbane",
    stream: "Academic",
    quote: "I'd done three years of Bible college before this. Year one at Futures taught me more about actually doing ministry than all of it combined.",
  },
  {
    name: "Priya N.",
    role: "Marketing Director · Melbourne",
    stream: "Audit",
    quote: "I never thought I'd 'go to college' again at 38. The Audit stream let me sit in the room with the next generation of leaders. It changed how I see my work.",
  },
  {
    name: "Daniel R.",
    role: "Campus Pastor · Atlanta",
    stream: "Internship — graduated 2024",
    quote: "Two years after graduating I'm leading a campus. Eighteen months ago I was painting houses. The bridge between those two things was Futures.",
  },
];

function RealStories() {
  return (
    <section id="stories" className="px-6 py-24 sm:px-10" style={{ background: "#F2E6D1" }}>
      <div className="mx-auto max-w-[1200px]">
        <p className="font-ui text-[11px] tracking-[0.06em] text-warm-700">Real stories</p>
        <h2
          className="mt-3 font-display text-ink-900"
          style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}
        >
          Four people. <em className="italic">Four years on.</em>
        </h2>
        <p className="mt-5 max-w-[60ch] font-body text-[16px] text-ink-600">
          Real graduates. Real roles. Real photos and full names below — used with permission.
        </p>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {REAL_STORIES.map((s) => (
            <div
              key={s.name}
              className="flex flex-col rounded-[22px] bg-white p-7 shadow-[0_18px_40px_-22px_rgba(20,20,20,0.2)]"
              style={{ border: "1px solid rgba(20,20,20,0.06)" }}
            >
              <div className="flex items-start gap-4">
                {s.photo ? (
                  <div
                    className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full"
                    style={{ background: "#EDE4D3" }}
                  >
                    <Image
                      src={s.photo}
                      alt={s.name}
                      fill
                      unoptimized
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full"
                    style={{ background: "#EDE4D3" }}
                  >
                    <span className="font-display italic" style={{ fontSize: 22, fontWeight: 300, color: "#A83D2E" }}>{s.name.split(" ")[0][0]}</span>
                  </div>
                )}
                <div>
                  <p className="font-ui text-[12px] font-medium text-ink-900">{s.name}</p>
                  <p className="mt-0.5 font-ui text-[11px] uppercase tracking-[0.16em] text-warm-700">{s.role}</p>
                  <p className="mt-0.5 font-ui text-[10px] uppercase tracking-[0.18em] text-ink-500">{s.stream}</p>
                </div>
              </div>
              <p className="mt-5 font-display italic text-ink-900" style={{ fontSize: 17, fontWeight: 300, lineHeight: 1.4 }}>
                &ldquo;{s.quote}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function KeyDates() {
  return (
    <section id="key-dates" className="px-6 py-24 sm:px-10" style={{ background: "#F7F1E6" }}>
      <div className="mx-auto max-w-[1200px]">
        <p className="font-ui text-[11px] tracking-[0.06em] text-warm-700">Key dates · 2026</p>
        <h2
          className="mt-3 font-display text-ink-900"
          style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}
        >
          Mark your <em className="italic">calendar</em>.
        </h2>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <DateCard
            title="Early-bird closes"
            date="29 May 2026"
            note="$500 off with code FOUNDER500. First 100 applicants only."
            tone="urgent"
          />
          <DateCard
            title="Enrolment closes"
            date="15 August 2026"
            note="Final date to apply for Semester One 2026."
          />
          <DateCard
            title="Orientation week"
            date="7–11 September 2026"
            note="On campus, Adelaide & Atlanta. Welcome dinner Sunday 6 Sep."
          />
          <DateCard
            title="Semester One begins"
            date="14 September 2026"
            note="First lecture, Subject 01 — What's Wrong with the Church."
          />
          <DateCard
            title="Mid-semester break"
            date="19–23 October 2026"
            note="Optional cohort retreat — date TBC."
          />
          <DateCard
            title="Semester One ends"
            date="11 December 2026"
            note="Final assessments due 4 December. Commissioning service Friday 11 Dec."
          />
        </div>

        <div className="mt-16">
          <p className="font-ui text-[11px] tracking-[0.06em] text-warm-700">Virtual open house · Monthly</p>
          <h3
            className="mt-3 font-display text-ink-900"
            style={{ fontSize: "clamp(1.5rem,2.8vw,2rem)", fontWeight: 300, lineHeight: 1.1 }}
          >
            Come see it before you say <em className="italic">yes</em>.
          </h3>
          <p className="mt-4 max-w-[60ch] font-body text-[15px] text-ink-600">
            45-minute live walkthrough with Ps Jane Evans, a current student, and Q&A. Held the first Thursday of every month, 7pm AEST / 6am EDT.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#apply-form"
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-ui text-[12px] uppercase tracking-[0.18em] text-cream transition-all hover:-translate-y-0.5"
              style={{ background: "#A83D2E" }}
            >
              Reserve your spot →
            </a>
            <a
              href="#campus-visit"
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-ui text-[12px] uppercase tracking-[0.18em] text-ink-900 transition-all hover:-translate-y-0.5"
              style={{ background: "rgba(28,26,23,0.06)", border: "1px solid rgba(28,26,23,0.12)" }}
            >
              Or — book a campus visit
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function DateCard({ title, date, note, tone }: { title: string; date: string; note: string; tone?: "urgent" }) {
  const isUrgent = tone === "urgent";
  return (
    <div
      className="flex flex-col rounded-[20px] p-6"
      style={{
        background: isUrgent ? "rgba(168,61,46,0.06)" : "white",
        border: `1px solid ${isUrgent ? "rgba(168,61,46,0.2)" : "rgba(20,20,20,0.06)"}`,
        boxShadow: "0 14px 32px -22px rgba(20,20,20,0.16)",
      }}
    >
      <p
        className="font-ui text-[11px] uppercase tracking-[0.18em]"
        style={{ color: isUrgent ? "#A83D2E" : "#7A6A55" }}
      >
        {title}
      </p>
      <p
        className="mt-3 font-display italic text-ink-900"
        style={{ fontSize: 22, fontWeight: 300, lineHeight: 1.15 }}
      >
        {date}
      </p>
      <p className="mt-3 font-body text-[14px] leading-relaxed text-ink-600">{note}</p>
    </div>
  );
}

function StickyFooterBar() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 600);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{
        background: "rgba(20,18,15,0.96)",
        backdropFilter: "blur(10px)",
        borderTop: "1px solid rgba(253,251,246,0.12)",
        color: "#FDFBF6",
      }}
    >
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-8">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className="rounded-full px-3 py-1 font-ui text-[10px] uppercase tracking-[0.18em]"
            style={{ background: "#D43F2B", color: "#FDFBF6" }}
          >
            Early-bird closes 29 May
          </span>
          <span className="hidden font-ui text-[11px] uppercase tracking-[0.18em] opacity-80 sm:inline">
            Starts Sept 2026 · Alphacrucis-accredited
          </span>
        </div>
        <a
          href="#apply-form"
          onClick={() => analytics.applyIntent({ source: "sticky_footer" })}
          className="inline-flex items-center gap-2 rounded-full px-5 py-2 font-ui text-[12px] tracking-[0.02em] transition-all hover:-translate-y-0.5"
          style={{
            background: "#A83D2E",
            color: "#FDFBF6",
            boxShadow: "0 12px 28px -10px rgba(168,61,46,0.55)",
          }}
        >
          Apply before 29 May →
        </a>
      </div>
    </div>
  );
}

function CollegeApplyStageTwo() {
  return (
    <section className="px-6 py-24 sm:px-10" style={{ background: "#F2E6D1" }}>
      <div className="mx-auto max-w-[560px]">
        <p className="mb-4 font-ui text-[11px] uppercase tracking-[0.22em] text-warm-700">
          Stage 2 &middot; unlocked because you&rsquo;ve got the book
        </p>
        <ValueExchangeForm
          source="college-applicant"
          offer="Ready to apply? Start your application and get paired with an admissions advisor."
          proofPoints={[
            "A real admissions advisor, not a bot",
            "Weekly check-ins until you submit",
            "Interview prep included",
          ]}
          fields={["email", "name"]}
          cta="Start my application"
          outcome="Your admissions advisor will reach out within 48 hours."
        />
      </div>
    </section>
  );
}
