// Helpers around content/sermons.json — give us typed lookups for the
// sermon series + individual sermon routes without coupling them to JSON shape.

import sermonsData from "@/content/sermons.json";

export type Series = {
  slug: string;
  title: string;
  preacher: string;
  episodes: number;
  cover: string;
  blurb: string;
};

export type ArchiveSermon = {
  id: string;
  title: string;
  series: string; // matches Series.title
  preacher: string;
  date: string;
  duration: string;
  scripture: string;
  theme?: string;
  thumb: string;
};

export type FeaturedSermon = ArchiveSermon & {
  videoUrl: string | null;
  chapters?: { t: string; label: string }[];
};

type SermonsData = {
  isLive: boolean;
  liveStreamUrl: string | null;
  featuredSeries: Series[];
  latest: FeaturedSermon | null;
  archive: ArchiveSermon[];
};

const data = sermonsData as SermonsData;

export function getAllSeries(): Series[] {
  return data.featuredSeries;
}

export function getSeriesBySlug(slug: string): Series | undefined {
  return data.featuredSeries.find((s) => s.slug === slug);
}

/** Episodes of a series — derived from archive + latest by matching the series title. */
export function getSeriesEpisodes(slug: string): (ArchiveSermon | FeaturedSermon)[] {
  const series = getSeriesBySlug(slug);
  if (!series) return [];
  const fromArchive = data.archive.filter((s) => s.series === series.title);
  // Include `latest` if it belongs to this series and isn't already in archive.
  const latest = data.latest;
  const already = latest && fromArchive.some((s) => s.id === latest.id);
  const all = latest && latest.series === series.title && !already
    ? [latest, ...fromArchive]
    : fromArchive;
  return [...all].sort((a, b) => b.date.localeCompare(a.date));
}

export function getAllSermons(): (ArchiveSermon | FeaturedSermon)[] {
  const out: (ArchiveSermon | FeaturedSermon)[] = [...data.archive];
  if (data.latest) {
    if (!out.some((s) => s.id === data.latest!.id)) out.unshift(data.latest);
  }
  return out;
}

export function getSermonById(id: string): FeaturedSermon | ArchiveSermon | undefined {
  if (data.latest && data.latest.id === id) return data.latest;
  return data.archive.find((s) => s.id === id);
}

/** Given a series slug + sermon id, find the right sermon (and verify it belongs to that series). */
export function getSermonInSeries(seriesSlug: string, sermonId: string) {
  const series = getSeriesBySlug(seriesSlug);
  if (!series) return null;
  const sermon = getSermonById(sermonId);
  if (!sermon || sermon.series !== series.title) return null;
  return { series, sermon };
}

export function neighborSermons(seriesSlug: string, sermonId: string) {
  const list = getSeriesEpisodes(seriesSlug);
  const idx = list.findIndex((s) => s.id === sermonId);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: list[idx + 1] ?? null, // older
    next: list[idx - 1] ?? null, // newer
  };
}
