/**
 * A/B/C subhead experiment bucketing.
 *
 * Each new visitor is assigned a variant (A, B, or C) at 33% each and the
 * bucket is persisted in localStorage so they see the same copy on return
 * visits. The variant is consumed by CollegeHero to pick which subhead line
 * to show.
 */

export type SubheadVariant = "A" | "B" | "C";

const STORAGE_KEY = "futures_college_subhead_variant";
const VARIANTS: SubheadVariant[] = ["A", "B", "C"];

/** Returns the visitor's assigned subhead variant (deterministic per visitor). */
export function getSubheadVariant(): SubheadVariant | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const stored = localStorage.getItem(STORAGE_KEY) as SubheadVariant | null;
    if (stored && VARIANTS.includes(stored)) return stored;
    const assigned = VARIANTS[Math.floor(Math.random() * VARIANTS.length)];
    localStorage.setItem(STORAGE_KEY, assigned);
    return assigned;
  } catch {
    return "A";
  }
}
