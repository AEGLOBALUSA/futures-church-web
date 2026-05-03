import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "What we believe — Futures Church";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "70px 96px",
          background:
            "radial-gradient(ellipse 80% 70% at 25% 25%, #F7F1E6 0%, #F2E6D1 42%, #E8C9A6 75%, #D9B089 100%)",
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
          What we believe
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {[
            ["Foundation", "The Bible is our foundation."],
            ["Focus", "Jesus is our focus."],
            ["Power", "The Holy Spirit is our power."],
            ["Family", "The local church is our family."],
          ].map(([eyebrow, line]) => (
            <div key={eyebrow} style={{ display: "flex", alignItems: "baseline", gap: 24 }}>
              <span
                style={{
                  fontFamily: "ui-sans-serif, system-ui, sans-serif",
                  fontSize: 14,
                  letterSpacing: 5,
                  textTransform: "uppercase",
                  color: "#B85C3B",
                  width: 130,
                }}
              >
                {eyebrow}
              </span>
              <span
                style={{
                  fontSize: 44,
                  fontStyle: "italic",
                  fontWeight: 300,
                  lineHeight: 1.1,
                  color: "#1C1A17",
                }}
              >
                {line}
              </span>
            </div>
          ))}
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
          <span>Futures Church · since 1922</span>
          <span style={{ fontStyle: "italic", color: "#C8906B" }}>futures.church</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
