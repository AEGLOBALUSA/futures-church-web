import Link from "next/link";
import { notFound } from "next/navigation";
import { getCampusBySlug } from "@/lib/intake/server";
import { getCampusEvents } from "@/lib/events/server";
import { MintCampusEditCookie } from "@/components/edit/MintCampusEditCookie";
import { EventsListClient, EventsTabNav } from "@/components/events/EventsListClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function NoAccess({ reason }: { reason: string }) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-cream px-6 py-24">
      <div className="max-w-prose text-center">
        <h1 className="font-display text-display-md text-ink-900">
          This link doesn&rsquo;t look right.
        </h1>
        <p className="mt-6 font-sans text-body text-ink-600">{reason}</p>
        <Link
          href="/"
          className="mt-10 inline-flex items-center gap-2 rounded-full border border-ink-900/15 bg-cream/60 px-5 py-2.5 font-ui text-body-sm text-ink-900 hover:bg-cream-300"
        >
          ← Back to futures.church
        </Link>
      </div>
    </div>
  );
}

export default async function CampusEventsPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ key?: string }>;
}) {
  const { slug } = await params;
  const { key } = await searchParams;
  const campus = await getCampusBySlug(slug);
  if (!campus) notFound();

  if (!key || key !== campus.access_token) {
    return <NoAccess reason="The token in your link doesn't match what we have on file." />;
  }

  // Cookie minting happens client-side via <MintCampusEditCookie /> below —
  // Next.js 15 forbids cookies().set() in server components.

  // Pull all events including past 7 days (so pastors see what they just ran) and unpublished drafts.
  const events = await getCampusEvents(slug, {
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    includeUnpublished: true,
  });

  return (
    <div className="min-h-screen bg-cream-200">
      <MintCampusEditCookie token={campus.access_token} />
      <header className="border-b border-ink-900/10 bg-cream/80 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto flex max-w-shell items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <Link href="/" className="font-display text-body-lg text-ink-900">
            Futures<span className="text-accent">.</span>
          </Link>
          <span className="font-ui text-[10px] uppercase tracking-[0.24em] text-ink-500">
            {campus.display_name} · campus portal
          </span>
        </div>
        <div className="mx-auto max-w-shell px-5 sm:px-8">
          <EventsTabNav current="events" campusSlug={slug} token={campus.access_token} />
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 pb-32 pt-12 sm:px-8 sm:pt-16">
        <EventsListClient
          campusSlug={slug}
          campusName={campus.display_name}
          initialEvents={events}
          token={campus.access_token}
          editorName=""
        />
      </main>
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const campus = await getCampusBySlug(slug);
  return {
    title: campus ? `${campus.display_name} — events` : "Campus events",
    robots: { index: false, follow: false },
  };
}
