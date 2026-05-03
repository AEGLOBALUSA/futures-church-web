import type { MetadataRoute } from "next";
import { campuses } from "@/lib/content/campuses";
import { getAllLeaders } from "@/lib/content/leaders";
import { getAllSeries, getAllSermons } from "@/lib/content/sermons";
import dailyWord from "@/content/daily-word.json";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://futures.church";

const STATIC_ROUTES: { path: string; freq: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
  { path: "", freq: "daily", priority: 1 },
  { path: "/about", freq: "monthly", priority: 0.7 },
  { path: "/accountability", freq: "yearly", priority: 0.5 },
  { path: "/baptism", freq: "monthly", priority: 0.6 },
  { path: "/bible-app", freq: "monthly", priority: 0.6 },
  { path: "/books", freq: "monthly", priority: 0.6 },
  { path: "/campuses", freq: "weekly", priority: 0.9 },
  { path: "/college", freq: "weekly", priority: 0.7 },
  { path: "/contact", freq: "monthly", priority: 0.6 },
  { path: "/daily-word", freq: "daily", priority: 0.9 },
  { path: "/dreamers", freq: "weekly", priority: 0.7 },
  { path: "/give", freq: "monthly", priority: 0.7 },
  { path: "/history", freq: "monthly", priority: 0.6 },
  { path: "/kids", freq: "weekly", priority: 0.7 },
  { path: "/leaders", freq: "monthly", priority: 0.7 },
  { path: "/plan-a-visit", freq: "weekly", priority: 0.95 },
  { path: "/selah", freq: "weekly", priority: 0.7 },
  { path: "/vision", freq: "monthly", priority: 0.7 },
  { path: "/watch", freq: "weekly", priority: 0.85 },
  { path: "/what-we-believe", freq: "monthly", priority: 0.85 },
  { path: "/women", freq: "weekly", priority: 0.7 },
];

type DailyWordData = {
  today: { date: string };
  archive: { date: string }[];
};

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = STATIC_ROUTES.map(({ path, freq, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: freq,
    priority,
  }));

  const campusRoutes: MetadataRoute.Sitemap = campuses.map((c) => ({
    url: `${SITE_URL}/campuses/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: c.status === "active" ? 0.8 : 0.5,
  }));

  const leaderRoutes: MetadataRoute.Sitemap = getAllLeaders().map((l) => ({
    url: `${SITE_URL}/leaders/${l.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: l.kind === "senior" ? 0.7 : 0.55,
  }));

  const seriesRoutes: MetadataRoute.Sitemap = getAllSeries().map((s) => ({
    url: `${SITE_URL}/watch/${s.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const sermonRoutes: MetadataRoute.Sitemap = [];
  for (const s of getAllSeries()) {
    for (const ep of getAllSermons().filter((e) => e.series === s.title)) {
      sermonRoutes.push({
        url: `${SITE_URL}/watch/${s.slug}/${ep.id}`,
        lastModified: ep.date ? new Date(ep.date) : now,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  const dw = dailyWord as DailyWordData;
  const dailyWordRoutes: MetadataRoute.Sitemap = [dw.today.date, ...dw.archive.map((a) => a.date)].map((date) => ({
    url: `${SITE_URL}/daily-word/${date}`,
    lastModified: new Date(`${date}T12:00:00`),
    changeFrequency: "yearly",
    priority: date === dw.today.date ? 0.8 : 0.4,
  }));

  return [...staticRoutes, ...campusRoutes, ...leaderRoutes, ...seriesRoutes, ...sermonRoutes, ...dailyWordRoutes];
}
