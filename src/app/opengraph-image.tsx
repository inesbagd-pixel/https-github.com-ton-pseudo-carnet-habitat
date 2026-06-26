import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const alt = `${siteConfig.name} — Magazine habitat, maison & jardin`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#FBF8F2",
          padding: "72px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <svg width="60" height="60" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="30" fill="#22304C" />
            <path d="M25 19h14v27l-7-5.5-7 5.5z" fill="#FBF8F2" />
            <rect x="25" y="19" width="14" height="5" fill="#C39A3A" />
          </svg>
          <div
            style={{
              fontSize: "24px",
              letterSpacing: "6px",
              color: "#9A7A22",
              textTransform: "uppercase",
              fontFamily: "Helvetica, Arial, sans-serif",
            }}
          >
            Magazine habitat
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: "92px",
              fontWeight: 700,
              color: "#1F1B16",
              lineHeight: 1.05,
            }}
          >
            Carnet Habitat
          </div>
          <div
            style={{
              marginTop: "28px",
              fontSize: "34px",
              color: "#4A4438",
              maxWidth: "900px",
              lineHeight: 1.35,
              fontFamily: "Helvetica, Arial, sans-serif",
            }}
          >
            {siteConfig.tagline}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            fontSize: "26px",
            color: "#A9542F",
            fontFamily: "Helvetica, Arial, sans-serif",
          }}
        >
          <span>Maison</span>
          <span style={{ color: "#E5DFD2" }}>·</span>
          <span>Travaux</span>
          <span style={{ color: "#E5DFD2" }}>·</span>
          <span>Jardin</span>
          <span style={{ color: "#E5DFD2" }}>·</span>
          <span>Énergie</span>
          <span style={{ color: "#E5DFD2" }}>·</span>
          <span>Décoration</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
