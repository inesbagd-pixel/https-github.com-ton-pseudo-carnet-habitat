import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { authors } from "@/lib/authors";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { PageHeader } from "@/components/PageHeader";
import { JsonLd } from "@/components/JsonLd";
import { Newsletter } from "@/components/Newsletter";
import { ArrowRightIcon } from "@/components/icons";

export const metadata: Metadata = buildMetadata({
  title: "À propos de Carnet Habitat",
  description:
    "Carnet Habitat est un magazine en ligne indépendant dédié à l'habitat : maison, travaux, jardin, énergie et décoration. Découvrez notre démarche et notre équipe.",
  path: "/a-propos",
});

const values = [
  {
    title: "Des conseils vérifiés",
    text: "Chaque guide est documenté, relu et confronté à l'expérience de professionnels du bâtiment, du jardin ou de l'énergie.",
  },
  {
    title: "Une indépendance totale",
    text: "Nos contenus sont écrits sans contrepartie : aucune marque ne dicte nos recommandations. L'intérêt du lecteur prime.",
  },
  {
    title: "Une exigence éditoriale",
    text: "Nous privilégions la clarté, la précision et l'utilité concrète à la course aux tendances ou au volume.",
  },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Accueil", path: "/" },
          { name: "À propos", path: "/a-propos" },
        ])}
      />
      <PageHeader
        eyebrow="À propos"
        title="Le magazine de celles et ceux qui aiment leur logement"
        lead={`${siteConfig.tagline} Carnet Habitat accompagne les particuliers à chaque étape de la vie de leur maison.`}
        crumbs={[
          { name: "Accueil", path: "/" },
          { name: "À propos", path: "/a-propos" },
        ]}
      />

      <section className="container-editorial py-14">
        <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[1.3fr_1fr]">
          <div className="prose-editorial">
            <p>
              <strong>Carnet Habitat</strong> est né d'un constat simple :
              améliorer son logement ne devrait pas être réservé aux initiés.
              Entre les forums contradictoires, les contenus sponsorisés et le
              jargon technique, il est souvent difficile de savoir par où
              commencer et à qui se fier.
            </p>
            <p>
              Nous avons voulu créer un média de référence, à la fois exigeant et
              accessible, qui réunit des journalistes spécialisés et des
              praticiens de terrain. Notre ligne éditoriale couvre cinq grands
              univers : la <Link href="/maison">maison</Link> au quotidien, les{" "}
              <Link href="/travaux">travaux</Link> et la rénovation, le{" "}
              <Link href="/jardin">jardin</Link> et les extérieurs, l'
              <Link href="/energie">énergie</Link> et le confort thermique, et
              enfin la <Link href="/decoration">décoration</Link> et
              l'aménagement.
            </p>
            <p>
              Chaque article est pensé comme un guide pratique : des explications
              claires, des repères concrets et des réponses aux questions que
              vous vous posez vraiment. Notre objectif n'est pas de vous vendre
              quoi que ce soit, mais de vous aider à décider en confiance.
            </p>
          </div>

          <aside className="space-y-5">
            {values.map((v) => (
              <div
                key={v.title}
                className="rounded-xl border border-line bg-bg-muted p-5"
              >
                <h2 className="font-serif text-lg font-semibold text-ink">
                  {v.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {v.text}
                </p>
              </div>
            ))}
          </aside>
        </div>
      </section>

      {/* Équipe */}
      <section className="border-t border-line bg-bg-muted">
        <div className="container-editorial py-16">
          <span className="eyebrow">La rédaction</span>
          <h2 className="mt-2 font-serif text-2xl font-semibold text-ink sm:text-3xl">
            Une équipe à votre service
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Object.values(authors).map((author) => (
              <div key={author.key} className="flex items-start gap-4">
                <Image
                  src={author.avatar}
                  alt={author.name}
                  width={64}
                  height={64}
                  className="h-16 w-16 shrink-0 rounded-full object-cover"
                />
                <div>
                  <p className="font-serif text-lg font-semibold text-ink">
                    {author.name}
                  </p>
                  <p className="text-xs uppercase tracking-wide text-terracotta-dark">
                    {author.role}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {author.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-editorial py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-2xl font-semibold text-ink">
            Une question, une suggestion de sujet ?
          </h2>
          <p className="mt-3 text-ink-soft">
            Nous lisons tous vos messages avec attention.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-bg transition-colors hover:bg-sage-dark"
          >
            Nous contacter
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="container-editorial pb-20">
        <Newsletter />
      </section>
    </>
  );
}
