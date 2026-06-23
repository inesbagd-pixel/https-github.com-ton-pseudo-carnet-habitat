import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { PageHeader } from "@/components/PageHeader";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = buildMetadata({
  title: "Mentions légales",
  description:
    "Mentions légales du magazine Carnet Habitat : éditeur, hébergeur, propriété intellectuelle et responsabilité.",
  path: "/mentions-legales",
});

export default function LegalPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Accueil", path: "/" },
          { name: "Mentions légales", path: "/mentions-legales" },
        ])}
      />
      <PageHeader
        title="Mentions légales"
        crumbs={[
          { name: "Accueil", path: "/" },
          { name: "Mentions légales", path: "/mentions-legales" },
        ]}
      />

      <section className="container-editorial py-14">
        <div className="prose-editorial mx-auto max-w-3xl">
          <p className="text-sm text-ink-faint">
            Dernière mise à jour : 1<sup>er</sup> janvier 2026.
          </p>

          <h2>Éditeur du site</h2>
          <p>
            Le site <strong>{siteConfig.name}</strong> est édité par Carnet
            Habitat, média éditorial indépendant consacré à l'habitat.
          </p>
          <ul>
            <li>Dénomination : {siteConfig.name}</li>
            <li>Statut : magazine en ligne (exemple de démonstration)</li>
            <li>
              Contact :{" "}
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            </li>
            <li>Directeur de la publication : la rédaction de Carnet Habitat</li>
          </ul>
          <p className="text-sm text-ink-faint">
            Les informations ci-dessus sont fournies à titre d'exemple dans le
            cadre d'un site de démonstration. Avant toute mise en production,
            renseignez les mentions obligatoires : raison sociale, forme
            juridique, capital, adresse du siège, RCS/SIREN et numéro de TVA le
            cas échéant.
          </p>

          <h2>Hébergement</h2>
          <p>
            Le site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut,
            CA 91789, États-Unis — <a href="https://vercel.com">vercel.com</a>.
          </p>

          <h2>Propriété intellectuelle</h2>
          <p>
            L'ensemble des contenus présents sur ce site (textes, illustrations,
            logo, charte graphique) est protégé par le droit de la propriété
            intellectuelle. Toute reproduction, représentation ou diffusion,
            totale ou partielle, sans autorisation écrite préalable est
            interdite et constituerait une contrefaçon.
          </p>
          <p>
            Les photographies d'illustration proviennent de banques d'images
            libres de droits et restent la propriété de leurs auteurs respectifs.
          </p>

          <h2>Responsabilité</h2>
          <p>
            Les informations publiées sur Carnet Habitat ont une vocation
            informative et pédagogique. Malgré le soin apporté à leur rédaction,
            elles ne sauraient se substituer à l'avis d'un professionnel qualifié
            pour vos projets de travaux, d'aménagement ou d'installation. Carnet
            Habitat ne saurait être tenu responsable des conséquences liées à
            l'utilisation des informations mises à disposition.
          </p>

          <h2>Liens externes</h2>
          <p>
            Le site peut contenir des liens vers des ressources externes. Carnet
            Habitat n'exerce aucun contrôle sur ces sites tiers et décline toute
            responsabilité quant à leur contenu.
          </p>

          <h2>Contact</h2>
          <p>
            Pour toute question relative à ces mentions légales, écrivez-nous à
            l'adresse <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
          </p>
        </div>
      </section>
    </>
  );
}
