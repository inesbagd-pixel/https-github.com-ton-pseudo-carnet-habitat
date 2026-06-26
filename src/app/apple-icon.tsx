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
          backgroundColor: "#22304C",
        }}
      >
        {/* Sceau Cachet-Signet (signet sur le champ bleu nuit) */}
        <svg width="132" height="132" viewBox="0 0 64 64">
          <path d="M25 19h14v27l-7-5.5-7 5.5z" fill="#FBF8F2" />
          <rect x="25" y="19" width="14" height="5" fill="#C39A3A" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
