import type { MetadataRoute } from "next";
import { campuses } from "@/lib/content/campuses";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://futures.church";

const STATIC_ROUTES = [
  "",
  "/about",
  "/bible-app",
  "/books",
  "/campuses",
  "/college",
  "/contact",
  "/daily-word",
  "/dreamers",
  "/give",
  "/history",
  "/kids",
  "/leaders",
  "/plan-a-visit",
  "/selah",
  "/vision",
  "/watch",
  "/women",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "" || path === "/daily-word" ? "daily" : "weekly",
    priority: path === "" ? 1 : path === "/campuses" || path === "/plan-a-visit" ? 0.9 : 0.7,
  }));

  const campusRoutes: MetadataRoute.Sitemap = campuses.map((c) => ({
    url: `${SITE_URL}/campuses/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...routes, ...campusRoutes];
}
