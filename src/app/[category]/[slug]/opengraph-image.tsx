import { ImageResponse } from "next/og";
import { getArticleBySlug } from "@/lib/articles";
import { getCategory } from "@/lib/categories";
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
          backgroundColor: "#FAFAF8",
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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "52px",
                height: "52px",
                borderRadius: "13px",
                backgroundColor: "#7A8F7A",
                color: "#FAFAF8",
                fontSize: "28px",
                fontWeight: 700,
              }}
            >
              C
            </div>
            <div style={{ fontSize: "26px", color: "#222222", fontWeight: 600 }}>
              Carnet Habitat
            </div>
          </div>
          <div
            style={{
              fontSize: "20px",
              letterSpacing: "4px",
              textTransform: "uppercase",
              color: "#C87B5A",
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
            color: "#222222",
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
              backgroundColor: "#7A8F7A",
              borderRadius: "3px",
            }}
          />
          <div
            style={{
              fontSize: "22px",
              color: "#4A4A46",
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
