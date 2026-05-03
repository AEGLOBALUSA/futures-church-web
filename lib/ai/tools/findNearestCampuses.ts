import { campuses, type Campus } from "@/lib/content/campuses";

/**
 * Great-circle distance between two lat/lng points in kilometres.
 * Standard haversine. Sub-millisecond, no external API dependency.
 */
export function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth radius in km
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export type CampusWithDistance = {
  campus: Campus;
  distanceKm: number;
};

/**
 * Rank Futures campuses by distance from a user's coordinates. Skips the
 * Online Campus (no physical location) and any campus missing lat/lng.
 * Returns the top `limit` results, sorted closest-first.
 */
export function findNearestCampuses(
  userLat: number,
  userLng: number,
  limit = 3
): CampusWithDistance[] {
  return campuses
    .filter(
      (c) =>
        c.status !== "online" &&
        typeof c.lat === "number" &&
        typeof c.lng === "number"
    )
    .map((c) => ({
      campus: c,
      distanceKm: haversineKm(
        userLat,
        userLng,
        c.lat as number,
        c.lng as number
      ),
    }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limit);
}

/**
 * Bucketed distance label so analytics never log raw kilometres (privacy)
 * but still tell us roughly where users are landing. Used for telemetry.
 */
export function distanceBucket(distanceKm: number): string {
  if (distanceKm < 10) return "<10km";
  if (distanceKm < 50) return "<50km";
  if (distanceKm < 200) return "<200km";
  if (distanceKm < 1000) return "<1000km";
  return ">1000km";
}

/**
 * Format ranked campuses as a Milo-readable system-prompt block.
 * Injected into the system prompt when the chat route has the visitor's
 * coordinates. Milo uses this verbatim when answering location questions.
 */
export function formatNearestCampusesForMilo(
  results: CampusWithDistance[]
): string {
  if (results.length === 0) {
    return "No Futures campuses with known coordinates were found.";
  }
  const lines = results.map(({ campus, distanceKm }) => {
    const dist = distanceKm < 1 ? "<1" : Math.round(distanceKm).toString();
    const pastors = campus.leadPastors ? ` — ${campus.leadPastors}` : "";
    const service = campus.serviceTime ?? "Sundays";
    return `- ${campus.name} (${campus.city}, ${campus.country})${pastors}: ${dist} km away. ${service}. /campuses/${campus.slug}`;
  });
  return lines.join("\n");
}
