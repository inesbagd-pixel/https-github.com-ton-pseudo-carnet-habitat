import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { PageHeader } from "@/components/PageHeader";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = buildMetadata({
  title: "Politique de confidentialité",
  description:
    "Politique de confidentialité de Carnet Habitat : données collectées, finalités, durée de conservation et vos droits (RGPD).",
  path: "/politique-de-confidentialite",
});

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Accueil", path: "/" },
          {
            name: "Politique de confidentialité",
            path: "/politique-de-confidentialite",
          },
        ])}
      />
      <PageHeader
        title="Politique de confidentialité"
        lead="Nous attachons une grande importance à la protection de vos données personnelles. Cette page explique quelles informations nous collectons et comment nous les utilisons."
        crumbs={[
          { name: "Accueil", path: "/" },
          {
            name: "Politique de confidentialité",
            path: "/politique-de-confidentialite",
          },
        ]}
      />

      <section className="container-editorial py-14">
        <div className="prose-editorial mx-auto max-w-3xl">
          <p className="text-sm text-ink-faint">
            Dernière mise à jour : 1<sup>er</sup> janvier 2026.
          </p>

          <h2>Responsable du traitement</h2>
          <p>
            Le responsable du traitement des données est l'éditeur du site{" "}
            <strong>{siteConfig.name}</strong>. Pour toute question relative à
            vos données, contactez-nous à{" "}
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
          </p>

          <h2>Données que nous collectons</h2>
          <p>Nous collectons uniquement les données strictement nécessaires :</p>
          <ul>
            <li>
              <strong>Inscription à la newsletter</strong> : votre adresse
              e-mail, afin de vous envoyer nos publications.
            </li>
            <li>
              <strong>Formulaire de contact</strong> : votre nom, votre adresse
              e-mail et le contenu de votre message, afin de vous répondre.
            </li>
            <li>
              <strong>Données de navigation</strong> : statistiques d'audience
              anonymisées, le cas échéant, pour améliorer le site.
            </li>
          </ul>

          <h2>Finalités et base légale</h2>
          <p>
            Vos données sont traitées sur la base de votre consentement (article
            6.1.a du RGPD) pour la newsletter, et de notre intérêt légitime à
            répondre à vos sollicitations pour le formulaire de contact. Elles ne
            sont jamais vendues ni cédées à des tiers à des fins commerciales.
          </p>

          <h2>Hébergement de la newsletter</h2>
          <p>
            La gestion des inscriptions à la newsletter peut être confiée à un
            prestataire spécialisé (par exemple Brevo), agissant en qualité de
            sous-traitant et respectant le RGPD. Vos données sont alors stockées
            au sein de l'Union européenne.
          </p>

          <h2>Durée de conservation</h2>
          <p>
            Les adresses e-mail des abonnés sont conservées jusqu'à votre
            désinscription. Les messages reçus via le formulaire de contact sont
            conservés le temps nécessaire au traitement de votre demande, puis
            archivés ou supprimés.
          </p>

          <h2>Cookies</h2>
          <p>
            Ce site privilégie une approche minimaliste. Seuls les cookies
            strictement nécessaires au fonctionnement et, le cas échéant, à la
            mesure d'audience anonymisée sont utilisés. Aucun cookie publicitaire
            de suivi n'est déposé sans votre consentement préalable.
          </p>

          <h2>Vos droits</h2>
          <p>
            Conformément au RGPD, vous disposez d'un droit d'accès, de
            rectification, d'effacement, de limitation, d'opposition et de
            portabilité de vos données. Vous pouvez exercer ces droits à tout
            moment en nous écrivant à{" "}
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>. Vous
            pouvez également introduire une réclamation auprès de la CNIL
            (www.cnil.fr).
          </p>

          <h2>Modifications</h2>
          <p>
            Cette politique de confidentialité peut être mise à jour. Toute
            modification sera publiée sur cette page avec une nouvelle date de
            mise à jour.
          </p>
        </div>
      </section>
    </>
  );
}
