/**
 * Lightweight analytics wrapper for college page events.
 *
 * Currently logs to console in development and is a no-op stub in production
 * until a proper analytics integration (Plausible / Segment) is wired up.
 * All calls are safe to make unconditionally — no tracking fires without
 * the visitor's awareness.
 */

type ApplyIntentPayload = {
  variant?: string;
  source: string;
};

type SessionUnlockPayload = {
  audience: string;
  sessionId: string;
};

function log(event: string, payload?: object) {
  if (process.env.NODE_ENV === "development") {
    console.log(`[analytics] ${event}`, payload ?? "");
  }
}

export const analytics = {
  /** User clicked an apply CTA — record variant + source for conversion reporting. */
  applyIntent(payload: ApplyIntentPayload) {
    log("apply_intent", payload);
  },

  /** The A/B/C subhead variant was seen — for experiment readout. */
  subheadVariantSeen(variant: string) {
    log("subhead_variant_seen", { variant });
  },

  /** A free session was unlocked — for funnel analysis. */
  sessionUnlock(payload: SessionUnlockPayload) {
    log("session_unlock", payload);
  },
};
