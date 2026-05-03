import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lost the path",
  robots: { index: false, follow: true },
};

export default function NotFound() {
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
            404 · Lost the path
          </p>
          <h1 className="mt-5 max-w-[20ch] font-display text-display-2xl leading-[0.92] text-ink-900">
            Looks like you wandered off.
          </h1>
          <p className="mt-8 max-w-prose font-display text-body-lg italic text-ink-700">
            The page you were looking for isn&rsquo;t here — maybe it moved, maybe it never was.
            Either way, the rest of the family is right where you left them.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-32 sm:px-10 lg:px-16">
        <p className="font-ui text-eyebrow uppercase tracking-[0.28em] text-ink-500">
          Try one of these
        </p>
        <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            { href: "/", label: "Home", helper: "Start at the start" },
            { href: "/campuses", label: "Find a campus", helper: "21 churches, 4 countries" },
            { href: "/watch", label: "Watch", helper: "Latest sermons + live stream" },
            { href: "/daily-word", label: "Daily Word", helper: "One scripture, every morning" },
            { href: "/plan-a-visit", label: "Plan a visit", helper: "Your first Sunday" },
            { href: "/contact", label: "Talk to us", helper: "Real humans, real reply" },
          ].map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="group block rounded-2xl border border-ink-900/10 bg-cream/95 px-5 py-4 transition hover:border-accent/40 hover:bg-cream-50"
              >
                <p
                  className="font-display italic text-ink-900"
                  style={{ fontSize: 19, fontWeight: 300, lineHeight: 1.2 }}
                >
                  {l.label}
                </p>
                <p className="mt-1 font-sans text-body-sm text-ink-600">{l.helper}</p>
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-12 font-display italic text-ink-600" style={{ fontSize: 16 }}>
          Or just{" "}
          <Link href="/" className="text-accent underline underline-offset-4 hover:text-warm-700">
            ask Milo
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
