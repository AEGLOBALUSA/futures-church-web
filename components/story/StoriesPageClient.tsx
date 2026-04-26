"use client";

import { useState, useEffect } from "react";
import { useAIGuide } from "@/lib/ai/AIGuideContext";
import { ValueExchangeForm } from "@/components/forms/ValueExchangeForm";

type Story = {
  id: string;
  name: string;
  campus: string;
  theme: string;
  headline: string;
  story: string;
  photo: string | null;
  year: number;
  placeholder?: boolean;
};

const THEMES = ["All", "Salvation", "Baptism", "Healing", "Marriage Restored", "Addiction Broken", "Leadership", "Campus Launch"];

export function StoriesPageClient({ stories }: { stories: Story[] }) {
  const { setPageContext } = useAIGuide();
  useEffect(() => setPageContext("home"), [setPageContext]);

  const [theme, setTheme] = useState("All");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = stories.filter((s) => theme === "All" || s.theme === theme);

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
            Stories
          </p>
          <h1
            className="mt-3 font-display text-ink-900"
            style={{ fontSize: "clamp(2.5rem,5.6vw,4.5rem)", fontWeight: 300, lineHeight: 1.02 }}
          >
            Real people.
            <br />
            <em className="italic">Real change.</em>
          </h1>
          <p className="mt-5 max-w-[52ch] font-sans text-ink-600" style={{ fontSize: 17, lineHeight: 1.65 }}>
            Salvations, baptisms, marriages restored, addictions broken — across 21 campuses
            and 4 countries. These are their stories.
          </p>

          <div className="mt-8 rounded-xl border border-dashed border-warm-400/60 bg-warm-50/50 px-5 py-4">
            <p className="font-ui text-[11px] uppercase tracking-[0.2em] text-warm-600">⚠ Staff action required</p>
            <p className="mt-1 font-sans text-ink-500" style={{ fontSize: 13 }}>
              Replace placeholder stories with real testimonies — complete <strong>Section H</strong> of the staff questionnaire. Minimum 6 stories to launch.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {THEMES.map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`rounded-full px-4 py-1.5 font-ui text-[11px] uppercase tracking-[0.18em] transition-colors ${
                  theme === t
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

      {/* Stories */}
      <section className="border-t border-ink-900/10 px-6 py-12 sm:px-10">
        <div className="mx-auto max-w-[900px]">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((story) => (
              <div
                key={story.id}
                className={`rounded-2xl border ${
                  story.placeholder
                    ? "border-dashed border-warm-400/50 bg-warm-50/40"
                    : "border-ink-900/10 bg-white/60"
                }`}
              >
                {/* Photo placeholder */}
                <div
                  className="h-40 rounded-t-2xl"
                  style={{ background: story.placeholder ? "#F2E6D1" : "#E8D5C0" }}
                >
                  {story.placeholder && (
                    <div className="flex h-full items-center justify-center">
                      <p className="font-ui text-[11px] uppercase tracking-[0.18em] text-warm-400">⚠ Photo needed</p>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="rounded-full px-2.5 py-0.5 font-ui text-[10px] uppercase tracking-[0.16em]"
                      style={{ background: "rgba(28,26,23,0.07)", color: "#6B5E4E" }}
                    >
                      {story.theme}
                    </span>
                    {story.placeholder && (
                      <span className="font-ui text-[10px] text-warm-500">⚠ placeholder</span>
                    )}
                  </div>

                  <h2
                    className={`mt-3 font-display ${story.placeholder ? "italic text-warm-600" : "text-ink-900"}`}
                    style={{ fontSize: "clamp(1rem,1.8vw,1.2rem)", fontWeight: 400, lineHeight: 1.25 }}
                  >
                    {story.headline.startsWith("PLACEHOLDER") ? `⚠ ${story.headline}` : story.headline}
                  </h2>

                  <p className="mt-1 font-ui text-[10px] uppercase tracking-[0.18em] text-ink-400">
                    {story.name.startsWith("PLACEHOLDER") ? "⚠ Name" : story.name} · {story.campus.startsWith("PLACEHOLDER") ? "⚠ Campus" : story.campus}
                  </p>

                  {!story.placeholder && (
                    <>
                      <p
                        className="mt-3 font-sans text-ink-600"
                        style={{
                          fontSize: 13,
                          lineHeight: 1.65,
                          display: "-webkit-box",
                          WebkitLineClamp: expanded === story.id ? undefined : 4,
                          WebkitBoxOrient: "vertical",
                          overflow: expanded === story.id ? "visible" : "hidden",
                        }}
                      >
                        {story.story}
                      </p>
                      <button
                        onClick={() => setExpanded(expanded === story.id ? null : story.id)}
                        className="mt-2 font-ui text-[11px] uppercase tracking-[0.14em] text-warm-600 hover:text-warm-700"
                      >
                        {expanded === story.id ? "Read less" : "Read more →"}
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Submit a story */}
      <section className="border-t border-ink-900/10 px-6 py-16 sm:px-10" style={{ background: "#F7F0E4" }}>
        <div className="mx-auto max-w-[640px]">
          <p className="font-ui uppercase text-warm-600" style={{ fontSize: 11, letterSpacing: "0.28em" }}>
            Your story matters
          </p>
          <h2
            className="mt-3 font-display text-ink-900"
            style={{ fontSize: "clamp(1.75rem,3.4vw,2.5rem)", fontWeight: 300, lineHeight: 1.1 }}
          >
            Share yours.
          </h2>
          <p className="mt-4 font-sans text-ink-600" style={{ fontSize: 16, lineHeight: 1.65 }}>
            If God has done something real in your life, we&apos;d love to hear it. Every story is
            read by a pastor — and with your permission, shared to encourage others.
          </p>
          <div className="mt-8">
            <ValueExchangeForm
              offer="Tell us what happened — a pastor will reach out before anything is published."
              proofPoints={["Nothing shared without your permission", "Pastoral conversation first"]}
              fields={["name", "email"]}
              cta="Share my story"
              outcome="A pastor will reach out within 48 hours."
              source="share-story"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
