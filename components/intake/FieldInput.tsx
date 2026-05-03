"use client";

import { useEffect, useRef, useState } from "react";
import type { IntakeField } from "@/lib/intake/sections";
import { SaveIndicator, type SaveStatus } from "./SaveIndicator";

export function FieldInput({
  field,
  value,
  onSave,
  lastEditor,
}: {
  field: IntakeField;
  value: unknown;
  onSave: (newValue: unknown) => Promise<{ ok: boolean; lastEditedAt?: string; error?: string }>;
  lastEditor?: { name: string | null; at: string } | null;
}) {
  const [local, setLocal] = useState<unknown>(value ?? defaultFor(field));
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [savedAt, setSavedAt] = useState<string | null>(lastEditor?.at ?? null);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (lastEditor?.at) setSavedAt(lastEditor.at);
  }, [lastEditor?.at]);

  function trigger(next: unknown) {
    setLocal(next);
    setStatus("saving");
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const res = await onSave(next);
      if (res.ok) {
        setStatus("saved");
        setSavedAt(res.lastEditedAt ?? new Date().toISOString());
        setError(null);
      } else {
        setStatus("error");
        setError(res.error ?? "save failed");
      }
    }, 1200);
  }

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <label className="font-display text-body-lg italic text-ink-900">
          {field.label}
          {field.required && <span className="ml-1.5 text-accent">·</span>}
        </label>
        <SaveIndicator status={status} savedAt={savedAt} error={error} />
      </div>
      {field.helper && (
        <p className="font-sans text-body-sm text-ink-600">{field.helper}</p>
      )}
      {renderInput(field, local, trigger)}
      {lastEditor?.name && status === "idle" && (
        <p className="font-ui text-[10px] uppercase tracking-[0.18em] text-ink-400">
          last edit · {lastEditor.name}
        </p>
      )}
    </div>
  );
}

function defaultFor(field: IntakeField) {
  if (field.type === "service-times") return [];
  return "";
}

function renderInput(
  field: IntakeField,
  value: unknown,
  set: (v: unknown) => void
) {
  const baseInput =
    "w-full rounded-xl border border-ink-900/10 bg-cream-50 px-4 py-3 font-sans text-body text-ink-900 placeholder:text-ink-400 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent-ring transition";

  switch (field.type) {
    case "longtext": {
      const v = typeof value === "string" ? value : "";
      const max = field.maxLength;
      return (
        <div>
          <textarea
            value={v}
            onChange={(e) => set(e.target.value)}
            placeholder={field.placeholder}
            rows={Math.max(3, Math.min(10, Math.ceil((v.length || 60) / 60)))}
            maxLength={max}
            className={`${baseInput} resize-y leading-relaxed`}
          />
          {max && (
            <div className="mt-1 text-right font-ui text-[10px] uppercase tracking-[0.18em] text-ink-400">
              {v.length} / {max}
            </div>
          )}
        </div>
      );
    }
    case "service-times":
      return <ServiceTimesEditor value={Array.isArray(value) ? (value as ServiceTime[]) : []} onChange={set} />;
    case "email":
      return (
        <input
          type="email"
          value={typeof value === "string" ? value : ""}
          onChange={(e) => set(e.target.value)}
          placeholder={field.placeholder ?? "you@yourchurch.com"}
          autoComplete="email"
          className={baseInput}
        />
      );
    case "phone":
      return (
        <input
          type="tel"
          value={typeof value === "string" ? value : ""}
          onChange={(e) => set(e.target.value)}
          placeholder={field.placeholder ?? "+61 …"}
          autoComplete="tel"
          className={baseInput}
        />
      );
    case "url":
    case "social":
      return (
        <input
          type="url"
          value={typeof value === "string" ? value : ""}
          onChange={(e) => set(e.target.value)}
          placeholder={field.placeholder ?? "https://"}
          inputMode="url"
          className={baseInput}
        />
      );
    case "photo-repository":
      // Handled by SectionCard via RepositoryPhotoZone — never reaches FieldInput.
      return null;
    case "text":
    default:
      return (
        <input
          type="text"
          value={typeof value === "string" ? value : ""}
          onChange={(e) => set(e.target.value)}
          placeholder={field.placeholder}
          maxLength={field.maxLength}
          className={baseInput}
        />
      );
  }
}

type ServiceTime = { day: string; time: string; timezone: string };

function ServiceTimesEditor({ value, onChange }: { value: ServiceTime[]; onChange: (v: ServiceTime[]) => void }) {
  const list = value.length > 0 ? value : [{ day: "", time: "", timezone: "" }];
  function update(idx: number, patch: Partial<ServiceTime>) {
    const next = list.map((row, i) => (i === idx ? { ...row, ...patch } : row));
    onChange(next);
  }
  function add() {
    onChange([...list, { day: "", time: "", timezone: "" }]);
  }
  function remove(idx: number) {
    const next = list.filter((_, i) => i !== idx);
    onChange(next.length > 0 ? next : [{ day: "", time: "", timezone: "" }]);
  }
  return (
    <div className="space-y-2">
      {list.map((row, idx) => (
        <div key={idx} className="grid grid-cols-1 gap-2 sm:grid-cols-[1.2fr_1fr_1fr_auto]">
          <input
            type="text"
            value={row.day}
            onChange={(e) => update(idx, { day: e.target.value })}
            placeholder="Sundays"
            className="rounded-xl border border-ink-900/10 bg-cream-50 px-3 py-2.5 font-sans text-body-sm text-ink-900 placeholder:text-ink-400 focus:border-accent focus:outline-none"
          />
          <input
            type="text"
            value={row.time}
            onChange={(e) => update(idx, { time: e.target.value })}
            placeholder="10:00am"
            className="rounded-xl border border-ink-900/10 bg-cream-50 px-3 py-2.5 font-sans text-body-sm text-ink-900 placeholder:text-ink-400 focus:border-accent focus:outline-none"
          />
          <input
            type="text"
            value={row.timezone}
            onChange={(e) => update(idx, { timezone: e.target.value })}
            placeholder="ACDT (Adelaide)"
            className="rounded-xl border border-ink-900/10 bg-cream-50 px-3 py-2.5 font-sans text-body-sm text-ink-900 placeholder:text-ink-400 focus:border-accent focus:outline-none"
          />
          <button
            type="button"
            onClick={() => remove(idx)}
            className="self-stretch rounded-xl px-3 py-2 font-ui text-[10px] uppercase tracking-[0.18em] text-ink-500 hover:text-red-700"
            aria-label="Remove this service time"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="rounded-full border border-ink-900/15 bg-cream/60 px-4 py-1.5 font-ui text-[11px] uppercase tracking-[0.2em] text-ink-900 hover:bg-cream-300"
      >
        + Add another service
      </button>
    </div>
  );
}
