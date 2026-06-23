import "server-only";
import { getAllArticleSummaries } from "./articles";
import { categoryMap } from "./categories";
import type { SearchRecord } from "./search-core";

export type { SearchRecord } from "./search-core";
export { normalize, searchRecords } from "./search-core";

/** Index de recherche minimal, généré côté serveur et filtré côté client. */
export function getSearchIndex(): SearchRecord[] {
  return getAllArticleSummaries().map((a) => ({
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    category: a.category,
    categoryName: categoryMap[a.category]?.name ?? a.category,
    url: `/${a.category}/${a.slug}`,
    tags: a.tags,
    date: a.date,
  }));
}
