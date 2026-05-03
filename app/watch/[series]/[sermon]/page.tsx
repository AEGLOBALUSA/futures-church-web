import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock, BookOpen, Play } from "lucide-react";
import {
  getAllSeries,
  getSeriesEpisodes,
  getSermonInSeries,
  neighborSermons,
  type FeaturedSermon,
  type ArchiveSermon,
} from "@/lib/content/sermons";
import { JsonLd } from "@/components/seo/JsonLd";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://futures.church";

export function generateStaticParams() {
  const out: { series: string; sermon: string }[] = [];
  for (const s of getAllSeries()) {
    for (const ep of getSeriesEpisodes(s.slug)) {
      out.push({ series: s.slug, sermon: ep.id });
    }
  }
  return out;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ series: string; sermon: string }>;
}): Promise<Metadata> {
  const { series, sermon } = await params;
  const found = getSermonInSeries(series, sermon);
  if (!found) return {};
  return {
    title: `${found.sermon.title} · ${found.series.title}`,
    description: `${found.sermon.preacher} on ${found.sermon.scripture}`,
    openGraph: {
      title: `${found.sermon.title} — ${found.series.title}`,
      description: `${found.sermon.preacher} on ${found.sermon.scripture}`,
      images: [found.sermon.thumb],
    },
  };
}

function isFeatured(s: FeaturedSermon | ArchiveSermon): s is FeaturedSermon {
  return "videoUrl" in s || "chapters" in s;
}

export default async function SermonPage({
  params,
}: {
  params: Promise<{ series: string; sermon: string }>;
}) {
  const { series: seriesSlug, sermon: sermonId } = await params;
  const found = getSermonInSeries(seriesSlug, sermonId);
  if (!found) notFound();
  const { series, sermon } = found;
  const featured = isFeatured(sermon) ? sermon : null;
  const { prev, next } = neighborSermons(seriesSlug, sermonId);

  // VideoObject schema — when Google indexes this page, the sermon shows up
  // properly in video search + rich results. Tied to the parent series.
  const videoSchema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: sermon.title,
    description: `${sermon.preacher} on ${sermon.scripture}`,
    thumbnailUrl: sermon.thumb,
    uploadDate: sermon.date,
    duration: sermon.duration,
    contentUrl: featured?.videoUrl ?? undefined,
    embedUrl: featured?.videoUrl ?? undefined,
    publisher: { "@type": "Organization", name: "Futures Church", url: SITE_URL },
    creator: { "@type": "Person", name: sermon.preacher },
    isPartOf: {
      "@type": "CreativeWorkSeries",
      name: series.title,
      url: `${SITE_URL}/watch/${seriesSlug}`,
    },
    inLanguage: "en",
  };

  return (
    <main className="bg-cream-200 text-ink-900">
      <JsonLd data={videoSchema} />
      <section className="relative isolate overflow-hidden">
        <div className="relative aspect-video w-full bg-ink-900 sm:aspect-[21/9] lg:aspect-[24/10]">
          {/* Video player — falls back to thumbnail + "Watch on YouTube" placeholder when videoUrl is absent */}
          {featured?.videoUrl ? (
            <video
              src={featured.videoUrl}
              poster={sermon.thumb}
              controls
              className="h-full w-full object-cover"
            />
          ) : (
            <>
              <Image
                src={sermon.thumb}
                alt={sermon.title}
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
                    "linear-gradient(180deg, rgba(28,26,23,0.25) 0%, rgba(28,26,23,0.55) 70%, rgba(28,26,23,0.8) 100%)",
                }}
              />
              <div className="absolute inset-0 grid place-items-center">
                <span className="rounded-full bg-cream/95 px-5 py-3 font-ui text-[11px] uppercase tracking-[0.24em] text-ink-900">
                  <Play className="mr-2 inline size-4 -translate-y-0.5" strokeWidth={1.6} fill="currentColor" />
                  Video coming soon
                </span>
              </div>
            </>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-12 sm:px-10 lg:px-16">
        <Link
          href={`/watch/${seriesSlug}`}
          className="group inline-flex items-center gap-2 font-sans text-ink-600 hover:text-ink-900"
          style={{ fontSize: 13 }}
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" strokeWidth={2} />
          <span>{series.title} series</span>
        </Link>

        <p className="mt-8 font-ui text-eyebrow uppercase tracking-[0.28em] text-accent">
          {series.title}
        </p>
        <h1
          className="mt-3 font-display italic text-ink-900"
          style={{
            fontSize: "clamp(2.25rem, 5vw, 3.75rem)",
            lineHeight: 1.05,
            fontWeight: 300,
            letterSpacing: "-0.01em",
          }}
        >
          {sermon.title}
        </h1>

        <div className="mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-2 font-sans text-ink-600" style={{ fontSize: 14 }}>
          <span>{sermon.preacher}</span>
          <span className="text-ink-300">·</span>
          <span>
            {new Date(`${sermon.date}T12:00:00`).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span className="text-ink-300">·</span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3.5" /> {sermon.duration}
          </span>
          <span className="text-ink-300">·</span>
          <span className="inline-flex items-center gap-1.5">
            <BookOpen className="size-3.5" /> {sermon.scripture}
          </span>
        </div>

        {/* Chapters — if the featured sermon has them */}
        {featured?.chapters && featured.chapters.length > 0 && (
          <div className="mt-12 rounded-3xl border border-ink-900/10 bg-cream/80 px-6 py-7 sm:px-8">
            <p className="font-ui text-eyebrow uppercase tracking-[0.28em] text-ink-500">
              Chapters
            </p>
            <ul className="mt-4 divide-y divide-ink-900/5">
              {featured.chapters.map((c, i) => (
                <li key={i} className="flex items-baseline gap-4 py-2.5">
                  <span className="w-16 shrink-0 font-mono text-body-sm text-ink-500">{c.t}</span>
                  <span
                    className="font-display italic text-ink-900"
                    style={{ fontSize: 17, fontWeight: 300, lineHeight: 1.3 }}
                  >
                    {c.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Prev / next within the series */}
        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-ink-900/10 pt-6">
          <div className="flex flex-wrap gap-3">
            {prev ? (
              <Link
                href={`/watch/${seriesSlug}/${prev.id}`}
                className="inline-flex items-center gap-2 rounded-full border border-ink-900/15 bg-cream/70 px-4 py-2 font-ui text-[11px] uppercase tracking-[0.22em] text-ink-700 hover:bg-cream-300"
              >
                <ArrowLeft className="size-3.5" /> Earlier in series
              </Link>
            ) : null}
            {next ? (
              <Link
                href={`/watch/${seriesSlug}/${next.id}`}
                className="inline-flex items-center gap-2 rounded-full border border-ink-900/15 bg-cream/70 px-4 py-2 font-ui text-[11px] uppercase tracking-[0.22em] text-ink-700 hover:bg-cream-300"
              >
                Later in series <ArrowRight className="size-3.5" />
              </Link>
            ) : null}
          </div>
          <Link
            href={`/watch/${seriesSlug}`}
            className="font-ui text-[11px] uppercase tracking-[0.22em] text-ink-700 hover:text-accent"
          >
            All episodes →
          </Link>
        </div>
      </section>
    </main>
  );
}
