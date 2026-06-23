import Link from "next/link";

interface Props {
  currentPage: number;
  totalPages: number;
  /** Construit l'URL d'une page (ex. (p) => p === 1 ? "/maison" : `/maison/page/${p}`). */
  hrefForPage: (page: number) => string;
}

export function Pagination({ currentPage, totalPages, hrefForPage }: Props) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav
      aria-label="Pagination"
      className="mt-14 flex items-center justify-center gap-1.5"
    >
      {currentPage > 1 && (
        <Link
          href={hrefForPage(currentPage - 1)}
          rel="prev"
          className="rounded-full border border-line px-4 py-2 text-sm text-ink-soft transition-colors hover:border-sage hover:text-ink"
        >
          Précédent
        </Link>
      )}

      <ul className="flex items-center gap-1.5">
        {pages.map((page) => {
          const active = page === currentPage;
          return (
            <li key={page}>
              <Link
                href={hrefForPage(page)}
                aria-current={active ? "page" : undefined}
                className={`inline-flex h-9 min-w-9 items-center justify-center rounded-full px-3 text-sm transition-colors ${
                  active
                    ? "bg-ink text-bg"
                    : "border border-line text-ink-soft hover:border-sage hover:text-ink"
                }`}
              >
                {page}
              </Link>
            </li>
          );
        })}
      </ul>

      {currentPage < totalPages && (
        <Link
          href={hrefForPage(currentPage + 1)}
          rel="next"
          className="rounded-full border border-line px-4 py-2 text-sm text-ink-soft transition-colors hover:border-sage hover:text-ink"
        >
          Suivant
        </Link>
      )}
    </nav>
  );
}
