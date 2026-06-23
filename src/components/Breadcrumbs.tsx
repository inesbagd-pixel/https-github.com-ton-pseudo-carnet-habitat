import Link from "next/link";
import { ChevronRightIcon } from "@/components/icons";
import type { Crumb } from "@/lib/seo";

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Fil d'Ariane" className="text-xs text-ink-faint">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-1.5">
              {isLast ? (
                <span aria-current="page" className="text-ink-soft">
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.path}
                  className="transition-colors hover:text-ink"
                >
                  {item.name}
                </Link>
              )}
              {!isLast && (
                <ChevronRightIcon className="h-3 w-3 text-line" aria-hidden />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
