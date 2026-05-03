import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Play } from "lucide-react";
import {
  getAllSeries,
  getSeriesBySlug,
  getSeriesEpisodes,
} from "@/lib/content/sermons";
import { JsonLd } from "@/components/seo/JsonLd";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://futures.church";

export function generateStaticParams() {
  return getAllSeries().map((s) => ({ series: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ series: string }>;
}): Promise<Metadata> {
  const { series: slug } = await params;
  const series = getSeriesBySlug(slug);
  if (!series) return {};
  return {
    title: `${series.title} · sermon series`,
    description: series.blurb,
    openGraph: {
      title: `${series.title} — Futures Church`,
      description: series.blurb,
      images: [series.cover],
    },
  };
}

export default async function SeriesPage({
  params,
}: {
  params: Promise<{ series: string }>;
}) {
  const { series: slug } = await params;
  const series = getSeriesBySlug(slug);
  if (!series) notFound();
  const episodes = getSeriesEpisodes(slug);

  // CreativeWorkSeries + BreadcrumbList — let Google connect this series
  // to its individual sermons (which carry isPartOf back to here).
  const seriesSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWorkSeries",
    name: series.title,
    description: series.blurb,
    image: series.cover,
    url: `${SITE_URL}/watch/${slug}`,
    numberOfEpisodes: series.episodes,
    creator: { "@type": "Person", name: series.preacher },
    publisher: { "@type": "Organization", name: "Futures Church", url: SITE_URL },
    inLanguage: "en",
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Watch", item: `${SITE_URL}/watch` },
      { "@type": "ListItem", position: 3, name: series.title, item: `${SITE_URL}/watch/${slug}` },
    ],
  };

  return (
    <main className="bg-cream-200 text-ink-900">
      <JsonLd data={[seriesSchema, breadcrumbSchema]} />
      {/* Hero — cover photo with overlay copy */}
      <section className="relative isolate overflow-hidden">
        <div className="relative h-[60vh] min-h-[440px] w-full">
          <Image
            src={series.cover}
            alt={series.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            unoptimized
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(28,26,23,0.15) 0%, rgba(28,26,23,0.45) 60%, rgba(28,26,23,0.85) 100%)",
            }}
          />
        </div>

        <div className="absolute inset-x-0 bottom-0 px-6 pb-12 sm:px-10 sm:pb-16 lg:px-16">
          <div className="mx-auto max-w-shell text-cream">
            <Link
              href="/watch"
              className="group inline-flex items-center gap-2 font-sans text-cream/80 hover:text-cream"
              style={{ fontSize: 13 }}
            >
              <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" strokeWidth={2} />
              <span>Watch</span>
            </Link>
            <p className="mt-6 font-ui text-eyebrow uppercase tracking-[0.28em] text-cream/70">
              Series · {series.preacher}
            </p>
            <h1
              className="mt-3 font-display italic"
              style={{
                fontSize: "clamp(3rem, 8vw, 6rem)",
                lineHeight: 0.95,
                fontWeight: 300,
                letterSpacing: "-0.01em",
              }}
            >
              {series.title}
            </h1>
            <p
              className="mt-5 max-w-prose font-display italic text-cream/85"
              style={{ fontSize: "clamp(1.1rem, 1.6vw, 1.4rem)", lineHeight: 1.4, fontWeight: 300 }}
            >
              {series.blurb}
            </p>
            <p className="mt-4 font-ui text-eyebrow uppercase tracking-[0.28em] text-cream/60">
              {series.episodes} episode{series.episodes === 1 ? "" : "s"}
              {episodes.length !== series.episodes && ` · ${episodes.length} available`}
            </p>
          </div>
        </div>
      </section>

      {/* Episode list */}
      <section className="mx-auto max-w-shell px-6 py-20 sm:px-10 sm:py-24 lg:px-16">
        <h2 className="font-ui text-eyebrow uppercase tracking-[0.28em] text-ink-500">
          Episodes
        </h2>

        {episodes.length === 0 ? (
          <p className="mt-8 max-w-prose font-display italic text-ink-700" style={{ fontSize: 18 }}>
            No episodes available yet — check back soon.
          </p>
        ) : (
          <ul className="mt-8 space-y-4">
            {episodes.map((ep, idx) => (
              <li key={ep.id}>
                <Link
                  href={`/watch/${slug}/${ep.id}`}
                  className="group flex items-stretch gap-5 overflow-hidden rounded-3xl border border-ink-900/10 bg-cream/95 transition hover:border-accent/40 hover:bg-cream-50"
                >
                  <div className="relative w-32 shrink-0 sm:w-48 lg:w-64">
                    <div className="relative aspect-video">
                      <Image
                        src={ep.thumb}
                        alt={ep.title}
                        fill
                        sizes="256px"
                        className="object-cover"
                        unoptimized
                      />
                      <div className="absolute inset-0 grid place-items-center bg-ink-900/25 opacity-0 transition group-hover:opacity-100">
                        <Play className="size-10 text-cream" strokeWidth={1.5} fill="currentColor" />
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 px-5 py-5 sm:py-6">
                    <p className="font-ui text-[10px] uppercase tracking-[0.22em] text-accent">
                      Episode {episodes.length - idx} · {ep.scripture}
                    </p>
                    <p
                      className="mt-2 font-display italic text-ink-900"
                      style={{ fontSize: "clamp(1.25rem, 2vw, 1.65rem)", lineHeight: 1.2, fontWeight: 300 }}
                    >
                      {ep.title}
                    </p>
                    <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1 font-sans text-body-sm text-ink-600">
                      <span>{ep.preacher}</span>
                      <span className="hidden sm:inline text-ink-300">·</span>
                      <span>{new Date(`${ep.date}T12:00:00`).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}</span>
                      <span className="hidden sm:inline text-ink-300">·</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="size-3" /> {ep.duration}
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
