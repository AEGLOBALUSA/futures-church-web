import { ImageResponse } from "next/og";
import { getSeriesBySlug } from "@/lib/content/sermons";

export const runtime = "edge";
export const alt = "Futures Church sermon series";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: { series: string } }) {
  const series = getSeriesBySlug(params.series);
  if (!series) {
    return new ImageResponse(<div style={{ width: "100%", height: "100%", background: "#FDFBF6" }} />, size);
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundImage: `url(${series.cover})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          fontFamily: "ui-serif, Georgia, Cambria, 'Times New Roman', serif",
          color: "#FDFBF6",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(28,26,23,0.25) 0%, rgba(28,26,23,0.55) 50%, rgba(28,26,23,0.92) 100%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "70px 90px",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontFamily: "ui-sans-serif, system-ui, sans-serif",
              fontSize: 16,
              letterSpacing: 5,
              textTransform: "uppercase",
              color: "rgba(255,253,248,0.8)",
            }}
          >
            <span style={{ width: 36, height: 2, background: "#C8906B", display: "block" }} />
            Sermon series · {series.preacher}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div
              style={{
                fontSize: 130,
                lineHeight: 0.92,
                fontStyle: "italic",
                fontWeight: 300,
                letterSpacing: -3,
                color: "#FDFBF6",
              }}
            >
              {series.title}
            </div>
            <div
              style={{
                fontSize: 28,
                fontStyle: "italic",
                fontWeight: 300,
                color: "rgba(255,253,248,0.85)",
                lineHeight: 1.3,
                maxWidth: 900,
              }}
            >
              {series.blurb}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              fontFamily: "ui-sans-serif, system-ui, sans-serif",
              fontSize: 18,
              color: "rgba(255,253,248,0.7)",
            }}
          >
            <span>{series.episodes} episode{series.episodes === 1 ? "" : "s"}</span>
            <span style={{ fontStyle: "italic", color: "#C8906B" }}>futures.church/watch</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
