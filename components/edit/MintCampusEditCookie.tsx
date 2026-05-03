"use client";

import { useEffect } from "react";

/**
 * Mounts on the intake or events portal, then fires a single POST to mint a
 * 30-day campus editor cookie. Renders nothing. Failures are silent — the
 * pastor can still use the form even if the cookie call fails.
 *
 * This exists because Next.js 15 forbids `cookies().set()` in server
 * components. The cookie has to be set from a route handler — so we just
 * call one from the client on first mount.
 */
export function MintCampusEditCookie({ token }: { token: string }) {
  useEffect(() => {
    if (!token) return;
    void fetch("/api/edit/mint-campus", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ token }),
    }).catch(() => {
      /* silent — pastor can still use the form without the cookie */
    });
  }, [token]);
  return null;
}
