/**
 * Logique de recherche pure (sans dépendance serveur).
 * Ce module est sûr à importer côté client.
 */

export interface SearchRecord {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categoryName: string;
  url: string;
  tags: string[];
  date: string;
}

/** Normalise une chaîne (minuscules, sans accents) pour la recherche. */
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

/** Recherche locale instantanée sur l'index. */
export function searchRecords(
  index: SearchRecord[],
  query: string,
): SearchRecord[] {
  const q = normalize(query.trim());
  if (!q) return [];
  const terms = q.split(/\s+/).filter(Boolean);

  return index
    .map((record) => {
      const haystack = normalize(
        [
          record.title,
          record.excerpt,
          record.categoryName,
          record.tags.join(" "),
        ].join(" "),
      );
      let score = 0;
      for (const term of terms) {
        if (!haystack.includes(term)) return { record, score: -1 };
        // Pondération : titre > catégorie > reste.
        if (normalize(record.title).includes(term)) score += 5;
        if (normalize(record.categoryName).includes(term)) score += 2;
        score += 1;
      }
      return { record, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.record);
}
