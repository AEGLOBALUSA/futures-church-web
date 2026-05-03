import { ImageResponse } from "next/og";
import { SectionOG } from "@/lib/og/section";

export const runtime = "edge";
export const alt = "Give — Futures Church";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <SectionOG
        eyebrow="Give"
        title="Generosity changes everything."
        subtitle="Card, transfer, stock, crypto — and where every gift actually goes."
      />
    ),
    { ...size }
  );
}
