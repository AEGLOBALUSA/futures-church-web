"use client";

import { useState, useEffect } from "react";
import { Download } from "lucide-react";
import { useAIGuide } from "@/lib/ai/AIGuideContext";

type Resource = {
  id: string;
  title: string;
  category: string;
  description: string;
  fileHref: string;
  fileType: string;
  free: boolean;
  placeholder?: boolean;
};

const CATEGORIES = ["All", "Sermon Notes", "Reading Plan", "Study Guide", "Parent Guide", "Marriage", "Support"];

export function ResourcesPageClient({ resources }: { resources: Resource[] }) {
  const { setPageContext } = useAIGuide();
  useEffect(() => setPageContext("home"), [setPageContext]);

  const [category, setCategory] = useState("All");

  const filtered = resources.filter(
    (r) => category === "All" || r.category === category,
  );

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
            Resources
          </p>
          <h1
            className="mt-3 font-display text-ink-900"
            style={{ fontSize: "clamp(2.5rem,5.6vw,4.5rem)", fontWeight: 300, lineHeight: 1.02 }}
          >
            Free. Always.
          </h1>
          <p className="mt-5 max-w-[52ch] font-sans text-ink-600" style={{ fontSize: 17, lineHeight: 1.65 }}>
            Sermon notes, reading plans, study guides, and parent resources. Download anything.
            Share everything.
          </p>

          <div className="mt-8 rounded-xl border border-dashed border-warm-400/60 bg-warm-50/50 px-5 py-4">
            <p className="font-ui text-[11px] uppercase tracking-[0.2em] text-warm-600">⚠ Staff action required</p>
            <p className="mt-1 font-sans text-ink-500" style={{ fontSize: 13 }}>
              Upload real resource files and replace placeholders — complete <strong>Section G</strong> of the staff questionnaire.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
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
        </div>
      </section>

      {/* Resources grid */}
      <section className="border-t border-ink-900/10 px-6 py-12 sm:px-10">
        <div className="mx-auto max-w-[900px]">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((r) => (
              <div
                key={r.id}
                className={`flex flex-col rounded-2xl border p-6 ${
                  r.placeholder
                    ? "border-dashed border-warm-400/50 bg-warm-50/40"
                    : "border-ink-900/10 bg-white/60"
                }`}
              >
                <div className="flex-1">
                  <span
                    className="rounded-full px-3 py-0.5 font-ui text-[10px] uppercase tracking-[0.18em]"
                    style={{ background: "rgba(28,26,23,0.07)", color: "#6B5E4E" }}
                  >
                    {r.category}
                  </span>
                  <h2
                    className="mt-3 font-display text-ink-900"
                    style={{ fontSize: "clamp(1rem,1.8vw,1.2rem)", fontWeight: 400, lineHeight: 1.2 }}
                  >
                    {r.title}
                  </h2>
                  <p className="mt-2 font-sans text-ink-500" style={{ fontSize: 13, lineHeight: 1.6 }}>
                    {r.description}
                  </p>
                </div>

                <div className="mt-5 border-t border-ink-900/8 pt-4">
                  {r.placeholder ? (
                    <span className="font-ui text-[11px] uppercase tracking-[0.16em] text-warm-500">
                      ⚠ File pending
                    </span>
                  ) : (
                    <a
                      href={r.fileHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 font-ui text-[11px] uppercase tracking-[0.16em] text-ink-700 transition-colors hover:text-warm-600"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download {r.fileType}
                      <span className="text-ink-400">· Free</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
