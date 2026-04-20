import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Selah — Three voices. Scripture first.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px 96px",
          // Warm radial on cream — no church colors, no blue/purple
          background:
            "radial-gradient(ellipse 70% 60% at 25% 30%, #F2E6D1 0%, #E8C9A6 55%, #D9B089 100%)",
          color: "#1C1A17",
          fontFamily:
            "ui-serif, Georgia, Cambria, 'Times New Roman', serif",
        }}
      >
        {/* top row — eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontFamily: "ui-sans-serif, system-ui, sans-serif",
            fontSize: 18,
            letterSpacing: 5,
            textTransform: "uppercase",
            color: "#8B5E2E",
          }}
        >
          <span
            style={{
              width: 48,
              height: 2,
              background: "#C8906B",
              display: "block",
            }}
          />
          Futures Church &middot; Selah
        </div>

        {/* wordmark */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              fontSize: 220,
              lineHeight: 0.9,
              fontStyle: "italic",
              fontWeight: 300,
              letterSpacing: -6,
              color: "#1C1A17",
            }}
          >
            Selah.
          </div>
          <div
            style={{
              marginTop: 18,
              fontSize: 42,
              fontStyle: "italic",
              fontWeight: 300,
              color: "#8B5E2E",
            }}
          >
            three voices. scripture first.
          </div>
        </div>

        {/* bottom row — trust line */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontFamily: "ui-sans-serif, system-ui, sans-serif",
            fontSize: 22,
            color: "#534D44",
          }}
        >
          <span>A pastoral companion for your hardest questions.</span>
          <span style={{ fontStyle: "italic", color: "#C8906B" }}>
            futures.church/selah
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
