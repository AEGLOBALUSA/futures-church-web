import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * GET /api/geo — coarse, no-permission-prompt visitor location.
 *
 * Reads Netlify's edge geolocation forwarded via `x-nf-geo` (base64 JSON).
 * Returns city + country + approximate lat/lng so the client can rank
 * campuses by distance without ever asking the browser for precise coords.
 *
 * If the header is missing (local dev, or upstream proxy strips it), the
 * route returns { ok: false, reason: "unavailable" }. Callers should fall
 * back to either a manual city picker or browser geolocation.
 *
 * Cache: visitor-scoped, never shared. We do NOT log the IP or coordinates.
 */
export async function GET(req: NextRequest) {
  const raw = req.headers.get("x-nf-geo");
  if (!raw) {
    return NextResponse.json(
      { ok: false, reason: "unavailable" },
      { status: 200, headers: { "cache-control": "private, no-store" } }
    );
  }

  try {
    const decoded = Buffer.from(raw, "base64").toString("utf8");
    const data = JSON.parse(decoded) as {
      city?: string;
      country?: { code?: string; name?: string };
      subdivision?: { code?: string; name?: string };
      latitude?: number;
      longitude?: number;
      timezone?: string;
    };

    if (typeof data.latitude !== "number" || typeof data.longitude !== "number") {
      return NextResponse.json(
        { ok: false, reason: "no-coords" },
        { status: 200, headers: { "cache-control": "private, no-store" } }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        coords: { lat: data.latitude, lng: data.longitude },
        city: data.city ?? null,
        region: data.subdivision?.name ?? null,
        country: data.country?.name ?? null,
        countryCode: data.country?.code ?? null,
        source: "netlify-edge",
      },
      { status: 200, headers: { "cache-control": "private, no-store" } }
    );
  } catch {
    return NextResponse.json(
      { ok: false, reason: "decode-error" },
      { status: 200, headers: { "cache-control": "private, no-store" } }
    );
  }
}
