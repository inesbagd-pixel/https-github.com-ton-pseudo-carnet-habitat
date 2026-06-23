import type { Metadata } from "next";
import { siteConfig, absoluteUrl } from "./site";
import type { Article } from "./articles";
import { getCategory } from "./categories";
import { getAuthor } from "./authors";

/**
 * Construit un objet Metadata Next.js cohérent (canonical, Open Graph,
 * Twitter Cards) à partir d'options simples.
 */
export function buildMetadata({
  title,
  description,
  path,
  ogImage,
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  noIndex?: boolean;
}): Metadata {
  const canonical = absoluteUrl(path);
  // Si aucune image n'est fournie, on laisse Next utiliser l'image OG générée
  // par convention de fichier (opengraph-image.tsx) : image de marque par
  // défaut, ou image brandée par article lorsqu'elle existe.
  const image = ogImage
    ? ogImage.startsWith("http")
      ? ogImage
      : absoluteUrl(ogImage)
    : undefined;
  const ogImages = image
    ? { images: [{ url: image, width: 1200, height: 630, alt: title }] }
    : {};
  const twitterImages = image ? { images: [image] } : {};

  return {
    title,
    description,
    alternates: { canonical },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
          "max-video-preview": -1,
        },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type,
      ...ogImages,
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
      ...(authors ? { authors } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...twitterImages,
    },
  };
}

/* --------------------------------------------------------------------- */
/*  JSON-LD Schema.org                                                    */
/* --------------------------------------------------------------------- */

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": absoluteUrl("/#organization"),
    name: siteConfig.name,
    url: siteConfig.url,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/icon.svg"),
    },
    description: siteConfig.description,
    sameAs: Object.values(siteConfig.social),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: "fr-FR",
    publisher: { "@id": absoluteUrl("/#organization") },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${absoluteUrl("/recherche")}?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export interface Crumb {
  name: string;
  path: string;
}

export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

export function articleSchema(article: Article) {
  const { frontmatter } = article;
  const category = getCategory(frontmatter.category);
  const author = getAuthor(frontmatter.author);
  const url = absoluteUrl(`/${frontmatter.category}/${article.slug}`);
  const image = article.ogImage.startsWith("http")
    ? article.ogImage
    : absoluteUrl(article.ogImage);

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: frontmatter.title,
    description: frontmatter.description,
    image: [image],
    datePublished: frontmatter.date,
    dateModified: frontmatter.updated || frontmatter.date,
    inLanguage: "fr-FR",
    articleSection: category?.name,
    keywords: (frontmatter.tags ?? []).join(", "),
    wordCount: article.content.trim().split(/\s+/).length,
    timeRequired: `PT${article.readingMinutes}M`,
    author: {
      "@type": "Person",
      name: author.name,
      jobTitle: author.role,
    },
    publisher: { "@id": absoluteUrl("/#organization") },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    isAccessibleForFree: true,
  };
}

export function faqSchema(faq: { question: string; answer: string }[]) {
  if (!faq || faq.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function personSchema(author: {
  key: string;
  name: string;
  role: string;
  bio: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": absoluteUrl(`/equipe#${author.key}`),
    name: author.name,
    jobTitle: author.role,
    description: author.bio,
    worksFor: { "@id": absoluteUrl("/#organization") },
    url: absoluteUrl("/equipe"),
  };
}

export function collectionPageSchema({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url: absoluteUrl(path),
    inLanguage: "fr-FR",
    isPartOf: { "@id": absoluteUrl("/#website") },
  };
}
