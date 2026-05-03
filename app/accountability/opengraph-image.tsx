import { ImageResponse } from "next/og";
import { SectionOG } from "@/lib/og/section";

export const runtime = "edge";
export const alt = "Accountability — Futures Church";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <SectionOG
        eyebrow="Accountability"
        title="What we're committed to."
        subtitle="Child safety, financial accountability, governance — across a century of ministry. Independently audited in the USA and Australia."
      />
    ),
    { ...size }
  );
}
