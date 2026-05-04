"use client";

import { useEffect, useRef, useState, type ClipboardEvent, type CSSProperties, type ReactNode } from "react";
import { useEditMode } from "./EditModeProvider";
import { useSlot } from "./SlotProvider";
import { slotById, type SlotDefinition } from "@/lib/content/slots/registry";

/**
 * Site-wide content slot editor. Wraps a piece of editable copy.
 *
 * Three modes, in order of "is this person editing right now":
 *
 *   1. View mode (default for all visitors).
 *      - If the slot has a value, render it as plain text in the
 *        page's natural style.
 *      - Else, render `children` as the fallback (existing default copy).
 *      - Else, render nothing.
 *
 *   2. Review mode (admin signed in, edit mode toggled on).
 *      - Empty slots: warm dashed outline + small italic Fraunces badge
 *        "Josh G. (or appointee) · Field name". Click → edit.
 *      - Filled slots: subtle green dot in the corner; click → edit.
 *
 *   3. Editing mode (active focus).
 *      - The slot becomes a contenteditable surface inheriting the EXACT
 *        typography of its style preset — Fraunces italic for display,
 *        Inter Tight for body. Same font, same size, same color, same
 *        line-height as the rendered output. NO monospace. NO grey
 *        panels. NO developer chrome.
 *      - Autosaves 1.5s after last keystroke. Esc reverts. Paste is
 *        sanitised to plain text.
 */

const STYLE_PRESETS: Record<
  SlotDefinition["style"],
  { className: string; style?: CSSProperties; emptyHeight: string }
> = {
  "display-hero": {
    className: "font-display italic text-ink-900",
    style: { fontSize: "clamp(2.5rem, 6.5vw, 5.5rem)", fontWeight: 300, lineHeight: 0.96 },
    emptyHeight: "min-h-[5rem]",
  },
  "display-italic-lg": {
    className: "font-display italic text-ink-900",
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

export type SlotEditorProps = {
  id: string;
  /**
   * Fallback content rendered in view mode when the slot is empty. Almost
   * always the existing hard-coded copy on the page, so removing the
   * `<SlotEditor>` wrapper would not change what visitors see today.
   */
  children?: ReactNode;
  /**
   * Override the typography preset baked into the slot definition. Rare —
   * only used when the same slot id appears in two visual contexts.
   */
  style?: SlotDefinition["style"];
  /**
   * Render as a `<p>` (default), `<h1>`, `<h2>`, `<span>`, or `<div>` so
   * the slot adopts the right semantic role for its context.
   */
  as?: "p" | "h1" | "h2" | "h3" | "span" | "div";
};

export function SlotEditor({ id, children, style: styleOverride, as = "p" }: SlotEditorProps) {
  const definition = slotById(id);
  const slotData = useSlot(id);
  const { canEdit, mode, scope, editorName } = useEditMode();

  const value = slotData?.value ?? "";
  const owner = slotData?.owner ?? definition?.defaultOwner ?? "Josh Greenwood (or appointee)";

  const [editing, setEditing] = useState(false);
  const [draftValue, setDraftValue] = useState(value);
  const [savedFlash, setSavedFlash] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const ref = useRef<HTMLDivElement>(null);
  const lastSavedRef = useRef(value);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync external value changes (e.g., another tab edited) into local state
  // when not actively editing.
  useEffect(() => {
    if (!editing) {
      setDraftValue(value);
      lastSavedRef.current = value;
    }
  }, [value, editing]);

  // Slot editor is admin-scope-only by design. Campus-scoped pastors edit
  // their own campus pages via the existing per-campus EditableText pattern.
  const isAdmin = scope?.kind === "admin";
  const reviewVisible = canEdit && isAdmin && mode;

  if (!definition) {
    // Slot ID isn't registered. In dev this is a bug; in prod fail soft.
    if (process.env.NODE_ENV !== "production") {
      console.warn(`<SlotEditor id="${id}"> — slot is not in the registry.`);
    }
    return <>{children}</>;
  }

  const preset = STYLE_PRESETS[styleOverride ?? definition.style];

  function commitSave(next: string) {
    setSavedFlash("saving");
    fetch("/api/edit/save-slot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slotId: id,
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
        setSavedFlash("error");
        setTimeout(() => setSavedFlash("idle"), 2400);
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
    setDraftValue(next);
    scheduleSave(next);
  }

  // Strip rich formatting on paste — keep contenteditable plain-text.
  function handlePaste(e: ClipboardEvent<HTMLDivElement>) {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      setDraftValue(lastSavedRef.current);
      if (ref.current) ref.current.innerText = lastSavedRef.current;
      setEditing(false);
      ref.current?.blur();
    }
  }

  function handleBlur() {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    if (draftValue !== lastSavedRef.current) commitSave(draftValue);
    setEditing(false);
  }

  function startEditing() {
    setEditing(true);
    queueMicrotask(() => {
      ref.current?.focus();
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
      const Tag = as as keyof React.JSX.IntrinsicElements;
      return (
        <Tag className={preset.className} style={preset.style}>
          {value}
        </Tag>
      );
    }
    return <>{children}</>;
  }

  // ── Review / editing mode (admin only) ───────────────────────────────
  const showAsEmpty = !value;

  return (
    <span
      id={`slot-${id}`}
      className={`relative block w-full ${showAsEmpty ? preset.emptyHeight : ""}`}
    >
      {/* Owner badge — quiet, italic, warm. Floats just outside the slot.
          NEVER an uppercase eyebrow — keeps it human. */}
      {!editing && (
        <span
          className="pointer-events-none absolute -top-5 left-2 z-10 font-display italic text-warm-700"
          style={{ fontSize: 11, fontWeight: 300 }}
        >
          {owner} · {definition.field}
        </span>
      )}

      {/* The actual editable surface. Inherits the slot's intended typography
          so the editor looks identical to the rendered page. */}
      <div
        ref={ref}
        contentEditable={editing}
        suppressContentEditableWarning
        role="textbox"
        aria-label={`${definition.field} — ${owner}`}
        spellCheck
        onClick={() => !editing && startEditing()}
        onInput={handleInput}
        onPaste={handlePaste}
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
            ? "1px solid rgba(184,92,59,0.5)"
            : showAsEmpty
            ? "1.5px dashed rgba(184,92,59,0.45)"
            : "1px solid rgba(63,123,78,0.0)",
          boxShadow: editing
            ? "0 0 0 4px rgba(184,92,59,0.12), 0 8px 24px -16px rgba(20,20,20,0.18)"
            : "none",
          minHeight: "1.5em",
        }}
      >
        {draftValue}
      </div>

      {/* Filled-slot indicator — quiet green dot in the top-right. */}
      {!editing && !showAsEmpty && (
        <span
          aria-hidden
          className="pointer-events-none absolute right-3 top-1.5 z-10 size-1.5 rounded-full"
          style={{ background: "#3F7B4E", opacity: 0.7 }}
        />
      )}

      {/* Guidance hint — only when editing. Italic Fraunces in the page's voice. */}
      {editing && definition.guidance && (
        <span
          className="mt-2 block font-display italic text-ink-500"
          style={{ fontSize: 13, lineHeight: 1.45 }}
        >
          {definition.guidance}
          {definition.wordBudget && (
            <span className="ml-2 font-ui not-italic text-ink-400" style={{ fontSize: 11 }}>
              {definition.wordBudget}
            </span>
          )}
        </span>
      )}

      {/* Saved indicator — gentle, like Google Docs. */}
      {savedFlash !== "idle" && (
        <span
          className="absolute -bottom-5 right-2 font-display italic"
          style={{
            fontSize: 11,
            color:
              savedFlash === "error"
                ? "#B85C3B"
                : savedFlash === "saving"
                ? "rgba(28,26,23,0.5)"
                : "#3F7B4E",
          }}
        >
          {savedFlash === "saving"
            ? "saving…"
            : savedFlash === "saved"
            ? "saved"
            : "save failed — retrying"}
        </span>
      )}
    </span>
  );
}
