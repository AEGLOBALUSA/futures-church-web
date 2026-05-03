"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { IntakeSection } from "@/lib/intake/sections";
import { computeProgressPct, intakeSections, isFieldComplete } from "@/lib/intake/sections";
import type { IntakeCampus, IntakeComment } from "@/lib/intake/server";
import { ProgressRing } from "@/components/intake/ProgressRing";
import { SectionCard } from "@/components/intake/SectionCard";
import type { RepositoryPhotoTile } from "@/components/intake/RepositoryPhotoZone";
import { EventsTabNav } from "@/components/events/EventsListClient";

type EditorEntry = { name: string | null; at: string };

export function IntakeClient({
  campus,
  sections,
  initialResponses,
  initialEditors,
  initialRepositoryPhotos,
  initialComments,
  token,
}: {
  campus: IntakeCampus;
  sections: IntakeSection[];
  initialResponses: Record<string, Record<string, unknown>>;
  initialEditors: Record<string, EditorEntry>;
  initialRepositoryPhotos: RepositoryPhotoTile[];
  initialComments: Record<string, IntakeComment[]>;
  token: string;
}) {
  const [responses, setResponses] = useState(initialResponses);
  const [editors, setEditors] = useState(initialEditors);
  const [repositoryPhotos] = useState<RepositoryPhotoTile[]>(initialRepositoryPhotos);
  const [repositoryCount, setRepositoryCount] = useState<number>(initialRepositoryPhotos.length);
  const [comments, setComments] = useState(initialComments);
  const [openSection, setOpenSection] = useState<string | null>(sections[0]?.key ?? null);
  const [editorName, setEditorName] = useState<string>("");
  const [askedName, setAskedName] = useState(false);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem(`intake:${token}:editor`) : null;
    if (stored) {
      setEditorName(stored);
      setAskedName(true);
    } else {
      setAskedName(false);
    }
  }, [token]);

  function commitEditorName(name: string) {
    const trimmed = name.trim().slice(0, 80);
    setEditorName(trimmed);
    setAskedName(true);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(`intake:${token}:editor`, trimmed);
    }
  }

  // Live progress — recomputes from current responses + the live repo photo count.
  const livePct = useMemo(() => {
    const photoCounts: Record<string, number> = {};
    for (const section of intakeSections) {
      for (const field of section.fields) {
        if (field.type === "photo-repository") {
          photoCounts[`${section.key}:${field.key}`] = repositoryCount;
        }
      }
    }
    return computeProgressPct(responses, photoCounts);
  }, [responses, repositoryCount]);

  async function onSaveField(sectionKey: string, fieldKey: string, value: unknown) {
    setResponses((prev) => ({
      ...prev,
      [sectionKey]: { ...(prev[sectionKey] ?? {}), [fieldKey]: value },
    }));
    const res = await fetch("/api/intake/save", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        token,
        sectionKey,
        fieldKey,
        value,
        editedBy: editorName || null,
      }),
    });
    const json = await res.json();
    if (res.ok) {
      setEditors((prev) => ({
        ...prev,
        [`${sectionKey}:${fieldKey}`]: { name: editorName || null, at: json.lastEditedAt },
      }));
      return { ok: true as const, lastEditedAt: json.lastEditedAt as string };
    }
    return { ok: false as const, error: json.error ?? "save failed" };
  }

  function onAddComment(sectionKey: string, comment: IntakeComment) {
    setComments((prev) => ({
      ...prev,
      [sectionKey]: [...(prev[sectionKey] ?? []), comment],
    }));
  }

  // Stats for the header strip.
  const stats = useMemo(() => {
    let complete = 0;
    let partial = 0;
    for (const s of sections) {
      const required = s.fields.filter((f) => f.required);
      const r = responses[s.key] ?? {};
      const photoCount = s.key === "photos" ? repositoryCount : 0;
      const filled = required.filter((f) => isFieldComplete(f, r[f.key], photoCount)).length;
      if (required.length === 0) {
        if (Object.values(r).some(Boolean)) partial += 1;
      } else if (filled === required.length) {
        complete += 1;
      } else if (filled > 0 || photoCount > 0) {
        partial += 1;
      }
    }
    return { complete, partial, total: sections.length };
  }, [sections, responses, repositoryCount]);

  const langGreeting = (() => {
    const lang = (responses.welcome?.language as string | undefined)?.toLowerCase() ?? campus.language;
    if (lang.includes("español") || lang.includes("spanish") || lang === "es") return "Bienvenidos";
    if (lang.includes("indonesia") || lang === "id" || lang.includes("bahasa")) return "Selamat datang";
    return "Welcome";
  })();

  return (
    <div className="min-h-screen bg-cream-200">
      {!askedName && (
        <NameGate campusName={campus.display_name} onSubmit={commitEditorName} />
      )}

      <header className="border-b border-ink-900/10 bg-cream/80 backdrop-blur sticky top-0 z-40">
        <div className="mx-auto flex max-w-shell items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <Link href="/" className="font-display text-body-lg text-ink-900">
            Futures<span className="text-accent">.</span>
          </Link>
          <span className="font-ui text-[10px] uppercase tracking-[0.24em] text-ink-500">
            {campus.display_name} · campus portal
          </span>
          {editorName && (
            <span className="hidden font-ui text-[10px] uppercase tracking-[0.18em] text-ink-500 sm:inline">
              you · {editorName}
            </span>
          )}
        </div>
        <div className="mx-auto max-w-shell px-5 sm:px-8">
          <EventsTabNav current="intake" campusSlug={campus.slug} token={token} />
        </div>
      </header>

      <section className="mx-auto max-w-shell px-5 pt-12 sm:px-8 sm:pt-20">
        <div className="grid gap-10 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <p className="font-ui text-[11px] uppercase tracking-[0.28em] text-ink-500">
              {langGreeting}, {campus.display_name} team
            </p>
            <h1 className="mt-3 font-display text-display-xl leading-[0.96] text-ink-900">
              Let&rsquo;s bring your campus home.
            </h1>
            <p className="mt-5 max-w-prose font-display text-body-lg italic text-ink-700">
              {sections.length} short sections. Roughly an hour total — but you don&rsquo;t have to
              do it in one sitting. Everything saves itself the moment you stop typing. Come back
              any time with this same link.
            </p>
          </div>
          <ProgressRing pct={livePct} size={120} />
        </div>

        <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-ink-900/10 bg-cream/70 px-4 py-2 font-ui text-[11px] uppercase tracking-[0.2em] text-ink-700">
          <span className="size-1.5 rounded-full bg-emerald-700" />
          {stats.complete} complete
          <span className="text-ink-300">·</span>
          <span className="size-1.5 rounded-full bg-warm-400" />
          {stats.partial} in progress
          <span className="text-ink-300">·</span>
          <span className="size-1.5 rounded-full bg-cream-300 ring-1 ring-ink-900/15" />
          {stats.total - stats.complete - stats.partial} not started
        </div>
      </section>

      <main className="mx-auto max-w-3xl px-5 pb-32 pt-12 sm:px-8 sm:pt-16">
        <div className="space-y-4">
          {sections.map((section, idx) => (
            <SectionCard
              key={section.key}
              section={section}
              index={idx}
              open={openSection === section.key}
              onToggle={() => setOpenSection((o) => (o === section.key ? null : section.key))}
              responses={responses[section.key] ?? {}}
              editors={editors}
              comments={comments[section.key] ?? []}
              token={token}
              editorName={editorName}
              campusSlug={campus.slug}
              repositoryPhotos={section.key === "photos" ? repositoryPhotos : []}
              repositoryPhotoCount={section.key === "photos" ? repositoryCount : 0}
              onSaveField={onSaveField}
              onAddComment={onAddComment}
              onRepositoryCountChange={section.key === "photos" ? setRepositoryCount : undefined}
            />
          ))}
        </div>

        <div className="mt-16 rounded-3xl border border-ink-900/10 bg-cream/70 px-7 py-10 text-center">
          <p className="font-display text-display-md italic text-ink-900">
            Done for now? Close the tab. Everything&rsquo;s saved.
          </p>
          <p className="mt-3 font-sans text-body text-ink-600">
            We see your progress in real time. When you&rsquo;re ready,{" "}
            <a className="text-accent underline underline-offset-4" href="mailto:hello@futures.church">
              hello@futures.church
            </a>{" "}
            is the human on the other end.
          </p>
        </div>
      </main>
    </div>
  );
}

function NameGate({
  campusName,
  onSubmit,
}: {
  campusName: string;
  onSubmit: (name: string) => void;
}) {
  const [name, setName] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cream-200/85 backdrop-blur-sm px-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (name.trim()) onSubmit(name);
        }}
        className="max-w-md w-full rounded-3xl border border-ink-900/10 bg-cream/95 px-7 py-10 shadow-[0_30px_80px_-30px_rgba(20,20,20,0.35)]"
      >
        <p className="font-ui text-[11px] uppercase tracking-[0.24em] text-ink-500">
          {campusName} · campus intake
        </p>
        <h2 className="mt-3 font-display text-display-md text-ink-900 leading-tight">
          Hi! What should we call you?
        </h2>
        <p className="mt-3 font-sans text-body-sm text-ink-600">
          Just so the team knows who&rsquo;s editing what. First name is fine.
        </p>
        <input
          autoFocus
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Sarah"
          className="mt-5 w-full rounded-xl border border-ink-900/10 bg-cream-50 px-4 py-3 font-sans text-body text-ink-900 placeholder:text-ink-400 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent-ring"
          maxLength={80}
        />
        <button
          type="submit"
          disabled={!name.trim()}
          className="mt-5 inline-flex items-center justify-center rounded-full bg-ink-900 px-6 py-2.5 font-ui text-[11px] uppercase tracking-[0.24em] text-cream transition hover:bg-warm-700 disabled:opacity-40"
        >
          Let&rsquo;s go →
        </button>
      </form>
    </div>
  );
}
