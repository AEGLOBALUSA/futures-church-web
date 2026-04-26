/**
 * Audience segmentation — cold vs warm visitors.
 *
 * "Warm" means the visitor has interacted with the college page before
 * (captured in localStorage). Used to gate free-session access patterns:
 * cold visitors go straight to Vimeo; warm visitors are nudged to the apply
 * form so we collect an email before they watch again.
 */

export type Audience = "cold" | "warm";

const STORAGE_KEY = "futures_college_audience";

/** Returns the visitor's audience segment. Defaults to "cold" on first visit. */
export function getAudience(): Audience {
  if (typeof window === "undefined") return "cold";
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "warm") return "warm";
    return "cold";
  } catch {
    return "cold";
  }
}

/** Mark the current visitor as warm (call after any meaningful engagement). */
export function markWarm(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, "warm");
  } catch {
    // ignore
  }
}
