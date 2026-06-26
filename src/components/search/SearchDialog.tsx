"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { type SearchRecord, searchRecords } from "@/lib/search-core";
import { Portal } from "@/components/Portal";
import { SearchIcon, CloseIcon } from "@/components/icons";

interface Props {
  index: SearchRecord[];
  open: boolean;
  onClose: () => void;
}

export function SearchDialog({ index, open, onClose }: Props) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    return searchRecords(index, query).slice(0, 8);
  }, [index, query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      // Focus l'entrée à l'ouverture.
      const t = setTimeout(() => inputRef.current?.focus(), 30);
      document.body.style.overflow = "hidden";
      return () => {
        clearTimeout(t);
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <Portal>
    <div
      className="fixed inset-0 z-[90] flex items-start justify-center px-4 pt-[10vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Rechercher un article"
    >
      <button
        type="button"
        aria-label="Fermer la recherche"
        className="absolute inset-0 bg-ink/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-xl border border-line bg-bg shadow-2xl">
        <div className="flex items-center gap-3 border-b border-line px-4">
          <SearchIcon className="h-5 w-5 shrink-0 text-ink-faint" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un article, une catégorie…"
            className="w-full bg-transparent py-4 text-base text-ink outline-none placeholder:text-ink-faint"
            aria-label="Rechercher"
          />
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 text-ink-faint transition-colors hover:bg-bg-muted hover:text-ink"
            aria-label="Fermer"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[55vh] overflow-y-auto">
          {query.trim() && results.length === 0 && (
            <p className="px-5 py-8 text-center text-sm text-ink-faint">
              Aucun article ne correspond à «&nbsp;{query}&nbsp;».
            </p>
          )}

          {results.length > 0 && (
            <ul className="divide-y divide-line">
              {results.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={r.url}
                    onClick={onClose}
                    className="block px-5 py-3.5 transition-colors hover:bg-bg-muted"
                  >
                    <span className="eyebrow text-[0.65rem]">
                      {r.categoryName}
                    </span>
                    <span className="mt-0.5 block font-serif text-[1.05rem] font-medium text-ink">
                      {r.title}
                    </span>
                    <span className="mt-0.5 line-clamp-1 block text-sm text-ink-faint">
                      {r.excerpt}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {!query.trim() && (
            <p className="px-5 py-8 text-center text-sm text-ink-faint">
              Tapez un mot-clé pour parcourir nos guides : humidité, toiture,
              terrasse, chauffage…
            </p>
          )}
        </div>
      </div>
    </div>
    </Portal>
  );
}
