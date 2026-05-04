"use client";

import { useCallback, useRef, useState } from "react";
import type { UserCoords } from "./useUserLocation";

const SESSION_KEY = "futures-ip-geo";

export type IpLocation = {
  coords: UserCoords;
  city: string | null;
  region: string | null;
  country: string | null;
  countryCode: string | null;
};

type CachedIpLocation = IpLocation & { cachedAt: number };

// 30-min session cache — visitor IP rarely changes mid-session, and we never
// want to hammer /api/geo on every campus button click.
const TTL_MS = 30 * 60 * 1000;

/**
 * One-tap, no-permission-prompt location lookup.
 *
 * Uses Netlify's edge geolocation (forwarded via x-nf-geo header) to derive
 * a rough lat/lng + city from the visitor's IP. Returns null if the header
 * isn't present (local dev, exotic proxy paths, or VPN-with-stripped-headers).
 *
 * Pair with useUserLocation when precise distance matters: call this first
 * for the instant answer, then optionally upgrade if the visitor wants more.
 */
export function useIpLocation() {
  const [state, setState] = useState<
    | { status: "idle" }
    | { status: "loading" }
    | { status: "ready"; data: IpLocation }
    | { status: "unavailable"; reason: string }
  >({ status: "idle" });
  const cachedRef = useRef<IpLocation | null>(null);

  const lookup = useCallback(async (): Promise<IpLocation | null> => {
    if (cachedRef.current) {
      setState({ status: "ready", data: cachedRef.current });
      return cachedRef.current;
    }

    // sessionStorage warm-up — survives across page navigations within the
    // same tab without re-hitting the network.
    if (typeof window !== "undefined") {
      try {
        const raw = sessionStorage.getItem(SESSION_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as CachedIpLocation;
          if (parsed.cachedAt && Date.now() - parsed.cachedAt < TTL_MS) {
            cachedRef.current = parsed;
            setState({ status: "ready", data: parsed });
            return parsed;
          }
        }
      } catch {}
    }

    setState({ status: "loading" });
    try {
      const res = await fetch("/api/geo", { cache: "no-store" });
      const json = (await res.json()) as
        | { ok: true; coords: UserCoords; city: string | null; region: string | null; country: string | null; countryCode: string | null }
        | { ok: false; reason: string };

      if (!json.ok) {
        setState({ status: "unavailable", reason: json.reason });
        return null;
      }

      const data: IpLocation = {
        coords: json.coords,
        city: json.city,
        region: json.region,
        country: json.country,
        countryCode: json.countryCode,
      };
      cachedRef.current = data;
      try {
        sessionStorage.setItem(
          SESSION_KEY,
          JSON.stringify({ ...data, cachedAt: Date.now() }),
        );
      } catch {}
      setState({ status: "ready", data });
      return data;
    } catch {
      setState({ status: "unavailable", reason: "network" });
      return null;
    }
  }, []);

  return { state, lookup };
}
