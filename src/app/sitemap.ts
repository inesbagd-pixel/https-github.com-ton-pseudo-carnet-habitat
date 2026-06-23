import type { MetadataRoute } from "next";
import { siteConfig, absoluteUrl } from "@/lib/site";
import { categories } from "@/lib/categories";
import { getAllArticles, getArticlesByCategory } from "@/lib/articles";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/a-propos"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/equipe"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/charte-editoriale"), lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: absoluteUrl("/contact"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: absoluteUrl("/mentions-legales"), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/politique-de-confidentialite"), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  // Pages catégories + pagination.
  const categoryPages: MetadataRoute.Sitemap = categories.flatMap((category) => {
    const total = Math.ceil(
      getArticlesByCategory(category.slug).length / siteConfig.postsPerPage,
    );
    const pages: MetadataRoute.Sitemap = [
      {
        url: absoluteUrl(`/${category.slug}`),
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
      },
    ];
    for (let p = 2; p <= total; p++) {
      pages.push({
        url: absoluteUrl(`/${category.slug}/page/${p}`),
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.5,
      });
    }
    return pages;
  });

  // Articles.
  const articlePages: MetadataRoute.Sitemap = getAllArticles().map((a) => ({
    url: absoluteUrl(`/${a.frontmatter.category}/${a.slug}`),
    lastModified: new Date(
      (a.frontmatter.updated || a.frontmatter.date) + "T00:00:00",
    ),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...articlePages];
}
