"use client";

import { useState } from "react";
import type { IntakeCampus } from "@/lib/intake/server";

export function SeedClient({
  initial,
  baseUrl,
}: {
  initial: IntakeCampus[];
  baseUrl: string;
}) {
  const [campuses, setCampuses] = useState<
    Array<Pick<IntakeCampus, "slug" | "display_name" | "region" | "language" | "access_token" | "status" | "progress_pct">>
  >(initial);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  async function sync() {
    setBusy(true);
    setMessage(null);
    const res = await fetch("/api/intake/admin/seed", { method: "POST" });
    const json = await res.json();
    if (!res.ok) {
      setMessage(`Sync failed: ${json.error ?? "unknown error"}`);
    } else {
      setCampuses(json.campuses);
      setMessage(
        json.inserted === 0
          ? "All campuses already have links."
          : `Created ${json.inserted} new link${json.inserted === 1 ? "" : "s"}.`
      );
    }
    setBusy(false);
  }

  async function copy(slug: string, link: string) {
    await navigator.clipboard.writeText(link);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug((s) => (s === slug ? null : s)), 1800);
  }

  async function copyAllAsCsv() {
    const rows = ["Campus,Region,Language,Status,Progress,Link"];
    for (const c of campuses) {
      const link = `${baseUrl}/intake/${c.slug}?key=${c.access_token}`;
      rows.push(
        `"${c.display_name}",${c.region},${c.language},${c.status},${c.progress_pct}%,"${link}"`
      );
    }
    await navigator.clipboard.writeText(rows.join("\n"));
    setMessage("CSV copied to clipboard.");
  }

  // Group by region for readability.
  const byRegion: Record<string, typeof campuses> = {};
  for (const c of campuses) {
    if (!byRegion[c.region]) byRegion[c.region] = [];
    byRegion[c.region].push(c);
  }
  const regions = Object.keys(byRegion).sort();

  return (
    <div className="mt-10">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={sync}
          disabled={busy}
          className="rounded-full bg-ink-900 px-5 py-2.5 font-ui text-[11px] uppercase tracking-[0.24em] text-cream transition hover:bg-warm-700 disabled:opacity-40"
        >
          {busy ? "Syncing…" : campuses.length === 0 ? "Create links for all campuses" : "Sync (add new campuses)"}
        </button>
        {campuses.length > 0 && (
          <button
            type="button"
            onClick={copyAllAsCsv}
            className="rounded-full border border-ink-900/15 bg-cream/70 px-5 py-2.5 font-ui text-[11px] uppercase tracking-[0.22em] text-ink-900 hover:bg-cream-300"
          >
            Copy all as CSV
          </button>
        )}
        {message && (
          <span className="font-ui text-[11px] uppercase tracking-[0.18em] text-ink-500">
            {message}
          </span>
        )}
      </div>

      {campuses.length === 0 && (
        <div className="mt-12 rounded-3xl border border-dashed border-ink-900/15 bg-cream/60 px-7 py-12 text-center">
          <p className="font-display text-body-lg italic text-ink-700">
            No campuses yet. Click the button above to create links from <code>lib/content/campuses.ts</code>.
          </p>
          <p className="mt-3 font-sans text-body-sm text-ink-500">
            If that fails, check that the <code>0002_intake</code> migration has been applied to Supabase.
          </p>
        </div>
      )}

      <div className="mt-12 space-y-12">
        {regions.map((region) => (
          <section key={region}>
            <h2 className="font-ui text-[10px] uppercase tracking-[0.28em] text-ink-500">
              {region} · {byRegion[region].length}
            </h2>
            <ul className="mt-4 space-y-3">
              {byRegion[region].map((c) => {
                const link = `${baseUrl}/intake/${c.slug}?key=${c.access_token}`;
                return (
                  <li
                    key={c.slug}
                    className="rounded-2xl border border-ink-900/10 bg-cream/95 px-5 py-4 sm:px-6"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-3">
                      <div>
                        <span className="font-display text-display-md italic text-ink-900">
                          {c.display_name}
                        </span>
                        <span className="ml-3 font-ui text-[10px] uppercase tracking-[0.22em] text-ink-500">
                          {c.language} · {c.status}
                        </span>
                      </div>
                      <span className="font-ui text-[11px] uppercase tracking-[0.2em] text-ink-700">
                        {c.progress_pct}%
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <code className="flex-1 truncate rounded-lg border border-ink-900/10 bg-cream-50 px-3 py-2 font-mono text-body-sm text-ink-700">
                        {link}
                      </code>
                      <button
                        type="button"
                        onClick={() => copy(c.slug, link)}
                        className="rounded-full bg-ink-900 px-4 py-2 font-ui text-[10px] uppercase tracking-[0.22em] text-cream hover:bg-warm-700"
                      >
                        {copiedSlug === c.slug ? "Copied" : "Copy"}
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
