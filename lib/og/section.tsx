// Shared OG image for section pages (Watch, Vision, History, Plan-a-Visit, etc.).
// Same warm cream-to-clay gradient + serif italic title + sans subtitle
// as the home OG, so every shared link feels like the same family.
//
// Each section's opengraph-image.tsx is a one-liner that calls SectionOG with
// route-specific copy. ImageResponse from "next/og" lives at the call site so
// runtime + size + alt + contentType exports remain at the route level.

export type SectionOGProps = {
  eyebrow?: string;
  title: string;
  /** One short sentence, italic. */
  subtitle?: string;
  /** Optional bottom-line strapline (the "Australia · USA · Indonesia" pattern). */
  strap?: string;
};

export function SectionOG({ eyebrow, title, subtitle, strap }: SectionOGProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "80px 96px",
        background:
          "radial-gradient(ellipse 80% 70% at 22% 28%, #F7F1E6 0%, #F2E6D1 40%, #E8C9A6 72%, #C89675 100%)",
        color: "#1C1A17",
        fontFamily: "ui-serif, Georgia, Cambria, 'Times New Roman', serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          fontSize: 17,
          letterSpacing: 5,
          textTransform: "uppercase",
          color: "#8B5E2E",
        }}
      >
        <span style={{ width: 48, height: 2, background: "#C8906B", display: "block" }} />
        {eyebrow ?? "Futures Church"}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div
          style={{
            fontSize: 124,
            lineHeight: 0.92,
            fontStyle: "italic",
            fontWeight: 300,
            letterSpacing: -3,
            color: "#1C1A17",
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              marginTop: 8,
              fontSize: 32,
              fontStyle: "italic",
              fontWeight: 300,
              color: "#8B5E2E",
              maxWidth: 920,
              lineHeight: 1.3,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          fontSize: 20,
          color: "#534D44",
        }}
      >
        <span>{strap ?? "Australia · USA · Indonesia · South America"}</span>
        <span style={{ fontStyle: "italic", color: "#C8906B" }}>futures.church</span>
      </div>
    </div>
  );
}
