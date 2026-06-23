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
          backgroundColor: "#FAFAF8",
          padding: "72px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "56px",
              height: "56px",
              borderRadius: "14px",
              backgroundColor: "#7A8F7A",
              color: "#FAFAF8",
              fontSize: "30px",
              fontWeight: 700,
            }}
          >
            C
          </div>
          <div
            style={{
              fontSize: "24px",
              letterSpacing: "6px",
              color: "#7A8F7A",
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
              color: "#222222",
              lineHeight: 1.05,
            }}
          >
            Carnet Habitat
          </div>
          <div
            style={{
              marginTop: "28px",
              fontSize: "34px",
              color: "#4A4A46",
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
            color: "#C87B5A",
            fontFamily: "Helvetica, Arial, sans-serif",
          }}
        >
          <span>Maison</span>
          <span style={{ color: "#E7E6DF" }}>·</span>
          <span>Travaux</span>
          <span style={{ color: "#E7E6DF" }}>·</span>
          <span>Jardin</span>
          <span style={{ color: "#E7E6DF" }}>·</span>
          <span>Énergie</span>
          <span style={{ color: "#E7E6DF" }}>·</span>
          <span>Décoration</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
