"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { X, MapPin } from "lucide-react";
import { campuses, type Campus } from "@/lib/content/campuses";

const DISMISSED_KEY = "futures_campus_banner_dismissed";
const DISMISS_DAYS = 90;

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function nearestActiveCampus(lat: number, lng: number): Campus | null {
  const active = campuses.filter((c) => c.status === "active" && c.lat != null && c.lng != null);
  if (!active.length) return null;
  return active.reduce((best, c) => {
    const d = haversineKm(lat, lng, c.lat!, c.lng!);
    const bestD = haversineKm(lat, lng, best.lat!, best.lng!);
    return d < bestD ? c : best;
  });
}

function campusByCity(query: string): Campus | null {
  const q = query.toLowerCase().trim();
  return (
    campuses.find(
      (c) =>
        c.status === "active" &&
        (c.city.toLowerCase().includes(q) ||
          c.name.toLowerCase().includes(q) ||
          c.country.toLowerCase().includes(q))
    ) ?? null
  );
}

function nextSundayGoogleCalUrl(campus: Campus): string {
  const now = new Date();
  const day = now.getDay(); // 0 = Sun
  const daysUntilSunday = day === 0 ? 7 : 7 - day;
  const sunday = new Date(now);
  sunday.setDate(now.getDate() + daysUntilSunday);
  sunday.setHours(10, 0, 0, 0);
  const end = new Date(sunday);
  end.setHours(11, 30, 0, 0);
  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
  const title = encodeURIComponent(`Futures ${campus.name} — Sunday Service`);
  const loc = encodeURIComponent(campus.address ?? campus.city);
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${fmt(sunday)}/${fmt(end)}&location=${loc}`;
}

export function ServiceTimeBanner() {
  const [visible, setVisible] = useState(false);
  const [found, setFound] = useState<Campus | null>(null);
  const [query, setQuery] = useState("");
  const [attempted, setAttempted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DISMISSED_KEY);
      if (raw) {
        const until = parseInt(raw, 10);
        if (Date.now() < until) return;
      }
    } catch {
      // localStorage blocked
    }
    setVisible(true);

    // Try geolocation silently (no prompt if permission already granted)
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.permissions?.query({ name: "geolocation" }).then((result) => {
        if (result.state === "granted") {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const c = nearestActiveCampus(pos.coords.latitude, pos.coords.longitude);
              if (c) setFound(c);
            },
            () => {},
            { timeout: 3000 }
          );
        }
      });
    }
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(
        DISMISSED_KEY,
        String(Date.now() + DISMISS_DAYS * 24 * 60 * 60 * 1000)
      );
    } catch {}
    setVisible(false);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setAttempted(true);
    const c = campusByCity(query);
    if (c) {
      setFound(c);
    } else if (typeof navigator !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const nearest = nearestActiveCampus(pos.coords.latitude, pos.coords.longitude);
          setFound(nearest);
        },
        () => setFound(null),
        { timeout: 5000 }
      );
    }
  }

  if (!visible) return null;

  return (
    <div
      role="banner"
      className="relative z-40 mt-16 border-b border-ink-900/10 bg-cream/95 backdrop-blur-sm"
      style={{ fontSize: 13 }}
    >
      <div className="mx-auto flex min-h-[40px] max-w-7xl items-center gap-4 px-4 py-2 sm:px-6">
        <MapPin className="hidden h-3.5 w-3.5 shrink-0 text-warm-500 sm:block" strokeWidth={1.8} />

        {found ? (
          <div className="flex flex-1 flex-wrap items-center gap-x-3 gap-y-1 font-sans text-ink-700">
            <span>
              <span className="font-medium text-ink-900">{found.name}</span>
              {found.serviceTime && (
                <span className="text-ink-500"> · {found.serviceTime}</span>
              )}
            </span>
            <Link
              href={`/campuses/${found.slug}`}
              className="font-medium text-warm-600 underline-offset-2 hover:underline"
            >
              Campus page →
            </Link>
            {found.status !== "online" && (
              <a
                href={nextSundayGoogleCalUrl(found)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-500 underline-offset-2 hover:text-warm-600 hover:underline"
              >
                Add to calendar
              </a>
            )}
          </div>
        ) : (
          <form onSubmit={handleSearch} className="flex flex-1 items-center gap-2">
            <label htmlFor="campus-search" className="shrink-0 font-sans text-ink-600">
              Find your campus
            </label>
            <input
              ref={inputRef}
              id="campus-search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="City or campus name"
              className="min-w-0 flex-1 rounded border border-ink-900/15 bg-transparent px-2.5 py-1 font-sans text-ink-900 placeholder:text-ink-400 focus:border-warm-500 focus:outline-none sm:max-w-[200px]"
              style={{ fontSize: 13 }}
            />
            <button
              type="submit"
              className="shrink-0 rounded bg-ink-900 px-3 py-1 font-sans text-cream transition-colors hover:bg-warm-600"
              style={{ fontSize: 12 }}
            >
              Go
            </button>
            {attempted && !found && (
              <Link
                href="/campuses"
                className="shrink-0 font-sans text-ink-500 underline-offset-2 hover:text-warm-600 hover:underline"
              >
                Browse all →
              </Link>
            )}
          </form>
        )}

        <button
          onClick={dismiss}
          aria-label="Dismiss campus finder"
          className="ml-auto shrink-0 text-ink-400 transition-colors hover:text-ink-900"
        >
          <X className="h-3.5 w-3.5" strokeWidth={1.8} />
        </button>
      </div>
    </div>
  );
}
