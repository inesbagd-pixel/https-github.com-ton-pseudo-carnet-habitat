import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import {
  getAllArticles,
  getArticleBySlug,
  getRelatedArticles,
} from "@/lib/articles";
import { getCategory } from "@/lib/categories";
import { formatDate, formatReadingTime } from "@/lib/format";
import {
  buildMetadata,
  articleSchema,
  breadcrumbSchema,
  faqSchema,
} from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { TableOfContents } from "@/components/article/TableOfContents";
import { Faq } from "@/components/article/Faq";
import { Newsletter } from "@/components/Newsletter";
import { ArticleCard } from "@/components/ArticleCard";
import { mdxComponents } from "@/components/mdx/MdxComponents";
import { ClockIcon } from "@/components/icons";

interface PageProps {
  params: Promise<{ category: string; slug: string }>;
}

export function generateStaticParams() {
  return getAllArticles().map((a) => ({
    category: a.frontmatter.category,
    slug: a.slug,
  }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article || article.frontmatter.category !== category) return {};

  const { frontmatter } = article;
  return buildMetadata({
    title: frontmatter.title,
    description: frontmatter.description,
    path: `/${category}/${slug}`,
    ogImage: article.ogImage,
    type: "article",
    publishedTime: frontmatter.date,
    modifiedTime: frontmatter.updated || frontmatter.date,
    authors: [article.author.name],
  });
}

export default async function ArticlePage({ params }: PageProps) {
  const { category: categorySlug, slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article || article.frontmatter.category !== categorySlug) {
    notFound();
  }

  const { frontmatter, author, toc, readingMinutes } = article;
  const category = getCategory(frontmatter.category)!;
  const related = getRelatedArticles(article, 3);

  const crumbs = [
    { name: "Accueil", path: "/" },
    { name: category.name, path: `/${category.slug}` },
    { name: frontmatter.title, path: `/${category.slug}/${slug}` },
  ];

  const schemas = [
    articleSchema(article),
    breadcrumbSchema(crumbs),
    faqSchema(frontmatter.faq ?? []),
  ].filter(Boolean) as object[];

  return (
    <>
      <JsonLd data={schemas} />

      <article>
        {/* En-tête éditorial */}
        <header className="border-b border-line">
          <div className="container-editorial py-8 sm:py-12">
            <Breadcrumbs items={crumbs} />
            <div className="mx-auto mt-6 max-w-3xl">
              <Link
                href={`/${category.slug}`}
                className="eyebrow transition-colors hover:text-ink"
              >
                {category.name}
              </Link>
              <h1 className="mt-3 font-serif text-3xl font-semibold leading-[1.12] tracking-tight text-ink sm:text-4xl lg:text-[2.9rem]">
                {frontmatter.title}
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-ink-soft">
                {frontmatter.description}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-faint">
                <div className="flex items-center gap-2.5">
                  <Image
                    src={author.avatar}
                    alt={author.name}
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                  <span>
                    <span className="font-medium text-ink-soft">
                      {author.name}
                    </span>
                    <span className="block text-xs">{author.role}</span>
                  </span>
                </div>
                <span className="hidden h-4 w-px bg-line sm:block" />
                <time dateTime={frontmatter.date}>
                  {formatDate(frontmatter.date)}
                </time>
                <span className="inline-flex items-center gap-1.5">
                  <ClockIcon className="h-4 w-4" />
                  {formatReadingTime(readingMinutes)}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Image de couverture */}
        <div className="container-editorial">
          <figure className="mx-auto mt-8 max-w-4xl sm:mt-10">
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-bg-muted">
              <Image
                src={frontmatter.cover}
                alt={frontmatter.coverAlt}
                fill
                priority
                sizes="(max-width: 896px) 100vw, 896px"
                className="object-cover"
              />
            </div>
          </figure>
        </div>

        {/* Corps : sommaire + contenu */}
        <div className="container-editorial mt-12">
          <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[16rem_minmax(0,1fr)]">
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <TableOfContents items={toc} />
              </div>
            </aside>

            <div className="min-w-0 max-w-prose">
              <div className="prose-editorial">
                <MDXRemote
                  source={article.content}
                  components={mdxComponents}
                  options={{
                    mdxOptions: {
                      remarkPlugins: [remarkGfm],
                      rehypePlugins: [rehypeSlug],
                    },
                  }}
                />
              </div>

              {/* FAQ */}
              <Faq items={frontmatter.faq ?? []} />

              {/* Tags */}
              {frontmatter.tags && frontmatter.tags.length > 0 && (
                <div className="mt-10 flex flex-wrap gap-2">
                  {frontmatter.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-bg-muted px-3 py-1 text-xs text-ink-soft"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Bio auteur */}
              <div className="mt-12 flex items-start gap-4 rounded-xl border border-line bg-bg-muted p-6">
                <Image
                  src={author.avatar}
                  alt={author.name}
                  width={56}
                  height={56}
                  className="h-14 w-14 shrink-0 rounded-full object-cover"
                />
                <div>
                  <p className="eyebrow text-[0.65rem]">Rédigé par</p>
                  <p className="mt-1 font-serif text-lg font-semibold text-ink">
                    {author.name}
                  </p>
                  <p className="text-xs text-ink-faint">{author.role}</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {author.bio}
                  </p>
                </div>
              </div>

              {/* Newsletter inline */}
              <div className="mt-12">
                <Newsletter variant="inline" />
              </div>
            </div>
          </div>
        </div>

        {/* Articles liés */}
        {related.length > 0 && (
          <section className="mt-20 border-t border-line bg-bg-muted">
            <div className="container-editorial py-16">
              <h2 className="font-serif text-2xl font-semibold text-ink">
                À lire également
              </h2>
              <div className="mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((item) => (
                  <ArticleCard key={item.slug} article={item} />
                ))}
              </div>
            </div>
          </section>
        )}
      </article>
    </>
  );
}
