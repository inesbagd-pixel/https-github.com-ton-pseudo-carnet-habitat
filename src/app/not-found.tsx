import Link from "next/link";
import { categories } from "@/lib/categories";
import { ArrowRightIcon } from "@/components/icons";

export default function NotFound() {
  return (
    <section className="container-editorial flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <span className="eyebrow">Erreur 404</span>
      <h1 className="mt-3 font-serif text-4xl font-semibold text-ink sm:text-5xl">
        Cette page est introuvable
      </h1>
      <p className="mt-4 max-w-md text-ink-soft">
        La page que vous cherchez a peut-être été déplacée ou n'existe plus.
        Reprenons la visite depuis l'une de nos rubriques.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-bg transition-colors hover:bg-sage-dark"
      >
        Retour à l'accueil
        <ArrowRightIcon className="h-4 w-4" />
      </Link>
      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/${c.slug}`}
            className="rounded-full border border-line px-4 py-2 text-sm text-ink-soft transition-colors hover:border-sage hover:text-ink"
          >
            {c.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
