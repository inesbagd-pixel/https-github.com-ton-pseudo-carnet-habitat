import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Category } from "@/lib/categories";
import { getArticlesByCategory, getPillarForCategory } from "@/lib/articles";
import { siteConfig } from "@/lib/site";
import { ArticleCard } from "@/components/ArticleCard";
import { Pagination } from "@/components/Pagination";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Newsletter } from "@/components/Newsletter";
import { ArrowRightIcon } from "@/components/icons";

export function CategoryView({
  category,
  page,
}: {
  category: Category;
  page: number;
}) {
  const all = getArticlesByCategory(category.slug);
  // Page pilier de la rubrique, mise en avant uniquement sur la 1re page.
  const pillar = getPillarForCategory(category.slug);
  const perPage = siteConfig.postsPerPage;
  const totalPages = Math.max(1, Math.ceil(all.length / perPage));

  if (page < 1 || page > totalPages) notFound();

  const start = (page - 1) * perPage;
  const articles = all.slice(start, start + perPage);

  const hrefForPage = (p: number) =>
    p === 1 ? `/${category.slug}` : `/${category.slug}/page/${p}`;

  return (
    <>
      {/* En-tête de catégorie */}
      <header className="border-b border-line">
        <div className="container-editorial py-10 sm:py-14">
          <Breadcrumbs
            items={[
              { name: "Accueil", path: "/" },
              { name: category.name, path: `/${category.slug}` },
            ]}
          />
          <div className="mt-6 grid items-center gap-8 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <span className="eyebrow">Rubrique</span>
              <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-ink sm:text-4xl lg:text-[2.75rem]">
                {category.name}
              </h1>
              <p className="mt-4 max-w-2xl text-[1.05rem] leading-relaxed text-ink-soft">
                {category.intro}
              </p>
              <p className="mt-4 text-sm text-ink-faint">
                {all.length} article{all.length > 1 ? "s" : ""} publié
                {all.length > 1 ? "s" : ""}
              </p>
            </div>
            <div className="relative hidden aspect-[16/11] overflow-hidden rounded-xl bg-bg-muted lg:block">
              <Image
                src={category.image}
                alt=""
                fill
                sizes="40vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </header>

      {/* Dossier pilier mis en avant (1re page uniquement) */}
      {pillar && page === 1 && (
        <section className="container-editorial pt-14">
          <Link
            href={`/${pillar.category}/${pillar.slug}`}
            className="group grid items-stretch overflow-hidden rounded-2xl border border-line bg-bg-muted sm:grid-cols-[1.1fr_1fr]"
          >
            <div className="relative aspect-[16/10] sm:aspect-auto">
              <Image
                src={pillar.cover}
                alt={pillar.coverAlt}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
            </div>
            <div className="flex flex-col justify-center p-7 sm:p-9">
              <span className="inline-flex w-fit items-center rounded-full bg-sage-soft px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-sage-dark">
                Dossier complet
              </span>
              <h2 className="mt-3 font-serif text-2xl font-semibold leading-snug text-ink sm:text-[1.7rem]">
                {pillar.title}
              </h2>
              <p className="mt-2 line-clamp-2 text-[0.95rem] leading-relaxed text-ink-soft">
                {pillar.excerpt}
              </p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-sage-dark">
                Lire le guide
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        </section>
      )}

      {/* Liste d'articles */}
      <section className="container-editorial py-14">
        {page > 1 && (
          <p className="mb-8 text-sm text-ink-faint">
            Page {page} sur {totalPages}
          </p>
        )}

        {articles.length === 0 ? (
          <p className="text-ink-soft">
            Les premiers articles de cette rubrique arrivent très bientôt.
          </p>
        ) : (
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, i) => (
              <ArticleCard
                key={article.slug}
                article={article}
                priority={i < 3}
              />
            ))}
          </div>
        )}

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          hrefForPage={hrefForPage}
        />
      </section>

      {/* Newsletter */}
      <section className="container-editorial pb-20">
        <Newsletter />
      </section>
    </>
  );
}
