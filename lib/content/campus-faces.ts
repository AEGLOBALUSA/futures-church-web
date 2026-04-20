import raw from "@/content/campus-faces.json";

export type CampusFace = {
  id: string;
  imageUrl: string;
  alt: string;
  /** Null when the face is drawn from the shared Futures pool (not yet tagged to a campus). */
  campusSlug: string | null;
  /** Optional — only present once comms has filled in a real name + signed release. */
  firstName?: string;
  /** Optional story snippet — 1 short sentence, never fabricated. */
  story?: string;
  /** Optional — e.g. "first Sunday: Mar '24". Honest, short. */
  joinedWhen?: string;
};

type RawShape = {
  pool: CampusFace[];
  byCampus: Record<string, CampusFace[]>;
};

const data = raw as unknown as RawShape;

export const facePool: CampusFace[] = data.pool;
export const facesByCampus: Record<string, CampusFace[]> = data.byCampus;

/**
 * Deterministic monthly rotation: same month = same faces, new month = reshuffle.
 * Keeps the page feeling alive without per-request churn. Works on server + client
 * because it only depends on campus slug + current YYYY-MM (no Math.random).
 */
export function pickFacesForCampus(
  campusSlug: string,
  count = 6,
  now: Date = new Date(),
): { faces: CampusFace[]; mode: "per-campus" | "pool" } {
  const perCampus = facesByCampus[campusSlug] ?? [];
  if (perCampus.length >= count) {
    return { faces: rotate(perCampus, seedFor(campusSlug, now)).slice(0, count), mode: "per-campus" };
  }

  // Fall back to the shared pool, seeded by campus+month so different campuses
  // show different slices this month.
  const pool = facePool;
  if (pool.length === 0) return { faces: [], mode: "pool" };
  const seed = seedFor(campusSlug, now);
  return { faces: rotate(pool, seed).slice(0, count), mode: "pool" };
}

function seedFor(campusSlug: string, now: Date): number {
  const ym = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  const key = `${campusSlug}:${ym}`;
  let h = 2166136261; // FNV-1a
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rotate<T>(arr: T[], seed: number): T[] {
  if (arr.length === 0) return arr;
  const offset = seed % arr.length;
  return [...arr.slice(offset), ...arr.slice(0, offset)];
}
