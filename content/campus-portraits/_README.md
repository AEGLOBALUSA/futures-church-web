# Campus pastor portraits — Round 7 brief

One JSON file per campus in this folder, keyed by the campus slug used in `/campuses/[slug]` routing. The `<CampusPastorPortrait />` component reads these files and renders the portrait if — and only if — `release_signed: true`. Unsigned entries return `null` silently, so no accidental leaks of unreleased imagery.

## Slug alignment note

The brief lists two slugs that differ from the live site:

| Brief slug | Site slug (use this) | Reason                          |
|-----------|----------------------|---------------------------------|
| `city`    | `adelaide-city`      | Routes, sitemap, SEO already live |
| `kadina`  | `copper-coast`       | Routes, sitemap, SEO already live |

The JSON files below use the **site** slugs so `<CampusPastorPortrait campusSlug={slug} />` drops in with zero route changes. If Ashley wants to rename those routes later, that's a migration separate from this shoot.

## File naming on disk (public assets)

When finals arrive they live under `public/campus-portraits/` and are referenced by JSON. Use the site slug in every filename:

```
public/campus-portraits/
  paradise-hero.avif
  paradise-hero.jpg        (JPEG fallback)
  paradise-square.avif
  adelaide-city-hero.avif
  copper-coast-hero.avif
  gwinnett-hero.avif           (Nick + Danielle)
  gwinnett-hero-secondary.avif (Nate + Chloe)
  ...
```

## Gwinnett secondary

Gwinnett is the only campus with two portraits for launch (Nick + Danielle primary, Nate + Chloe secondary). Both live in `gwinnett.json` under `hero_primary` and `hero_secondary`.

## Releases

Every subject signs a photo release stored in `content/releases/pastors/` before `release_signed` flips true. Don't ship without the release file on disk.
