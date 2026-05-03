// Editor scope detection — who can edit what, on the live site.
//
// Two scopes, two cookies:
//   • Senior admin → `intake_admin` cookie (from /intake/admin/login). Can edit anywhere.
//   • Campus pastor → `fc_edit_campus` cookie set when they land on /intake/[slug]?key=…
//     Contains: { slug, exp, sig } base64-encoded JSON. Scoped to one campus only.
//
// 30-day session. Trust-the-link model — minted from a valid intake token,
// then carried as a normal cookie until expiry.

import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { isAdminAuthed } from "@/lib/intake/admin-auth";

const COOKIE_NAME = "fc_edit_campus";
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

function secret(): string {
  const s = process.env.INTAKE_ADMIN_SECRET ?? process.env.NEXTAUTH_SECRET;
  if (!s) throw new Error("INTAKE_ADMIN_SECRET (or NEXTAUTH_SECRET) is not set");
  return s;
}

type CampusEditorPayload = {
  slug: string;
  exp: number; // unix ms
};

function sign(json: string): string {
  return createHmac("sha256", secret()).update(json).digest("base64url");
}

function pack(payload: CampusEditorPayload): string {
  const json = JSON.stringify(payload);
  const sig = sign(json);
  return `${Buffer.from(json).toString("base64url")}.${sig}`;
}

function unpack(value: string): CampusEditorPayload | null {
  const parts = value.split(".");
  if (parts.length !== 2) return null;
  const [b64, sig] = parts;
  let json: string;
  try {
    json = Buffer.from(b64, "base64url").toString("utf8");
  } catch {
    return null;
  }
  const expected = sign(json);
  if (sig.length !== expected.length) return null;
  try {
    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  } catch {
    return null;
  }
  let payload: CampusEditorPayload;
  try {
    payload = JSON.parse(json);
  } catch {
    return null;
  }
  if (!payload.slug || typeof payload.exp !== "number" || payload.exp < Date.now()) return null;
  return payload;
}

export type EditorScope =
  | { kind: "admin" }
  | { kind: "campus"; slug: string }
  | null;

/** Read the current visitor's editor scope from cookies. SSR-safe. */
export async function getEditorScope(): Promise<EditorScope> {
  if (await isAdminAuthed()) return { kind: "admin" };
  const c = await cookies();
  const value = c.get(COOKIE_NAME)?.value;
  if (!value) return null;
  const payload = unpack(value);
  if (!payload) return null;
  return { kind: "campus", slug: payload.slug };
}

/** Mint and set the campus editor cookie. Called from /intake/[slug] after token validation. */
export async function mintCampusEditorSession(slug: string) {
  const c = await cookies();
  const payload: CampusEditorPayload = { slug, exp: Date.now() + SESSION_TTL_MS };
  c.set(COOKIE_NAME, pack(payload), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  });
}

export async function clearCampusEditorSession() {
  const c = await cookies();
  c.delete(COOKIE_NAME);
}

/** Can this scope edit the given campus's content? */
export function canEditCampus(scope: EditorScope, slug: string): boolean {
  if (!scope) return false;
  if (scope.kind === "admin") return true;
  return scope.kind === "campus" && scope.slug === slug;
}

/** Can this scope edit any global page content (home, vision, etc.)? */
export function canEditGlobal(scope: EditorScope): boolean {
  return scope?.kind === "admin";
}
