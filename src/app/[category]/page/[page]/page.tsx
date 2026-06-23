import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories, getCategory } from "@/lib/categories";
import { getArticlesByCategory } from "@/lib/articles";
import { siteConfig } from "@/lib/site";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { CategoryView } from "@/components/CategoryView";
import { JsonLd } from "@/components/JsonLd";

interface PageProps {
  params: Promise<{ category: string; page: string }>;
}

export function generateStaticParams() {
  const params: { category: string; page: string }[] = [];
  for (const category of categories) {
    const total = Math.ceil(
      getArticlesByCategory(category.slug).length / siteConfig.postsPerPage,
    );
    // La page 1 est servie par /[category]. On génère 2..total.
    for (let p = 2; p <= total; p++) {
      params.push({ category: category.slug, page: String(p) });
    }
  }
  return params;
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category: slug, page } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return buildMetadata({
    title: `${category.name} — page ${page}`,
    description: category.description,
    path: `/${category.slug}/page/${page}`,
    ogImage: category.image,
  });
}

export default async function CategoryPaginatedPage({ params }: PageProps) {
  const { category: slug, page } = await params;
  const category = getCategory(slug);
  const pageNumber = Number(page);
  if (!category || !Number.isInteger(pageNumber)) notFound();

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Accueil", path: "/" },
          { name: category.name, path: `/${category.slug}` },
          { name: `Page ${page}`, path: `/${category.slug}/page/${page}` },
        ])}
      />
      <CategoryView category={category} page={pageNumber} />
    </>
  );
}
