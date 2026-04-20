/**
 * In-memory rate limiter for /api/selah/converse.
 *
 * For a single-region Netlify deploy with a modest launch cohort this is
 * fine — it's one process per region, resets on cold start, and never
 * logs identifiable data. If we scale out, swap this for Upstash / Redis.
 *
 * Limits (from launch brief):
 *   - 30 messages per sessionId
 *   - 200 messages per user per day  (user == sessionId for anon, or keyed by Stripe customer id once we have auth)
 *   - 5 concurrent in-flight per IP
 *
 * A "warm message" is returned on hit — no 429 errors to the user.
 */

const SESSION_CAP = 30;
const DAILY_CAP = 200;
const CONCURRENT_PER_IP = 5;
const DAY_MS = 24 * 60 * 60 * 1000;

type SessionStat = { count: number; firstSeen: number };
type DailyStat = { count: number; windowStart: number };

const sessionCounts = new Map<string, SessionStat>();
const dailyCounts = new Map<string, DailyStat>();
const inFlightByIp = new Map<string, number>();

function sweep() {
  const now = Date.now();
  // Expire sessions older than 24h, expired daily windows.
  for (const [k, v] of sessionCounts) if (now - v.firstSeen > DAY_MS) sessionCounts.delete(k);
  for (const [k, v] of dailyCounts) if (now - v.windowStart > DAY_MS) dailyCounts.delete(k);
}

export type LimitDecision =
  | { ok: true; release: () => void }
  | { ok: false; warmMessage: string };

export function acquireLimit(opts: {
  sessionId: string;
  userKey?: string;
  ip: string;
}): LimitDecision {
  sweep();
  const { sessionId, userKey, ip } = opts;
  const now = Date.now();

  const inFlight = inFlightByIp.get(ip) ?? 0;
  if (inFlight >= CONCURRENT_PER_IP) {
    return {
      ok: false,
      warmMessage:
        "You've got a few questions in flight already — let one finish, then come back to this one. I'm not going anywhere.",
    };
  }

  const s = sessionCounts.get(sessionId) ?? { count: 0, firstSeen: now };
  if (s.count >= SESSION_CAP) {
    return {
      ok: false,
      warmMessage:
        "We've covered a lot in this conversation — more than thirty turns. Take what you have, sit with it, and come back fresh when you're ready. A new conversation window is always open.",
    };
  }

  const key = userKey ?? sessionId;
  const d = dailyCounts.get(key) ?? { count: 0, windowStart: now };
  if (now - d.windowStart > DAY_MS) {
    d.count = 0;
    d.windowStart = now;
  }
  if (d.count >= DAILY_CAP) {
    return {
      ok: false,
      warmMessage:
        "You've reached today's conversation limit. That's by design — this is meant to be one voice among many in your day, not the loudest. Sleep on what we've talked through. I'll be here tomorrow.",
    };
  }

  // Reserve.
  inFlightByIp.set(ip, inFlight + 1);
  s.count += 1;
  s.firstSeen = s.firstSeen || now;
  sessionCounts.set(sessionId, s);
  d.count += 1;
  dailyCounts.set(key, d);

  return {
    ok: true,
    release: () => {
      const curr = inFlightByIp.get(ip) ?? 0;
      const next = Math.max(0, curr - 1);
      if (next === 0) inFlightByIp.delete(ip);
      else inFlightByIp.set(ip, next);
    },
  };
}
