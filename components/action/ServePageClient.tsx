"use client";

import { useState, useEffect } from "react";
import { useAIGuide } from "@/lib/ai/AIGuideContext";
import { ValueExchangeForm } from "@/components/forms/ValueExchangeForm";

type Team = {
  id: string;
  team: string;
  icon: string;
  tagline: string;
  description: string;
  commitment: string;
  skills: string[];
  coordinator: string;
  coordinatorEmail: string;
  campuses: string;
  placeholder?: boolean;
};

const TEAM_ICONS: Record<string, string> = {
  heart: "♡",
  users: "◎",
  mic: "♪",
  video: "▶",
  music: "♫",
  hand: "✋",
  coffee: "☕",
  camera: "◈",
};

export function ServePageClient({ teams }: { teams: Team[] }) {
  const { setPageContext } = useAIGuide();
  useEffect(() => setPageContext("home"), [setPageContext]);

  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [applying, setApplying] = useState<string | null>(null);

  const team = selectedTeam ? teams.find((t) => t.id === selectedTeam) : null;

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
            Serve
          </p>
          <h1
            className="mt-3 font-display text-ink-900"
            style={{ fontSize: "clamp(2.5rem,5.6vw,4.5rem)", fontWeight: 300, lineHeight: 1.02 }}
          >
            Every person who walks
            <br />
            through our doors deserves
            <br />
            <em className="italic">the best hour of their week.</em>
          </h1>
          <p className="mt-5 max-w-[52ch] font-sans text-ink-600" style={{ fontSize: 17, lineHeight: 1.65 }}>
            You make that happen. Pick a team — training is provided, community is guaranteed.
          </p>

          <div className="mt-6 rounded-xl border border-dashed border-warm-400/60 bg-warm-50/50 px-5 py-4">
            <p className="font-ui text-[11px] uppercase tracking-[0.2em] text-warm-600">⚠ Staff action required</p>
            <p className="mt-1 font-sans text-ink-500" style={{ fontSize: 13 }}>
              Update coordinator names, emails, and commitment details — complete <strong>Section E</strong> of the staff questionnaire.
            </p>
          </div>
        </div>
      </section>

      {/* Teams grid */}
      <section className="border-t border-ink-900/10 px-6 py-12 sm:px-10">
        <div className="mx-auto max-w-[1100px]">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {teams.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTeam(t.id === selectedTeam ? null : t.id)}
                className={`rounded-2xl border p-6 text-left transition-all ${
                  selectedTeam === t.id
                    ? "border-ink-900/30 bg-ink-900 text-cream shadow-lg"
                    : "border-ink-900/10 bg-white/60 hover:border-ink-900/20 hover:shadow-sm"
                }`}
              >
                <div className="text-2xl" aria-hidden>{TEAM_ICONS[t.icon] ?? "·"}</div>
                <h2
                  className="mt-3 font-display"
                  style={{ fontSize: "clamp(1rem,1.8vw,1.25rem)", fontWeight: 400 }}
                >
                  {t.team}
                </h2>
                <p
                  className={`mt-2 font-sans ${selectedTeam === t.id ? "text-cream/75" : "text-ink-500"}`}
                  style={{ fontSize: 13, lineHeight: 1.55 }}
                >
                  {t.tagline}
                </p>
              </button>
            ))}
          </div>

          {/* Expanded team detail */}
          {team && (
            <div className="mt-8 rounded-2xl border border-ink-900/15 bg-white/80 p-8 shadow-sm">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <h2
                    className="font-display text-ink-900"
                    style={{ fontSize: "clamp(1.5rem,2.8vw,2rem)", fontWeight: 300 }}
                  >
                    {team.team}
                  </h2>
                  <p className="mt-3 max-w-[60ch] font-sans text-ink-600" style={{ fontSize: 15, lineHeight: 1.65 }}>
                    {team.description}
                  </p>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="font-ui text-[10px] uppercase tracking-[0.2em] text-ink-400">Time commitment</p>
                      <p className={`mt-1 font-sans text-[14px] ${team.commitment.startsWith("PLACEHOLDER") ? "italic text-warm-600" : "text-ink-700"}`}>
                        {team.commitment.startsWith("PLACEHOLDER") ? `⚠ ${team.commitment}` : team.commitment}
                      </p>
                    </div>
                    <div>
                      <p className="font-ui text-[10px] uppercase tracking-[0.2em] text-ink-400">Skills</p>
                      <div className="mt-1 flex flex-wrap gap-1.5">
                        {team.skills.map((s) => (
                          <span key={s} className="rounded-full border border-ink-900/12 px-2.5 py-0.5 font-sans text-[12px] text-ink-600">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5">
                    <p className="font-ui text-[10px] uppercase tracking-[0.2em] text-ink-400">Team coordinator</p>
                    <p className={`mt-1 font-sans text-[14px] ${team.coordinator.startsWith("PLACEHOLDER") ? "italic text-warm-600" : "text-ink-700"}`}>
                      {team.coordinator.startsWith("PLACEHOLDER") ? `⚠ ${team.coordinator}` : team.coordinator}
                      {!team.coordinatorEmail.startsWith("PLACEHOLDER") && (
                        <> · <a href={`mailto:${team.coordinatorEmail}`} className="underline hover:text-warm-600">{team.coordinatorEmail}</a></>
                      )}
                    </p>
                  </div>
                </div>

                <div className="shrink-0">
                  {applying === team.id ? (
                    <div className="w-72">
                      <ValueExchangeForm
                        offer={`Apply to join the ${team.team} team.`}
                        proofPoints={["Training provided", "Your campus pastor will be in touch"]}
                        fields={["name", "email"]}
                        cta="Apply to serve"
                        outcome="Your coordinator will reach out within 48 hours."
                        source={`serve-${team.id}`}
                      />
                    </div>
                  ) : (
                    <button
                      onClick={() => setApplying(team.id)}
                      className="rounded-full bg-ink-900 px-7 py-3.5 font-ui text-[13px] tracking-[0.02em] text-cream transition-colors hover:bg-warm-600"
                    >
                      Apply to serve →
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
