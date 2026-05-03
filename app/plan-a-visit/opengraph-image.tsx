import { ImageResponse } from "next/og";
import { SectionOG } from "@/lib/og/section";

export const runtime = "edge";
export const alt = "Plan a visit — Futures Church";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <SectionOG
        eyebrow="Plan a visit"
        title="We saved you a seat."
        subtitle="What to wear, where to park, what your kids will love. We'll meet you at the door."
      />
    ),
    { ...size }
  );
}
