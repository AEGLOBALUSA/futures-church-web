import { ImageResponse } from "next/og";
import dailyWord from "@/content/daily-word.json";

export const runtime = "edge";
export const alt = "Daily Word — Futures Church";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type FullEntry = {
  date: string;
  scripture: { text: string; reference: string };
  reflection: string;
};
type ArchiveEntry = { date: string; reference: string; preview: string };
type DailyWordData = { today: FullEntry; archive: ArchiveEntry[] };
const data = dailyWord as DailyWordData;

function findEntry(date: string): { reference: string; text: string | null } {
  if (data.today.date === date) {
    return { reference: data.today.scripture.reference, text: data.today.scripture.text };
  }
  const a = data.archive.find((x) => x.date === date);
  if (a) return { reference: a.reference, text: a.preview };
  return { reference: "Daily Word", text: null };
}

function formatLong(date: string): string {
  const d = new Date(`${date}T12:00:00`);
  if (isNaN(d.getTime())) return date;
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

export default async function Image({ params }: { params: { date: string } }) {
  const { reference, text } = findEntry(params.date);
  const truncated = text && text.length > 180 ? text.slice(0, 175) + "…" : text;

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
            "radial-gradient(ellipse 80% 70% at 30% 25%, #F7F1E6 0%, #F2E6D1 45%, #E8C9A6 78%, #D9B089 100%)",
          color: "#1C1A17",
          fontFamily: "ui-serif, Georgia, Cambria, 'Times New Roman', serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "ui-sans-serif, system-ui, sans-serif",
            fontSize: 17,
            letterSpacing: 5,
            textTransform: "uppercase",
            color: "#8B5E2E",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ width: 36, height: 2, background: "#C8906B", display: "block" }} />
            Daily Word
          </div>
          <span style={{ color: "#534D44" }}>{formatLong(params.date)}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {truncated && (
            <div
              style={{
                fontSize: 56,
                lineHeight: 1.1,
                fontStyle: "italic",
                fontWeight: 300,
                color: "#1C1A17",
                letterSpacing: -1,
              }}
            >
              &ldquo;{truncated}&rdquo;
            </div>
          )}
          <div
            style={{
              fontFamily: "ui-sans-serif, system-ui, sans-serif",
              fontSize: 26,
              color: "#8B5E2E",
              letterSpacing: 2,
            }}
          >
            {reference}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontFamily: "ui-sans-serif, system-ui, sans-serif",
            fontSize: 18,
            color: "#534D44",
          }}
        >
          <span>One scripture. One reflection. 5am every day.</span>
          <span style={{ fontStyle: "italic", color: "#C8906B" }}>futures.church/daily-word</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
