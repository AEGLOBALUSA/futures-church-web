"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MapPin, Navigation, Loader2 } from "lucide-react";
import type { Campus } from "@/lib/content/campuses";
import { useIpLocation } from "@/lib/ai/useIpLocation";

type WithDistance = Campus & { distanceKm: number };

// Haversine — great-circle distance in km between two lat/lng pairs.
function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const x = Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(x));
}

function formatDistance(km: number, locale: string): string {
  // US visitors get miles; everyone else gets km.
  if (locale.toLowerCase().startsWith("en-us")) {
    const miles = km * 0.621371;
    return miles < 10 ? `${miles.toFixed(1)} mi` : `${Math.round(miles)} mi`;
  }
  return km < 10 ? `${km.toFixed(1)} km` : `${Math.round(km)} km`;
}

export function NearestCampusFinder({ campuses }: { campuses: Campus[] }) {
  const [status, setStatus] = useState<"idle" | "ip-loading" | "ip-loaded" | "asking" | "loaded" | "denied" | "error">("idle");
  const [nearest, setNearest] = useState<WithDistance[]>([]);
  const [city, setCity] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { lookup } = useIpLocation();

  function rankByCoords(me: { lat: number; lng: number }) {
    return campuses
      .filter((c) => c.lat != null && c.lng != null && c.status === "active")
      .map<WithDistance>((c) => ({
        ...c,
        distanceKm: distanceKm(me, { lat: c.lat!, lng: c.lng! }),
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, 3);
  }

  // On mount, try IP-based geo so the visitor lands with a list already
  // populated — no clicks, no prompts. The "Use precise location" button
  // remains as an opt-in upgrade for visitors who want exact distance.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setStatus("ip-loading");
      const ip = await lookup();
      if (cancelled) return;
      if (!ip) {
        setStatus("idle");
        return;
      }
      setNearest(rankByCoords(ip.coords));
      setCity(ip.city ?? ip.region ?? ip.country ?? null);
      setStatus("ip-loaded");
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function findNearest() {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setStatus("error");
      setErrorMessage("Your browser doesn't support location lookup. Try the campus list below.");
      return;
    }
    setStatus("asking");
    setErrorMessage(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const me = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setNearest(rankByCoords(me));
        setStatus("loaded");
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setStatus("denied");
          setErrorMessage("No worries — try the campus list below.");
        } else {
          setStatus("error");
          setErrorMessage("Couldn't read your location. Try the campus list below.");
        }
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60_000 }
    );
  }

  const locale = typeof navigator !== "undefined" ? navigator.language : "en";

  return (
    <div className="rounded-3xl border border-ink-900/10 bg-cream/95 px-6 py-7 sm:px-8 sm:py-8 shadow-[0_24px_48px_-32px_rgba(20,20,20,0.18)]">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-ui text-eyebrow uppercase tracking-[0.28em] text-ink-500">
            Find your home
          </p>
          <h2
            className="mt-2 font-display italic text-ink-900"
            style={{ fontSize: "clamp(1.5rem, 2.6vw, 2rem)", lineHeight: 1.15, fontWeight: 300 }}
          >
            Your three nearest campuses, in seconds.
          </h2>
        </div>
        <button
          type="button"
          onClick={findNearest}
          disabled={status === "asking" || status === "ip-loading"}
          className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-5 py-3 font-ui text-[11px] uppercase tracking-[0.24em] text-cream transition hover:bg-warm-700 disabled:opacity-60"
        >
          {status === "asking" ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Locating…
            </>
          ) : status === "ip-loaded" ? (
            <>
              <Navigation className="size-4" /> Use precise location
            </>
          ) : (
            <>
              <Navigation className="size-4" /> Use my location
            </>
          )}
        </button>
      </div>

      {status === "ip-loaded" && city && (
        <p className="mt-3 font-sans text-body-sm text-ink-500">
          Based on your IP, looks like you&rsquo;re in <span className="text-ink-700">{city}</span>. Tap above for exact distance.
        </p>
      )}

      {(status === "denied" || status === "error") && errorMessage && (
        <p className="mt-4 font-sans text-body-sm text-ink-600">{errorMessage}</p>
      )}

      {(status === "loaded" || status === "ip-loaded") && nearest.length > 0 && (
        <ul className="mt-6 space-y-3">
          {nearest.map((c, i) => (
            <li key={c.slug}>
              <Link
                href={`/campuses/${c.slug}`}
                className="group flex items-center justify-between gap-4 rounded-2xl border border-ink-900/10 bg-cream-50 px-5 py-4 transition hover:border-accent/40 hover:bg-cream-100"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span className="font-display italic text-accent" style={{ fontSize: 24, fontWeight: 300 }}>
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <p
                      className="truncate font-display italic text-ink-900"
                      style={{ fontSize: 19, fontWeight: 300, lineHeight: 1.2 }}
                    >
                      {c.name}
                    </p>
                    <p className="font-sans text-body-sm text-ink-600">
                      <MapPin className="inline size-3.5 -translate-y-0.5 mr-1 text-accent" strokeWidth={1.6} />
                      {c.city}
                      {c.serviceTime && <span className="ml-2 text-ink-500">· {c.serviceTime}</span>}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-display italic text-ink-900" style={{ fontSize: 17, fontWeight: 300 }}>
                    {formatDistance(c.distanceKm, locale)}
                  </p>
                  <p className="font-ui text-[10px] uppercase tracking-[0.22em] text-ink-500">
                    away
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {(status === "loaded" || status === "ip-loaded") && nearest.length === 0 && (
        <p className="mt-4 font-sans text-body-sm text-ink-600">
          We couldn&rsquo;t find a Futures campus close to you. Try our online campus —{" "}
          <Link href="/campuses/online" className="text-accent underline underline-offset-4">
            join from anywhere
          </Link>
          .
        </p>
      )}
    </div>
  );
}
