import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdminAuthed } from "@/lib/intake/admin-auth";
import { listAllCampusesWithProgress } from "@/lib/intake/server";
import { SeedClient } from "./SeedClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SeedPage() {
  if (!(await isAdminAuthed())) redirect("/intake/admin/login");
  const campuses = await listAllCampusesWithProgress();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://futures.church";

  return (
    <div className="min-h-screen bg-cream-200">
      <header className="border-b border-ink-900/10 bg-cream/80 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto flex max-w-shell items-center gap-4 px-5 py-3 sm:px-8">
          <Link
            href="/intake/admin"
            className="font-ui text-[11px] uppercase tracking-[0.2em] text-ink-500 hover:text-ink-900"
          >
            ← Back to dashboard
          </Link>
          <span className="ml-auto font-ui text-[10px] uppercase tracking-[0.24em] text-ink-500">
            Campus links
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-shell px-5 pb-32 pt-12 sm:px-8 sm:pt-16">
        <p className="font-ui text-[11px] uppercase tracking-[0.28em] text-ink-500">
          Setup
        </p>
        <h1 className="mt-3 font-display text-display-xl leading-[0.96] text-ink-900">
          Send each campus their link.
        </h1>
        <p className="mt-5 max-w-prose font-display text-body-lg italic text-ink-700">
          One unique URL per campus. They&rsquo;re generated once and stay stable forever — share via
          email, text, whatever&rsquo;s easiest. New campuses get a link the next time you click
          &ldquo;sync.&rdquo;
        </p>

        <SeedClient initial={campuses} baseUrl={baseUrl} />
      </main>
    </div>
  );
}

export const metadata = {
  title: "Campus links",
  robots: { index: false, follow: false },
};
