import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 6,
        }}
      >
        <span
          style={{
            fontSize: 22,
            fontFamily: "ui-serif, Georgia, serif",
            fontStyle: "italic",
            color: "#FFA31A",
            lineHeight: 1,
            paddingBottom: 2,
          }}
        >
          F
        </span>
      </div>
    ),
    { ...size },
  );
}
