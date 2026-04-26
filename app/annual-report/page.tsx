import type { Metadata } from "next";
import Link from "next/link";
import { Download } from "lucide-react";
import progress from "@/content/vision/progress.json";

export const metadata: Metadata = {
  title: "Annual Report — Futures Church",
  description:
    "Audited annual reports, financial summaries, and headline numbers from every year of Futures Church.",
};

const REPORTS = [
  {
    year: 2025,
    pdfHref: "PLACEHOLDER — Add 2025 annual report PDF link",
    highlights: {
      campuses: "PLACEHOLDER",
      baptisms: "PLACEHOLDER",
      leadersRaised: "PLACEHOLDER",
      given: "PLACEHOLDER",
      givenAway: "PLACEHOLDER",
    },
    placeholder: true,
  },
  {
    year: 2024,
    pdfHref: "PLACEHOLDER — Add 2024 annual report PDF link",
    highlights: {
      campuses: "PLACEHOLDER",
      baptisms: "PLACEHOLDER",
      leadersRaised: "PLACEHOLDER",
      given: "PLACEHOLDER",
      givenAway: "PLACEHOLDER",
    },
    placeholder: true,
  },
  {
    year: 2023,
    pdfHref: "PLACEHOLDER — Add 2023 annual report PDF link",
    highlights: {
      campuses: "PLACEHOLDER",
      baptisms: "PLACEHOLDER",
      leadersRaised: "PLACEHOLDER",
      given: "PLACEHOLDER",
      givenAway: "PLACEHOLDER",
    },
    placeholder: true,
  },
];

export default function AnnualReportPage() {
  return (
    <main className="bg-cream text-ink-900">
      {/* Hero */}
      <section
        className="px-6 pb-16 pt-32 sm:px-10"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(204,143,74,0.12) 0%, transparent 60%), #FDFBF6",
        }}
      >
        <div className="mx-auto max-w-[820px]">
          <p className="font-ui uppercase text-warm-600" style={{ fontSize: 11, letterSpacing: "0.28em" }}>
            Annual Report
          </p>
          <h1
            className="mt-3 font-display text-ink-900"
            style={{ fontSize: "clamp(2.5rem,5.6vw,4.5rem)", fontWeight: 300, lineHeight: 1.02 }}
          >
            Where every dollar goes.
            <br />
            <em className="italic">On the record.</em>
          </h1>
          <p className="mt-6 max-w-[52ch] font-sans text-ink-600" style={{ fontSize: 17, lineHeight: 1.65 }}>
            We believe generosity deserves transparency. Every year we publish an audited
            financial report — not because we have to, but because you deserve to know.
          </p>
        </div>
      </section>

      {/* Live numbers */}
      <section className="border-t border-ink-900/10 px-6 py-12 sm:px-10" style={{ background: "#F7F0E4" }}>
        <div className="mx-auto max-w-[900px]">
          <div className="grid grid-cols-3 gap-6">
            {[
              { value: progress.campuses.current, label: "Active campuses" },
              { value: `${(progress.leaders.current / 1000).toFixed(1)}k`, label: "Leaders raised" },
              { value: `${(progress.souls.current / 1000).toFixed(0)}k`, label: "Souls won" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-ink-900" style={{ fontSize: "clamp(2rem,4vw,3.5rem)", fontWeight: 300 }}>
                  {stat.value}
                </p>
                <p className="mt-1 font-ui text-[11px] uppercase tracking-[0.2em] text-ink-500">{stat.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center font-sans text-[12px] text-ink-400">
            Live figures as of {progress.asOf} — see /vision for the full scoreboard
          </p>
        </div>
      </section>

      {/* Reports */}
      <section className="border-t border-ink-900/10 px-6 py-16 sm:px-10">
        <div className="mx-auto max-w-[900px]">
          <div className="rounded-2xl border border-dashed border-warm-400/60 bg-warm-50/50 mb-10 p-6 text-center">
            <p className="font-ui text-[12px] uppercase tracking-[0.2em] text-warm-600">⚠ Staff action required</p>
            <p className="mt-2 font-sans text-ink-600" style={{ fontSize: 14 }}>
              Upload annual report PDFs and complete headline numbers — Section J of the staff questionnaire.
            </p>
          </div>

          <div className="space-y-6">
            {REPORTS.map((r) => (
              <div key={r.year} className="rounded-2xl border border-ink-900/10 p-6 sm:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2
                      className="font-display text-ink-900"
                      style={{ fontSize: "clamp(1.5rem,3vw,2.25rem)", fontWeight: 300 }}
                    >
                      {r.year} Annual Report
                    </h2>
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {Object.entries(r.highlights).map(([key, val]) => (
                        <div key={key}>
                          <p
                            className="font-display text-ink-900"
                            style={{ fontSize: 22, fontWeight: 300 }}
                          >
                            {val}
                          </p>
                          <p className="font-ui text-[10px] uppercase tracking-[0.18em] text-ink-500">
                            {key === "given" ? "Dollars given" : key === "givenAway" ? "Dollars given away" : key === "leadersRaised" ? "Leaders raised" : key}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  {r.pdfHref.startsWith("PLACEHOLDER") ? (
                    <div className="shrink-0 rounded-xl border border-dashed border-warm-400/60 px-5 py-3 text-center">
                      <p className="font-ui text-[11px] text-warm-600">⚠ PDF pending</p>
                    </div>
                  ) : (
                    <a
                      href={r.pdfHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex shrink-0 items-center gap-2 rounded-full bg-ink-900 px-6 py-3 font-ui text-[12px] tracking-[0.04em] text-cream transition-colors hover:bg-warm-600"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download PDF
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Financial questions */}
      <section className="border-t border-ink-900/10 px-6 py-12 sm:px-10">
        <div className="mx-auto max-w-[640px] text-center">
          <p className="font-sans text-ink-600" style={{ fontSize: 15, lineHeight: 1.7 }}>
            Questions about our financials?{" "}
            <Link href="/contact" className="underline underline-offset-2 hover:text-warm-600">
              Contact our finance team
            </Link>{" "}
            — we respond within two business days.
          </p>
        </div>
      </section>
    </main>
  );
}
