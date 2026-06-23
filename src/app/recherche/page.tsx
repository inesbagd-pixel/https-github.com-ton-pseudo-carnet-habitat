import type { Metadata } from "next";
import { getSearchIndex } from "@/lib/search";
import { buildMetadata } from "@/lib/seo";
import { PageHeader } from "@/components/PageHeader";
import { SearchPageClient } from "@/components/search/SearchPageClient";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export const metadata: Metadata = buildMetadata({
  title: "Rechercher un article",
  description:
    "Recherchez parmi tous les guides Carnet Habitat : maison, travaux, jardin, énergie et décoration.",
  path: "/recherche",
  noIndex: true,
});

export default async function SearchPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const index = getSearchIndex();

  return (
    <>
      <PageHeader
        eyebrow="Recherche"
        title="Trouver un guide"
        lead="Parcourez l'ensemble de nos articles par mot-clé, thème ou rubrique."
        crumbs={[
          { name: "Accueil", path: "/" },
          { name: "Recherche", path: "/recherche" },
        ]}
      />
      <section className="container-editorial py-12">
        <div className="mx-auto max-w-2xl">
          <SearchPageClient index={index} initialQuery={q ?? ""} />
        </div>
      </section>
    </>
  );
}
