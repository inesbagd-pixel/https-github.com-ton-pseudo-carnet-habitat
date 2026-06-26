import Link from "next/link";
import type { ArticleSummary } from "@/lib/articles";
import { ArrowRightIcon, ChevronRightIcon } from "@/components/icons";

/**
 * Bandeau affiché sur un article satellite : renvoie vers la page pilier
 * du silo (renforce le maillage interne vers les pages stratégiques).
 */
export function PillarBanner({ pillar }: { pillar: ArticleSummary }) {
  return (
    <aside className="my-10 rounded-xl border border-line bg-bg-muted p-5 sm:p-6">
      <p className="eyebrow text-[0.65rem]">Dossier complet</p>
      <p className="mt-2 font-serif text-lg font-medium text-ink">
        Cet article fait partie de notre guide de référence.
      </p>
      <Link
        href={`/${pillar.category}/${pillar.slug}`}
        className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-sage-dark transition-colors hover:text-ink"
      >
        Lire {pillar.title}
        <ArrowRightIcon className="h-4 w-4" />
      </Link>
    </aside>
  );
}

/**
 * Liste des articles du silo, affichée sur la page pilier.
 */
export function SiloNav({
  articles,
  title = "Les articles de ce dossier",
}: {
  articles: ArticleSummary[];
  title?: string;
}) {
  if (articles.length === 0) return null;
  return (
    <section className="mt-14 rounded-xl border border-line bg-bg-muted p-6 sm:p-8">
      <span className="eyebrow">Dans ce dossier</span>
      <h2 className="mt-2 font-serif text-2xl font-semibold text-ink">{title}</h2>
      <ul className="mt-5 divide-y divide-line">
        {articles.map((a) => (
          <li key={a.slug}>
            <Link
              href={`/${a.category}/${a.slug}`}
              className="group flex items-center justify-between gap-4 py-3.5"
            >
              <span className="font-serif text-[1.05rem] font-medium text-ink">
                <span className="link-underline">{a.title}</span>
              </span>
              <ChevronRightIcon className="h-4 w-4 shrink-0 text-ink-faint transition-transform group-hover:translate-x-0.5" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
