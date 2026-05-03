"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X, Image as ImageIcon, Trash2 } from "lucide-react";
import { EVENT_CATEGORIES, type CampusEvent, type EventCategory } from "@/lib/events/types";

const AUDIENCES = [
  { value: "everyone", label: "Everyone" },
  { value: "kids", label: "Kids" },
  { value: "parents", label: "Parents" },
  { value: "youth", label: "Youth" },
  { value: "women", label: "Women" },
  { value: "men", label: "Men" },
  { value: "leaders", label: "Leaders" },
];

type EventEditorState = {
  category: EventCategory;
  title: string;
  description: string;
  startsAt: string;
  endsAt: string;
  allDay: boolean;
  location: string;
  audience: string[];
  registrationUrl: string;
  isFeatured: boolean;
  isPublished: boolean;
  coverImagePath: string | null;
  coverImageUrl: string | null;
};

function isoToLocalDateTimeInput(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  // datetime-local needs YYYY-MM-DDTHH:mm in browser's local time.
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function localDateTimeInputToIso(input: string): string | null {
  if (!input) return null;
  const d = new Date(input);
  if (isNaN(d.getTime())) return null;
  return d.toISOString();
}

function emptyState(): EventEditorState {
  // Default: next Sunday at 10am local time.
  const now = new Date();
  const daysUntilSunday = (7 - now.getDay()) % 7 || 7;
  const next = new Date(now);
  next.setDate(now.getDate() + daysUntilSunday);
  next.setHours(10, 0, 0, 0);
  return {
    category: "service",
    title: "",
    description: "",
    startsAt: isoToLocalDateTimeInput(next.toISOString()),
    endsAt: "",
    allDay: false,
    location: "",
    audience: ["everyone"],
    registrationUrl: "",
    isFeatured: false,
    isPublished: true,
    coverImagePath: null,
    coverImageUrl: null,
  };
}

function fromEvent(e: CampusEvent & { coverImageUrl?: string | null }): EventEditorState {
  return {
    category: e.category,
    title: e.title,
    description: e.description ?? "",
    startsAt: isoToLocalDateTimeInput(e.starts_at),
    endsAt: isoToLocalDateTimeInput(e.ends_at),
    allDay: e.all_day,
    location: e.location ?? "",
    audience: e.audience.length > 0 ? e.audience : ["everyone"],
    registrationUrl: e.registration_url ?? "",
    isFeatured: e.is_featured,
    isPublished: e.is_published,
    coverImagePath: e.cover_image_path,
    coverImageUrl: e.coverImageUrl ?? null,
  };
}

export function EventEditorSheet({
  open,
  editing,
  token,
  editorName,
  onClose,
  onSaved,
  onDeleted,
}: {
  open: boolean;
  editing: (CampusEvent & { coverImageUrl?: string | null }) | null;
  token: string;
  editorName: string;
  onClose: () => void;
  onSaved: () => void;
  onDeleted: () => void;
}) {
  const [state, setState] = useState<EventEditorState>(emptyState);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset state when opening or switching events.
  useEffect(() => {
    if (!open) return;
    setState(editing ? fromEvent(editing) : emptyState());
    setError(null);
    setConfirmingDelete(false);
  }, [open, editing]);

  function set<K extends keyof EventEditorState>(key: K, value: EventEditorState[K]) {
    setState((prev) => ({ ...prev, [key]: value }));
  }

  function toggleAudience(v: string) {
    setState((prev) => {
      const has = prev.audience.includes(v);
      const next = has ? prev.audience.filter((a) => a !== v) : [...prev.audience, v];
      return { ...prev, audience: next.length > 0 ? next : ["everyone"] };
    });
  }

  async function uploadCover(file: File) {
    setBusy(true);
    setError(null);
    const fd = new FormData();
    fd.append("token", token);
    fd.append("file", file);
    const res = await fetch("/api/intake/events/upload", { method: "POST", body: fd });
    const json = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(json.error ?? "upload failed");
      return;
    }
    set("coverImagePath", json.storagePath);
    set("coverImageUrl", json.signedUrl);
  }

  async function save() {
    if (!state.title.trim()) {
      setError("Add a title");
      return;
    }
    if (!state.startsAt) {
      setError("Add a date and time");
      return;
    }
    setBusy(true);
    setError(null);
    const payload = {
      token,
      editedBy: editorName || null,
      category: state.category,
      title: state.title.trim(),
      description: state.description.trim() || null,
      startsAt: localDateTimeInputToIso(state.startsAt),
      endsAt: state.endsAt ? localDateTimeInputToIso(state.endsAt) : null,
      allDay: state.allDay,
      location: state.location.trim() || null,
      audience: state.audience,
      registrationUrl: state.registrationUrl.trim() || null,
      isFeatured: state.isFeatured,
      isPublished: state.isPublished,
      coverImagePath: state.coverImagePath,
    };
    const url = editing ? `/api/intake/events/${editing.id}` : "/api/intake/events";
    const method = editing ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(json.error ?? "save failed");
      return;
    }
    onSaved();
  }

  async function remove() {
    if (!editing) return;
    setBusy(true);
    setError(null);
    const res = await fetch(`/api/intake/events/${editing.id}`, {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token, editedBy: editorName || null }),
    });
    setBusy(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error ?? "delete failed");
      return;
    }
    onDeleted();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-end bg-ink-900/40 backdrop-blur-sm sm:items-stretch">
      <div
        className="w-full sm:w-[500px] sm:h-full bg-cream/98 sm:rounded-l-3xl flex flex-col max-h-[92vh] sm:max-h-none mt-auto sm:mt-0 rounded-t-3xl sm:rounded-t-none shadow-[0_-30px_80px_-30px_rgba(20,20,20,0.4)]"
        role="dialog"
        aria-label={editing ? "Edit event" : "Add event"}
      >
        <header className="flex items-center justify-between gap-3 border-b border-ink-900/10 px-5 py-4 sm:px-7">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-ink-600 hover:bg-cream-300"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
          <span className="font-ui text-[11px] uppercase tracking-[0.24em] text-ink-500">
            {editing ? "Edit event" : "New event"}
          </span>
          <button
            type="button"
            onClick={save}
            disabled={busy || !state.title.trim() || !state.startsAt}
            className="rounded-full bg-ink-900 px-5 py-2 font-ui text-[11px] uppercase tracking-[0.22em] text-cream transition hover:bg-warm-700 disabled:opacity-40"
          >
            {busy ? "Saving…" : editing ? "Save" : "Publish"}
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-7 sm:py-8">
          {/* Title — big, prominent. Like a Google Doc title. */}
          <input
            type="text"
            value={state.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Event title"
            maxLength={120}
            className="w-full bg-transparent font-display italic text-ink-900 placeholder:text-ink-400 focus:outline-none"
            style={{ fontSize: 28, fontWeight: 300, lineHeight: 1.15 }}
          />
          <div className="mt-1 text-right font-ui text-[10px] uppercase tracking-[0.18em] text-ink-400">
            {state.title.length} / 120
          </div>

          {/* Category pills */}
          <div className="mt-5">
            <p className="font-ui text-[10px] uppercase tracking-[0.22em] text-ink-500">Category</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {EVENT_CATEGORIES.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => set("category", c.value)}
                  className={`rounded-full px-3.5 py-1.5 font-ui text-[11px] uppercase tracking-[0.18em] transition ${
                    state.category === c.value
                      ? "bg-ink-900 text-cream"
                      : "border border-ink-900/15 bg-cream/60 text-ink-700 hover:bg-cream-300"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date / time — native pickers for phone friendliness */}
          <div className="mt-6 grid grid-cols-1 gap-3">
            <div>
              <p className="font-ui text-[10px] uppercase tracking-[0.22em] text-ink-500">Starts</p>
              <input
                type="datetime-local"
                value={state.startsAt}
                onChange={(e) => set("startsAt", e.target.value)}
                className="mt-2 w-full rounded-xl border border-ink-900/10 bg-cream-50 px-4 py-3 font-sans text-body text-ink-900 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent-ring"
              />
            </div>
            <div>
              <p className="font-ui text-[10px] uppercase tracking-[0.22em] text-ink-500">Ends (optional)</p>
              <input
                type="datetime-local"
                value={state.endsAt}
                onChange={(e) => set("endsAt", e.target.value)}
                className="mt-2 w-full rounded-xl border border-ink-900/10 bg-cream-50 px-4 py-3 font-sans text-body text-ink-900 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent-ring"
              />
            </div>
          </div>

          {/* Location */}
          <div className="mt-5">
            <p className="font-ui text-[10px] uppercase tracking-[0.22em] text-ink-500">Where</p>
            <input
              type="text"
              value={state.location}
              onChange={(e) => set("location", e.target.value)}
              placeholder="Main auditorium / Online / 100 Magill Rd…"
              maxLength={160}
              className="mt-2 w-full rounded-xl border border-ink-900/10 bg-cream-50 px-4 py-3 font-sans text-body text-ink-900 placeholder:text-ink-400 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent-ring"
            />
          </div>

          {/* Description */}
          <div className="mt-5">
            <p className="font-ui text-[10px] uppercase tracking-[0.22em] text-ink-500">Description</p>
            <textarea
              value={state.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="A few sentences. Voice over headlines."
              rows={3}
              maxLength={1200}
              className="mt-2 w-full rounded-xl border border-ink-900/10 bg-cream-50 px-4 py-3 font-sans text-body text-ink-900 placeholder:text-ink-400 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent-ring resize-y leading-relaxed"
            />
            <div className="mt-1 text-right font-ui text-[10px] uppercase tracking-[0.18em] text-ink-400">
              {state.description.length} / 1200
            </div>
          </div>

          {/* Audience tags */}
          <div className="mt-5">
            <p className="font-ui text-[10px] uppercase tracking-[0.22em] text-ink-500">Who&rsquo;s it for?</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {AUDIENCES.map((a) => {
                const on = state.audience.includes(a.value);
                return (
                  <button
                    key={a.value}
                    type="button"
                    onClick={() => toggleAudience(a.value)}
                    className={`rounded-full px-3.5 py-1.5 font-ui text-[11px] uppercase tracking-[0.18em] transition ${
                      on
                        ? "bg-warm-400 text-ink-900"
                        : "border border-ink-900/15 bg-cream/60 text-ink-700 hover:bg-cream-300"
                    }`}
                  >
                    {a.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cover image */}
          <div className="mt-5">
            <p className="font-ui text-[10px] uppercase tracking-[0.22em] text-ink-500">Cover image (optional)</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) uploadCover(e.target.files[0]);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
            />
            {state.coverImageUrl ? (
              <div className="mt-2 relative overflow-hidden rounded-2xl">
                <div className="relative aspect-[16/9]">
                  <Image
                    src={state.coverImageUrl}
                    alt={state.title || "Event cover"}
                    fill
                    sizes="(max-width: 640px) 100vw, 500px"
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="flex justify-between gap-2 border-t border-ink-900/10 px-3 py-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="font-ui text-[10px] uppercase tracking-[0.2em] text-ink-700 hover:text-ink-900"
                  >
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      set("coverImagePath", null);
                      set("coverImageUrl", null);
                    }}
                    className="font-ui text-[10px] uppercase tracking-[0.2em] text-red-700 hover:text-red-900"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-2 flex items-center gap-3 rounded-2xl border-2 border-dashed border-ink-900/15 bg-cream-50/60 px-4 py-5 text-left w-full hover:border-accent hover:bg-accent-muted transition"
              >
                <ImageIcon className="size-5 text-ink-500" strokeWidth={1.6} />
                <span className="font-display italic text-ink-700">Add a photo</span>
              </button>
            )}
          </div>

          {/* Registration URL */}
          <div className="mt-5">
            <p className="font-ui text-[10px] uppercase tracking-[0.22em] text-ink-500">Sign-up link (optional)</p>
            <input
              type="url"
              value={state.registrationUrl}
              onChange={(e) => set("registrationUrl", e.target.value)}
              placeholder="https://"
              inputMode="url"
              className="mt-2 w-full rounded-xl border border-ink-900/10 bg-cream-50 px-4 py-3 font-sans text-body text-ink-900 placeholder:text-ink-400 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent-ring"
            />
          </div>

          {/* Toggles */}
          <div className="mt-6 grid grid-cols-1 gap-3 rounded-2xl border border-ink-900/10 bg-cream-50/50 px-4 py-4">
            <label className="flex items-center justify-between gap-3 font-sans text-body-sm text-ink-900">
              <span>
                <span className="font-display italic">Feature this event</span>
                <span className="block font-ui text-[10px] uppercase tracking-[0.18em] text-ink-500 mt-0.5">
                  Pinned to &ldquo;Coming up&rdquo; on the home + campus
                </span>
              </span>
              <input
                type="checkbox"
                checked={state.isFeatured}
                onChange={(e) => set("isFeatured", e.target.checked)}
                className="size-5 accent-accent"
              />
            </label>
            <label className="flex items-center justify-between gap-3 font-sans text-body-sm text-ink-900 border-t border-ink-900/10 pt-3">
              <span>
                <span className="font-display italic">Publish</span>
                <span className="block font-ui text-[10px] uppercase tracking-[0.18em] text-ink-500 mt-0.5">
                  Off = saved as draft, hidden from visitors
                </span>
              </span>
              <input
                type="checkbox"
                checked={state.isPublished}
                onChange={(e) => set("isPublished", e.target.checked)}
                className="size-5 accent-emerald-700"
              />
            </label>
          </div>

          {error && (
            <p className="mt-4 font-sans text-body-sm text-red-700">{error}</p>
          )}

          {/* Delete (edit mode only) */}
          {editing && (
            <div className="mt-10 border-t border-ink-900/10 pt-6">
              {confirmingDelete ? (
                <div className="rounded-2xl border border-red-200 bg-red-50/50 px-4 py-4">
                  <p className="font-display italic text-red-900" style={{ fontSize: 16 }}>
                    Delete &ldquo;{editing.title}&rdquo;?
                  </p>
                  <p className="mt-1 font-sans text-body-sm text-red-800">
                    This can&rsquo;t be undone.
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={remove}
                      disabled={busy}
                      className="rounded-full bg-red-700 px-4 py-2 font-ui text-[11px] uppercase tracking-[0.22em] text-cream hover:bg-red-800"
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmingDelete(false)}
                      className="rounded-full border border-red-200 px-4 py-2 font-ui text-[11px] uppercase tracking-[0.22em] text-red-900"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(true)}
                  className="inline-flex items-center gap-2 font-ui text-[11px] uppercase tracking-[0.22em] text-red-700 hover:text-red-900"
                >
                  <Trash2 className="size-4" />
                  Delete event
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
