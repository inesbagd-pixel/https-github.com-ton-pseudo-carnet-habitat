import Link from "next/link";
import Image from "next/image";
import type { ArticleSummary } from "@/lib/articles";
import { categoryMap } from "@/lib/categories";
import { formatDate, formatReadingTime } from "@/lib/format";

interface Props {
  article: ArticleSummary;
  priority?: boolean;
  /** "default" : carte verticale. "horizontal" : image à gauche (listes). */
  variant?: "default" | "horizontal" | "compact";
}

export function ArticleCard({
  article,
  priority = false,
  variant = "default",
}: Props) {
  const category = categoryMap[article.category];
  const href = `/${article.category}/${article.slug}`;

  if (variant === "compact") {
    return (
      <article className="group">
        <Link href={href} className="flex items-start gap-4">
          <div className="relative aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-md bg-bg-muted sm:w-28">
            <Image
              src={article.cover}
              alt={article.coverAlt}
              fill
              sizes="120px"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          </div>
          <div className="min-w-0">
            <span className="eyebrow text-[0.65rem]">{category?.name}</span>
            <h3 className="mt-1 font-serif text-[1.02rem] font-medium leading-snug text-ink">
              <span className="link-underline">{article.title}</span>
            </h3>
            <p className="mt-1 text-xs text-ink-faint">
              {formatReadingTime(article.readingMinutes)}
            </p>
          </div>
        </Link>
      </article>
    );
  }

  if (variant === "horizontal") {
    return (
      <article className="group grid gap-5 sm:grid-cols-[minmax(0,1fr)_1.2fr] sm:items-center">
        <Link
          href={href}
          className="relative block aspect-[16/10] overflow-hidden rounded-lg bg-bg-muted"
          tabIndex={-1}
          aria-hidden
        >
          <Image
            src={article.cover}
            alt={article.coverAlt}
            fill
            sizes="(max-width: 640px) 100vw, 40vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            priority={priority}
          />
        </Link>
        <div>
          <span className="eyebrow">{category?.name}</span>
          <h3 className="mt-2 font-serif text-xl font-medium leading-snug text-ink sm:text-2xl">
            <Link href={href} className="link-underline">
              {article.title}
            </Link>
          </h3>
          <p className="mt-2 line-clamp-2 text-[0.95rem] leading-relaxed text-ink-soft">
            {article.excerpt}
          </p>
          <p className="mt-3 text-xs text-ink-faint">
            {article.authorName} · {formatDate(article.date)} ·{" "}
            {formatReadingTime(article.readingMinutes)}
          </p>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex h-full flex-col">
      <Link
        href={href}
        className="relative block aspect-[16/10] overflow-hidden rounded-lg bg-bg-muted"
        tabIndex={-1}
        aria-hidden
      >
        <Image
          src={article.cover}
          alt={article.coverAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          priority={priority}
        />
      </Link>
      <div className="flex flex-1 flex-col pt-4">
        <span className="eyebrow">{category?.name}</span>
        <h3 className="mt-2 font-serif text-xl font-medium leading-snug text-ink">
          <Link href={href} className="link-underline">
            {article.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-[0.95rem] leading-relaxed text-ink-soft">
          {article.excerpt}
        </p>
        <p className="mt-4 text-xs text-ink-faint">
          {article.authorName} · {formatDate(article.date)} ·{" "}
          {formatReadingTime(article.readingMinutes)}
        </p>
      </div>
    </article>
  );
}
