import { ImageResponse } from "next/og";
import { getLeaderBySlug } from "@/lib/content/leaders";

export const runtime = "edge";
export const alt = "Futures Church leader";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: { slug: string } }) {
  const leader = getLeaderBySlug(params.slug);
  const name = leader?.name ?? "Futures Church";
  const roleLine = leader
    ? leader.kind === "senior"
      ? "Global Senior Pastor"
      : `${leader.role}${leader.campusName ? ` · ${leader.campusName}` : ""}`
    : "Futures Church";
  const photo = leader?.photo && !leader.photoPlaceholder ? leader.photo : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background:
            "radial-gradient(ellipse 80% 70% at 25% 30%, #F7F1E6 0%, #F2E6D1 42%, #E8C9A6 75%, #D9B089 100%)",
          color: "#1C1A17",
          fontFamily: "ui-serif, Georgia, Cambria, 'Times New Roman', serif",
        }}
      >
        {photo && (
          <div
            style={{
              width: "42%",
              height: "100%",
              display: "flex",
              backgroundImage: `url(${photo})`,
              backgroundSize: "cover",
              backgroundPosition: "center top",
            }}
          />
        )}

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "60px 70px",
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
              color: "#8B5E2E",
            }}
          >
            <span style={{ width: 36, height: 2, background: "#C8906B", display: "block" }} />
            Futures Church
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div
              style={{
                fontSize: 88,
                lineHeight: 0.95,
                fontStyle: "italic",
                fontWeight: 300,
                letterSpacing: -2,
                color: "#1C1A17",
              }}
            >
              {name}
            </div>
            <div
              style={{
                fontFamily: "ui-sans-serif, system-ui, sans-serif",
                fontSize: 22,
                color: "#8B5E2E",
                letterSpacing: 1,
              }}
            >
              {roleLine}
            </div>
          </div>

          <div
            style={{
              fontFamily: "ui-sans-serif, system-ui, sans-serif",
              fontSize: 18,
              color: "#534D44",
              fontStyle: "italic",
            }}
          >
            futures.church
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
