"use client";

import { useState, useEffect } from "react";
import { useAIGuide } from "@/lib/ai/AIGuideContext";
import { ValueExchangeForm } from "@/components/forms/ValueExchangeForm";

type Role = {
  id: string;
  title: string;
  campus: string;
  team: string;
  type: string;
  salaryDisclosed: boolean;
  salaryRange: string | null;
  description: string;
  reportsTo: string;
  applyEmail: string;
  closingDate: string;
  placeholder?: boolean;
};

const TEAMS = ["All teams", "Pastoral", "Kids", "Youth", "Worship", "Production", "Admin", "College", "Comms"];

export function CareersPageClient({ roles }: { roles: Role[] }) {
  const { setPageContext } = useAIGuide();
  useEffect(() => setPageContext("home"), [setPageContext]);

  const [team, setTeam] = useState("All teams");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = roles.filter(
    (r) => team === "All teams" || r.team.toLowerCase().includes(team.toLowerCase()),
  );

  const hasRealRoles = roles.some((r) => !r.placeholder);

  return (
    <main className="bg-cream text-ink-900">
      {/* Hero */}
      <section
        className="px-6 pb-12 pt-32 sm:px-10"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(204,143,74,0.12) 0%, transparent 60%), #FDFBF6",
        }}
      >
        <div className="mx-auto max-w-[900px]">
          <p className="font-ui uppercase text-warm-600" style={{ fontSize: 11, letterSpacing: "0.28em" }}>
            Careers
          </p>
          <h1
            className="mt-3 font-display text-ink-900"
            style={{ fontSize: "clamp(2.5rem,5.6vw,4.5rem)", fontWeight: 300, lineHeight: 1.02 }}
          >
            Build something
            <br />
            <em className="italic">that lasts.</em>
          </h1>
          <p className="mt-5 max-w-[52ch] font-sans text-ink-600" style={{ fontSize: 17, lineHeight: 1.65 }}>
            Open roles across 21 campuses in Australia, the USA, Indonesia, and South America.
            Pastoral, technical, creative, administrative — if you&apos;re called, there&apos;s a place.
          </p>

          <div className="mt-8 rounded-xl border border-dashed border-warm-400/60 bg-warm-50/50 px-5 py-4">
            <p className="font-ui text-[11px] uppercase tracking-[0.2em] text-warm-600">⚠ Staff action required</p>
            <p className="mt-1 font-sans text-ink-500" style={{ fontSize: 13 }}>
              Replace placeholder roles with real open positions — complete <strong>Section I</strong> of the staff questionnaire.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {TEAMS.map((t) => (
              <button
                key={t}
                onClick={() => setTeam(t)}
                className={`rounded-full px-4 py-1.5 font-ui text-[11px] uppercase tracking-[0.18em] transition-colors ${
                  team === t
                    ? "bg-ink-900 text-cream"
                    : "border border-ink-900/15 text-ink-600 hover:border-ink-900/30"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="border-t border-ink-900/10 px-6 py-12 sm:px-10">
        <div className="mx-auto max-w-[900px] space-y-4">
          {filtered.map((role) => (
            <div
              key={role.id}
              className={`rounded-2xl border ${
                role.placeholder
                  ? "border-dashed border-warm-400/50 bg-warm-50/40"
                  : "border-ink-900/10 bg-white/60"
              }`}
            >
              <button
                className="w-full px-6 py-5 text-left"
                onClick={() => setExpanded(expanded === role.id ? null : role.id)}
              >
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2
                      className={`font-display ${role.placeholder ? "italic text-warm-600" : "text-ink-900"}`}
                      style={{ fontSize: "clamp(1.1rem,2vw,1.35rem)", fontWeight: 400 }}
                    >
                      {role.title.startsWith("PLACEHOLDER") ? `⚠ ${role.title}` : role.title}
                    </h2>
                    <div className="mt-1 flex flex-wrap gap-2">
                      <span className="font-ui text-[11px] text-ink-500">
                        {role.campus.startsWith("PLACEHOLDER") ? `⚠ ${role.campus}` : role.campus}
                      </span>
                      <span className="font-ui text-[11px] text-ink-400">·</span>
                      <span className="font-ui text-[11px] text-ink-500">
                        {role.type.startsWith("PLACEHOLDER") ? `⚠ ${role.type}` : role.type}
                      </span>
                      {role.salaryDisclosed && role.salaryRange && (
                        <>
                          <span className="font-ui text-[11px] text-ink-400">·</span>
                          <span className="font-ui text-[11px] text-warm-600">{role.salaryRange}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <span className="font-ui text-[12px] text-ink-400">{expanded === role.id ? "↑" : "↓"}</span>
                </div>
              </button>

              {expanded === role.id && (
                <div className="border-t border-ink-900/10 px-6 pb-6 pt-5">
                  <p className={`max-w-[62ch] font-sans ${role.description.startsWith("PLACEHOLDER") ? "italic text-warm-600" : "text-ink-600"}`} style={{ fontSize: 15, lineHeight: 1.65 }}>
                    {role.description.startsWith("PLACEHOLDER") ? `⚠ ${role.description}` : role.description}
                  </p>
                  {!role.description.startsWith("PLACEHOLDER") && (
                    <div className="mt-5 flex flex-wrap gap-3">
                      <a
                        href={`mailto:${role.applyEmail}`}
                        className="inline-flex items-center gap-1.5 rounded-full bg-ink-900 px-6 py-2.5 font-ui text-[12px] tracking-[0.02em] text-cream transition-colors hover:bg-warm-600"
                      >
                        Apply →
                      </a>
                      {role.closingDate && !role.closingDate.startsWith("PLACEHOLDER") && (
                        <span className="flex items-center font-ui text-[11px] text-ink-400">
                          Closes {role.closingDate}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* General EOI */}
      <section className="border-t border-ink-900/10 px-6 py-16 sm:px-10" style={{ background: "#F7F0E4" }}>
        <div className="mx-auto max-w-[640px]">
          <p className="font-ui uppercase text-warm-600" style={{ fontSize: 11, letterSpacing: "0.28em" }}>
            {hasRealRoles ? "Don't see your role?" : "No specific roles right now"}
          </p>
          <h2
            className="mt-3 font-display text-ink-900"
            style={{ fontSize: "clamp(1.75rem,3.4vw,2.5rem)", fontWeight: 300, lineHeight: 1.1 }}
          >
            We&apos;d still love to meet you.
          </h2>
          <p className="mt-4 font-sans text-ink-600" style={{ fontSize: 16, lineHeight: 1.65 }}>
            Even when we&apos;re not actively hiring, we&apos;re always building a pipeline of great people.
            Send us an expression of interest and we&apos;ll keep you in mind.
          </p>
          <div className="mt-8">
            <ValueExchangeForm
              offer="Tell us who you are and what you'd love to build."
              proofPoints={["Reviewed by a campus pastor", "We'll reach out when the right role opens"]}
              fields={["name", "email"]}
              cta="Send an expression of interest"
              outcome="We'll be in touch when the right opportunity arises."
              source="careers-eoi"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
