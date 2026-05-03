"use client";

// Next.js App Router error boundary — renders for any uncaught error in a
// route segment. Must be a client component. Logs to the console + Sentry
// (if wired) so we can find what broke.

import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("Route error:", error);
  }, [error]);

  return (
    <main className="bg-cream-200 text-ink-900">
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse at 25% 20%, #F7F1E6 0%, #F2E6D1 45%, #E8C9A6 80%, #D9B089 100%)",
          }}
        />
        <div className="mx-auto max-w-shell px-6 py-32 sm:px-10 sm:py-40 lg:px-16">
          <p className="font-ui text-eyebrow uppercase tracking-[0.28em] text-ink-500">
            500 · Something on our end
          </p>
          <h1 className="mt-5 max-w-[22ch] font-display text-display-2xl leading-[0.92] text-ink-900">
            We hit a knot. Working on it.
          </h1>
          <p className="mt-8 max-w-prose font-display text-body-lg italic text-ink-700">
            This page didn&rsquo;t load the way it was supposed to. Our team has been notified
            automatically. Try again in a moment, or pick another door — we&rsquo;ll meet you on the
            other side.
          </p>
          {error.digest && (
            <p className="mt-4 font-mono text-body-sm text-ink-500">
              Reference: {error.digest}
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-32 sm:px-10 lg:px-16">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-full bg-ink-900 px-6 py-3 font-ui text-[11px] uppercase tracking-[0.24em] text-cream transition hover:bg-warm-700"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-full border border-ink-900/15 bg-cream/70 px-6 py-3 font-ui text-[11px] uppercase tracking-[0.22em] text-ink-900 hover:bg-cream-300"
          >
            Back to home
          </Link>
          <a
            href="mailto:hello@futures.church"
            className="rounded-full border border-ink-900/15 bg-cream/70 px-6 py-3 font-ui text-[11px] uppercase tracking-[0.22em] text-ink-900 hover:bg-cream-300"
          >
            Email us
          </a>
        </div>

        <p className="mt-12 font-display italic text-ink-600" style={{ fontSize: 16 }}>
          If this keeps happening,{" "}
          <a className="text-accent underline underline-offset-4 hover:text-warm-700" href="mailto:hello@futures.church">
            tell us
          </a>{" "}
          what you were doing — it helps more than you&rsquo;d think.
        </p>
      </section>
    </main>
  );
}
