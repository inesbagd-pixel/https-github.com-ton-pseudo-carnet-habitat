import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { categories, getCategory } from "@/lib/categories";
import { buildMetadata, breadcrumbSchema, collectionPageSchema } from "@/lib/seo";
import { CategoryView } from "@/components/CategoryView";
import { JsonLd } from "@/components/JsonLd";

interface PageProps {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return buildMetadata({
    title: category.title,
    description: category.description,
    path: `/${category.slug}`,
    ogImage: category.image,
  });
}

export default async function CategoryPage({ params }: PageProps) {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  return (
    <>
      <JsonLd
        data={[
          collectionPageSchema({
            name: category.title,
            description: category.description,
            path: `/${category.slug}`,
          }),
          breadcrumbSchema([
            { name: "Accueil", path: "/" },
            { name: category.name, path: `/${category.slug}` },
          ]),
        ]}
      />
      <CategoryView category={category} page={1} />
    </>
  );
}
