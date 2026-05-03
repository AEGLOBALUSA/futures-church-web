"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Pencil, X, LogOut } from "lucide-react";
import { useEditMode } from "./EditModeProvider";

export function EditModePill() {
  const { canEdit, mode, setMode, scope, editorName, setEditorName } = useEditMode();
  const pathname = usePathname();
  const [askingName, setAskingName] = useState(false);
  const [name, setName] = useState("");

  if (!canEdit) return null;
  // Hide on internal-tooling routes — the pill belongs on public pages.
  if (pathname?.startsWith("/intake") || pathname?.startsWith("/admin")) return null;

  async function logOut() {
    if (scope?.kind === "campus") {
      await fetch("/api/edit/logout", { method: "POST" });
    } else {
      await fetch("/api/intake/admin/verify", { method: "POST" });
    }
    window.location.reload();
  }

  function toggle() {
    // When entering edit mode for the first time on this device, prompt for name.
    if (!mode && !editorName) {
      setAskingName(true);
      return;
    }
    setMode(!mode);
  }

  function commitName() {
    if (!name.trim()) return;
    setEditorName(name);
    setAskingName(false);
    setMode(true);
  }

  return (
    <>
      <div
        className={`fixed z-40 left-5 bottom-5 sm:left-7 sm:bottom-7 transition-all ${
          mode ? "scale-100" : "scale-100"
        }`}
      >
        <div
          className="flex items-center gap-1.5 rounded-full px-1.5 py-1.5 backdrop-blur-md"
          style={{
            background: mode ? "rgba(28,26,23,0.92)" : "rgba(255,253,248,0.85)",
            border: `1px solid ${mode ? "rgba(184,92,59,0.5)" : "rgba(28,26,23,0.12)"}`,
            boxShadow: "0 18px 36px -18px rgba(20,20,20,0.45), inset 0 0 0 1px rgba(255,255,255,0.4)",
            color: mode ? "#FDFBF6" : "#1C1A17",
          }}
        >
          <button
            type="button"
            onClick={toggle}
            className="flex items-center gap-2 rounded-full px-3.5 py-2 font-ui transition-colors"
            style={{
              fontSize: 11,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              background: mode ? "rgba(184,92,59,0.25)" : "transparent",
            }}
            aria-pressed={mode}
            aria-label={mode ? "Turn edit mode off" : "Turn edit mode on"}
          >
            {mode ? <X className="size-3.5" /> : <Pencil className="size-3.5" />}
            <span>{mode ? "Editing" : "Edit"}</span>
          </button>
          {mode && (
            <>
              <span className="hidden sm:inline-block px-2 font-ui" style={{ fontSize: 10, letterSpacing: "0.2em", opacity: 0.8 }}>
                {scope?.kind === "admin" ? "ADMIN" : `· ${editorName || "you"}`}
              </span>
              <button
                type="button"
                onClick={logOut}
                className="rounded-full p-2 font-ui transition-colors hover:bg-white/10"
                aria-label="Sign out of editing"
                title="Sign out"
              >
                <LogOut className="size-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tiny floating helper hint, only when entering edit mode. */}
      {mode && (
        <div className="fixed z-40 left-5 bottom-20 sm:left-7 sm:bottom-24 pointer-events-none">
          <span
            className="rounded-full px-3 py-1.5 font-ui backdrop-blur"
            style={{
              background: "rgba(255,253,248,0.92)",
              border: "1px dashed rgba(184,92,59,0.5)",
              color: "#8B4A2E",
              fontSize: 10,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
            }}
          >
            tap any dashed text to edit
          </span>
        </div>
      )}

      {askingName && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-cream-200/85 backdrop-blur-sm px-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              commitName();
            }}
            className="max-w-md w-full rounded-3xl border border-ink-900/10 bg-cream/95 px-7 py-10 shadow-[0_30px_80px_-30px_rgba(20,20,20,0.35)]"
          >
            <p className="font-ui text-[11px] uppercase tracking-[0.24em] text-ink-500">
              Welcome back
            </p>
            <h2 className="mt-3 font-display text-display-md text-ink-900 leading-tight">
              Hi! What should we call you?
            </h2>
            <p className="mt-3 font-sans text-body-sm text-ink-600">
              First name is fine. Saved on this device. We log it next to every change so the team knows who edited what.
            </p>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Sarah"
              maxLength={80}
              className="mt-5 w-full rounded-xl border border-ink-900/10 bg-cream-50 px-4 py-3 font-sans text-body text-ink-900 placeholder:text-ink-400 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent-ring"
            />
            <div className="mt-5 flex gap-2">
              <button
                type="submit"
                disabled={!name.trim()}
                className="rounded-full bg-ink-900 px-6 py-2.5 font-ui text-[11px] uppercase tracking-[0.24em] text-cream transition hover:bg-warm-700 disabled:opacity-40"
              >
                Start editing →
              </button>
              <button
                type="button"
                onClick={() => setAskingName(false)}
                className="rounded-full border border-ink-900/15 bg-cream/70 px-5 py-2.5 font-ui text-[11px] uppercase tracking-[0.22em] text-ink-700"
              >
                Not now
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
