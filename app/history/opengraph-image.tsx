import { ImageResponse } from "next/og";
import { SectionOG } from "@/lib/og/section";

export const runtime = "edge";
export const alt = "History — Futures Church";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <SectionOG
        eyebrow="Since 1922"
        title="A hundred years in."
        subtitle="One small Adelaide chapel. Four generations. Twenty-one campuses across four countries."
      />
    ),
    { ...size }
  );
}
