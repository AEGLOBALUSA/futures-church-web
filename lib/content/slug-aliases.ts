/**
 * Slug aliases — bridges the Round 7 / 7B brief's preferred short slugs
 * ('city', 'kadina') with the live site routing slugs ('adelaide-city',
 * 'copper-coast'). Accept either at the API boundary; route paths stay
 * unchanged so no SEO / sitemap migration needed.
 */
const ALIASES: Record<string, string> = {
  city: "adelaide-city",
  kadina: "copper-coast",
};

/** Normalize a brief-style slug to the site's routing slug. Pass-through otherwise. */
export function resolveCampusSlug(slug: string): string {
  return ALIASES[slug] ?? slug;
}
