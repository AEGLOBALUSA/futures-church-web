"use client";

import { useMemo } from "react";
import type { IntakeSection } from "@/lib/intake/sections";
import { isFieldComplete } from "@/lib/intake/sections";
import { FieldInput } from "./FieldInput";
import { RepositoryPhotoZone, type RepositoryPhotoTile } from "./RepositoryPhotoZone";
import { CommentThread } from "./CommentThread";
import type { IntakeComment } from "@/lib/intake/server";
import * as LucideIcons from "lucide-react";

export function SectionCard({
  section,
  index,
  open,
  onToggle,
  responses,
  editors,
  comments,
  token,
  editorName,
  campusSlug,
  repositoryPhotos,
  repositoryPhotoCount,
  onSaveField,
  onAddComment,
  onRepositoryCountChange,
}: {
  section: IntakeSection;
  index: number;
  open: boolean;
  onToggle: () => void;
  responses: Record<string, unknown>;
  editors: Record<string, { name: string | null; at: string } | undefined>;
  comments: IntakeComment[];
  token: string;
  editorName: string;
  campusSlug: string;
  repositoryPhotos: RepositoryPhotoTile[];
  repositoryPhotoCount: number;
  onSaveField: (
    sectionKey: string,
    fieldKey: string,
    value: unknown
  ) => Promise<{ ok: boolean; lastEditedAt?: string; error?: string }>;
  onAddComment: (sectionKey: string, comment: IntakeComment) => void;
  onRepositoryCountChange?: (count: number) => void;
}) {
  const completion = useMemo(() => {
    const required = section.fields.filter((f) => f.required);
    const photoCount = section.key === "photos" ? repositoryPhotoCount : 0;
    if (required.length === 0) {
      const any = section.fields.some((f) =>
        isFieldComplete(f, responses[f.key], photoCount)
      );
      return any ? "started" : "empty";
    }
    const filled = required.filter((f) =>
      isFieldComplete(f, responses[f.key], photoCount)
    ).length;
    if (filled === 0) return "empty";
    if (filled < required.length) return "partial";
    return "complete";
  }, [section, responses, repositoryPhotoCount]);

  const Icon =
    (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[
      section.icon
    ] ?? LucideIcons.Circle;

  return (
    <article
      className={`overflow-hidden rounded-3xl border transition ${
        open
          ? "border-ink-900/15 bg-cream/95 shadow-[0_28px_60px_-32px_rgba(20,20,20,0.18)]"
          : "border-ink-900/10 bg-cream/70 hover:bg-cream/90"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-5 px-5 py-5 text-left sm:px-7 sm:py-6"
        aria-expanded={open}
      >
        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-cream-300 text-ink-900">
          <Icon className="size-5" />
        </span>
        <span className="flex-1 min-w-0">
          <span className="block font-ui text-[10px] uppercase tracking-[0.24em] text-ink-500">
            {String(index + 1).padStart(2, "0")} · {section.estimatedMinutes} min
          </span>
          <span className="mt-1 block font-display text-display-md text-ink-900 leading-tight">
            {section.title}
          </span>
          {!open && (
            <span className="mt-1.5 block font-sans text-body-sm text-ink-600 line-clamp-2">
              {section.lead}
            </span>
          )}
        </span>
        <CompletionDot status={completion} />
      </button>

      {open && (
        <div className="border-t border-ink-900/10 px-5 py-7 sm:px-9 sm:py-9">
          <p className="max-w-prose font-display text-body-lg italic text-ink-700">
            {section.lead}
          </p>

          <div className="mt-7 space-y-7">
            {section.fields.map((field) => {
              if (field.type === "photo-repository") {
                return (
                  <div key={field.key} className="space-y-2">
                    <label className="font-display text-body-lg italic text-ink-900">
                      {field.label}
                      {field.required && (
                        <span className="ml-1.5 text-accent">·</span>
                      )}
                    </label>
                    {field.helper && (
                      <p className="font-sans text-body-sm text-ink-600">{field.helper}</p>
                    )}
                    <RepositoryPhotoZone
                      campusSlug={campusSlug}
                      token={token}
                      editorName={editorName}
                      initialPhotos={repositoryPhotos}
                      minPhotos={field.minPhotos}
                      onCountChange={onRepositoryCountChange}
                    />
                  </div>
                );
              }
              return (
                <FieldInput
                  key={field.key}
                  field={field}
                  value={responses[field.key]}
                  lastEditor={editors[`${section.key}:${field.key}`]}
                  onSave={(v) => onSaveField(section.key, field.key, v)}
                />
              );
            })}
          </div>

          <CommentThread
            comments={comments}
            sectionKey={section.key}
            token={token}
            editorName={editorName}
            onAdd={(c) => onAddComment(section.key, c)}
          />
        </div>
      )}
    </article>
  );
}

function CompletionDot({ status }: { status: "empty" | "started" | "partial" | "complete" }) {
  const map = {
    empty: { bg: "bg-cream-300", label: "Empty" },
    started: { bg: "bg-warm-400", label: "Started" },
    partial: { bg: "bg-warm-400", label: "Partial" },
    complete: { bg: "bg-emerald-700", label: "Complete" },
  } as const;
  const cfg = map[status];
  return (
    <span className="flex shrink-0 flex-col items-center gap-1.5">
      <span className={`size-2.5 rounded-full ${cfg.bg}`} aria-label={cfg.label} />
      <span className="hidden font-ui text-[9px] uppercase tracking-[0.2em] text-ink-500 sm:inline">
        {cfg.label}
      </span>
    </span>
  );
}
