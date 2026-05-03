"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { IntakeSection } from "@/lib/intake/sections";
import { isFieldComplete } from "@/lib/intake/sections";
import type { IntakeCampus } from "@/lib/intake/server";

type ResponseRow = {
  campus_slug: string;
  section_key: string;
  field_key: string;
  value: unknown;
};
type PhotoRow = { campus_slug: string; section_key: string };
type ActivityRow = {
  id: number;
  campus_slug: string | null;
  event_type: string;
  description: string;
  actor_name: string | null;
  metadata: unknown;
  created_at: string;
};

type SectionStatus = "empty" | "started" | "partial" | "complete";

export function AdminDashboard({
  campuses,
  sections,
  responses,
  photos,
  activity,
}: {
  campuses: IntakeCampus[];
  sections: IntakeSection[];
  responses: ResponseRow[];
  photos: PhotoRow[];
  activity: ActivityRow[];
}) {
  const [tab, setTab] = useState<"grid" | "activity">("grid");
  const [region, setRegion] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");

  // Index responses & photo counts for fast section status lookups.
  const respIndex = useMemo(() => {
    const map: Record<string, Record<string, Record<string, unknown>>> = {};
    for (const r of responses) {
      if (!map[r.campus_slug]) map[r.campus_slug] = {};
      if (!map[r.campus_slug][r.section_key]) map[r.campus_slug][r.section_key] = {};
      map[r.campus_slug][r.section_key][r.field_key] = r.value;
    }
    return map;
  }, [responses]);

  const photoIndex = useMemo(() => {
    const map: Record<string, Record<string, number>> = {};
    for (const p of photos) {
      if (!map[p.campus_slug]) map[p.campus_slug] = {};
      map[p.campus_slug][p.section_key] = (map[p.campus_slug][p.section_key] ?? 0) + 1;
    }
    return map;
  }, [photos]);

  function sectionStatus(campusSlug: string, section: IntakeSection): SectionStatus {
    const r = respIndex[campusSlug]?.[section.key] ?? {};
    const photoCount = photoIndex[campusSlug]?.[section.key] ?? 0;
    const required = section.fields.filter((f) => f.required);
    if (required.length === 0) {
      const any = section.fields.some((f) => isFieldComplete(f, r[f.key], photoCount));
      return any ? "started" : "empty";
    }
    const filled = required.filter((f) => isFieldComplete(f, r[f.key], photoCount)).length;
    if (filled === 0) return "empty";
    if (filled < required.length) return "partial";
    return "complete";
  }

  // High-level rollup tiles.
  const stats = useMemo(() => {
    let complete = 0,
      started = 0,
      empty = 0;
    for (const c of campuses) {
      if (c.progress_pct >= 100) complete += 1;
      else if (c.progress_pct > 0) started += 1;
      else empty += 1;
    }
    return { complete, started, empty, total: campuses.length };
  }, [campuses]);

  const regions = useMemo(() => {
    const set = new Set<string>();
    campuses.forEach((c) => set.add(c.region));
    return Array.from(set).sort();
  }, [campuses]);

  const filtered = campuses.filter((c) => {
    if (region !== "all" && c.region !== region) return false;
    if (status !== "all") {
      if (status === "complete" && c.progress_pct < 100) return false;
      if (status === "in-progress" && (c.progress_pct === 0 || c.progress_pct >= 100)) return false;
      if (status === "empty" && c.progress_pct > 0) return false;
    }
    return true;
  });

  async function logout() {
    await fetch("/api/intake/admin/verify", { method: "POST" });
    window.location.href = "/intake/admin/login";
  }

  return (
    <div className="min-h-screen bg-cream-200">
      <header className="border-b border-ink-900/10 bg-cream/80 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto flex max-w-shell items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <Link href="/" className="font-display text-body-lg text-ink-900">
            Futures<span className="text-accent">.</span>
          </Link>
          <span className="flex flex-col items-center leading-tight">
            <span className="font-ui text-[10px] uppercase tracking-[0.24em] text-ink-500">
              Campus intake · admin
            </span>
            <Link
              href="/intake/admin/coverage"
              className="mt-1 font-display italic text-warm-700 hover:text-ink-900"
              style={{ fontSize: 12, fontWeight: 300 }}
            >
              edits
            </Link>
          </span>
          <button
            type="button"
            onClick={logout}
            className="font-ui text-[11px] uppercase tracking-[0.2em] text-ink-500 hover:text-ink-900"
          >
            Sign out
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-shell px-5 pt-12 sm:px-8 sm:pt-16">
        <p className="font-ui text-[11px] uppercase tracking-[0.28em] text-ink-500">Intake</p>
        <h1 className="mt-3 font-display text-display-xl leading-[0.96] text-ink-900">
          {stats.total} campuses, one master sheet.
        </h1>
        <p className="mt-5 max-w-prose font-display text-body-lg italic text-ink-700">
          Live status of every campus&rsquo;s answers as they fill in. Click any cell for the answer.
        </p>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Tile label="Campuses" value={stats.total} />
          <Tile label="Complete" value={stats.complete} dot="bg-emerald-700" />
          <Tile label="In progress" value={stats.started} dot="bg-warm-400" />
          <Tile label="Not started" value={stats.empty} dot="bg-cream-300 ring-1 ring-ink-900/15" />
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/intake/admin/seed"
            className="rounded-full border border-ink-900/15 bg-cream/70 px-4 py-1.5 font-ui text-[11px] uppercase tracking-[0.22em] text-ink-900 hover:bg-cream-300"
          >
            Campus links · seed & copy
          </Link>
          <Link
            href="/intake/admin/inbox"
            className="rounded-full border border-ink-900/15 bg-cream/70 px-4 py-1.5 font-ui text-[11px] uppercase tracking-[0.22em] text-ink-900 hover:bg-cream-300"
          >
            Inbox · contact + visit + prayer
          </Link>
          <Link
            href="/intake/admin/coverage"
            className="rounded-full border border-warm-500/40 bg-warm-500/10 px-4 py-1.5 font-ui text-[11px] uppercase tracking-[0.22em] text-warm-700 hover:bg-warm-500/20"
          >
            Edits · site-wide content
          </Link>
          <Link
            href="/intake/admin/activity"
            className="rounded-full border border-ink-900/15 bg-cream/70 px-4 py-1.5 font-ui text-[11px] uppercase tracking-[0.22em] text-ink-900 hover:bg-cream-300"
          >
            Activity · last 7 days
          </Link>
        </div>

        {stats.total === 0 && (
          <div className="mt-10 rounded-3xl border border-dashed border-ink-900/15 bg-cream/60 px-7 py-10 text-center">
            <p className="font-display text-body-lg italic text-ink-700">
              No campuses yet. Run the migration in Supabase, then{" "}
              <Link href="/intake/admin/seed" className="text-accent underline underline-offset-4">
                create links for all 25 campuses
              </Link>
              .
            </p>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-shell px-5 pb-32 pt-10 sm:px-8">
        <div className="flex flex-wrap items-center gap-3 border-b border-ink-900/10 pb-3">
          <Tab current={tab} value="grid" onClick={() => setTab("grid")}>Master grid</Tab>
          <Tab current={tab} value="activity" onClick={() => setTab("activity")}>Activity feed</Tab>

          <span className="ml-auto flex flex-wrap items-center gap-2">
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="rounded-full border border-ink-900/15 bg-cream/70 px-3 py-1.5 font-ui text-[11px] uppercase tracking-[0.18em] text-ink-700"
            >
              <option value="all">All regions</option>
              {regions.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="rounded-full border border-ink-900/15 bg-cream/70 px-3 py-1.5 font-ui text-[11px] uppercase tracking-[0.18em] text-ink-700"
            >
              <option value="all">Any status</option>
              <option value="complete">Complete</option>
              <option value="in-progress">In progress</option>
              <option value="empty">Not started</option>
            </select>
          </span>
        </div>

        {tab === "grid" && (
          <div className="mt-6 overflow-x-auto rounded-3xl border border-ink-900/10 bg-cream/70">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-cream/95 text-left">
                  <th className="sticky left-0 z-10 bg-cream/95 px-4 py-3 font-ui text-[10px] uppercase tracking-[0.2em] text-ink-500">
                    Campus
                  </th>
                  <th className="px-3 py-3 font-ui text-[10px] uppercase tracking-[0.2em] text-ink-500">
                    %
                  </th>
                  {sections.map((s, i) => (
                    <th
                      key={s.key}
                      className="px-2 py-3 font-ui text-[9px] uppercase tracking-[0.18em] text-ink-500"
                      title={s.title}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </th>
                  ))}
                  <th className="px-3 py-3 font-ui text-[10px] uppercase tracking-[0.2em] text-ink-500">
                    Last activity
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={sections.length + 3} className="px-4 py-10 text-center font-sans text-body-sm text-ink-500">
                      No campuses match these filters.
                    </td>
                  </tr>
                )}
                {filtered.map((c) => (
                  <tr key={c.slug} className="border-t border-ink-900/5 hover:bg-cream/95">
                    <td className="sticky left-0 z-10 bg-cream/70 px-4 py-3 hover:bg-cream/95">
                      <Link href={`/intake/admin/${c.slug}`} className="block">
                        <div className="font-display text-body italic text-ink-900">
                          {c.display_name}
                        </div>
                        <div className="font-ui text-[10px] uppercase tracking-[0.18em] text-ink-500">
                          {c.region} · {c.language}
                        </div>
                      </Link>
                    </td>
                    <td className="px-3 py-3 font-display text-body italic text-ink-900">
                      {c.progress_pct}%
                    </td>
                    {sections.map((s) => {
                      const st = sectionStatus(c.slug, s);
                      const cls =
                        st === "complete"
                          ? "bg-emerald-700"
                          : st === "partial" || st === "started"
                          ? "bg-warm-400"
                          : "bg-cream-300 ring-1 ring-ink-900/15";
                      return (
                        <td key={s.key} className="px-2 py-3" title={`${s.title} — ${st}`}>
                          <Link
                            href={`/intake/admin/${c.slug}#${s.key}`}
                            className="block"
                            aria-label={`${s.title} — ${st}`}
                          >
                            <span className={`mx-auto block size-3 rounded-full ${cls}`} />
                          </Link>
                        </td>
                      );
                    })}
                    <td className="px-3 py-3 font-ui text-[10px] uppercase tracking-[0.18em] text-ink-500">
                      {c.last_activity_at ? relativeTime(c.last_activity_at) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "activity" && (
          <div className="mt-6 rounded-3xl border border-ink-900/10 bg-cream/70 px-4 py-2 sm:px-7 sm:py-4">
            {activity.length === 0 ? (
              <p className="px-2 py-10 text-center font-sans text-body-sm italic text-ink-500">
                Nothing yet. Once campuses start filling in, you&rsquo;ll see every keystroke and upload here.
              </p>
            ) : (
              <ul className="divide-y divide-ink-900/5">
                {activity.map((a) => (
                  <li key={a.id} className="flex flex-wrap items-baseline justify-between gap-3 py-3">
                    <div>
                      <span className="font-display text-body italic text-ink-900">
                        {a.actor_name ?? "Someone"}
                      </span>
                      {a.campus_slug && (
                        <span className="ml-2 rounded-full bg-cream-300 px-2 py-0.5 font-ui text-[10px] uppercase tracking-[0.18em] text-ink-700">
                          {campusName(campuses, a.campus_slug)}
                        </span>
                      )}
                      <span className="ml-2 font-sans text-body-sm text-ink-600">
                        {humanEvent(a.event_type)} · {a.description}
                      </span>
                    </div>
                    <time className="font-ui text-[10px] uppercase tracking-[0.18em] text-ink-400">
                      {relativeTime(a.created_at)}
                    </time>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function Tile({ label, value, dot }: { label: string; value: number; dot?: string }) {
  return (
    <div className="rounded-2xl border border-ink-900/10 bg-cream/95 px-5 py-4">
      <div className="flex items-center gap-2">
        {dot && <span className={`size-1.5 rounded-full ${dot}`} />}
        <span className="font-ui text-[10px] uppercase tracking-[0.22em] text-ink-500">{label}</span>
      </div>
      <div className="mt-2 font-display text-display-md leading-none text-ink-900">{value}</div>
    </div>
  );
}

function Tab({
  current,
  value,
  onClick,
  children,
}: {
  current: string;
  value: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  const active = current === value;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 font-ui text-[11px] uppercase tracking-[0.22em] transition ${
        active ? "bg-ink-900 text-cream" : "text-ink-500 hover:text-ink-900"
      }`}
    >
      {children}
    </button>
  );
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60_000) return "just now";
  if (diff < 3600_000) return `${Math.round(diff / 60_000)}m ago`;
  if (diff < 86400_000) return `${Math.round(diff / 3600_000)}h ago`;
  return `${Math.round(diff / 86400_000)}d ago`;
}

function humanEvent(eventType: string): string {
  switch (eventType) {
    case "field_saved": return "edited";
    case "photo_uploaded": return "uploaded";
    case "comment_added": return "left a note";
    case "opened": return "opened the form";
    case "submitted": return "submitted";
    case "invited": return "invited";
    case "reminder_sent": return "reminded";
    default: return eventType;
  }
}

function campusName(campuses: IntakeCampus[], slug: string): string {
  return campuses.find((c) => c.slug === slug)?.display_name ?? slug;
}
