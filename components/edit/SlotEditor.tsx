"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { useEditMode } from "./EditModeProvider";
import type { SlotDefinition } from "@/lib/content/slots/registry";

/**
 * Site-wide content slot editor. Wraps a piece of editable copy.
 *
 * Three modes, in order of "is this person editing right now":
 *
 *   1. View mode (default for all visitors).
 *      Renders the value as plain text in the page's natural style.
 *      If the value is empty, renders nothing — the page just doesn't
 *      have that copy yet.
 *
 *   2. Review mode (admin signed in, edit mode toggled on).
 *      Empty slots show a warm dashed outline + a small floating
 *      assignee badge. Filled slots show a tiny green dot in the
 *      corner. Hover surfaces "click to edit."
 *
 *   3. Editing mode (clicked in review mode).
 *      The slot becomes a contenteditable surface inheriting the
 *      EXACT typography of its style preset — Fraunces italic display
 *      for display slots, Inter Tight for body. Same font, same size,
 *      same color, same line-height as the rendered output. No
 *      monospace, no developer chrome, no grey panels. Saves auto-
 *      debounced on idle (1.5s after last keystroke). Esc reverts.
 */

const STYLE_PRESETS: Record<
  SlotDefinition["style"],
  { className: string; style?: CSSProperties; emptyHeight: string }
> = {
  "display-italic-lg": {
    className:
      "font-display italic text-ink-900",
    style: { fontSize: "clamp(2rem, 4.4vw, 3rem)", fontWeight: 300, lineHeight: 1.02 },
    emptyHeight: "min-h-[3.5rem]",
  },
  "display-md": {
    className: "font-display italic text-ink-900",
    style: { fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 300, lineHeight: 1.1 },
    emptyHeight: "min-h-[2.5rem]",
  },
  "body-lg": {
    className: "font-sans text-ink-700",
    style: { fontSize: 17, lineHeight: 1.7 },
    emptyHeight: "min-h-[5rem]",
  },
  body: {
    className: "font-sans text-ink-700",
    style: { fontSize: 15, lineHeight: 1.65 },
    emptyHeight: "min-h-[3.5rem]",
  },
  eyebrow: {
    className: "font-ui uppercase tracking-[0.24em] text-ink-500",
    style: { fontSize: 11 },
    emptyHeight: "min-h-[1.5rem]",
  },
};

type Props = {
  slot: SlotDefinition;
  /** Current saved value. Empty string means the slot is unfilled. */
  initialValue: string;
  /**
   * Owner override (rare — most slots use `slot.defaultOwner`). Used when
   * Josh has reassigned the slot via the dashboard.
   */
  owner?: string;
  /**
   * Optional fallback to render in view mode when the slot is empty.
   * If both `initialValue` and `fallback` are empty, view mode renders
   * nothing — the page has no visible gap.
   */
  fallback?: string;
};

export function SlotEditor({ slot, initialValue, owner, fallback }: Props) {
  const { canEdit, mode, scope, editorName } = useEditMode();
  const [value, setValue] = useState(initialValue);
  const [editing, setEditing] = useState(false);
  const [savedFlash, setSavedFlash] = useState<"idle" | "saving" | "saved">("idle");
  const ref = useRef<HTMLDivElement>(null);
  const lastSavedRef = useRef(initialValue);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const preset = STYLE_PRESETS[slot.style];
  const effectiveOwner = owner ?? slot.defaultOwner;

  // Slot editor is ADMIN-ONLY. Campus-scoped pastors edit their own campus
  // pages via the existing EditableText component, not via SlotEditor.
  const isAdmin = scope?.kind === "admin";
  const reviewVisible = canEdit && isAdmin && mode;

  // Sync external prop changes (rare) into local state when not editing.
  useEffect(() => {
    if (!editing) {
      setValue(initialValue);
      lastSavedRef.current = initialValue;
    }
  }, [initialValue, editing]);

  function commitSave(next: string) {
    setSavedFlash("saving");
    fetch("/api/edit/save-slot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slotId: slot.id,
        value: next,
        editedBy: editorName ?? null,
      }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(`save failed: ${res.status}`);
        lastSavedRef.current = next;
        setSavedFlash("saved");
        setTimeout(() => setSavedFlash("idle"), 1400);
      })
      .catch(() => {
        setSavedFlash("idle");
      });
  }

  function scheduleSave(next: string) {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (next !== lastSavedRef.current) commitSave(next);
    }, 1500);
  }

  function handleInput() {
    const next = ref.current?.innerText ?? "";
    setValue(next);
    scheduleSave(next);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      setValue(lastSavedRef.current);
      if (ref.current) ref.current.innerText = lastSavedRef.current;
      setEditing(false);
      ref.current?.blur();
    }
  }

  function handleBlur() {
    // Flush any pending debounce on blur so the save lands immediately.
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    if (value !== lastSavedRef.current) commitSave(value);
    setEditing(false);
  }

  function startEditing() {
    setEditing(true);
    queueMicrotask(() => {
      ref.current?.focus();
      // Move caret to end of content.
      if (ref.current) {
        const range = document.createRange();
        range.selectNodeContents(ref.current);
        range.collapse(false);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    });
  }

  // ── View mode ────────────────────────────────────────────────────────
  if (!reviewVisible) {
    if (value) {
      return (
        <span className={preset.className} style={preset.style}>
          {value}
        </span>
      );
    }
    if (fallback) {
      return (
        <span className={preset.className} style={preset.style}>
          {fallback}
        </span>
      );
    }
    return null;
  }

  // ── Review / editing mode (admin only) ───────────────────────────────
  const showAsEmpty = !value;
  const containerClass = showAsEmpty
    ? `relative inline-block w-full ${preset.emptyHeight}`
    : "relative inline-block w-full";

  return (
    <span className={containerClass}>
      {/* Owner badge — quiet, italic, warm. Floats just outside the slot.
          NEVER an uppercase eyebrow — keeps it human. */}
      {!editing && (
        <span
          className="pointer-events-none absolute -top-5 left-0 z-10 font-display italic text-warm-700"
          style={{ fontSize: 11, fontWeight: 300, letterSpacing: 0 }}
        >
          {effectiveOwner} · {slot.field}
        </span>
      )}

      {/* The actual editable surface. Inherits the slot's intended typography
          so the editor looks identical to the rendered page. No monospace,
          no developer chrome, no greybox. */}
      <div
        ref={ref}
        contentEditable={editing}
        suppressContentEditableWarning
        role="textbox"
        aria-label={`${slot.field} — ${effectiveOwner}`}
        spellCheck
        onClick={() => !editing && startEditing()}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className={`${preset.className} block w-full cursor-text rounded-[10px] outline-none transition-all`}
        style={{
          ...preset.style,
          padding: "0.4em 0.6em",
          background: editing
            ? "rgba(255,253,248,0.95)"
            : showAsEmpty
            ? "rgba(255,253,248,0.55)"
            : "transparent",
          border: editing
            ? "1px solid rgba(184,92,59,0.45)"
            : showAsEmpty
            ? "1.5px dashed rgba(184,92,59,0.45)"
            : "1px solid transparent",
          boxShadow: editing
            ? "0 0 0 4px rgba(184,92,59,0.12), 0 8px 24px -16px rgba(20,20,20,0.18)"
            : "none",
          minHeight: "1.5em",
        }}
      >
        {value}
      </div>

      {/* Guidance hint — only when editing, beneath the editor. Italic
          Fraunces, in voice with the page. */}
      {editing && slot.guidance && (
        <span
          className="mt-2 block font-display italic text-ink-500"
          style={{ fontSize: 13, lineHeight: 1.45 }}
        >
          {slot.guidance}
          {slot.wordBudget && (
            <span className="ml-2 font-ui not-italic text-ink-400" style={{ fontSize: 11 }}>
              {slot.wordBudget}
            </span>
          )}
        </span>
      )}

      {/* Saved indicator — bottom-right, gentle. Same register as the
          "saved" pill in Google Docs / Notion. */}
      {savedFlash !== "idle" && (
        <span
          className="absolute -bottom-5 right-0 font-display italic text-ink-400"
          style={{ fontSize: 11 }}
        >
          {savedFlash === "saving" ? "saving…" : "saved"}
        </span>
      )}
    </span>
  );
}
