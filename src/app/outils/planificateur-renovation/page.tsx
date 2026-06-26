import type { Metadata } from "next";
import Link from "next/link";
import {
  buildMetadata,
  breadcrumbSchema,
  webApplicationSchema,
  howToSchema,
  faqSchema,
} from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { PageHeader } from "@/components/PageHeader";
import { Faq } from "@/components/article/Faq";
import { Newsletter } from "@/components/Newsletter";
import { RenovationPlanner } from "@/components/outils/RenovationPlanner";
import { getGuideLinkMap } from "@/lib/articles";
import type { FaqItem } from "@/lib/articles";

const PATH = "/outils/planificateur-renovation";
const TITLE = "Planificateur de rénovation : créez votre plan de travaux gratuit";
const DESCRIPTION =
  "Outil gratuit pour préparer votre rénovation : répondez à 6 questions et obtenez un plan personnalisé — étapes dans le bon ordre, points de vigilance, durée, checklist et guides. Sans inscription.";

export const metadata: Metadata = buildMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
});

const HOWTO_STEPS = [
  {
    name: "Décrire son logement",
    text: "Indiquez le type de logement, l'année de construction et la surface : ces éléments déterminent l'ordre des travaux et les diagnostics à prévoir.",
  },
  {
    name: "Choisir son projet",
    text: "Sélectionnez le chantier principal (isolation, toiture, chauffage, ventilation, salle de bain, cuisine, extérieur ou rénovation complète).",
  },
  {
    name: "Préciser budget et priorité",
    text: "Donnez une fourchette de budget et votre objectif principal (économies d'énergie, confort, valorisation ou esthétique).",
  },
  {
    name: "Obtenir son plan personnalisé",
    text: "Le planificateur génère un plan : prérequis, étapes ordonnées, points de vigilance, erreurs fréquentes, durée estimée, checklist et guides à lire.",
  },
];

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Le planificateur de rénovation est-il gratuit ?",
    answer:
      "Oui, l'outil est entièrement gratuit et sans inscription. Vous répondez à quelques questions et obtenez immédiatement un plan personnalisé, que vous pouvez imprimer ou enregistrer en PDF.",
  },
  {
    question: "Comment le plan est-il généré ?",
    answer:
      "Le plan repose sur des règles métier inspirées des bonnes pratiques du bâtiment : ordre logique des travaux, diagnostics réglementaires selon l'âge du logement, cohérence entre isolation, ventilation et chauffage. Aucun service externe ni intelligence artificielle n'est utilisé : tout est calculé dans votre navigateur, vos réponses ne quittent pas votre appareil.",
  },
  {
    question: "Le plan remplace-t-il l'avis d'un professionnel ?",
    answer:
      "Non. Le plan vous aide à prioriser vos travaux et à poser les bonnes questions, mais il ne remplace ni un diagnostic technique, ni un devis. Pour chiffrer précisément votre projet, faites appel à des artisans qualifiés, idéalement certifiés RGE pour conserver vos droits aux aides.",
  },
  {
    question: "Dans quel ordre faut-il réaliser des travaux de rénovation ?",
    answer:
      "La règle d'or : sécuriser d'abord le clos et le couvert (toiture, façade, menuiseries), traiter l'humidité, puis isoler et ventiler, ensuite refaire les réseaux (électricité, plomberie, chauffage), et terminer par les cloisons et les finitions. Commencer par la décoration est l'erreur la plus coûteuse.",
  },
  {
    question: "Quels travaux privilégier pour faire des économies d'énergie ?",
    answer:
      "On commence presque toujours par l'isolation des combles, le poste le plus rentable, puis les murs, les menuiseries et les planchers bas. On adapte ensuite la ventilation et, en dernier, le système de chauffage, que l'on peut alors dimensionner plus juste — donc moins cher.",
  },
  {
    question: "Puis-je partager ou conserver mon plan ?",
    answer:
      "Oui. Vous pouvez imprimer votre plan, l'enregistrer en PDF depuis la fenêtre d'impression, ou copier le lien : il contient vos réponses et permet de retrouver le même plan, idéal pour le partager avec un proche ou un artisan.",
  },
];

export default function PlanificateurRenovationPage() {
  const guides = getGuideLinkMap();
  const currentYear = new Date().getFullYear();

  const crumbs = [
    { name: "Accueil", path: "/" },
    { name: "Outils", path: "/outils" },
    { name: "Planificateur de rénovation", path: PATH },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          webApplicationSchema({
            name: "Planificateur de rénovation",
            description: DESCRIPTION,
            path: PATH,
          }),
          howToSchema({
            name: "Préparer son projet de rénovation",
            description:
              "Méthode en 4 temps pour bâtir un plan de rénovation cohérent grâce au planificateur Carnet Habitat.",
            steps: HOWTO_STEPS,
          }),
          faqSchema(FAQ_ITEMS) ?? {},
        ]}
      />

      <div className="no-print">
        <PageHeader
          eyebrow="Outils habitat"
          title="Planificateur de rénovation"
          lead="Répondez à six questions et obtenez en quelques secondes un plan de rénovation personnalisé : les étapes dans le bon ordre, les points de vigilance, les erreurs à éviter, une estimation de durée et une checklist à suivre. Gratuit, sans inscription, sans appel à un service externe."
          crumbs={crumbs}
        />
      </div>

      {/* L'outil interactif */}
      <section className="container-editorial py-14">
        <RenovationPlanner guides={guides} currentYear={currentYear} />
      </section>

      {/* Contenu éditorial (SEO) */}
      <section className="no-print border-t border-line bg-bg-muted">
        <div className="container-editorial py-16">
          <div className="prose-editorial mx-auto max-w-prose">
            <h2>Pourquoi planifier sa rénovation avant de commencer&nbsp;?</h2>
            <p>
              La réussite d&apos;une rénovation se joue rarement sur le choix
              d&apos;un matériau ou d&apos;une couleur&nbsp;: elle se joue sur la{" "}
              <strong>méthode</strong> et sur l&apos;<strong>ordre des
              travaux</strong>. Engager des dépenses dans le désordre, c&apos;est
              prendre le risque de défaire ce que l&apos;on vient de faire&nbsp;:
              repeindre une pièce avant de refaire l&apos;électricité, isoler
              sous une toiture qui fuit, installer un chauffage neuf dans une
              passoire thermique. Le <strong>planificateur de rénovation</strong>{" "}
              de Carnet Habitat a été conçu pour vous éviter ces erreurs
              coûteuses en vous donnant, dès le départ, une vision claire et
              ordonnée de votre projet.
            </p>
            <p>
              Contrairement à un simple calculateur de budget, cet outil ne se
              contente pas d&apos;afficher un chiffre. À partir de votre type de
              logement, de son année de construction, de sa surface, de votre
              projet, de votre budget et de votre priorité, il construit un{" "}
              <strong>plan logique</strong>&nbsp;: ce qu&apos;il faut faire en
              premier, ce qui peut attendre, ce à quoi prêter attention et les
              pièges dans lesquels tombent le plus souvent les particuliers.
            </p>

            <h2>Le bon ordre des travaux, étape par étape</h2>
            <p>
              Tous les professionnels du bâtiment s&apos;accordent sur une
              logique commune, que le planificateur applique et adapte à votre
              situation. On commence par <strong>sécuriser le clos et le
              couvert</strong>&nbsp;: la toiture, la charpente, la façade et les
              menuiseries extérieures doivent être saines avant tout. Un
              logement «&nbsp;hors d&apos;eau, hors d&apos;air&nbsp;» est la
              condition de tout le reste. Notre{" "}
              <Link href="/travaux/guide-toiture">guide de la toiture</Link>{" "}
              détaille les signes qui doivent alerter.
            </p>
            <p>
              Vient ensuite le traitement de l&apos;<strong>humidité</strong>.
              Inutile d&apos;isoler ou de refaire des murs si une remontée
              capillaire ou un défaut de ventilation ronge le bâti&nbsp;: nos
              articles sur{" "}
              <Link href="/maison/traiter-humidite-maison">
                le traitement de l&apos;humidité
              </Link>{" "}
              expliquent comment identifier la cause avant d&apos;agir. On
              s&apos;attaque alors à l&apos;<strong>enveloppe thermique</strong>
              &nbsp;: l&apos;
              <Link href="/travaux/guide-isolation-maison">isolation</Link> des
              combles, des murs, des fenêtres puis des planchers, dans cet ordre
              de rentabilité. L&apos;isolation va de pair avec la{" "}
              <Link href="/maison/vmc-simple-flux-double-flux">ventilation</Link>
              &nbsp;: une enveloppe plus étanche exige un renouvellement
              d&apos;air maîtrisé, sous peine de condensation.
            </p>
            <p>
              Ce n&apos;est qu&apos;ensuite que l&apos;on rénove les{" "}
              <strong>réseaux</strong> (électricité, plomberie,{" "}
              <Link href="/energie/guide-chauffage-maison">chauffage</Link>),
              que l&apos;on monte les <strong>cloisons</strong> et que l&apos;on
              applique enfin les <strong>finitions</strong>&nbsp;: sols,
              peintures, cuisine et salle de bain. Installer le chauffage en
              dernier, une fois le logement isolé, permet de le{" "}
              <strong>dimensionner au plus juste</strong> et de réduire la
              facture d&apos;investissement comme de fonctionnement.
            </p>

            <h2>Un plan adapté à votre logement</h2>
            <p>
              L&apos;année de construction change tout. Un logement{" "}
              <strong>antérieur à 1997</strong> peut contenir de l&apos;amiante
              et impose un repérage avant certains travaux&nbsp;; un bâti{" "}
              <strong>antérieur à 1949</strong> peut receler des peintures au
              plomb. Les constructions <strong>d&apos;avant 1975</strong>, bâties
              avant la première réglementation thermique, sont souvent des
              passoires énergétiques où l&apos;isolation devient prioritaire. À
              l&apos;inverse, une maison récente nécessitera surtout des
              ajustements de confort. Le planificateur intègre ces seuils pour
              ajuster les prérequis et les points de vigilance de votre plan.
            </p>
            <p>
              Le type de logement compte aussi. En <strong>appartement</strong>,
              une partie des travaux (toiture, façade, parfois ventilation
              collective) relève de la <strong>copropriété</strong> et doit être
              votée en assemblée générale&nbsp;: un délai à anticiper très en
              amont. En <strong>maison individuelle</strong>, vous gardez la main
              sur l&apos;ensemble, mais certaines modifications extérieures
              exigent une déclaration préalable en mairie.
            </p>

            <h2>Priorité et budget&nbsp;: arbitrer intelligemment</h2>
            <p>
              Votre <strong>priorité</strong> oriente les recommandations. Pour
              des <strong>économies d&apos;énergie</strong>, le plan met
              l&apos;accent sur l&apos;isolation, la ventilation et un meilleur{" "}
              <Link href="/energie/comprendre-dpe-logement">
                diagnostic de performance énergétique (DPE)
              </Link>
              , ainsi que sur les aides mobilisables (MaPrimeRénov&apos;, CEE,
              éco-PTZ) qui supposent des devis établis <em>avant</em> le début
              des travaux et des artisans certifiés RGE. Pour la{" "}
              <strong>valorisation du bien</strong>, l&apos;étiquette énergétique
              et la rénovation des pièces d&apos;eau pèsent lourd à la revente.
              Pour le <strong>confort</strong>, on soigne la régulation
              thermique et la qualité de l&apos;air&nbsp;; pour l&apos;
              <strong>esthétique</strong>, les finitions interviennent en bout de
              parcours, une fois l&apos;essentiel assaini.
            </p>
            <p>
              Le <strong>budget</strong> sert de garde-fou. Plutôt que de
              disperser un budget modeste sur plusieurs chantiers à moitié faits,
              mieux vaut traiter un poste prioritaire de bout en bout. Sur une
              rénovation complète, le planificateur rappelle de conserver une{" "}
              <strong>marge de 10 à 15&nbsp;%</strong> pour les imprévus, presque
              inévitables dès que l&apos;on ouvre les murs d&apos;un logement
              ancien. Et dans tous les cas&nbsp;: multipliez les devis. L&apos;
              écart entre deux artisans dépasse fréquemment 30&nbsp;% à
              prestation comparable, comme le rappelle notre guide pour{" "}
              <Link href="/travaux/choisir-artisan-renovation">
                bien choisir ses artisans
              </Link>
              .
            </p>

            <h2>Imprimer, exporter et partager votre plan</h2>
            <p>
              Une fois votre plan généré, vous pouvez l&apos;<strong>imprimer
              </strong> ou l&apos;<strong>enregistrer en PDF</strong> en un clic,
              pour le glisser dans votre dossier de travaux ou le présenter à un
              professionnel. La <strong>checklist interactive</strong> vous
              permet de cocher les démarches au fur et à mesure, et le bouton de
              partage copie un lien contenant vos réponses&nbsp;: vos proches
              retrouveront exactement le même plan. Aucune donnée n&apos;est
              envoyée à un serveur&nbsp;: tout est calculé localement, dans votre
              navigateur, pour un outil rapide et respectueux de votre vie
              privée.
            </p>
            <p>
              Le planificateur n&apos;est qu&apos;un point de départ. Chaque
              étape qu&apos;il recommande renvoie vers nos{" "}
              <Link href="/outils">guides de référence</Link> détaillés, pour
              approfondir, comparer les solutions et avancer en confiance. Bonne
              rénovation&nbsp;!
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-prose">
            <Faq items={FAQ_ITEMS} />
          </div>
        </div>
      </section>

      <section className="no-print container-editorial py-16">
        <Newsletter />
      </section>
    </>
  );
}
