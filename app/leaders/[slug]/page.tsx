import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin } from "lucide-react";
import {
  getAllLeaderSlugs,
  getLeaderBySlug,
  getLeaderCampus,
  getAllLeaders,
} from "@/lib/content/leaders";
import { getCampusIntakeFacts } from "@/lib/intake/campus-content";
import { getMergedCampusVoice } from "@/lib/intake/campus-content";

export async function generateStaticParams() {
  return getAllLeaderSlugs().map((slug) => ({ slug }));
}

// Pull intake data on every request (cached 60s) so a pastor's freshly-typed
// bio shows up here within a minute.
export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const leader = getLeaderBySlug(slug);
  if (!leader) return {};
  return {
    title: `${leader.name} · Futures Church`,
    description: leader.oneLine ?? leader.bioParagraphs[0] ?? `${leader.name} — ${leader.role}`,
    openGraph: {
      title: `${leader.name} · Futures Church`,
      description: leader.oneLine ?? leader.bioParagraphs[0] ?? `${leader.role}`,
      images: leader.photo ? [leader.photo] : undefined,
    },
  };
}

export default async function LeaderPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const leader = getLeaderBySlug(slug);
  if (!leader) notFound();

  const campus = getLeaderCampus(slug);
  const campusFacts = leader.campusSlug ? await getCampusIntakeFacts(leader.campusSlug) : null;
  const mergedVoice = leader.campusSlug ? await getMergedCampusVoice(leader.campusSlug) : null;

  // Resolve the bio body, in priority order:
  //   1. Senior pastor authored paragraphs (senior-pastors.json) — Ashley/Jane
  //   2. Campus pastor's intake `pastor_bio_long` (mapped into voice.pastorBio)
  //   3. Campus oneLine fallback
  const authoredBio = leader.bioParagraphs;
  const intakeBio = mergedVoice?.pastorBio ? [mergedVoice.pastorBio] : [];
  const bioParagraphs = authoredBio.length > 0 ? authoredBio : intakeBio;

  // Other leaders to suggest at the bottom — same kind, max 6.
  const others = getAllLeaders()
    .filter((l) => l.slug !== leader.slug && l.kind === leader.kind)
    .slice(0, 6);

  return (
    <main className="bg-cream text-ink-900 selection:bg-warm-500 selection:text-cream">
      <section className="mx-auto max-w-shell px-6 pt-24 pb-16 sm:px-10 lg:px-16">
        <Link
          href="/leaders"
          className="group inline-flex items-center gap-2 font-sans text-ink-600 hover:text-ink-900"
          style={{ fontSize: 13 }}
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" strokeWidth={2} />
          <span>All leaders</span>
        </Link>

        <div className="mt-10 grid grid-cols-1 gap-12 lg:grid-cols-[5fr_7fr] lg:items-end">
          <div className="relative w-full overflow-hidden rounded-[28px]"
            style={{
              aspectRatio: "2/3",
              boxShadow: "0 48px 96px -36px rgba(18,16,13,0.45)",
              background: "#E8DFD3",
            }}
          >
            {leader.photo && (
              <Image
                src={leader.photo}
                alt={leader.name}
                fill
                priority
                className={`object-cover object-top ${
                  leader.photoPlaceholder ? "saturate-[0.6] opacity-80" : ""
                }`}
                sizes="(max-width: 1024px) 100vw, 42vw"
                unoptimized
              />
            )}
            {leader.photoPlaceholder && (
              <div className="absolute bottom-3 left-3 right-3">
                <span
                  className="inline-flex rounded-full px-3 py-1.5 font-sans backdrop-blur-md"
                  style={{
                    background: "rgba(255,253,248,0.85)",
                    border: "1px dashed rgba(184,92,59,0.45)",
                    color: "#8B4A2E",
                    fontSize: 10,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                  }}
                >
                  Real portrait coming soon
                </span>
              </div>
            )}
          </div>

          <div>
            <p
              className="font-sans uppercase text-ink-600"
              style={{ fontSize: 11, letterSpacing: "0.28em" }}
            >
              {leader.kind === "senior" ? "Global senior pastor" : leader.role}
              {leader.campusName && ` · ${leader.campusName}`}
            </p>
            <h1
              className="mt-4 font-display italic"
              style={{
                color: "#1C1A17",
                fontSize: "clamp(2.75rem, 6vw, 5rem)",
                lineHeight: 1,
                fontWeight: 300,
                letterSpacing: "-0.01em",
              }}
            >
              {leader.name}
            </h1>
            {leader.oneLine && (
              <p
                className="mt-6 max-w-prose font-display italic text-ink-700"
                style={{ fontSize: "clamp(1.1rem, 1.6vw, 1.35rem)", lineHeight: 1.5, fontWeight: 300 }}
              >
                {leader.oneLine}
              </p>
            )}
            {campus && (
              <div className="mt-6 flex items-center gap-2 font-sans text-ink-600" style={{ fontSize: 14 }}>
                <MapPin className="h-4 w-4 text-accent" strokeWidth={1.8} />
                <span>{leader.campusCity}</span>
              </div>
            )}
            {leader.links.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-3">
                {leader.links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    target={l.href.startsWith("http") ? "_blank" : undefined}
                    rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="rounded-full border border-ink-900/15 bg-cream/70 px-4 py-2 font-ui text-[11px] uppercase tracking-[0.22em] text-ink-900 hover:bg-cream-300"
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-16 sm:px-10 lg:px-16">
        {bioParagraphs.length > 0 ? (
          <div className="space-y-6">
            {bioParagraphs.map((p, i) => (
              <p
                key={i}
                className="font-sans text-ink-900"
                style={{ fontSize: 17, lineHeight: 1.75 }}
                dangerouslySetInnerHTML={{ __html: p }}
              />
            ))}
          </div>
        ) : (
          <div
            className="rounded-3xl border border-dashed px-7 py-10"
            style={{ borderColor: "rgba(184,92,59,0.4)", background: "rgba(255,253,248,0.7)" }}
          >
            <p className="font-ui text-eyebrow uppercase tracking-[0.28em] text-accent">
              From {leader.name.split(" & ")[0]}, in their own words
            </p>
            <p className="mt-3 font-display italic text-ink-700" style={{ fontSize: 19, lineHeight: 1.5, fontWeight: 300 }}>
              A longer story is on its way. {leader.name.split(" & ")[0]} is filling in their own bio
              right now — when it lands, it lands here.
            </p>
            {campus && (
              <p className="mt-5 font-sans text-ink-600" style={{ fontSize: 14, lineHeight: 1.65 }}>
                Until then, the best way to meet them is on a Sunday at{" "}
                <Link
                  href={`/campuses/${leader.campusSlug}`}
                  className="text-accent underline underline-offset-4 hover:text-warm-700"
                >
                  {leader.campusName}
                </Link>
                {campusFacts?.serviceTimes && campusFacts.serviceTimes.length > 0
                  ? ` — ${campusFacts.serviceTimes
                      .map((s) => [s.day, s.time].filter(Boolean).join(" "))
                      .join(", ")}.`
                  : "."}
              </p>
            )}
          </div>
        )}

        {leader.books.length > 0 && (
          <div className="mt-14">
            <p className="font-ui text-eyebrow uppercase tracking-[0.28em] text-ink-500">
              Books by {leader.name.split(" & ")[0]}
            </p>
            <ul className="mt-5 space-y-2">
              {leader.books.map((b) => (
                <li
                  key={b}
                  className="font-display italic text-ink-900"
                  style={{ fontSize: 19, fontWeight: 300, lineHeight: 1.4 }}
                  dangerouslySetInnerHTML={{ __html: b }}
                />
              ))}
            </ul>
            <Link
              href="/books"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-ink-900/15 bg-cream/70 px-4 py-2 font-ui text-[11px] uppercase tracking-[0.22em] text-ink-900 hover:bg-cream-300"
            >
              Browse all books →
            </Link>
          </div>
        )}

        {campus && (
          <div className="mt-14 rounded-3xl border border-ink-900/10 bg-cream/80 px-7 py-8 sm:px-9 sm:py-10">
            <p className="font-ui text-eyebrow uppercase tracking-[0.28em] text-ink-500">
              Visit {leader.campusName}
            </p>
            <h3
              className="mt-3 font-display italic"
              style={{ fontSize: "clamp(1.5rem, 2.6vw, 2rem)", lineHeight: 1.1, fontWeight: 300 }}
            >
              The best way to meet {leader.name.split(" & ")[0]} is on a Sunday.
            </h3>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/campuses/${leader.campusSlug}`}
                className="rounded-full bg-ink-900 px-5 py-2.5 font-ui text-[11px] uppercase tracking-[0.24em] text-cream hover:bg-warm-700"
              >
                {leader.campusName} campus
              </Link>
              <Link
                href={`/plan-a-visit?campus=${leader.campusSlug}`}
                className="rounded-full border border-ink-900/15 bg-cream/70 px-5 py-2.5 font-ui text-[11px] uppercase tracking-[0.22em] text-ink-900 hover:bg-cream-300"
              >
                Plan a visit
              </Link>
            </div>
          </div>
        )}
      </section>

      {others.length > 0 && (
        <section className="mx-auto max-w-shell px-6 pb-32 sm:px-10 lg:px-16">
          <p className="font-ui text-eyebrow uppercase tracking-[0.28em] text-ink-500">
            More leaders
          </p>
          <h2
            className="mt-3 font-display"
            style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)", lineHeight: 1.05, fontWeight: 300 }}
          >
            {leader.kind === "senior" ? "Other senior leadership." : "Other campus pastors."}
          </h2>
          <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
            {others.map((o) => (
              <Link
                key={o.slug}
                href={`/leaders/${o.slug}`}
                className="group block overflow-hidden rounded-2xl"
                style={{
                  background: "#E8DFD3",
                  boxShadow: "0 14px 32px -22px rgba(20,20,20,0.3)",
                }}
              >
                <div className="relative aspect-[4/5]">
                  {o.photo && (
                    <Image
                      src={o.photo}
                      alt={o.name}
                      fill
                      sizes="(max-width: 640px) 50vw, 17vw"
                      className={`object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04] ${
                        o.photoPlaceholder ? "saturate-[0.6] opacity-80" : ""
                      }`}
                      unoptimized
                    />
                  )}
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background: "linear-gradient(180deg, transparent 50%, rgba(28,26,23,0.65) 100%)",
                    }}
                  />
                  <div className="absolute bottom-2.5 left-3 right-3 text-cream">
                    <p className="font-display italic" style={{ fontSize: 15, fontWeight: 300, lineHeight: 1.2 }}>
                      {o.name}
                    </p>
                    {o.campusName && (
                      <p className="font-sans" style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", opacity: 0.85 }}>
                        {o.campusName}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
