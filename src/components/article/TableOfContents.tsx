"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/articles";

export function TableOfContents({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (items.length === 0) return;
    const headings = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-100px 0px -70% 0px", threshold: 0 },
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [items]);

  if (items.length < 2) return null;

  return (
    <nav aria-label="Sommaire de l'article" className="text-sm">
      <p className="eyebrow mb-3">Sommaire</p>
      <ul className="space-y-2 border-l border-line">
        {items.map((item) => {
          const active = activeId === item.id;
          return (
            <li
              key={item.id}
              className={item.level === 3 ? "pl-4" : ""}
            >
              <a
                href={`#${item.id}`}
                className={`-ml-px block border-l-2 py-0.5 pl-4 leading-snug transition-colors ${
                  active
                    ? "border-sage font-medium text-ink"
                    : "border-transparent text-ink-faint hover:text-ink-soft"
                }`}
              >
                {item.title}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
