import Link from "next/link";
import Image from "next/image";
import { categories } from "@/lib/categories";
import {
  getLatestArticles,
  getFeaturedArticles,
  getArticlesByCategory,
  getPillars,
} from "@/lib/articles";
import { siteConfig } from "@/lib/site";
import { formatDate } from "@/lib/format";
import { ArticleCard } from "@/components/ArticleCard";
import { CategoryCard } from "@/components/CategoryCard";
import { SectionHeading } from "@/components/SectionHeading";
import { Newsletter } from "@/components/Newsletter";
import { ArrowRightIcon } from "@/components/icons";

export default function HomePage() {
  const featured = getFeaturedArticles(4);
  const hero = featured[0];
  const latest = getLatestArticles(7);
  // On évite de répéter l'article du hero dans la grille « Derniers articles ».
  const latestGrid = latest.filter((a) => a.slug !== hero?.slug).slice(0, 6);
  // Pages piliers mises en avant comme « guides de référence ».
  const guides = getPillars(6);

  const categoryCounts = Object.fromEntries(
    categories.map((c) => [c.slug, getArticlesByCategory(c.slug).length]),
  );

  return (
    <>
      {/* ----------------------------- HERO ----------------------------- */}
      <section className="border-b border-line">
        <div className="container-editorial py-14 sm:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
            <div>
              <span className="eyebrow">Magazine habitat &amp; maison</span>
              <h1 className="mt-4 font-serif text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
                Carnet Habitat
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
                {siteConfig.tagline}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="#derniers-articles"
                  className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-bg transition-colors hover:bg-sage-dark"
                >
                  Découvrir les articles
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
                <Link
                  href="/a-propos"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft transition-colors hover:text-ink"
                >
                  Le magazine
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {hero && (
              <article className="group relative">
                <Link
                  href={`/${hero.category}/${hero.slug}`}
                  className="relative block aspect-[4/3] overflow-hidden rounded-xl bg-bg-muted"
                >
                  <Image
                    src={hero.cover}
                    alt={hero.coverAlt}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-ink/65 via-transparent to-transparent"
                    aria-hidden
                  />
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    <span className="inline-block rounded-full bg-bg/90 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-terracotta-dark">
                      À la une
                    </span>
                    <h2 className="mt-3 font-serif text-2xl font-semibold leading-snug text-bg sm:text-[1.7rem]">
                      {hero.title}
                    </h2>
                    <p className="mt-2 text-sm text-bg/85">
                      {formatDate(hero.date)}
                    </p>
                  </div>
                </Link>
              </article>
            )}
          </div>
        </div>
      </section>

      {/* -------------------------- CATÉGORIES -------------------------- */}
      <section className="container-editorial py-16 sm:py-20">
        <SectionHeading
          eyebrow="Explorer"
          title="Six rubriques pour votre logement"
          description="Du quotidien de la maison aux grands chantiers, en passant par le jardin, l'énergie, la décoration et les espaces extérieurs."
        />
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-6">
          {categories.map((category) => (
            <CategoryCard
              key={category.slug}
              category={category}
              count={categoryCounts[category.slug]}
            />
          ))}
        </div>
      </section>

      {/* ----------------------- DERNIERS ARTICLES ---------------------- */}
      <section
        id="derniers-articles"
        className="container-editorial scroll-mt-24 py-4 sm:py-6"
      >
        <SectionHeading
          eyebrow="Le fil"
          title="Derniers articles"
          description="Nos publications les plus récentes, toutes rubriques confondues."
        />
        <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {latestGrid.map((article, i) => (
            <ArticleCard key={article.slug} article={article} priority={i < 3} />
          ))}
        </div>
      </section>

      {/* ----------------------- GUIDES POPULAIRES ---------------------- */}
      {guides.length > 0 && (
        <section className="mt-20 border-y border-line bg-bg-muted">
          <div className="container-editorial py-16 sm:py-20">
            <SectionHeading
              eyebrow="À lire absolument"
              title="Nos guides complets"
              description="Des dossiers de référence, longs et documentés, pour aller au fond de chaque sujet."
            />
            <div className="mt-10 grid gap-10 lg:grid-cols-3">
              {guides.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------------------------- NEWSLETTER ------------------------ */}
      <section className="container-editorial py-20">
        <Newsletter />
      </section>

      {/* ----------------------------- À PROPOS ------------------------- */}
      <section className="border-t border-line bg-bg-muted">
        <div className="container-editorial grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <span className="eyebrow">À propos</span>
            <h2 className="mt-3 font-serif text-2xl font-semibold text-ink sm:text-3xl">
              Un magazine indépendant dédié à l'habitat
            </h2>
            <p className="mt-4 max-w-2xl leading-relaxed text-ink-soft">
              Carnet Habitat réunit des journalistes et des praticiens — artisans,
              architectes d'intérieur, conseillers en énergie — autour d'une même
              idée : rendre l'amélioration de l'habitat accessible à tous. Nos
              guides sont écrits avec soin, vérifiés et pensés pour vous aider à
              décider, entretenir et aménager en toute confiance.
            </p>
            <Link
              href="/a-propos"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-sage-dark transition-colors hover:text-ink"
            >
              Découvrir notre démarche
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
          <dl className="grid grid-cols-3 gap-4 text-center">
            {[
              { n: "6", l: "rubriques" },
              { n: "30+", l: "guides publiés" },
              { n: "100%", l: "indépendant" },
            ].map((stat) => (
              <div
                key={stat.l}
                className="rounded-xl border border-line bg-bg px-3 py-6"
              >
                <dt className="font-serif text-3xl font-semibold text-terracotta-dark">
                  {stat.n}
                </dt>
                <dd className="mt-1 text-xs uppercase tracking-wide text-ink-faint">
                  {stat.l}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
