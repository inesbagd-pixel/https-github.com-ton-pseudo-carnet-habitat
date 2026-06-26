import Link from "next/link";
import Image from "next/image";
import type { ArticleSummary } from "@/lib/articles";
import { categoryMap, getCategoryTone } from "@/lib/categories";
import { formatDate } from "@/lib/format";

interface Props {
  article: ArticleSummary;
  priority?: boolean;
  /** "default" : carte signature. "horizontal" : image à gauche. "compact" : liste. */
  variant?: "default" | "horizontal" | "compact";
}

export function ArticleCard({
  article,
  priority = false,
  variant = "default",
}: Props) {
  const category = categoryMap[article.category];
  const tone = getCategoryTone(article.category);
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
            <span
              className="text-[0.65rem] font-semibold uppercase tracking-[0.12em]"
              style={{ color: tone.ink }}
            >
              {category?.name}
            </span>
            <h3 className="mt-1 font-serif text-[1.02rem] font-medium leading-snug text-ink">
              <span className="link-underline">{article.title}</span>
            </h3>
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
          <span
            className="text-[0.7rem] font-semibold uppercase tracking-[0.14em]"
            style={{ color: tone.ink }}
          >
            {category?.name}
          </span>
          <h3 className="mt-2 font-serif text-xl font-medium leading-snug text-ink sm:text-2xl">
            <Link href={href} className="link-underline">
              {article.title}
            </Link>
          </h3>
          <p className="mt-2 line-clamp-2 text-[0.95rem] leading-relaxed text-ink-soft">
            {article.excerpt}
          </p>
          <p className="mt-3 text-xs text-ink-faint">
            {article.authorName} · {formatDate(article.date)}
          </p>
        </div>
      </article>
    );
  }

  /* ---- Carte signature « Carnet » : filet + onglet d'index + byline réglée ---- */
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-line bg-bg transition-colors hover:border-sage/50">
      <div className="relative">
        {/* filet supérieur de rubrique */}
        <span
          aria-hidden
          className="absolute inset-x-0 top-0 z-10 h-1"
          style={{ background: tone.ink }}
        />
        {/* onglet d'index (rubrique) */}
        <span
          className="absolute left-4 top-1 z-10 rounded-b-md px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-white"
          style={{ background: tone.ink }}
        >
          {category?.name}
        </span>
        <Link
          href={href}
          className="relative block aspect-[16/10] overflow-hidden bg-bg-muted"
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
      </div>
      <div className="flex flex-1 flex-col px-5 pb-5 pt-5">
        <h3 className="font-serif text-xl font-medium leading-snug text-ink">
          <Link href={href} className="link-underline">
            {article.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-[0.93rem] leading-relaxed text-ink-soft">
          {article.excerpt}
        </p>
        <div className="mt-auto border-t border-line pt-3">
          <p className="text-xs text-ink-faint">
            {article.authorName} · {formatDate(article.date)}
          </p>
        </div>
      </div>
    </article>
  );
}
