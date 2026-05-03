"use client";

import { useCallback, useRef, useState } from "react";

export type UserCoords = { lat: number; lng: number };

export type LocationState =
  | { status: "idle" }
  | { status: "requesting" }
  | { status: "granted"; coords: UserCoords }
  | { status: "denied"; reason?: string }
  | { status: "unavailable" };

/**
 * One-tap geolocation hook for Milo's "find my closest campus" flow.
 *
 * - Asks the browser for coordinates only when `request()` is called.
 *   Never auto-prompts.
 * - Caches the granted coords in-memory for the session so a follow-up
 *   question doesn't re-prompt the user.
 * - Coordinates are returned to the caller and never stored on the server
 *   at full precision.
 */
export function useUserLocation() {
  const [state, setState] = useState<LocationState>({ status: "idle" });
  const cachedRef = useRef<UserCoords | null>(null);

  const request = useCallback((): Promise<UserCoords | null> => {
    if (cachedRef.current) {
      setState({ status: "granted", coords: cachedRef.current });
      return Promise.resolve(cachedRef.current);
    }

    return new Promise((resolve) => {
      if (typeof navigator === "undefined" || !navigator.geolocation) {
        setState({ status: "unavailable" });
        resolve(null);
        return;
      }
      setState({ status: "requesting" });
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords: UserCoords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          cachedRef.current = coords;
          setState({ status: "granted", coords });
          resolve(coords);
        },
        (err) => {
          setState({ status: "denied", reason: err?.message ?? "denied" });
          resolve(null);
        },
        {
          enableHighAccuracy: false,
          timeout: 10_000,
          maximumAge: 60_000,
        }
      );
    });
  }, []);

  return { state, request };
}
