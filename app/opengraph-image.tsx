import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Futures Church — One family. 21 campuses. 4 countries.";
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
          background:
            "radial-gradient(ellipse 80% 70% at 20% 30%, #F7F1E6 0%, #F2E6D1 40%, #E8C9A6 70%, #C89675 100%)",
          color: "#1C1A17",
          fontFamily: "ui-serif, Georgia, Cambria, 'Times New Roman', serif",
        }}
      >
        {/* Eyebrow */}
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
          Futures Church
        </div>

        {/* Main wordmark */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          <div
            style={{
              fontSize: 130,
              lineHeight: 0.92,
              fontStyle: "italic",
              fontWeight: 300,
              letterSpacing: -4,
              color: "#1C1A17",
            }}
          >
            Come home.
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 38,
              fontStyle: "italic",
              fontWeight: 300,
              color: "#8B5E2E",
            }}
          >
            One family. 21 campuses. 4 countries.
          </div>
        </div>

        {/* Bottom */}
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
          <span>Australia · USA · Indonesia · South America</span>
          <span style={{ fontStyle: "italic", color: "#C8906B" }}>
            futures.church
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
