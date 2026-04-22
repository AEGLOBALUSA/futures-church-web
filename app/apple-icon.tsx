import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#07080B",
          borderRadius: 38,
        }}
      >
        <span
          style={{
            fontSize: 116,
            fontFamily: "ui-serif, Georgia, serif",
            fontStyle: "italic",
            color: "#FFA31A",
            lineHeight: 1,
            paddingBottom: 8,
          }}
        >
          F
        </span>
      </div>
    ),
    { ...size },
  );
}
