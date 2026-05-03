import { ImageResponse } from "next/og";
import { SectionOG } from "@/lib/og/section";

export const runtime = "edge";
export const alt = "Daily Word — Futures Church";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <SectionOG
        eyebrow="Daily Word"
        title="One scripture. One reflection."
        subtitle="Sent at 5am your time. Free. Skippable. Never spammy."
        strap="Joining 80,000+ others around the world"
      />
    ),
    { ...size }
  );
}
