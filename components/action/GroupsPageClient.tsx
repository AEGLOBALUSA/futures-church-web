"use client";

import { useState, useEffect } from "react";
import { useAIGuide } from "@/lib/ai/AIGuideContext";
import { ValueExchangeForm } from "@/components/forms/ValueExchangeForm";

type Group = {
  id: string;
  name: string;
  leader: string;
  leaderPhoto: string | null;
  day: string;
  time: string;
  city: string;
  suburb: string;
  demographic: string;
  description: string;
  howToJoin: string;
  placeholder?: boolean;
};

const DEMOGRAPHICS = ["All", "Mixed", "Men", "Women", "Singles", "Young Marrieds", "Families", "Spanish", "Indonesian", "Online"];

export function GroupsPageClient({ groups }: { groups: Group[] }) {
  const { setPageContext } = useAIGuide();
  useEffect(() => setPageContext("home"), [setPageContext]);

  const [cityQuery, setCityQuery] = useState("");
  const [demo, setDemo] = useState("All");

  const filtered = groups.filter((g) => {
    const matchCity =
      !cityQuery.trim() ||
      g.city.toLowerCase().includes(cityQuery.toLowerCase()) ||
      g.suburb.toLowerCase().includes(cityQuery.toLowerCase());
    const matchDemo = demo === "All" || g.demographic === demo;
    return matchCity && matchDemo;
  });

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
            Life Groups
          </p>
          <h1
            className="mt-3 font-display text-ink-900"
            style={{ fontSize: "clamp(2.5rem,5.6vw,4.5rem)", fontWeight: 300, lineHeight: 1.02 }}
          >
            Sunday is the start.
            <br />
            <em className="italic">Community is the whole thing.</em>
          </h1>
          <p className="mt-5 max-w-[52ch] font-sans text-ink-600" style={{ fontSize: 17, lineHeight: 1.65 }}>
            Life groups are where people actually know your name. Small enough to matter.
            Find one near you — or start one.
          </p>

          <div className="mt-8 rounded-xl border border-dashed border-warm-400/60 bg-warm-50/50 px-5 py-4">
            <p className="font-ui text-[11px] uppercase tracking-[0.2em] text-warm-600">⚠ Staff action required</p>
            <p className="mt-1 font-sans text-ink-500" style={{ fontSize: 13 }}>
              Replace placeholder groups with real life groups — complete <strong>Section D</strong> of the staff questionnaire.
            </p>
          </div>

          {/* Search + filters */}
          <div className="mt-8 space-y-4">
            <input
              type="text"
              value={cityQuery}
              onChange={(e) => setCityQuery(e.target.value)}
              placeholder="City or suburb"
              className="w-full max-w-sm rounded-xl border border-ink-900/15 bg-white/60 px-4 py-3 font-sans text-ink-900 placeholder:text-ink-400 focus:border-warm-500 focus:outline-none"
              style={{ fontSize: 15 }}
            />
            <div className="flex flex-wrap gap-2">
              {DEMOGRAPHICS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDemo(d)}
                  className={`rounded-full px-4 py-1.5 font-ui text-[11px] uppercase tracking-[0.18em] transition-colors ${
                    demo === d ? "bg-ink-900 text-cream" : "border border-ink-900/15 text-ink-600 hover:border-ink-900/30"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Groups grid */}
      <section className="border-t border-ink-900/10 px-6 py-12 sm:px-10">
        <div className="mx-auto max-w-[900px]">
          {filtered.length === 0 ? (
            <p className="font-sans text-ink-500" style={{ fontSize: 15 }}>
              No groups match your search. Try a different city or demographic.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((group) => (
                <div
                  key={group.id}
                  className={`rounded-2xl border p-6 ${
                    group.placeholder
                      ? "border-dashed border-warm-400/50 bg-warm-50/40"
                      : "border-ink-900/10 bg-white/60"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink-900/8 font-display text-ink-600" style={{ fontSize: 16 }}>
                      {group.leader.startsWith("PLACEHOLDER") ? "?" : group.leader[0]}
                    </div>
                    <div>
                      <p className="font-sans font-medium text-ink-900" style={{ fontSize: 14 }}>
                        {group.name.startsWith("PLACEHOLDER") ? <span className="italic text-warm-600">⚠ {group.name}</span> : group.name}
                      </p>
                      <p className="font-sans text-ink-500" style={{ fontSize: 12 }}>
                        {group.leader.startsWith("PLACEHOLDER") ? <span className="italic text-warm-500">⚠ {group.leader}</span> : group.leader}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full border border-ink-900/10 px-2.5 py-0.5 font-ui text-[10px] uppercase tracking-[0.16em] text-ink-500">{group.demographic}</span>
                    <span className="rounded-full border border-ink-900/10 px-2.5 py-0.5 font-ui text-[10px] uppercase tracking-[0.16em] text-ink-500">{group.city}</span>
                  </div>

                  <p className="mt-3 font-sans text-ink-600" style={{ fontSize: 13, lineHeight: 1.6 }}>
                    {group.description.startsWith("PLACEHOLDER") ? <span className="italic text-warm-500">⚠ {group.description}</span> : group.description}
                  </p>

                  <div className="mt-4 border-t border-ink-900/8 pt-4">
                    <p className="font-ui text-[10px] uppercase tracking-[0.18em] text-ink-400">How to join</p>
                    <p className="mt-1 font-sans text-ink-600" style={{ fontSize: 12 }}>
                      {group.howToJoin.startsWith("PLACEHOLDER") ? <span className="italic text-warm-500">⚠ {group.howToJoin}</span> : group.howToJoin}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Start a group */}
      <section className="border-t border-ink-900/10 px-6 py-16 sm:px-10" style={{ background: "#F7F0E4" }}>
        <div className="mx-auto max-w-[640px]">
          <p className="font-ui uppercase text-warm-600" style={{ fontSize: 11, letterSpacing: "0.28em" }}>
            Can&apos;t find your group?
          </p>
          <h2
            className="mt-3 font-display text-ink-900"
            style={{ fontSize: "clamp(1.75rem,3.4vw,2.5rem)", fontWeight: 300, lineHeight: 1.1 }}
          >
            Start one.
          </h2>
          <p className="mt-4 font-sans text-ink-600" style={{ fontSize: 16, lineHeight: 1.65 }}>
            If there&apos;s no group in your area — or for your season of life — you can be the one who
            starts it. We&apos;ll support you with training, resources, and a pastor to walk alongside you.
          </p>
          <div className="mt-8">
            <ValueExchangeForm
              offer="Tell us about yourself and we'll connect you with your campus pastor."
              proofPoints={["Full training provided", "Pastor walks with you"]}
              fields={["name", "email"]}
              cta="I'd like to start a group"
              outcome="Your campus pastor will reach out within 48 hours."
              source="start-a-group"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
