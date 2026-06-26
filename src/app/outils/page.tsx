import type { Metadata } from "next";
import Link from "next/link";
import {
  buildMetadata,
  breadcrumbSchema,
  collectionPageSchema,
} from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { PageHeader } from "@/components/PageHeader";
import { Newsletter } from "@/components/Newsletter";
import { ToolsIcon, ArrowRightIcon } from "@/components/icons";

const PATH = "/outils";
const TITLE = "Outils habitat : préparez vos projets de maison gratuitement";
const DESCRIPTION =
  "Les outils gratuits de Carnet Habitat pour préparer vos projets : planificateur de rénovation, aide à la décision et checklists. Sans inscription, calcul local, respect de votre vie privée.";

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

interface ToolEntry {
  href: string;
  title: string;
  description: string;
  badge: string;
  available: boolean;
}

const TOOLS: ToolEntry[] = [
  {
    href: "/outils/planificateur-renovation",
    title: "Planificateur de rénovation",
    description:
      "Décrivez votre logement et votre projet, obtenez un plan personnalisé : étapes dans le bon ordre, prérequis, points de vigilance, durée, checklist et guides à lire.",
    badge: "Nouveau",
    available: true,
  },
];

export default function OutilsPage() {
  const crumbs = [
    { name: "Accueil", path: "/" },
    { name: "Outils", path: PATH },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          collectionPageSchema({
            name: "Outils habitat",
            description: DESCRIPTION,
            path: PATH,
          }),
        ]}
      />

      <PageHeader
        eyebrow="Outils habitat"
        title="Des outils pour préparer vos projets"
        lead="Au-delà de nos guides, Carnet Habitat met à votre disposition des outils gratuits pour vous aider à décider et à passer à l'action. Sans inscription, sans publicité : vos réponses sont calculées localement et ne quittent jamais votre appareil."
        crumbs={crumbs}
      />

      <section className="container-editorial py-14">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group flex flex-col rounded-2xl border border-line bg-bg p-6 transition-colors hover:border-sage hover:bg-sage-soft/30 sm:p-7"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-sage-soft text-sage-dark">
                  <ToolsIcon className="h-5 w-5" />
                </span>
                <span className="rounded-full bg-terracotta-soft px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wide text-terracotta-dark">
                  {tool.badge}
                </span>
              </div>
              <h2 className="mt-5 font-serif text-xl font-semibold text-ink">
                {tool.title}
              </h2>
              <p className="mt-2 flex-1 text-[0.95rem] leading-relaxed text-ink-soft">
                {tool.description}
              </p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-sage-dark">
                Ouvrir l&apos;outil
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}

          {/* Emplacement pour de futurs outils */}
          <div className="flex flex-col justify-center rounded-2xl border border-dashed border-line bg-bg-muted/50 p-6 text-center sm:p-7">
            <p className="font-serif text-lg font-medium text-ink">
              D&apos;autres outils arrivent
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Simulateurs d&apos;économies d&apos;énergie, checklists de chantier,
              aides au choix des matériaux… Abonnez-vous pour être prévenu.
            </p>
          </div>
        </div>
      </section>

      <section className="container-editorial pb-20">
        <Newsletter />
      </section>
    </>
  );
}
