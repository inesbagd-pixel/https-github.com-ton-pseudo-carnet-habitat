import Image from "next/image";
import { notFound } from "next/navigation";
import type { Category } from "@/lib/categories";
import { getArticlesByCategory } from "@/lib/articles";
import { siteConfig } from "@/lib/site";
import { ArticleCard } from "@/components/ArticleCard";
import { Pagination } from "@/components/Pagination";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Newsletter } from "@/components/Newsletter";

export function CategoryView({
  category,
  page,
}: {
  category: Category;
  page: number;
}) {
  const all = getArticlesByCategory(category.slug);
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
