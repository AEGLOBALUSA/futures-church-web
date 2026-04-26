import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COLLEGE_HOSTS = new Set([
  "futuresglobal.college",
  "www.futuresglobal.college",
]);

/**
 * Host-aware routing:
 *
 *  - On `futuresglobal.college` (standalone domain), the root path `/` serves
 *    the college marketing page. Any church-only routes return 404 so the
 *    college domain stays focused.
 *
 *  - On every other host (futures.church, futures-church.netlify.app, etc.)
 *    the normal site routes apply unchanged.
 *
 * Runs at the Edge, before Next.js routing, so it works where Netlify's
 * `netlify.toml` host-conditional rewrites are shadowed by existing routes.
 */
export function middleware(req: NextRequest) {
  const host = (req.headers.get("host") ?? "").toLowerCase().split(":")[0];
  if (!COLLEGE_HOSTS.has(host)) return NextResponse.next();

  const url = req.nextUrl;
  const path = url.pathname;

  // Root → college marketing page (transparent rewrite, URL stays `/`).
  if (path === "/") {
    const rewritten = url.clone();
    rewritten.pathname = "/college";
    return NextResponse.rewrite(rewritten);
  }

  // Canonicalize: if someone lands on /college on this host, 301 to root.
  if (path === "/college" || path === "/college/") {
    const canonical = url.clone();
    canonical.pathname = "/";
    return NextResponse.redirect(canonical, 301);
  }

  // Otherwise let it through (static assets, API routes, OG image, etc.).
  return NextResponse.next();
}

export const config = {
  // Skip Next internals and any static asset with a file extension.
  matcher: ["/((?!_next/|_vercel|.*\\..*).*)"],
};
