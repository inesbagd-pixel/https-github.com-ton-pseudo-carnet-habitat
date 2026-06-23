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
          backgroundColor: "#7A8F7A",
          color: "#FAFAF8",
          fontSize: "104px",
          fontWeight: 700,
          fontFamily: "Georgia, serif",
        }}
      >
        C
      </div>
    ),
    { ...size },
  );
}
