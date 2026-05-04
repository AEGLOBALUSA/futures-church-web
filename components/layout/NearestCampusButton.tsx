"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MapPin, Loader2 } from "lucide-react";
import { useUserLocation } from "@/lib/ai/useUserLocation";
import { useIpLocation } from "@/lib/ai/useIpLocation";
import { findNearestCampuses } from "@/lib/ai/tools/findNearestCampuses";

type Variant = "nav" | "nav-dark" | "mobile";

/**
 * One-tap "find my nearest campus" CTA.
 *
 * Click flow (no permission prompt path first):
 *   1. Try IP-based geolocation via /api/geo (Netlify edge headers).
 *      → Instant, no browser permission prompt, city-level accuracy
 *        which is plenty for ranking 21 campuses worldwide.
 *   2. If IP unavailable (local dev, VPN, header stripped), fall back
 *      to browser geolocation (asks permission, exact coords).
 *   3. Rank physical campuses by distance, take the closest.
 *   4. Push to that campus's page.
 *
 * Failure paths fall back to /campuses so the visitor lands somewhere useful.
 */
export function NearestCampusButton({ variant = "nav" }: { variant?: Variant }) {
  const router = useRouter();
  const { request } = useUserLocation();
  const { lookup } = useIpLocation();
  const [busy, setBusy] = useState(false);

  async function go() {
    if (busy) return;
    setBusy(true);
    try {
      // Try IP first — instant, no prompt.
      let coords = (await lookup())?.coords ?? null;
      // Fall back to browser geolocation if IP wasn't available.
      if (!coords) coords = await request();
      if (!coords) {
        router.push("/campuses");
        return;
      }
      const nearest = findNearestCampuses(coords.lat, coords.lng, 1)[0];
      if (!nearest) {
        router.push("/campuses");
        return;
      }
      router.push(`/campuses/${nearest.campus.slug}`);
    } finally {
      setBusy(false);
    }
  }

  if (variant === "mobile") {
    return (
      <button
        type="button"
        onClick={go}
        disabled={busy}
        className="flex w-full items-center justify-center gap-2 rounded-full border border-warm-500 px-5 py-3 font-ui text-[14px] text-warm-700 transition-colors hover:bg-warm-500/10 disabled:opacity-60"
      >
        {busy ? (
          <Loader2 className="h-4 w-4 animate-spin" strokeWidth={1.75} />
        ) : (
          <MapPin className="h-4 w-4" strokeWidth={1.75} />
        )}
        <span>{busy ? "Finding your campus…" : "Find my nearest campus"}</span>
      </button>
    );
  }

  const isDark = variant === "nav-dark";
  return (
    <button
      type="button"
      onClick={go}
      disabled={busy}
      title="Find your nearest Futures campus"
      className={`hidden md:inline-flex items-center gap-1.5 rounded-full px-4 py-2 font-ui text-[13px] transition-colors disabled:opacity-60 ${
        isDark
          ? "border border-cream/30 text-cream/90 hover:bg-cream/10"
          : "border border-ink-900/15 text-ink-700 hover:bg-ink-900/5"
      }`}
    >
      {busy ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" strokeWidth={1.75} />
      ) : (
        <MapPin className="h-3.5 w-3.5" strokeWidth={1.75} />
      )}
      <span>{busy ? "Finding…" : "Nearest campus"}</span>
    </button>
  );
}

/**
 * Fallback link used in the mobile drawer when JS hasn't hydrated yet.
 * Same destination — just no geolocation.
 */
export function NearestCampusLink() {
  return (
    <Link
      href="/campuses"
      className="flex items-center gap-2 text-[14px] text-ink-700 hover:text-ink-900"
    >
      <MapPin className="h-4 w-4" strokeWidth={1.75} />
      Find a campus
    </Link>
  );
}
