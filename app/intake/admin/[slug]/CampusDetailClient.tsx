"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { IntakeSection } from "@/lib/intake/sections";
import type { IntakeCampus, IntakeComment, IntakePhoto } from "@/lib/intake/server";

type PhotoWithUrl = IntakePhoto & { signedUrl: string | null };
type ActivityRow = {
  id: number;
  event_type: string;
  description: string;
  actor_name: string | null;
  created_at: string;
};

export function CampusDetailClient({
  campus,
  sections,
  responseBySection,
  editorBySection,
  photosBySection,
  commentsBySection,
  activity,
  accessLink,
}: {
  campus: IntakeCampus;
  sections: IntakeSection[];
  responseBySection: Record<string, Record<string, unknown>>;
  editorBySection: Record<string, { name: string | null; at: string }>;
  photosBySection: Record<string, PhotoWithUrl[]>;
  commentsBySection: Record<string, IntakeComment[]>;
  activity: ActivityRow[];
  accessLink: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(accessLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <main className="mx-auto max-w-3xl px-5 pb-32 pt-12 sm:px-8 sm:pt-16">
      <p className="font-ui text-[11px] uppercase tracking-[0.28em] text-ink-500">
        {campus.region} · {campus.language} · {campus.status}
      </p>
      <h1 className="mt-3 font-display text-display-xl leading-[0.96] text-ink-900">
        {campus.display_name}
      </h1>
      <p className="mt-4 font-display text-body-lg italic text-ink-700">
        {campus.progress_pct}% complete · last activity{" "}
        {campus.last_activity_at ? new Date(campus.last_activity_at).toLocaleString() : "never"}.
      </p>

      <section className="mt-8 rounded-3xl border border-ink-900/10 bg-cream/95 px-6 py-5">
        <p className="font-ui text-[10px] uppercase tracking-[0.24em] text-ink-500">Pastor link</p>
        <div className="mt-2 flex items-center gap-3">
          <code className="flex-1 truncate rounded-lg border border-ink-900/10 bg-cream-50 px-3 py-2 font-mono text-body-sm text-ink-700">
            {accessLink}
          </code>
          <button
            type="button"
            onClick={copy}
            className="rounded-full bg-ink-900 px-4 py-2 font-ui text-[10px] uppercase tracking-[0.22em] text-cream hover:bg-warm-700"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        {campus.primary_pastor_email && (
          <p className="mt-3 font-sans text-body-sm text-ink-600">
            Primary contact:{" "}
            <a className="text-accent underline underline-offset-4" href={`mailto:${campus.primary_pastor_email}`}>
              {campus.primary_pastor_email}
            </a>
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href={`/intake/admin/${campus.slug}/photos`}
            className="inline-flex items-center gap-2 rounded-full border border-ink-900/15 bg-cream-50 px-4 py-2 font-ui text-[11px] uppercase tracking-[0.22em] text-ink-900 hover:bg-cream-300"
          >
            Photo curator →
          </Link>
        </div>
      </section>

      <section className="mt-12 space-y-6">
        {sections.map((section, idx) => {
          const r = responseBySection[section.key] ?? {};
          const ph = photosBySection[section.key] ?? [];
          const cm = commentsBySection[section.key] ?? [];
          const hasContent =
            Object.values(r).some(Boolean) || ph.length > 0 || cm.length > 0;
          return (
            <article
              key={section.key}
              id={section.key}
              className="rounded-3xl border border-ink-900/10 bg-cream/80 px-6 py-7 sm:px-8 sm:py-8"
            >
              <header>
                <p className="font-ui text-[10px] uppercase tracking-[0.24em] text-ink-500">
                  {String(idx + 1).padStart(2, "0")} · {section.title}
                </p>
                <p className="mt-1 font-display text-body-lg italic text-ink-700">
                  {section.lead}
                </p>
              </header>

              {!hasContent && (
                <p className="mt-5 font-sans text-body-sm italic text-ink-400">
                  Nothing here yet.
                </p>
              )}

              <div className="mt-6 space-y-5">
                {section.fields.map((field) => {
                  if (field.type === "photo-repository") {
                    if (ph.length === 0) return null;
                    return (
                      <div key={field.key}>
                        <p className="font-ui text-[10px] uppercase tracking-[0.2em] text-ink-500">
                          {field.label}
                        </p>
                        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                          {ph.map((p) => (
                            <figure key={p.id} className="overflow-hidden rounded-2xl border border-ink-900/10 bg-cream-300">
                              <div className="relative aspect-[4/5]">
                                {p.signedUrl ? (
                                  <Image src={p.signedUrl} alt={p.caption ?? p.file_name ?? "photo"} fill sizes="33vw" className="object-cover" unoptimized />
                                ) : (
                                  <div className="flex h-full items-center justify-center font-ui text-body-sm text-ink-500">…</div>
                                )}
                              </div>
                              {p.caption && (
                                <figcaption className="border-t border-ink-900/10 px-3 py-2 font-sans text-body-sm text-ink-700">
                                  {p.caption}
                                </figcaption>
                              )}
                            </figure>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  const v = r[field.key];
                  if (v == null || v === "") return null;
                  if (field.type === "service-times") {
                    if (!Array.isArray(v) || v.length === 0) return null;
                    return (
                      <div key={field.key}>
                        <p className="font-ui text-[10px] uppercase tracking-[0.2em] text-ink-500">
                          {field.label}
                        </p>
                        <ul className="mt-2 space-y-1 font-sans text-body text-ink-900">
                          {(v as Array<{ day: string; time: string; timezone: string }>).map((t, i) => (
                            <li key={i}>
                              {[t.day, t.time, t.timezone].filter(Boolean).join(" · ") || <span className="italic text-ink-400">empty row</span>}
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  }
                  const editor = editorBySection[`${section.key}:${field.key}`];
                  return (
                    <div key={field.key}>
                      <p className="font-ui text-[10px] uppercase tracking-[0.2em] text-ink-500">
                        {field.label}
                      </p>
                      <p className="mt-1.5 whitespace-pre-wrap font-sans text-body text-ink-900">
                        {String(v)}
                      </p>
                      {editor?.name && (
                        <p className="mt-1 font-ui text-[10px] uppercase tracking-[0.18em] text-ink-400">
                          {editor.name} · {new Date(editor.at).toLocaleString()}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {cm.length > 0 && (
                <div className="mt-6 border-t border-ink-900/10 pt-4">
                  <p className="font-ui text-[10px] uppercase tracking-[0.2em] text-ink-500">
                    Team notes
                  </p>
                  <ul className="mt-3 space-y-2">
                    {cm.map((c) => (
                      <li key={c.id} className="rounded-xl border border-ink-900/10 bg-cream-50 px-4 py-3">
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="font-ui text-[10px] uppercase tracking-[0.18em] text-ink-500">
                            {c.author_name ?? "Someone"}
                          </span>
                          <time className="font-ui text-[10px] uppercase tracking-[0.18em] text-ink-400">
                            {new Date(c.created_at).toLocaleString()}
                          </time>
                        </div>
                        <p className="mt-1.5 whitespace-pre-wrap font-sans text-body-sm text-ink-900">
                          {c.body}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </article>
          );
        })}
      </section>

      <section className="mt-12 rounded-3xl border border-ink-900/10 bg-cream/80 px-6 py-7">
        <p className="font-ui text-[10px] uppercase tracking-[0.24em] text-ink-500">
          Recent activity
        </p>
        {activity.length === 0 ? (
          <p className="mt-3 font-sans text-body-sm italic text-ink-500">
            Nothing yet.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-ink-900/5">
            {activity.map((a) => (
              <li key={a.id} className="flex flex-wrap items-baseline justify-between gap-3 py-2">
                <span className="font-sans text-body-sm text-ink-700">
                  <span className="font-display italic text-ink-900">{a.actor_name ?? "Someone"}</span>{" "}
                  · {a.event_type} · {a.description}
                </span>
                <time className="font-ui text-[10px] uppercase tracking-[0.18em] text-ink-400">
                  {new Date(a.created_at).toLocaleString()}
                </time>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
