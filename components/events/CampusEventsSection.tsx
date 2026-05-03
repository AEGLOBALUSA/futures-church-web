import Image from "next/image";
import Link from "next/link";
import { Calendar as CalendarIcon, MapPin, ArrowRight } from "lucide-react";
import type { EventWithSignedImage } from "@/lib/events/types";
import { EVENT_CATEGORIES } from "@/lib/events/types";

const CATEGORY_LABEL = Object.fromEntries(EVENT_CATEGORIES.map((c) => [c.value, c.label]));

function formatLong(iso: string, all_day: boolean): string {
  const d = new Date(iso);
  const dateStr = d.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  if (all_day) return `${dateStr} · all day`;
  const timeStr = d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  return `${dateStr} · ${timeStr}`;
}

function formatShort(iso: string, all_day: boolean): { date: string; time: string } {
  const d = new Date(iso);
  const date = d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  if (all_day) return { date, time: "All day" };
  const time = d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  return { date, time };
}

/** Hero "This Sunday" strip — one prominent next service. */
export function ThisSundayStrip({
  event,
  tone,
  campusName,
}: {
  event: EventWithSignedImage;
  tone: string;
  campusName: string;
}) {
  return (
    <div
      className="rounded-3xl border border-ink-900/10 bg-cream/95 px-6 py-6 sm:px-8 sm:py-7"
      style={{ boxShadow: "0 30px 60px -32px rgba(20,20,20,0.18)" }}
    >
      <div className="flex items-baseline gap-3">
        <span aria-hidden className="inline-block size-2 rounded-full" style={{ background: tone }} />
        <p className="font-sans uppercase text-ink-600" style={{ fontSize: 11, letterSpacing: "0.28em" }}>
          This Sunday at {campusName}
        </p>
      </div>
      <h3
        className="mt-3 font-display italic text-ink-900"
        style={{ fontSize: "clamp(1.5rem, 2.6vw, 2rem)", lineHeight: 1.15, fontWeight: 300 }}
      >
        {event.title}
      </h3>
      <p className="mt-2 font-sans text-ink-700" style={{ fontSize: 16 }}>
        {formatLong(event.starts_at, event.all_day)}
        {event.location ? ` · ${event.location}` : ""}
      </p>
      {event.description && (
        <p className="mt-4 font-sans text-ink-600" style={{ fontSize: 15, lineHeight: 1.65 }}>
          {event.description}
        </p>
      )}
      {event.registration_url && (
        <a
          href={event.registration_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-sans transition-transform hover:-translate-y-0.5"
          style={{ background: tone, color: "#FDFBF6", fontSize: 14 }}
        >
          Sign up <ArrowRight className="size-4" />
        </a>
      )}
    </div>
  );
}

/** "Coming up" rail — a list of upcoming events at one campus. */
export function ComingUpRail({
  events,
  tone,
  campusName,
}: {
  events: EventWithSignedImage[];
  tone: string;
  campusName: string;
}) {
  if (events.length === 0) return null;

  return (
    <section className="px-6 py-20 sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-baseline justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-baseline gap-3">
              <span aria-hidden className="inline-block size-2 rounded-full" style={{ background: tone }} />
              <p
                className="font-sans"
                style={{ color: "#534D44", fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase" }}
              >
                Coming up · {campusName}
              </p>
            </div>
            <h2
              className="mt-3 max-w-[24ch] font-display"
              style={{ color: "#1C1A17", fontSize: "clamp(1.75rem, 3vw, 2.5rem)", lineHeight: 1.05, fontWeight: 300 }}
            >
              What&rsquo;s on the calendar.
            </h2>
          </div>
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((e) => (
            <EventCard key={e.id} event={e} tone={tone} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function EventCard({ event, tone }: { event: EventWithSignedImage; tone: string }) {
  const when = formatShort(event.starts_at, event.all_day);
  return (
    <li
      className="overflow-hidden rounded-3xl border border-ink-900/10 bg-cream/90"
      style={{ boxShadow: "0 16px 36px -22px rgba(20,20,20,0.2)" }}
    >
      <div className="relative aspect-[16/10]">
        {event.coverImageUrl ? (
          <Image
            src={event.coverImageUrl}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="grid h-full place-items-center" style={{ background: tone }}>
            <CalendarIcon className="size-9" strokeWidth={1.4} style={{ color: "#FDFBF6", opacity: 0.6 }} />
          </div>
        )}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, transparent 55%, rgba(28,26,23,0.35) 100%)" }}
        />
        <div className="absolute left-3 top-3">
          <span
            className="rounded-full px-2.5 py-1 font-sans backdrop-blur"
            style={{
              background: "rgba(255,253,248,0.85)",
              color: "#1C1A17",
              fontSize: 10,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
            }}
          >
            {CATEGORY_LABEL[event.category] ?? event.category}
          </span>
        </div>
      </div>
      <div className="px-5 py-5">
        <p className="font-ui uppercase text-ink-500" style={{ fontSize: 10, letterSpacing: "0.24em" }}>
          {when.date} · {when.time}
        </p>
        <h3
          className="mt-2 font-display italic text-ink-900"
          style={{ fontSize: 19, fontWeight: 300, lineHeight: 1.25 }}
        >
          {event.title}
        </h3>
        {event.location && (
          <p className="mt-1.5 flex items-center gap-1.5 font-sans text-ink-600" style={{ fontSize: 13 }}>
            <MapPin className="size-3.5" strokeWidth={1.6} />
            {event.location}
          </p>
        )}
        {event.description && (
          <p className="mt-3 font-sans text-ink-700 line-clamp-3" style={{ fontSize: 14, lineHeight: 1.6 }}>
            {event.description}
          </p>
        )}
        {event.registration_url && (
          <a
            href={event.registration_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 font-ui text-[11px] uppercase tracking-[0.22em] transition-colors hover:text-accent"
            style={{ color: tone }}
          >
            Sign up <ArrowRight className="size-3.5" />
          </a>
        )}
      </div>
    </li>
  );
}

/** Compact list version, for use inside the campus hero column. */
export function NextEventsCompact({
  events,
  tone,
  max = 3,
}: {
  events: EventWithSignedImage[];
  tone: string;
  max?: number;
}) {
  const list = events.slice(0, max);
  if (list.length === 0) return null;
  return (
    <ul className="mt-6 space-y-3">
      {list.map((e) => {
        const when = formatShort(e.starts_at, e.all_day);
        return (
          <li key={e.id} className="flex items-baseline gap-3">
            <span aria-hidden className="mt-2 inline-block size-1.5 shrink-0 rounded-full" style={{ background: tone }} />
            <div>
              <p
                className="font-display italic text-ink-900"
                style={{ fontSize: 16, fontWeight: 300, lineHeight: 1.2 }}
              >
                {e.title}
              </p>
              <p className="font-sans text-ink-600" style={{ fontSize: 12.5 }}>
                {when.date} · {when.time}
                {e.location ? ` · ${e.location}` : ""}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
