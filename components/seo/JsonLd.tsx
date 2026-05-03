// Tiny helper for inlining JSON-LD structured data on a page.
// Server-rendered (no "use client") so it ships with the HTML for crawlers
// to read on first paint without JS execution.
//
// Pass either a single schema object or an array of schemas — when you have
// multiple (Person + BreadcrumbList, Article + BreadcrumbList, etc.) we emit
// one <script> per schema so Google parses them as independent entities.

type Schema = Record<string, unknown>;

export function JsonLd({ data }: { data: Schema | Schema[] }) {
  const list = Array.isArray(data) ? data : [data];
  return (
    <>
      {list.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
