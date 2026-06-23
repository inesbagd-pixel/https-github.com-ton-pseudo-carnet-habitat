/**
 * Définition des catégories éditoriales du magazine.
 * Chaque article référence l'une de ces catégories via son slug.
 */

export type CategorySlug =
  | "maison"
  | "travaux"
  | "jardin"
  | "energie"
  | "decoration"
  | "exterieurs";

export interface Category {
  slug: CategorySlug;
  name: string;
  /** Titre H1 / titre SEO de la page catégorie. */
  title: string;
  /** Introduction éditoriale optimisée SEO en tête de page catégorie. */
  intro: string;
  /** Meta description de la page catégorie. */
  description: string;
  /** Image d'illustration de la catégorie (carte d'accueil + en-tête). */
  image: string;
  /** Accroche courte affichée sur les cartes de catégorie. */
  blurb: string;
  /** Accent couleur : "sage" ou "terracotta". */
  accent: "sage" | "terracotta";
}

export const categories: Category[] = [
  {
    slug: "maison",
    name: "Maison",
    title: "Maison : entretien, organisation et confort au quotidien",
    blurb: "Entretenir, organiser et améliorer chaque pièce de la maison.",
    intro:
      "De la cave au grenier, la rubrique Maison rassemble nos conseils pratiques pour entretenir votre logement, gagner en organisation et améliorer votre confort au quotidien. Humidité, rangement, petites réparations, qualité de l'air : des guides clairs et vérifiés pour vivre mieux chez soi, sans se ruiner.",
    description:
      "Conseils pratiques pour entretenir, organiser et améliorer votre maison : lutte contre l'humidité, rangement, confort et petites réparations du quotidien.",
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1600&q=70",
    accent: "sage",
  },
  {
    slug: "travaux",
    name: "Travaux",
    title: "Travaux : rénovation, gros œuvre et second œuvre expliqués",
    blurb: "Rénover sereinement, du diagnostic au choix des artisans.",
    intro:
      "Refaire une toiture, isoler des combles, repérer un défaut de structure : la rubrique Travaux décrypte la rénovation pour vous aider à prendre les bonnes décisions. Nous expliquons les étapes, les ordres de grandeur de budget et les signaux d'alerte, afin que vous abordiez chaque chantier avec sérénité et les bonnes questions.",
    description:
      "Guides de rénovation et de travaux : toiture, isolation, diagnostic, second œuvre et conseils pour bien préparer et suivre votre chantier.",
    image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=70",
    accent: "terracotta",
  },
  {
    slug: "jardin",
    name: "Jardin",
    title: "Jardin : entretien, terrasse et espaces extérieurs",
    blurb: "Entretenir son extérieur et profiter d'un jardin durable.",
    intro:
      "Pelouse, terrasse en bois, potager ou simple balcon : la rubrique Jardin vous accompagne pour entretenir et embellir vos espaces extérieurs au fil des saisons. Des gestes simples, respectueux des plantes et du sol, pour profiter d'un extérieur sain et accueillant sans y passer tous vos week-ends.",
    description:
      "Conseils jardin et extérieurs : entretien de la pelouse, nettoyage des terrasses en bois, plantation et soin des espaces verts au fil des saisons.",
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=1600&q=70",
    accent: "sage",
  },
  {
    slug: "energie",
    name: "Énergie",
    title: "Énergie : chauffage, isolation et économies durables",
    blurb: "Maîtriser sa consommation et gagner en confort thermique.",
    intro:
      "Réduire sa facture sans sacrifier son confort, c'est possible avec les bons réglages et les bons équipements. La rubrique Énergie vous aide à comprendre votre consommation, à choisir un chauffage adapté et à investir intelligemment dans l'efficacité énergétique de votre logement, chiffres et repères à l'appui.",
    description:
      "Économies d'énergie et confort thermique : réduire sa consommation de chauffage, choisir un thermostat connecté et améliorer l'efficacité de son logement.",
    image:
      "https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?auto=format&fit=crop&w=1600&q=70",
    accent: "terracotta",
  },
  {
    slug: "decoration",
    name: "Décoration",
    title: "Décoration : aménagement, couleurs et lumière",
    blurb: "Aménager des intérieurs lumineux, harmonieux et durables.",
    intro:
      "La décoration n'est pas qu'une affaire de tendances : c'est l'art d'organiser l'espace, la lumière et les couleurs pour s'y sentir bien. La rubrique Décoration partage des idées d'aménagement intemporelles, des palettes harmonieuses et des conseils concrets pour révéler le potentiel de chaque pièce, du salon à la chambre.",
    description:
      "Idées déco et aménagement : salons lumineux, palettes de couleurs apaisantes, choix des matières et agencement de chaque pièce de la maison.",
    image:
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1600&q=70",
    accent: "terracotta",
  },
  {
    slug: "exterieurs",
    name: "Extérieurs",
    title: "Extérieurs : terrasses, pergolas, clôtures et aménagement",
    blurb: "Concevoir et aménager des espaces extérieurs durables.",
    intro:
      "Prolongement naturel de la maison, les espaces extérieurs méritent autant d'attention que l'intérieur. La rubrique Extérieurs réunit nos guides pour concevoir, installer et entretenir terrasses, pergolas, clôtures, portails, abris de jardin, carports et allées. Des conseils concrets sur les matériaux, les budgets et la pose, pour aménager un extérieur cohérent, fonctionnel et durable, qu'il s'agisse d'un grand jardin ou d'une petite cour.",
    description:
      "Aménagement extérieur : guides sur les terrasses, pergolas, clôtures, portails, abris de jardin, carports et allées — matériaux, budget et installation.",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=70",
    accent: "sage",
  },
];

export const categoryMap: Record<CategorySlug, Category> = categories.reduce(
  (acc, c) => {
    acc[c.slug] = c;
    return acc;
  },
  {} as Record<CategorySlug, Category>,
);

export function getCategory(slug: string): Category | undefined {
  return categoryMap[slug as CategorySlug];
}

export function isCategorySlug(slug: string): slug is CategorySlug {
  return slug in categoryMap;
}
