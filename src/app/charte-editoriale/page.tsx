import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { PageHeader } from "@/components/PageHeader";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = buildMetadata({
  title: "Charte éditoriale",
  description:
    "La méthodologie de Carnet Habitat : indépendance, sources, vérification, mise à jour et transparence. Comment nous produisons des contenus habitat fiables.",
  path: "/charte-editoriale",
});

const principles = [
  {
    title: "Indépendance",
    text: "Nos contenus sont rédigés sans contrepartie financière d'aucune marque. Aucun annonceur ne décide de nos sujets ni n'oriente nos recommandations. Lorsqu'un partenariat éditorial existe, il est clairement signalé au lecteur.",
  },
  {
    title: "Utilité avant tout",
    text: "Nous écrivons pour répondre à une question concrète, pas pour remplir une page. Chaque guide vise à aider le lecteur à décider, entretenir ou aménager, avec des informations directement actionnables.",
  },
  {
    title: "Vérification",
    text: "Les informations techniques sont recoupées avec des sources fiables et l'expérience de praticiens (artisans, architectes d'intérieur, conseillers en énergie). Nous préférons une formulation prudente à une affirmation hasardeuse.",
  },
  {
    title: "Transparence",
    text: "Chaque article est signé par un membre identifié de la rédaction, dont vous pouvez consulter le parcours et les autres publications. La date de publication et de mise à jour est affichée.",
  },
];

export default function ChartePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Accueil", path: "/" },
          { name: "Charte éditoriale", path: "/charte-editoriale" },
        ])}
      />
      <PageHeader
        eyebrow="Notre méthode"
        title="Charte éditoriale"
        lead="Carnet Habitat applique une démarche rigoureuse et transparente. Voici comment nous concevons, vérifions et faisons vivre nos contenus."
        crumbs={[
          { name: "Accueil", path: "/" },
          { name: "Charte éditoriale", path: "/charte-editoriale" },
        ]}
      />

      <section className="container-editorial py-14">
        <div className="mx-auto max-w-4xl">
          {/* Principes */}
          <div className="grid gap-5 sm:grid-cols-2">
            {principles.map((p) => (
              <div
                key={p.title}
                className="rounded-xl border border-line bg-bg-muted p-6"
              >
                <h2 className="font-serif text-lg font-semibold text-ink">
                  {p.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {p.text}
                </p>
              </div>
            ))}
          </div>

          {/* Méthodologie détaillée */}
          <div className="prose-editorial mt-14">
            <h2>Notre processus de rédaction</h2>
            <p>
              Chaque article suit les mêmes étapes, de l'idée à la publication,
              afin de garantir un niveau de qualité homogène sur l'ensemble du
              magazine.
            </p>
            <ol>
              <li>
                <strong>Choix du sujet.</strong> Nous partons des questions
                réelles que se posent les lecteurs : entretien, travaux,
                aménagement, économies d'énergie. Un sujet n'est retenu que s'il
                apporte une valeur concrète.
              </li>
              <li>
                <strong>Recherche et documentation.</strong> Nous consultons des
                sources fiables, la réglementation en vigueur et l'expérience de
                professionnels du secteur.
              </li>
              <li>
                <strong>Rédaction.</strong> L'article est structuré pour être
                clair et lisible : un sujet par section, des repères concrets,
                pas de jargon inutile.
              </li>
              <li>
                <strong>Relecture.</strong> Chaque texte est relu pour vérifier
                l'exactitude des informations, la clarté et la cohérence avec nos
                autres contenus.
              </li>
              <li>
                <strong>Mise à jour.</strong> Les guides sont révisés lorsque les
                pratiques, les techniques ou la réglementation évoluent. La date
                de mise à jour est indiquée.
              </li>
            </ol>

            <h2>Nos sources</h2>
            <p>
              Nous privilégions les sources officielles et reconnues (organismes
              publics, documentation technique, normes), complétées par le
              savoir-faire de praticiens. Lorsqu'un sujet relève d'un domaine
              réglementé ou évolutif — aides financières, urbanisme, normes
              électriques —, nous renvoyons vers les organismes compétents
              plutôt que de donner une information susceptible de se périmer.
            </p>

            <h2>Nos limites</h2>
            <p>
              Nos contenus ont une vocation informative et pédagogique. Ils ne
              remplacent pas l'avis d'un professionnel qualifié pour un projet
              précis. Pour des travaux engageant la sécurité ou la structure du
              bâti, nous recommandons systématiquement de faire appel à un
              spécialiste.
            </p>

            <h2>Corrections</h2>
            <p>
              Personne n'est à l'abri d'une imprécision. Si vous repérez une
              erreur, signalez-la nous : nous corrigeons rapidement et
              indiquons, le cas échéant, la mise à jour. Écrivez-nous à{" "}
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
            </p>

            <h2>Publicité et partenariats</h2>
            <p>
              Carnet Habitat peut être amené à nouer des partenariats éditoriaux.
              Dans ce cas, le contenu concerné est explicitement identifié comme
              tel et reste soumis à nos exigences de qualité et d'honnêteté
              envers le lecteur. Nos recommandations ne sont jamais conditionnées
              à une rémunération.
            </p>
          </div>

          <div className="mt-12 rounded-xl border border-line bg-sage-soft/40 p-7 text-center">
            <p className="text-ink-soft">
              Une question sur notre démarche ?{" "}
              <Link
                href="/contact"
                className="font-medium text-sage-dark underline underline-offset-2 hover:text-ink"
              >
                Contactez la rédaction
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
