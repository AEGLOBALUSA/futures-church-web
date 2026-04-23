"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { AIInput } from "@/components/ai/AIInput";
import { GlassCard } from "@/components/ui/GlassCard";
import { Eyebrow, Hero, Sub } from "@/components/ui/Type";
import { ValueExchangeForm } from "@/components/forms/ValueExchangeForm";
import { useAIGuide } from "@/lib/ai/AIGuideContext";

type CollegeData = {
  hero: {
    eyebrow: string;
    headline: string;
    sub: string;
    facts: { value: string; label: string }[];
    accreditation: { label: string; name: string; logo: string };
  };
  hook: {
    eyebrow: string;
    headline: string;
    sub: string;
    sessions: { title: string; length: string; thumb: string; vimeo: string }[];
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
    hours: string;
    pitch: string;
    for: string;
    cta: { label: string; href: string };
  }[];
  programme: {
    eyebrow: string;
    headline: string;
    core: { n: string; title: string; tagline: string }[];
    electives: { title: string; blurb: string }[];
    outcomes: string[];
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
    earlyBird: string;
    close: string;
    sub: string;
  };
  online: {
    eyebrow: string;
    headline: string;
    includes: string[];
    excludes: string[];
    launch: string;
    cta: { label: string; href: string };
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

export function CollegePageClient({ data }: { data: CollegeData }) {
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
    <main className="bg-cream text-ink-900">
      <CollegeHero hero={data.hero} />
      <FreeSessions hook={data.hook} />
      <WhyNow whyNow={data.whyNow} />
      <ThreeStreams streams={data.streams} />
      <YearOneProgramme programme={data.programme} />
      <FacultyWall faculty={data.faculty} />
      <CampusExperience experience={data.experience} />
      <CollegeOutcomes outcomes={data.outcomes} />
      <TuitionAndAid tuition={data.tuition} />
      <EnrollmentWindow enrollment={data.enrollment} />
      <FuturesOnline online={data.online} />
      <CollegeFAQ faq={data.faq} />
      <CollegeApplyStageOne onSubmit={markStageOne} />
      <VisitBooking />
      {stageOneComplete && <CollegeApplyStageTwo />}
    </main>
  );
}

/* --------------------------------- HERO --------------------------------- */

function CollegeHero({ hero }: { hero: CollegeData["hero"] }) {
  return (
    <section
      id="apply"
      className="relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 80% 20%, #F2E6D1 0%, #E8C9A6 35%, #FDFBF6 85%)",
      }}
    >
      <div className="mx-auto max-w-[1440px] px-6 pb-28 pt-32 sm:px-10 sm:pt-40">
        <Eyebrow>{hero.eyebrow}</Eyebrow>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-4 max-w-[20ch]"
        >
          <Hero>
            Come <em className="italic">build</em>.
          </Hero>
        </motion.div>
        <Sub className="mt-6 max-w-[56ch]">{hero.sub}</Sub>

        <p className="mt-6 max-w-[60ch] font-body text-[15px]" style={{ color: "#8A7A6A" }}>
          An Alphacrucis-accredited year &mdash; built for leaders the world isn&rsquo;t ready for yet.
        </p>

        {/* Ask Milo */}
        <div className="mt-10 max-w-[620px]">
          <p className="mb-3 font-ui text-[12px] tracking-[0.06em] text-ink-600">Ask Milo</p>
          <GlassCard breathe className="p-6">
            <AIInput
              placeholder="Ask Milo anything about the college — streams, cost, a day in the life."
              chips={CHIPS}
              compact
            />
          </GlassCard>
        </div>

        {/* Accreditation lock-up */}
        <div className="mt-10 flex items-center gap-4">
          <p className="font-ui text-[11px] uppercase tracking-[0.24em] text-warm-700">
            {hero.accreditation.label}
          </p>
          <div className="relative h-8 w-40">
            <Image
              src={hero.accreditation.logo}
              alt={hero.accreditation.name}
              fill
              unoptimized
              sizes="160px"
              className="object-contain object-left"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- FREE SESSIONS ---------------------------- */

function FreeSessions({ hook }: { hook: CollegeData["hook"] }) {
  return (
    <section className="px-6 py-28 sm:px-10">
      <div className="mx-auto max-w-[1200px]">
        <p className="font-ui text-[11px] tracking-[0.06em] text-warm-700">{hook.eyebrow}</p>
        <h2
          className="mt-3 font-display text-ink-900"
          style={{ fontSize: "clamp(2rem,4.4vw,3.25rem)", fontWeight: 300, lineHeight: 1.02 }}
          dangerouslySetInnerHTML={{ __html: hook.headline }}
        />
        <p className="mt-5 max-w-[54ch] font-body text-[16px] text-ink-600">{hook.sub}</p>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {hook.sessions.map((s, i) => (
            <motion.a
              key={s.vimeo}
              href={`https://vimeo.com/${s.vimeo}`}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
              className="group flex flex-col overflow-hidden rounded-[22px] bg-white shadow-[0_18px_40px_-22px_rgba(20,20,20,0.3)]"
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
                <p className="mt-5 font-ui text-[12px] uppercase tracking-[0.22em] text-warm-700">
                  Unlock free session &rarr;
                </p>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- WHY NOW -------------------------------- */

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
          <div className="mt-10 flex items-baseline gap-5">
            <p
              className="font-display"
              style={{ fontSize: "clamp(3rem,6vw,5rem)", fontWeight: 300, lineHeight: 1, color: "#E8C9A6" }}
              dangerouslySetInnerHTML={{ __html: whyNow.stat.value }}
            />
            <p className="max-w-[22ch] font-ui text-[12px] uppercase tracking-[0.22em] opacity-75">
              {whyNow.stat.label}
            </p>
          </div>
          <p className="mt-8 max-w-[54ch] font-body text-[16px] leading-relaxed opacity-85">
            {whyNow.body}
          </p>
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

/* ----------------------------- THREE STREAMS ---------------------------- */

function ThreeStreams({ streams }: { streams: CollegeData["streams"] }) {
  return (
    <section id="streams" className="px-6 py-28 sm:px-10">
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

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
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
              <p className="mt-5 font-body text-[15px] leading-relaxed text-ink-900">
                {s.pitch}
              </p>
              <p className="mt-4 font-body text-[14px] leading-relaxed text-ink-600">
                {s.for}
              </p>
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

/* --------------------------- YEAR ONE PROGRAMME ------------------------- */

function YearOneProgramme({ programme }: { programme: CollegeData["programme"] }) {
  return (
    <section className="px-6 py-28 sm:px-10" style={{ background: "#F7F1E6" }}>
      <div className="mx-auto max-w-[1200px]">
        <p className="font-ui text-[11px] tracking-[0.06em] text-warm-700">{programme.eyebrow}</p>
        <h2
          className="mt-3 font-display text-ink-900"
          style={{ fontSize: "clamp(2rem,4.4vw,3.25rem)", fontWeight: 300, lineHeight: 1.02 }}
        >
          Eight subjects. Three electives. One <em className="italic">sending</em>.
        </h2>

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
              <p className="font-ui text-[11px] uppercase tracking-[0.24em] text-warm-700">
                Subject {c.n}
              </p>
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
              What you&rsquo;ll carry out
            </p>
            <ul className="mt-4 space-y-3">
              {programme.outcomes.map((o) => (
                <li key={o} className="flex gap-3 font-body text-[15px] text-ink-900">
                  <span className="mt-[9px] h-1.5 w-1.5 flex-shrink-0 rounded-full bg-warm-500" />
                  <span dangerouslySetInnerHTML={{ __html: o }} />
                </li>
              ))}
            </ul>
          </div>
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
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- FACULTY -------------------------------- */

function FacultyWall({ faculty }: { faculty: CollegeData["faculty"] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="px-6 py-28 sm:px-10">
      <div className="mx-auto max-w-[1200px]">
        <p className="font-ui text-[11px] tracking-[0.06em] text-warm-700">Faculty</p>
        <h2
          className="mt-3 font-display text-ink-900"
          style={{ fontSize: "clamp(2rem,4.4vw,3.25rem)", fontWeight: 300, lineHeight: 1.02 }}
        >
          The <em className="italic">family</em> teaching.
        </h2>
        <p className="mt-5 max-w-[54ch] font-body text-[16px] text-ink-600">
          Pastors, practitioners, and scholars. Additional subject lecturers announced through 2026.
        </p>
        <div className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
          {faculty.map((f, i) => (
            <button
              key={f.name}
              type="button"
              onClick={() => setOpen(i)}
              className="group overflow-hidden rounded-[18px] bg-white text-left shadow-[0_14px_30px_-20px_rgba(20,20,20,0.25)]"
              style={{ border: "1px solid rgba(20,20,20,0.05)" }}
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden">
                <Image
                  src={f.photo}
                  alt={f.name}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
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
          ))}
        </div>
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
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={faculty[open].photo}
                alt={faculty[open].name}
                fill
                unoptimized
                sizes="100vw"
                className="object-cover"
              />
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

/* --------------------------- CAMPUS EXPERIENCE -------------------------- */

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

/* ------------------------------- OUTCOMES ------------------------------- */

function CollegeOutcomes({ outcomes }: { outcomes: CollegeData["outcomes"] }) {
  return (
    <section className="px-6 py-28 sm:px-10">
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

/* ---------------------------- TUITION & AID ----------------------------- */

function TuitionAndAid({ tuition }: { tuition: CollegeData["tuition"] }) {
  return (
    <section className="px-6 py-28 sm:px-10" style={{ background: "#F7F1E6" }}>
      <div className="mx-auto max-w-[900px]">
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

/* --------------------------- ENROLLMENT WINDOW -------------------------- */

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
        <p className="mt-5 max-w-[54ch] font-body text-[16px] opacity-85">{enrollment.sub}</p>

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

        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href="#apply"
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-ui text-[13px]"
            style={{ background: "#FDFBF6", color: "#1C1A17" }}
          >
            Come for the degree &rarr;
          </a>
          <a
            href="#apply"
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-ui text-[13px]"
            style={{ border: "1px solid rgba(253,251,246,0.4)", color: "#FDFBF6" }}
          >
            Come just to learn
          </a>
          <a
            href="#apply"
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-ui text-[13px]"
            style={{ border: "1px solid rgba(253,251,246,0.4)", color: "#FDFBF6" }}
          >
            Come live it
          </a>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- FUTURES ONLINE --------------------------- */

function FuturesOnline({ online }: { online: CollegeData["online"] }) {
  return (
    <section id="online-waitlist" className="px-6 py-28 sm:px-10">
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

/* ---------------------------------- FAQ --------------------------------- */

function CollegeFAQ({ faq }: { faq: CollegeData["faq"] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <section className="px-6 py-28 sm:px-10" style={{ background: "#F7F1E6" }}>
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

/* ------------------------------ APPLY FORMS ----------------------------- */

function CollegeApplyStageOne({ onSubmit }: { onSubmit: () => void }) {
  return (
    <section className="px-6 py-24 sm:px-10">
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

const VISIT_DAYS = Array.from({ length: 14 }).map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() + 7 + i);
  return d.toISOString().slice(0, 10);
});

function VisitBooking() {
  const [selected, setSelected] = useState<string | null>(null);
  const days = useMemo(() => VISIT_DAYS, []);
  return (
    <section className="px-6 py-24 sm:px-10" style={{ background: "#F7F1E6" }}>
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
