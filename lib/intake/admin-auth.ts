import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "intake_admin";
const SESSION_TTL_SEC = 30 * 24 * 60 * 60; // 30 days

function secret(): string {
  const s = process.env.INTAKE_ADMIN_SECRET ?? process.env.NEXTAUTH_SECRET;
  if (!s) throw new Error("INTAKE_ADMIN_SECRET (or NEXTAUTH_SECRET) is not set");
  return s;
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

function makeCookie(): string {
  const expiresAt = Date.now() + SESSION_TTL_SEC * 1000;
  const payload = `admin.${expiresAt}`;
  return `${payload}.${sign(payload)}`;
}

function verifyCookie(value: string): boolean {
  const parts = value.split(".");
  if (parts.length !== 3) return false;
  const [_, expiresAtStr, sig] = parts;
  const payload = `${parts[0]}.${expiresAtStr}`;
  const expected = sign(payload);
  if (sig.length !== expected.length) return false;
  try {
    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
  } catch {
    return false;
  }
  const exp = Number(expiresAtStr);
  if (!Number.isFinite(exp) || exp < Date.now()) return false;
  return true;
}

export async function isAdminAuthed(): Promise<boolean> {
  const c = await cookies();
  const v = c.get(COOKIE_NAME)?.value;
  if (!v) return false;
  return verifyCookie(v);
}

export async function setAdminSession() {
  const c = await cookies();
  c.set(COOKIE_NAME, makeCookie(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SEC,
  });
}

export async function clearAdminSession() {
  const c = await cookies();
  c.delete(COOKIE_NAME);
}

export function checkAdminPassword(input: string): boolean {
  const expected = process.env.INTAKE_ADMIN_PASSWORD;
  if (!expected) return false;
  if (input.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(input), Buffer.from(expected));
  } catch {
    return false;
  }
}
