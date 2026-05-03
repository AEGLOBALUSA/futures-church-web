import { ImageResponse } from "next/og";
import { SectionOG } from "@/lib/og/section";

export const runtime = "edge";
export const alt = "Leaders — Futures Church";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <SectionOG
        eyebrow="Leadership"
        title="Real pastors."
        subtitle="Every face behind the family. Ashley & Jane Evans, plus the couples who lead each campus."
      />
    ),
    { ...size }
  );
}
