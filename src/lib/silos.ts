/**
 * Silos éditoriaux (topic clusters).
 *
 * Chaque silo associe une PAGE PILIER (dossier de fond) à ses articles
 * « satellites ». Ce maillage alimente :
 *   - le bloc « Ce guide fait partie du dossier… » sur chaque article ;
 *   - la liste des articles du silo affichée sur la page pilier ;
 *   - la priorisation des articles liés (PageRank interne).
 *
 * Données pures (aucun import serveur) — la résolution en articles se fait
 * dans articles.ts / les composants serveur.
 */

import type { CategorySlug } from "./categories";

export interface Silo {
  /** Slug de la page pilier. */
  pillar: string;
  category: CategorySlug;
  /** Slugs des articles satellites du silo. */
  articles: string[];
}

export const silos: Silo[] = [
  {
    pillar: "guide-isolation-maison",
    category: "travaux",
    // Parcours de lecture : diagnostic → combles → murs → fenêtres →
    // planchers → matériaux → ponts thermiques → ventilation.
    articles: [
      "signes-mauvaise-isolation",
      "isoler-combles-perdus",
      "isoler-combles-amenages",
      "isolation-murs-ite-ou-iti",
      "isolation-fenetres-double-vitrage",
      "isoler-plancher-bas",
      "choisir-isolant-thermique",
      "isolants-biosources",
      "traiter-ponts-thermiques",
      "isolation-ventilation-humidite",
    ],
  },
  {
    pillar: "guide-renovation-maison",
    category: "travaux",
    articles: [
      "renover-salle-de-bain-etapes",
      "choisir-artisan-renovation",
      "quand-refaire-toiture",
      "desencombrer-maison-methode",
    ],
  },
  {
    pillar: "guide-toiture",
    category: "travaux",
    articles: ["quand-refaire-toiture", "signes-mauvaise-isolation"],
  },
  {
    pillar: "guide-chauffage-maison",
    category: "energie",
    articles: [
      "reduire-consommation-chauffage",
      "bien-choisir-thermostat-connecte",
      "isoler-combles-perdus",
      "comprendre-dpe-logement",
    ],
  },
  {
    pillar: "guide-entretien-jardin",
    category: "jardin",
    articles: [
      "entretenir-pelouse-ete",
      "nettoyer-terrasse-bois",
      "potager-debutant-demarrer",
      "tailler-haie-bonne-periode",
    ],
  },
  {
    pillar: "guide-amenagement-exterieur",
    category: "exterieurs",
    articles: [
      "terrasse-bois-ou-composite",
      "choisir-installer-pergola",
      "choisir-cloture-jardin",
      "choisir-portail-maison",
      "choisir-abri-de-jardin",
      "installer-un-carport",
      "amenager-allee-jardin",
      "reussir-eclairage-exterieur",
    ],
  },
];

export function getSiloByPillar(pillarSlug: string): Silo | undefined {
  return silos.find((s) => s.pillar === pillarSlug);
}

/**
 * Pilier « principal » d'un article satellite (le premier silo qui le
 * contient). Renvoie undefined si l'article n'appartient à aucun silo.
 */
export function getPrimaryPillarSlug(articleSlug: string): string | undefined {
  return silos.find((s) => s.articles.includes(articleSlug))?.pillar;
}

/** Tous les slugs « frères » d'un article (même silo), pilier inclus. */
export function getSiloSiblingSlugs(articleSlug: string): string[] {
  const slugs = new Set<string>();
  for (const silo of silos) {
    if (silo.articles.includes(articleSlug)) {
      slugs.add(silo.pillar);
      silo.articles.forEach((a) => slugs.add(a));
    }
  }
  slugs.delete(articleSlug);
  return [...slugs];
}
