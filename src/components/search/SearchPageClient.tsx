"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { type SearchRecord, searchRecords } from "@/lib/search-core";
import { SearchIcon } from "@/components/icons";

export function SearchPageClient({
  index,
  initialQuery = "",
}: {
  index: SearchRecord[];
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery);

  // Met à jour l'URL (sans rechargement) pour partager une recherche.
  useEffect(() => {
    const url = new URL(window.location.href);
    if (query.trim()) url.searchParams.set("q", query.trim());
    else url.searchParams.delete("q");
    window.history.replaceState(null, "", url.toString());
  }, [query]);

  const results = useMemo(
    () => (query.trim() ? searchRecords(index, query) : []),
    [index, query],
  );

  return (
    <div>
      <div className="relative">
        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-faint" />
        <input
          type="search"
          value={query}
          autoFocus
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un guide, une rubrique, un mot-clé…"
          className="w-full rounded-full border border-line bg-bg py-4 pl-12 pr-4 text-base text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-sage"
          aria-label="Rechercher un article"
        />
      </div>

      <div className="mt-8">
        {!query.trim() && (
          <p className="text-ink-soft">
            Saisissez un mot-clé pour parcourir nos {index.length} articles.
          </p>
        )}

        {query.trim() && (
          <p className="mb-6 text-sm text-ink-faint">
            {results.length} résultat{results.length > 1 ? "s" : ""} pour «&nbsp;
            {query}&nbsp;»
          </p>
        )}

        <ul className="divide-y divide-line">
          {results.map((r) => (
            <li key={r.slug}>
              <Link
                href={r.url}
                className="group block py-5 transition-colors"
              >
                <span className="eyebrow text-[0.65rem]">{r.categoryName}</span>
                <h2 className="mt-1 font-serif text-xl font-medium text-ink">
                  <span className="link-underline">{r.title}</span>
                </h2>
                <p className="mt-1 line-clamp-2 text-[0.95rem] text-ink-soft">
                  {r.excerpt}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
