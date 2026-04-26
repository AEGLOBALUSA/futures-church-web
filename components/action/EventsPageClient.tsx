"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarPlus } from "lucide-react";
import { useEffect } from "react";
import { useAIGuide } from "@/lib/ai/AIGuideContext";

type Event = {
  id: string;
  title: string;
  category: string;
  campus: string;
  campusSlug: string;
  recurring?: string;
  day: string;
  time: string;
  description: string;
  address?: string;
  signupRequired: boolean;
  signupHref?: string;
  placeholder?: boolean;
};

const CATEGORIES = ["All", "Worship", "Youth", "Women", "Kids", "College", "Baptism", "Conference"];
const CAMPUSES = ["All campuses", "Australia", "USA", "Indonesia"];

function gcalUrl(event: Event): string {
  const title = encodeURIComponent(event.title);
  const loc = encodeURIComponent(event.address ?? event.campus);
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&location=${loc}`;
}

export function EventsPageClient({ events }: { events: Event[] }) {
  const { setPageContext } = useAIGuide();
  useEffect(() => setPageContext("home"), [setPageContext]);

  const [category, setCategory] = useState("All");
  const [campus, setCampus] = useState("All campuses");

  const filtered = events.filter((e) => {
    const matchCategory = category === "All" || e.category === category;
    const matchCampus =
      campus === "All campuses" ||
      (campus === "Australia" && ["paradise", "adelaide-city", "south", "clare-valley", "salisbury", "mount-barker", "victor-harbor", "copper-coast"].includes(e.campusSlug)) ||
      (campus === "USA" && ["gwinnett", "kennesaw", "alpharetta", "franklin", "futuros-duluth", "futuros-kennesaw"].includes(e.campusSlug)) ||
      (campus === "Indonesia" && ["cemani", "solo", "samarinda", "langowan", "bali"].includes(e.campusSlug)) ||
      e.campusSlug === "all" || e.campusSlug === "online";
    return matchCategory && matchCampus;
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
            Events
          </p>
          <h1
            className="mt-3 font-display text-ink-900"
            style={{ fontSize: "clamp(2.5rem,5.6vw,4.5rem)", fontWeight: 300, lineHeight: 1.02 }}
          >
            What&apos;s on.
          </h1>
          <p className="mt-5 max-w-[52ch] font-sans text-ink-600" style={{ fontSize: 17, lineHeight: 1.65 }}>
            Services, gatherings, camps, and special nights — across all 21 campuses.
          </p>

          {/* Placeholder notice */}
          <div className="mt-8 rounded-xl border border-dashed border-warm-400/60 bg-warm-50/50 px-5 py-4">
            <p className="font-ui text-[11px] uppercase tracking-[0.2em] text-warm-600">⚠ Staff action required</p>
            <p className="mt-1 font-sans text-ink-500" style={{ fontSize: 13 }}>
              Replace placeholder events with real upcoming events — complete <strong>Section C</strong> of the staff questionnaire.
            </p>
          </div>

          {/* Filters */}
          <div className="mt-8 flex flex-wrap gap-3">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`rounded-full px-4 py-1.5 font-ui text-[11px] uppercase tracking-[0.18em] transition-colors ${
                  category === c
                    ? "bg-ink-900 text-cream"
                    : "border border-ink-900/15 text-ink-600 hover:border-ink-900/30"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-3">
            {CAMPUSES.map((c) => (
              <button
                key={c}
                onClick={() => setCampus(c)}
                className={`rounded-full px-4 py-1.5 font-ui text-[11px] uppercase tracking-[0.18em] transition-colors ${
                  campus === c
                    ? "bg-warm-600 text-cream"
                    : "border border-ink-900/10 text-ink-500 hover:border-ink-900/20"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Event grid */}
      <section className="border-t border-ink-900/10 px-6 py-12 sm:px-10">
        <div className="mx-auto max-w-[900px]">
          {filtered.length === 0 ? (
            <p className="font-sans text-ink-500" style={{ fontSize: 15 }}>
              No events match this filter. Try a different category or campus.
            </p>
          ) : (
            <div className="space-y-4">
              {filtered.map((event) => (
                <div
                  key={event.id}
                  className={`rounded-2xl border p-6 ${
                    event.placeholder
                      ? "border-dashed border-warm-400/50 bg-warm-50/40"
                      : "border-ink-900/10 bg-white/60"
                  }`}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className="rounded-full px-3 py-0.5 font-ui text-[10px] uppercase tracking-[0.18em]"
                          style={{ background: "rgba(28,26,23,0.07)", color: "#6B5E4E" }}
                        >
                          {event.category}
                        </span>
                        {event.recurring && (
                          <span className="font-ui text-[10px] uppercase tracking-[0.18em] text-ink-400">
                            {event.recurring}
                          </span>
                        )}
                        {event.placeholder && (
                          <span className="font-ui text-[10px] uppercase tracking-[0.18em] text-warm-500">
                            ⚠ placeholder
                          </span>
                        )}
                      </div>

                      <h2
                        className="mt-2 font-display text-ink-900"
                        style={{ fontSize: "clamp(1.1rem,2vw,1.4rem)", fontWeight: 400 }}
                      >
                        {event.title}
                      </h2>
                      <p className="mt-1 font-sans text-ink-500" style={{ fontSize: 14 }}>
                        {event.day.startsWith("PLACEHOLDER") ? `⚠ ${event.day}` : event.day} · {event.time.startsWith("PLACEHOLDER") ? `⚠ ${event.time}` : event.time} · {event.campus}
                      </p>
                      <p className="mt-2 max-w-[56ch] font-sans text-ink-600" style={{ fontSize: 14, lineHeight: 1.6 }}>
                        {event.description}
                      </p>
                    </div>

                    <div className="flex shrink-0 flex-wrap gap-2 sm:flex-col sm:items-end">
                      {event.signupRequired && event.signupHref && (
                        <Link
                          href={event.signupHref}
                          className="inline-flex items-center gap-1.5 rounded-full bg-ink-900 px-5 py-2.5 font-ui text-[12px] tracking-[0.02em] text-cream transition-colors hover:bg-warm-600"
                        >
                          Sign up →
                        </Link>
                      )}
                      {!event.placeholder && (
                        <a
                          href={gcalUrl(event)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-full border border-ink-900/15 px-4 py-2 font-ui text-[11px] tracking-[0.08em] text-ink-600 transition-colors hover:border-warm-500 hover:text-warm-600"
                        >
                          <CalendarPlus className="h-3.5 w-3.5" />
                          Add to cal
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
