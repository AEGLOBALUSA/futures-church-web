"use client";

import { useEffect, useRef, useState } from "react";
import { Pencil, Check, X, AlertCircle } from "lucide-react";
import { useEditMode, useCanEditCampus } from "./EditModeProvider";

type EditableTextProps = {
  campusSlug: string;
  sectionKey: string;
  fieldKey: string;
  /** The currently rendered value (server-rendered). Used as the editor's initial value. */
  value: string;
  /** Maximum characters. Visible counter shown near the editor. */
  maxLength?: number;
  /** True for paragraph fields — uses textarea. False for single-line inputs. */
  multiline?: boolean;
  /** Tailwind classes to apply to the rendered text. The textarea matches them. */
  className?: string;
  /** Inline style for the rendered text. The textarea inherits the same. */
  style?: React.CSSProperties;
  /** Wrapper element. Defaults to <p> for prose; pass "span" for inline. */
  as?: keyof React.JSX.IntrinsicElements;
  /** Helper text shown under the editor (e.g. "max 200 chars"). */
  helper?: string;
  /** Optional placeholder if value is empty. */
  placeholder?: string;
};

type SaveStatus = "idle" | "saving" | "saved" | "error";

/**
 * Inline-editable text. Renders the value as static prose by default. When the
 * current visitor is an authorized editor AND has toggled edit mode on, the
 * element shows a dashed outline + pencil icon. Click → swap for an inline
 * editor that visually matches the rendered text. Save on blur or ⏎.
 */
export function EditableText({
  campusSlug,
  sectionKey,
  fieldKey,
  value,
  maxLength,
  multiline = true,
  className,
  style,
  as = "p",
  helper,
  placeholder,
}: EditableTextProps) {
  const { mode, editorName } = useEditMode();
  const canEdit = useCanEditCampus(campusSlug);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [serverValue, setServerValue] = useState(value);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | HTMLInputElement | null>(null);

  // Reset local draft when the server value changes (e.g. after revalidate).
  useEffect(() => {
    setServerValue(value);
    if (!editing) setDraft(value);
  }, [value, editing]);

  // Auto-grow textarea to match content.
  useEffect(() => {
    if (!editing || !multiline) return;
    const ta = textareaRef.current as HTMLTextAreaElement | null;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${ta.scrollHeight}px`;
  }, [editing, draft, multiline]);

  function startEdit() {
    if (!canEdit || !mode) return;
    setDraft(serverValue);
    setEditing(true);
    setError(null);
    // Focus + select on next tick.
    setTimeout(() => {
      textareaRef.current?.focus();
      if (textareaRef.current && "select" in textareaRef.current) {
        (textareaRef.current as HTMLTextAreaElement).select();
      }
    }, 20);
  }

  function cancelEdit() {
    setDraft(serverValue);
    setEditing(false);
    setError(null);
  }

  async function commitEdit() {
    const next = draft.trim();
    // No-op if unchanged.
    if (next === serverValue) {
      setEditing(false);
      return;
    }
    setStatus("saving");
    setError(null);
    try {
      const res = await fetch("/api/edit/save", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          campusSlug,
          sectionKey,
          fieldKey,
          value: next,
          editedBy: editorName || null,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setStatus("error");
        setError(json.error ?? "save failed");
        return;
      }
      setServerValue(next);
      setStatus("saved");
      setEditing(false);
      // Clear the "saved" indicator after a moment.
      setTimeout(() => setStatus("idle"), 2500);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "save failed");
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) {
    if (e.key === "Escape") {
      e.preventDefault();
      cancelEdit();
    }
    // ⏎ saves on single-line; Shift+⏎ inserts newline on multiline; ⌘⏎ saves multiline.
    if (e.key === "Enter") {
      if (!multiline || (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        commitEdit();
      }
    }
  }

  // Shared body for the rendered (non-editing) state.
  const renderedClass = `${className ?? ""} ${
    canEdit && mode
      ? "cursor-text relative outline-dashed outline-1 outline-offset-4 outline-accent/40 hover:outline-accent transition-[outline-color]"
      : ""
  }`;

  if (!editing) {
    const Wrapper = as as React.ElementType;
    return (
      <Wrapper
        className={renderedClass.trim()}
        style={style}
        onClick={startEdit}
        title={canEdit && mode ? "Tap to edit" : undefined}
      >
        {serverValue || (
          <span className="italic text-ink-400">{placeholder ?? "—"}</span>
        )}
        {canEdit && mode && (
          <span
            aria-hidden
            className="ml-2 inline-flex h-5 w-5 -translate-y-0.5 items-center justify-center rounded-full bg-accent/15 align-middle text-accent"
          >
            <Pencil className="size-3" strokeWidth={2} />
          </span>
        )}
        {status === "saved" && (
          <span
            aria-live="polite"
            className="ml-2 inline-flex items-center gap-1 align-middle font-ui text-[10px] uppercase tracking-[0.2em] text-emerald-700"
          >
            <Check className="size-3" /> saved
          </span>
        )}
      </Wrapper>
    );
  }

  // Editing — swap to a textarea/input visually matched to the rendered text.
  return (
    <div className="relative">
      {multiline ? (
        <textarea
          ref={textareaRef as React.RefObject<HTMLTextAreaElement>}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={commitEdit}
          maxLength={maxLength}
          className={`${className ?? ""} w-full resize-none border-0 outline-none ring-2 ring-accent rounded-md px-2 py-1 -mx-2 -my-1 bg-cream-50/90`}
          style={style}
          aria-label="Edit text"
        />
      ) : (
        <input
          ref={textareaRef as React.RefObject<HTMLInputElement>}
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={commitEdit}
          maxLength={maxLength}
          className={`${className ?? ""} w-full border-0 outline-none ring-2 ring-accent rounded-md px-2 py-1 -mx-2 -my-1 bg-cream-50/90`}
          style={style}
          aria-label="Edit text"
        />
      )}
      <div className="mt-1.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 text-ink-600">
          <span className="font-ui text-[10px] uppercase tracking-[0.18em]">
            {status === "saving" ? "saving…" : multiline ? "⌘+⏎ to save · esc to cancel" : "⏎ to save · esc to cancel"}
          </span>
          {helper && (
            <span className="font-sans text-[12px] text-ink-500">{helper}</span>
          )}
        </div>
        {maxLength && (
          <span
            className={`font-ui text-[10px] uppercase tracking-[0.18em] ${
              draft.length > maxLength * 0.95 ? "text-amber-700" : "text-ink-400"
            }`}
          >
            {draft.length} / {maxLength}
          </span>
        )}
      </div>
      {error && (
        <p className="mt-2 inline-flex items-center gap-1.5 font-sans text-[12px] text-red-700">
          <AlertCircle className="size-3.5" />
          {error}
          <button
            type="button"
            onClick={cancelEdit}
            className="ml-2 inline-flex items-center gap-1 underline underline-offset-4"
          >
            <X className="size-3" /> revert
          </button>
        </p>
      )}
    </div>
  );
}
