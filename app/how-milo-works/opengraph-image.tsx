import { ImageResponse } from "next/og";
import { SectionOG } from "@/lib/og/section";

export const runtime = "edge";
export const alt = "How Milo works — Futures Church";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <SectionOG
        eyebrow="How Milo works"
        title="Plain answers about your guide."
        subtitle="What Milo does, how he's made, and the commitments we've made about your conversations."
      />
    ),
    { ...size }
  );
}
