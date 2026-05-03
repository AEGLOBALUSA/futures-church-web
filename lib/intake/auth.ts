import { randomBytes } from "crypto";

// 32 bytes of entropy → 43-char URL-safe token. Unguessable for our purposes.
export function generateAccessToken(): string {
  return randomBytes(32).toString("base64url");
}

export function generateAdminToken(): string {
  return randomBytes(32).toString("base64url");
}

// Admin magic-link sessions live for 30 minutes once issued, 7 days once consumed.
export const ADMIN_MAGIC_LINK_TTL_MS = 30 * 60 * 1000;
export const ADMIN_SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
