"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { AIInput } from "@/components/ai/AIInput";
import { GlassCard } from "@/components/ui/GlassCard";
import { Eyebrow } from "@/components/ui/Type";
import { ValueExchangeForm } from "@/components/forms/ValueExchangeForm";
import { useAIGuide } from "@/lib/ai/AIGuideContext";

type PastorLink = { label: string; href: string };
type SeniorPastor = {
  slug: string;
  name: string;
  role: string;
  photo: string;
  bio: string[];
  books: string[];
  links: PastorLink[];
};

type CampusPastor = {
  name: string;
  role: string;
  photo: string;
  placeholder: boolean;
};

type CampusPastors = {
  slug: string;
  campusName: string;
  city: string;
  country: string;
  plantedYear: number;
  status: string;
  oneLine: string;
  pastors: CampusPastor[];
};

type ExecMember = {
  name: string;
  role: string;
  oneLine: string;
  photo: string;
  placeholder: boolean;
};

type MinistryLead = {
  slug: string;
  label: string;
  leaderName: string;
  leaderRole: string;
  photo: string;
  placeholder: boolean;
  href: string;
  oneLine: string;
};

type LeadersData = {
  senior: SeniorPastor[];
  campusPastors: CampusPastors[];
  executive: ExecMember[];
  ministryLeads: MinistryLead[];
};

const CHIPS = [
  "tell me about Ashley & Jane",
  "who's the pastor at my closest campus?",
  "show me the global team",
  "who leads bU Women?",
  "who leads Dreamers?",
  "can I meet a pastor before visiting?",
];

export function LeadersPageClient({ data }: { data: LeadersData }) {
  const { setPageContext } = useAIGuide();
  useEffect(() => setPageContext("leaders"), [setPageContext]);

  return (
    <main className="bg-cream text-ink-900">
      <LeadersHero />
      <SeniorPastorsSection pastors={data.senior} />
      <CampusPastorsGrid campuses={data.campusPastors} />
      <ExecutiveTeam team={data.executive} />
      <MinistryLeads leads={data.ministryLeads} />
      <LeadersCTA />
    </main>
  );
}

function LeadersHero() {
  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-32 sm:px-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 80% 10%, rgba(204,143,74,0.12), transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-[1200px]">
        <Eyebrow>LEADERSHIP &middot; ALL CAMPUSES &middot; ALL MINISTRIES</Eyebrow>
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
          The <em className="italic">people</em> behind twenty-one churches.
        </motion.h1>
        <p className="mt-6 max-w-[54ch] font-body text-[18px] leading-relaxed text-ink-600">
          Real pastors. Real names. Real stories.
        </p>
        <div className="mt-10 max-w-[620px]">
          <GlassCard breathe className="p-5">
            <AIInput placeholder="Ask about a pastor or campus&hellip;" chips={CHIPS} compact />
          </GlassCard>
        </div>
      </div>
    </section>
  );
}

function SeniorPastorsSection({ pastors }: { pastors: SeniorPastor[] }) {
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
              id={p.slug}
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
              <div className="p-8">
                <p
                  className="font-display text-ink-900"
                  style={{ fontSize: 32, fontWeight: 300, lineHeight: 1.02 }}
                >
                  {p.name}
                </p>
                <p className="mt-1 font-ui text-[11px] uppercase tracking-[0.24em] text-warm-700">
                  {p.role}
                </p>
                <div className="mt-5 space-y-4 font-body text-[15px] leading-relaxed text-ink-600">
                  {p.bio.map((para, i) => (
                    <p key={i} dangerouslySetInnerHTML={{ __html: para }} />
                  ))}
                </div>
                {p.books.length > 0 && (
                  <div className="mt-6">
                    <p className="font-ui text-[11px] uppercase tracking-[0.24em] text-warm-700">
                      Books
                    </p>
                    <ul className="mt-3 space-y-2 font-body text-[14px] italic text-ink-600">
                      {p.books.map((b) => (
                        <li key={b}>&ldquo;{b}&rdquo;</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="mt-7 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => window.dispatchEvent(new Event("futures:open-dock"))}
                    className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-5 py-2.5 font-ui text-[13px] text-cream transition-transform hover:-translate-y-0.5"
                  >
                    Ask a question &rarr;
                  </button>
                  {p.links.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      className="inline-flex items-center gap-2 rounded-full border border-ink-900/10 px-5 py-2.5 font-ui text-[13px] text-ink-600 transition-colors hover:border-warm-500 hover:text-ink-900"
                    >
                      {l.label}
                    </a>
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

function CampusPastorsGrid({ campuses }: { campuses: CampusPastors[] }) {
  const countries = useMemo(
    () => ["All", ...Array.from(new Set(campuses.map((c) => c.country)))],
    [campuses]
  );
  const [country, setCountry] = useState("All");
  const filtered = useMemo(
    () => (country === "All" ? campuses : campuses.filter((c) => c.country === country)),
    [country, campuses]
  );

  return (
    <section className="px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Eyebrow>CAMPUS PASTORS</Eyebrow>
            <h2
              className="mt-3 font-display text-ink-900"
              style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}
            >
              Every church has a <em className="italic">name</em>.
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {countries.map((c) => {
              const active = c === country;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCountry(c)}
                  className="rounded-full px-4 py-1.5 font-ui text-[12px] transition-colors"
                  style={{
                    background: active ? "#141210" : "rgba(20,20,20,0.04)",
                    color: active ? "#FFFCF7" : "rgba(20,20,20,0.7)",
                  }}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <Link
              key={c.slug}
              href={`/campuses/${c.slug}`}
              className="group block overflow-hidden rounded-[22px] bg-white transition-transform hover:-translate-y-1"
              style={{ border: "1px solid rgba(20,20,20,0.05)" }}
            >
              <div className="flex">
                {c.pastors.slice(0, 2).map((p, i) => (
                  <div key={i} className="relative aspect-square flex-1 overflow-hidden">
                    <Image
                      src={p.photo}
                      alt={p.name}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 50vw, 20vw"
                      className="object-cover"
                    />
                    {p.placeholder && (
                      <span className="absolute right-2 top-2 rounded-full bg-ink-900/70 px-2 py-0.5 font-ui text-[9px] uppercase tracking-[0.18em] text-cream">
                        placeholder
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <div className="p-5">
                <p
                  className="font-display italic text-ink-900"
                  style={{ fontSize: 22, fontWeight: 300 }}
                >
                  {c.campusName}
                </p>
                <p className="mt-1 font-ui text-[11px] uppercase tracking-[0.2em] text-warm-700">
                  {c.city} &middot; {c.country}
                </p>
                <p className="mt-3 font-body text-[13px] text-ink-600">
                  {c.pastors.map((p) => p.name).join(" & ")}
                  {c.status === "launching" && (
                    <span className="ml-2 rounded-full bg-warm-500/15 px-2 py-0.5 font-ui text-[10px] uppercase tracking-[0.18em] text-warm-700">
                      launching
                    </span>
                  )}
                </p>
                <p className="mt-3 font-body text-[13px] text-ink-600/80">{c.oneLine}</p>
                <span className="mt-4 inline-block font-ui text-[11px] uppercase tracking-[0.24em] text-warm-700 group-hover:text-ink-900">
                  Visit campus &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ExecutiveTeam({ team }: { team: ExecMember[] }) {
  return (
    <section className="px-6 py-24 sm:px-10" style={{ background: "#F7F1E6" }}>
      <div className="mx-auto max-w-[1200px]">
        <Eyebrow>EXECUTIVE TEAM</Eyebrow>
        <h2
          className="mt-3 font-display text-ink-900"
          style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}
        >
          The central <em className="italic">team</em>.
        </h2>
        <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {team.map((m) => (
            <div
              key={m.name}
              className="overflow-hidden rounded-[20px] bg-white"
              style={{ border: "1px solid rgba(20,20,20,0.05)" }}
            >
              <div className="relative aspect-square w-full overflow-hidden">
                <Image
                  src={m.photo}
                  alt={m.name}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover"
                />
                {m.placeholder && (
                  <span className="absolute right-2 top-2 rounded-full bg-ink-900/70 px-2 py-0.5 font-ui text-[9px] uppercase tracking-[0.18em] text-cream">
                    placeholder
                  </span>
                )}
              </div>
              <div className="p-5">
                <p
                  className="font-display italic text-ink-900"
                  style={{ fontSize: 19, fontWeight: 300 }}
                >
                  {m.name}
                </p>
                <p className="mt-1 font-ui text-[10px] uppercase tracking-[0.2em] text-warm-700">
                  {m.role}
                </p>
                <p className="mt-3 font-body text-[13px] text-ink-600">{m.oneLine}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MinistryLeads({ leads }: { leads: MinistryLead[] }) {
  return (
    <section className="px-6 py-24 sm:px-10">
      <div className="mx-auto max-w-[1200px]">
        <Eyebrow>MINISTRY LEADS</Eyebrow>
        <h2
          className="mt-3 font-display text-ink-900"
          style={{ fontSize: "clamp(2rem,4.4vw,3rem)", fontWeight: 300, lineHeight: 1.02 }}
        >
          Four streams. <em className="italic">Four families</em>.
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {leads.map((l) => (
            <Link
              key={l.slug}
              href={l.href}
              className="group block overflow-hidden rounded-[22px] bg-white transition-transform hover:-translate-y-1"
              style={{ border: "1px solid rgba(20,20,20,0.05)" }}
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Image
                  src={l.photo}
                  alt={l.leaderName}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover"
                />
                {l.placeholder && (
                  <span className="absolute right-2 top-2 rounded-full bg-ink-900/70 px-2 py-0.5 font-ui text-[9px] uppercase tracking-[0.18em] text-cream">
                    placeholder
                  </span>
                )}
              </div>
              <div className="p-5">
                <p
                  className="font-display italic text-ink-900"
                  style={{ fontSize: 22, fontWeight: 300 }}
                >
                  {l.label}
                </p>
                <p className="mt-1 font-ui text-[11px] uppercase tracking-[0.2em] text-warm-700">
                  {l.leaderName} &middot; {l.leaderRole}
                </p>
                <p className="mt-3 font-body text-[13px] text-ink-600">{l.oneLine}</p>
                <span className="mt-5 inline-block font-ui text-[11px] uppercase tracking-[0.24em] text-warm-700 group-hover:text-ink-900">
                  Open {l.label} &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function LeadersCTA() {
  return (
    <section className="px-6 py-24 sm:px-10" style={{ background: "#F7F1E6" }}>
      <div className="mx-auto max-w-[720px]">
        <Eyebrow>MEET A PASTOR FIRST</Eyebrow>
        <h2
          className="mt-3 font-display text-ink-900"
          style={{ fontSize: "clamp(1.75rem,3.6vw,2.5rem)", fontWeight: 300, lineHeight: 1.05 }}
        >
          Want to meet a pastor <em className="italic">before</em> visiting?
        </h2>
        <p className="mt-5 font-body text-[16px] leading-relaxed text-ink-600">
          Send a note. A real pastor from your closest campus will reply this week &mdash; no auto-reply, no follow-up funnel.
        </p>
        <div className="mt-10">
          <ValueExchangeForm
            source="leaders-pastoral-connect"
            offer="Send a note to your closest campus pastor. They reply within seven days."
            proofPoints={[
              "A real pastor, not a bot",
              "Reply within seven days",
              "No follow-up funnel",
            ]}
            fields={["email", "oneThing"]}
            cta="Send my note"
            outcome="Your note is with the team. A pastor will reply within seven days."
          />
        </div>
      </div>
    </section>
  );
}
