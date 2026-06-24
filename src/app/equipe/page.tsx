import type { Metadata } from "next";
import Link from "next/link";
import { authors } from "@/lib/authors";
import { AuthorAvatar } from "@/components/AuthorAvatar";
import { getArticlesByAuthor } from "@/lib/articles";
import { formatDate } from "@/lib/format";
import {
  buildMetadata,
  breadcrumbSchema,
  personSchema,
} from "@/lib/seo";
import { PageHeader } from "@/components/PageHeader";
import { JsonLd } from "@/components/JsonLd";
import { ArrowRightIcon } from "@/components/icons";

export const metadata: Metadata = buildMetadata({
  title: "L'équipe de Carnet Habitat",
  description:
    "Découvrez les journalistes et experts de Carnet Habitat : leurs spécialités, leur parcours et l'ensemble de leurs articles publiés.",
  path: "/equipe",
});

export default function EquipePage() {
  const team = Object.values(authors);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Accueil", path: "/" },
            { name: "Équipe", path: "/equipe" },
          ]),
          ...team.map((a) => personSchema(a)),
        ]}
      />
      <PageHeader
        eyebrow="La rédaction"
        title="Les femmes et les hommes derrière Carnet Habitat"
        lead="Des journalistes spécialisés et des praticiens de terrain, réunis pour vous offrir des conseils habitat fiables, clairs et indépendants."
        crumbs={[
          { name: "Accueil", path: "/" },
          { name: "Équipe", path: "/equipe" },
        ]}
      />

      <section className="container-editorial py-14">
        <div className="mx-auto max-w-4xl space-y-16">
          {team.map((author) => {
            const articles = getArticlesByAuthor(author.key);
            return (
              <article
                key={author.key}
                id={author.key}
                className="scroll-mt-24 border-b border-line pb-16 last:border-0 last:pb-0"
              >
                <div className="grid gap-6 sm:grid-cols-[auto_1fr] sm:gap-8">
                  <AuthorAvatar
                    name={author.name}
                    className="h-28 w-28 text-3xl"
                  />
                  <div>
                    <h2 className="font-serif text-2xl font-semibold text-ink">
                      {author.name}
                    </h2>
                    <p className="mt-0.5 text-sm uppercase tracking-wide text-terracotta-dark">
                      {author.role}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {author.specialties.map((s) => (
                        <span
                          key={s}
                          className="rounded-full bg-sage-soft px-3 py-1 text-xs font-medium text-sage-dark"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                    <p className="mt-4 leading-relaxed text-ink-soft">
                      {author.bio}
                    </p>
                    <p className="mt-2 text-sm text-ink-faint">
                      Dans la rédaction depuis {author.since} ·{" "}
                      {articles.length} article{articles.length > 1 ? "s" : ""}{" "}
                      publié{articles.length > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                {articles.length > 0 && (
                  <div className="mt-7 sm:pl-[8.5rem]">
                    <h3 className="eyebrow mb-3">Ses articles</h3>
                    <ul className="divide-y divide-line">
                      {articles.map((a) => (
                        <li key={a.slug}>
                          <Link
                            href={`/${a.category}/${a.slug}`}
                            className="group flex items-center justify-between gap-4 py-3"
                          >
                            <span className="font-serif text-[1.02rem] text-ink">
                              <span className="link-underline">{a.title}</span>
                            </span>
                            <span className="hidden shrink-0 text-xs text-ink-faint sm:block">
                              {formatDate(a.date)}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        <div className="mx-auto mt-16 max-w-4xl rounded-xl border border-line bg-bg-muted p-7 text-center sm:p-9">
          <h2 className="font-serif text-xl font-semibold text-ink">
            Notre méthode de travail
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">
            Chaque article suit une démarche éditoriale rigoureuse : recherche,
            vérification et relecture. Découvrez notre charte éditoriale.
          </p>
          <Link
            href="/charte-editoriale"
            className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-sage-dark transition-colors hover:text-ink"
          >
            Lire la charte éditoriale
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
