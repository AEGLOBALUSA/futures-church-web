import { ImageResponse } from "next/og";
import { getSermonInSeries } from "@/lib/content/sermons";

export const runtime = "edge";
export const alt = "Futures Church sermon";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: { series: string; sermon: string } }) {
  const found = getSermonInSeries(params.series, params.sermon);
  if (!found) {
    return new ImageResponse(<div style={{ width: "100%", height: "100%", background: "#FDFBF6" }} />, size);
  }
  const { sermon, series } = found;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundImage: `url(${sermon.thumb})`,
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
              "linear-gradient(180deg, rgba(28,26,23,0.3) 0%, rgba(28,26,23,0.65) 60%, rgba(28,26,23,0.92) 100%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "60px 90px",
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
            {series.title} · {sermon.preacher}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div
              style={{
                fontSize: 88,
                lineHeight: 0.95,
                fontStyle: "italic",
                fontWeight: 300,
                letterSpacing: -2,
                color: "#FDFBF6",
                maxWidth: 1000,
              }}
            >
              {sermon.title}
            </div>
            <div
              style={{
                fontFamily: "ui-sans-serif, system-ui, sans-serif",
                fontSize: 22,
                color: "rgba(255,253,248,0.85)",
                letterSpacing: 1,
              }}
            >
              {sermon.scripture} · {sermon.duration}
            </div>
          </div>

          <div
            style={{
              fontFamily: "ui-sans-serif, system-ui, sans-serif",
              fontSize: 18,
              color: "rgba(255,253,248,0.7)",
            }}
          >
            <span style={{ fontStyle: "italic", color: "#C8906B" }}>futures.church/watch</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
