import { ImageResponse } from "next/og";
import { getArticleBySlug } from "@/lib/articles";
import { getCategory, getCategoryTone } from "@/lib/categories";
import { siteConfig } from "@/lib/site";

export const alt = "Carnet Habitat";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: Promise<{ category: string; slug: string }>;
}

/**
 * Image Open Graph brandée, générée automatiquement pour chaque article :
 * rubrique + titre de l'article sur l'identité visuelle Carnet Habitat.
 */
export default async function ArticleOgImage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  const title = article?.frontmatter.title ?? siteConfig.name;
  const category = article ? getCategory(article.frontmatter.category) : undefined;
  const accent = article ? getCategoryTone(article.frontmatter.category).ink : "#22304C";
  const isPillar = Boolean(article?.frontmatter.pillar);
  const eyebrow = isPillar
    ? `Dossier · ${category?.name ?? ""}`
    : category?.name ?? "Magazine habitat";

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
          padding: "70px",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* En-tête : logo + rubrique */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <svg width="52" height="52" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="30" fill="#22304C" />
              <path d="M25 19h14v27l-7-5.5-7 5.5z" fill="#FBF8F2" />
              <rect x="25" y="19" width="14" height="5" fill="#C39A3A" />
            </svg>
            <div style={{ fontSize: "26px", color: "#1F1B16", fontWeight: 600 }}>
              Carnet Habitat
            </div>
          </div>
          <div
            style={{
              fontSize: "20px",
              letterSpacing: "4px",
              textTransform: "uppercase",
              color: accent,
              fontFamily: "Helvetica, Arial, sans-serif",
            }}
          >
            {eyebrow}
          </div>
        </div>

        {/* Titre */}
        <div
          style={{
            display: "flex",
            fontSize: title.length > 70 ? "58px" : "70px",
            fontWeight: 700,
            color: "#1F1B16",
            lineHeight: 1.1,
            maxWidth: "1000px",
          }}
        >
          {title}
        </div>

        {/* Pied : filet sauge */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "64px",
              height: "6px",
              backgroundColor: accent,
              borderRadius: "3px",
            }}
          />
          <div
            style={{
              fontSize: "22px",
              color: "#4A4438",
              fontFamily: "Helvetica, Arial, sans-serif",
            }}
          >
            {siteConfig.url.replace("https://", "")}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
