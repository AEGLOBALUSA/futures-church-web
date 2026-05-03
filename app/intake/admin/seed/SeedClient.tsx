"use client";

import { useState } from "react";
import type { IntakeCampus } from "@/lib/intake/server";

type SeedCampus = Pick<
  IntakeCampus,
  "slug" | "display_name" | "region" | "language" | "access_token" | "status" | "progress_pct"
>;

export function SeedClient({
  initial,
  baseUrl,
}: {
  initial: IntakeCampus[];
  baseUrl: string;
}) {
  const [campuses, setCampuses] = useState<SeedCampus[]>(initial);
  const [busy, setBusy] = useState(false);
  const [busySlug, setBusySlug] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [confirmRotateAll, setConfirmRotateAll] = useState(false);

  function linkFor(c: SeedCampus): string {
    return `${baseUrl}/intake/${c.slug}?key=${c.access_token}`;
  }

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
      rows.push(
        `"${c.display_name}",${c.region},${c.language},${c.status},${c.progress_pct}%,"${linkFor(c)}"`
      );
    }
    await navigator.clipboard.writeText(rows.join("\n"));
    setMessage("CSV copied to clipboard.");
  }

  async function rotateOne(slug: string) {
    if (!confirm("Rotating will invalidate the current link. The pastor will need the new one. Continue?")) return;
    setBusySlug(slug);
    setMessage(null);
    const res = await fetch("/api/intake/admin/rotate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ campusSlug: slug }),
    });
    const json = await res.json();
    setBusySlug(null);
    if (!res.ok) {
      setMessage(`Rotate failed: ${json.error ?? "unknown"}`);
      return;
    }
    setCampuses((prev) =>
      prev.map((c) => (c.slug === slug ? { ...c, access_token: json.access_token } : c))
    );
    setMessage(`Rotated ${slug}. Old link is now dead.`);
  }

  async function rotateAll() {
    setBusy(true);
    setConfirmRotateAll(false);
    setMessage(null);
    const res = await fetch("/api/intake/admin/rotate", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ all: true }),
    });
    const json = await res.json();
    setBusy(false);
    if (!res.ok) {
      setMessage(`Rotate-all failed: ${json.error ?? "unknown"}`);
      return;
    }
    // Update local state with new tokens.
    setCampuses((prev) =>
      prev.map((c) => {
        const updated = (json.campuses as SeedCampus[]).find((u) => u.slug === c.slug);
        return updated ? { ...c, access_token: updated.access_token } : c;
      })
    );
    setMessage(`Rotated ${json.rotated} campus token${json.rotated === 1 ? "" : "s"}. All previous links are dead.`);
  }

  function inviteMailto(c: SeedCampus): string {
    const subject = `Welcome to the new Futures Church website — your ${c.display_name} link`;
    const isSpanish = c.language === "es";
    const isIndo = c.language === "id";
    const greeting = isSpanish ? "Hola" : isIndo ? "Halo" : "Hi";
    const body = `${greeting} ${c.display_name} team,

We're getting the new Futures Church website ready and we need you to fill in your campus's content. Below is your unique private link — bookmark it. It's just for ${c.display_name} and won't expire.

${linkFor(c)}

It opens to two tabs:
  • "Intake form" — 13 short sections (your story, service times, pastors, kids ministry, accessibility, etc.). Auto-saves as you type.
  • "Events" — add what's coming up at ${c.display_name}, with cover images.

You can fill it in over a few sittings — come back any time. Drop a comment in any section if anything's unclear and we'll see it.

If you have photos to contribute, drop them all into section 5 ("Photos"). The design team will pick which goes where.

Thank you — we can't wait to see ${c.display_name} on the new site.

— The Futures family`;
    const email = ""; // we don't have it stored yet — leave for the admin to fill
    return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  // Group by region for readability.
  const byRegion: Record<string, SeedCampus[]> = {};
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
          {busy ? "Working…" : campuses.length === 0 ? "Create links for all campuses" : "Sync (add new campuses)"}
        </button>
        {campuses.length > 0 && (
          <>
            <button
              type="button"
              onClick={copyAllAsCsv}
              className="rounded-full border border-ink-900/15 bg-cream/70 px-5 py-2.5 font-ui text-[11px] uppercase tracking-[0.22em] text-ink-900 hover:bg-cream-300"
            >
              Copy all as CSV
            </button>
            <button
              type="button"
              onClick={() => setConfirmRotateAll(true)}
              className="rounded-full border border-red-700/40 bg-cream/70 px-5 py-2.5 font-ui text-[11px] uppercase tracking-[0.22em] text-red-700 hover:bg-red-50"
            >
              Rotate all tokens
            </button>
          </>
        )}
        {message && (
          <span className="font-ui text-[11px] uppercase tracking-[0.18em] text-ink-500">
            {message}
          </span>
        )}
      </div>

      {confirmRotateAll && (
        <div className="mt-6 rounded-3xl border border-red-700/40 bg-red-50/40 px-7 py-6">
          <p className="font-display italic text-red-900" style={{ fontSize: 18, lineHeight: 1.4 }}>
            This will invalidate every campus&rsquo;s current link.
          </p>
          <p className="mt-2 font-sans text-body-sm text-red-900/80">
            Any pastor who has the old link will get an &ldquo;invalid token&rdquo; page. Use this only when
            tokens have leaked or you&rsquo;re cycling secrets before launch. After rotating, you&rsquo;ll need
            to email the new link to every pastor.
          </p>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={rotateAll}
              disabled={busy}
              className="rounded-full bg-red-700 px-5 py-2.5 font-ui text-[11px] uppercase tracking-[0.24em] text-cream hover:bg-red-800 disabled:opacity-40"
            >
              {busy ? "Rotating…" : "Yes, rotate all"}
            </button>
            <button
              type="button"
              onClick={() => setConfirmRotateAll(false)}
              className="rounded-full border border-red-700/30 px-5 py-2.5 font-ui text-[11px] uppercase tracking-[0.22em] text-red-900"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

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
                const link = linkFor(c);
                const isBusy = busySlug === c.slug;
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
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <code className="flex-1 min-w-0 truncate rounded-lg border border-ink-900/10 bg-cream-50 px-3 py-2 font-mono text-body-sm text-ink-700">
                        {link}
                      </code>
                      <button
                        type="button"
                        onClick={() => copy(c.slug, link)}
                        className="rounded-full bg-ink-900 px-4 py-2 font-ui text-[10px] uppercase tracking-[0.22em] text-cream hover:bg-warm-700"
                      >
                        {copiedSlug === c.slug ? "Copied" : "Copy"}
                      </button>
                      <a
                        href={inviteMailto(c)}
                        className="rounded-full border border-ink-900/15 bg-cream/70 px-4 py-2 font-ui text-[10px] uppercase tracking-[0.22em] text-ink-700 hover:bg-cream-300"
                        title="Open your email client with a pre-written invitation"
                      >
                        Email invite
                      </a>
                      <button
                        type="button"
                        onClick={() => rotateOne(c.slug)}
                        disabled={isBusy}
                        className="rounded-full border border-red-700/40 bg-cream/70 px-4 py-2 font-ui text-[10px] uppercase tracking-[0.22em] text-red-700 hover:bg-red-50 disabled:opacity-40"
                        title="Generate a new token. Old link will stop working."
                      >
                        {isBusy ? "Rotating…" : "Rotate"}
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
