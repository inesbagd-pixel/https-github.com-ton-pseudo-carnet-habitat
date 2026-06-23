import type { Metadata } from "next";
import { siteConfig } from "@/lib/site";
import { buildMetadata, breadcrumbSchema } from "@/lib/seo";
import { PageHeader } from "@/components/PageHeader";
import { JsonLd } from "@/components/JsonLd";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description:
    "Contactez la rédaction de Carnet Habitat : questions, suggestions de sujets, partenariats éditoriaux.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Accueil", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
      <PageHeader
        eyebrow="Contact"
        title="Écrivez-nous"
        lead="Une question, une remarque, une idée de sujet ou une proposition de partenariat éditorial ? La rédaction vous lit."
        crumbs={[
          { name: "Accueil", path: "/" },
          { name: "Contact", path: "/contact" },
        ]}
      />

      <section className="container-editorial py-14">
        <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <ContactForm />
          </div>
          <aside className="space-y-6">
            <div className="rounded-xl border border-line bg-bg-muted p-6">
              <h2 className="eyebrow">Par e-mail</h2>
              <a
                href={`mailto:${siteConfig.email}`}
                className="mt-2 block font-serif text-lg text-ink transition-colors hover:text-sage-dark"
              >
                {siteConfig.email}
              </a>
              <p className="mt-2 text-sm text-ink-soft">
                Nous répondons généralement sous deux jours ouvrés.
              </p>
            </div>
            <div className="rounded-xl border border-line bg-bg-muted p-6">
              <h2 className="eyebrow">Partenariats</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Vous représentez une marque ou une institution de l'habitat et
                souhaitez collaborer ? Précisez « Partenariat » dans l'objet de
                votre message.
              </p>
            </div>
            <div className="rounded-xl border border-line bg-bg-muted p-6">
              <h2 className="eyebrow">Suivez-nous</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                Retrouvez nos inspirations et nos guides sur nos réseaux sociaux,
                liés en bas de page.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
