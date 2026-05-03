// Tiny helper for inlining JSON-LD structured data on a page.
// Server-rendered (no "use client") so it ships with the HTML for crawlers
// to read on first paint without JS execution.

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
