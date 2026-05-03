"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Calendar as CalendarIcon, Star, EyeOff } from "lucide-react";
import type { CampusEvent } from "@/lib/events/types";
import { EVENT_CATEGORIES } from "@/lib/events/types";
import { EventEditorSheet } from "./EventEditorSheet";

type EventWithUrl = CampusEvent & { coverImageUrl: string | null };

const CATEGORY_LABEL = Object.fromEntries(EVENT_CATEGORIES.map((c) => [c.value, c.label]));

function formatWhen(iso: string, all_day: boolean): { date: string; time: string } {
  const d = new Date(iso);
  const date = d.toLocaleDateString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
  if (all_day) return { date, time: "All day" };
  const time = d.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
  return { date, time };
}

function bucket(iso: string): "this-week" | "next-week" | "later" {
  const d = new Date(iso).getTime();
  const now = Date.now();
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  if (d < now + oneWeek) return "this-week";
  if (d < now + 2 * oneWeek) return "next-week";
  return "later";
}

export function EventsListClient({
  campusSlug,
  campusName,
  initialEvents,
  token,
  editorName,
}: {
  campusSlug: string;
  campusName: string;
  initialEvents: EventWithUrl[];
  token: string;
  editorName: string;
}) {
  const [events, setEvents] = useState<EventWithUrl[]>(initialEvents);
  const [editing, setEditing] = useState<EventWithUrl | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  async function refresh() {
    const res = await fetch(`/api/intake/events/list?campus=${campusSlug}&token=${encodeURIComponent(token)}`, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.events)) setEvents(json.events);
    }
  }

  function onAdd() {
    setEditing(null);
    setSheetOpen(true);
  }
  function onEdit(e: EventWithUrl) {
    setEditing(e);
    setSheetOpen(true);
  }
  async function onSaved() {
    setSheetOpen(false);
    await refresh();
  }
  async function onDeleted() {
    setSheetOpen(false);
    await refresh();
  }

  const grouped = useMemo(() => {
    const out: Record<"this-week" | "next-week" | "later", EventWithUrl[]> = {
      "this-week": [],
      "next-week": [],
      later: [],
    };
    for (const e of events) out[bucket(e.starts_at)].push(e);
    return out;
  }, [events]);

  const empty = events.length === 0;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-ui text-[11px] uppercase tracking-[0.28em] text-ink-500">
            {campusName} · events
          </p>
          <h2 className="mt-2 font-display text-display-md italic text-ink-900 leading-tight">
            What&rsquo;s coming up.
          </h2>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-5 py-2.5 font-ui text-[11px] uppercase tracking-[0.24em] text-cream transition hover:bg-warm-700"
        >
          <Plus className="size-4" />
          New event
        </button>
      </div>

      {empty ? (
        <EmptyState onAdd={onAdd} />
      ) : (
        <div className="mt-10 space-y-12">
          {(["this-week", "next-week", "later"] as const).map((key) => {
            const list = grouped[key];
            if (list.length === 0) return null;
            return (
              <section key={key}>
                <h3 className="font-ui text-[11px] uppercase tracking-[0.28em] text-ink-500">
                  {key === "this-week" ? "This week" : key === "next-week" ? "Next week" : "Later"}
                </h3>
                <ul className="mt-4 space-y-3">
                  {list.map((e) => (
                    <EventRow key={e.id} event={e} onEdit={() => onEdit(e)} />
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}

      <EventEditorSheet
        open={sheetOpen}
        editing={editing}
        token={token}
        editorName={editorName}
        onClose={() => setSheetOpen(false)}
        onSaved={onSaved}
        onDeleted={onDeleted}
      />
    </div>
  );
}

function EventRow({ event, onEdit }: { event: EventWithUrl; onEdit: () => void }) {
  const when = formatWhen(event.starts_at, event.all_day);
  return (
    <li>
      <button
        type="button"
        onClick={onEdit}
        className="flex w-full items-stretch gap-4 overflow-hidden rounded-2xl border border-ink-900/10 bg-cream/95 text-left transition hover:border-accent/40 hover:bg-cream-50"
      >
        {event.coverImageUrl ? (
          <div className="relative w-[110px] shrink-0 sm:w-[160px]">
            <Image
              src={event.coverImageUrl}
              alt={event.title}
              fill
              sizes="160px"
              className="object-cover"
              unoptimized
            />
          </div>
        ) : (
          <div className="grid w-[110px] shrink-0 place-items-center bg-cream-300 sm:w-[160px]">
            <CalendarIcon className="size-6 text-ink-500" strokeWidth={1.5} />
          </div>
        )}
        <div className="flex-1 min-w-0 px-4 py-4">
          <div className="flex items-start gap-2">
            <span className="font-ui text-[10px] uppercase tracking-[0.22em] text-accent">
              {CATEGORY_LABEL[event.category] ?? event.category}
            </span>
            {event.is_featured && <Star className="size-3.5 text-warm-400" fill="currentColor" />}
            {!event.is_published && (
              <span className="inline-flex items-center gap-1 rounded-full bg-ink-900/10 px-2 py-0.5 font-ui text-[9px] uppercase tracking-[0.22em] text-ink-700">
                <EyeOff className="size-3" /> Draft
              </span>
            )}
          </div>
          <p className="mt-1.5 truncate font-display italic text-ink-900" style={{ fontSize: 19, fontWeight: 300, lineHeight: 1.25 }}>
            {event.title}
          </p>
          <p className="mt-1 font-sans text-body-sm text-ink-600">
            {when.date} · {when.time}
            {event.location ? ` · ${event.location}` : ""}
          </p>
        </div>
      </button>
    </li>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="mt-12 rounded-3xl border border-dashed border-ink-900/15 bg-cream/60 px-7 py-14 text-center">
      <CalendarIcon className="mx-auto size-7 text-ink-500" strokeWidth={1.4} />
      <p className="mt-4 font-display italic text-ink-700" style={{ fontSize: 22, fontWeight: 300 }}>
        Nothing on the calendar yet.
      </p>
      <p className="mt-2 font-sans text-body-sm text-ink-500">
        Add the first one — your Sunday service is a great place to start.
      </p>
      <button
        type="button"
        onClick={onAdd}
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink-900 px-5 py-2.5 font-ui text-[11px] uppercase tracking-[0.24em] text-cream hover:bg-warm-700"
      >
        <Plus className="size-4" />
        Add an event
      </button>
    </div>
  );
}

// ── Convenience for when this is dropped into a page wanting a tab nav above ─

export function EventsTabNav({
  current,
  campusSlug,
  token,
}: {
  current: "intake" | "events";
  campusSlug: string;
  token: string;
}) {
  const tabs = [
    { key: "intake" as const, label: "Intake form", href: `/intake/${campusSlug}?key=${encodeURIComponent(token)}` },
    { key: "events" as const, label: "Events", href: `/intake/${campusSlug}/events?key=${encodeURIComponent(token)}` },
  ];
  return (
    <nav className="flex gap-1 border-b border-ink-900/10">
      {tabs.map((t) => (
        <Link
          key={t.key}
          href={t.href}
          className={`relative px-4 py-3 font-ui text-[11px] uppercase tracking-[0.22em] transition ${
            current === t.key ? "text-ink-900" : "text-ink-500 hover:text-ink-900"
          }`}
        >
          {t.label}
          {current === t.key && (
            <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-accent" />
          )}
        </Link>
      ))}
    </nav>
  );
}
