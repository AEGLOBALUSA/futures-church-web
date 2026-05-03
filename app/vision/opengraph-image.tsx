import { ImageResponse } from "next/og";
import { SectionOG } from "@/lib/og/section";

export const runtime = "edge";
export const alt = "Vision — Futures Church";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <SectionOG
        eyebrow="Vision"
        title="Two hundred."
        subtitle="200 campuses · 10,000 leaders · 200,000 souls. A 100-year family with a 10-year mission."
      />
    ),
    { ...size }
  );
}
