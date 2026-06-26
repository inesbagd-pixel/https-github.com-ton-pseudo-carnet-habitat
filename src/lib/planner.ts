/**
 * Planificateur de rénovation — moteur de règles métier.
 *
 * Module PUR (aucun import serveur) : il peut donc tourner aussi bien côté
 * serveur (rendu SEO) que côté client (outil interactif). Aucune dépendance,
 * aucun appel réseau — le plan est calculé localement à partir d'un arbre de
 * règles inspiré des bonnes pratiques du bâtiment (ordre des travaux,
 * diagnostics réglementaires, points de vigilance courants).
 */

/* ------------------------------------------------------------------ */
/*  Types & options                                                    */
/* ------------------------------------------------------------------ */

export type LogementType = "maison" | "appartement";

export type ProjetType =
  | "isolation"
  | "toiture"
  | "chauffage"
  | "ventilation"
  | "salle-de-bain"
  | "cuisine"
  | "exterieur"
  | "complete";

export type Priorite = "economies" | "confort" | "valorisation" | "esthetique";

export type BudgetBucket = "lt5k" | "5-15k" | "15-40k" | "40-80k" | "gt80k";

export interface PlannerInput {
  logement: LogementType;
  annee: number;
  surface: number;
  projet: ProjetType;
  budget: BudgetBucket;
  priorite: Priorite;
}

export interface PlanStep {
  title: string;
  detail: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
}

/** Lien vers un guide Carnet Habitat, résolu côté serveur depuis le slug. */
export interface GuideLink {
  slug: string;
  title: string;
  href: string;
  categoryName: string;
}

export type Difficulty = 1 | 2 | 3;

export interface CostEstimate {
  low: number;
  high: number;
  /** true si la fourchette est calculée au m² (donc liée à la surface). */
  perM2: boolean;
}

export interface Plan {
  /** Titre lisible du projet (ex. « Isolation thermique »). */
  projetLabel: string;
  /** Résumé d'introduction personnalisé. */
  summary: string;
  /** Estimation de durée (chantier), phrase complète. */
  durationLabel: string;
  /** Estimation de durée, version courte pour les cartes (ex. « 2 à 7 mois »). */
  durationShort: string;
  /** Niveau de difficulté (1 = accessible, 2 = modérée, 3 = élevée). */
  difficulty: Difficulty;
  /** Libellé du niveau de difficulté. */
  difficultyLabel: string;
  /** Coût estimatif indicatif (hors aides). */
  cost: CostEstimate;
  /** Travaux à réaliser avant les autres (prérequis). */
  prerequisites: string[];
  /** Étapes recommandées, dans le bon ordre. */
  steps: PlanStep[];
  /** Points de vigilance. */
  vigilance: string[];
  /** Erreurs fréquentes à éviter. */
  mistakes: string[];
  /** Note de cohérence budget / surface. */
  budgetNote: string;
  /** Checklist interactive (cases à cocher). */
  checklist: ChecklistItem[];
  /** Slugs des guides Carnet Habitat à recommander (résolus côté serveur). */
  guideSlugs: string[];
}

/* ------------------------------------------------------------------ */
/*  Métadonnées d'affichage (formulaire)                               */
/* ------------------------------------------------------------------ */

export const LOGEMENTS: { value: LogementType; label: string; hint: string }[] = [
  {
    value: "maison",
    label: "Maison individuelle",
    hint: "Vous décidez seul des travaux, intérieur comme extérieur.",
  },
  {
    value: "appartement",
    label: "Appartement",
    hint: "Certaines parties relèvent de la copropriété (toiture, façade).",
  },
];

export const PROJETS: {
  value: ProjetType;
  label: string;
  hint: string;
}[] = [
  { value: "isolation", label: "Isolation", hint: "Combles, murs, fenêtres, planchers." },
  { value: "toiture", label: "Toiture", hint: "Couverture, charpente, étanchéité." },
  { value: "chauffage", label: "Chauffage", hint: "Changer de système, réguler, économiser." },
  { value: "ventilation", label: "Ventilation", hint: "VMC, qualité de l'air, humidité." },
  { value: "salle-de-bain", label: "Salle de bain", hint: "Rénovation complète d'une pièce d'eau." },
  { value: "cuisine", label: "Cuisine", hint: "Réaménagement et nouveaux équipements." },
  { value: "exterieur", label: "Extérieur", hint: "Terrasse, clôture, allée, pergola." },
  { value: "complete", label: "Rénovation complète", hint: "Rénover l'ensemble du logement." },
];

export const PRIORITES: { value: Priorite; label: string; hint: string }[] = [
  { value: "economies", label: "Économies d'énergie", hint: "Réduire les factures, viser un meilleur DPE." },
  { value: "confort", label: "Confort", hint: "Température stable, air sain, silence." },
  { value: "valorisation", label: "Valorisation du bien", hint: "Augmenter la valeur à la revente." },
  { value: "esthetique", label: "Esthétique", hint: "Embellir et moderniser les espaces." },
];

export const BUDGETS: { value: BudgetBucket; label: string; mid: number }[] = [
  { value: "lt5k", label: "Moins de 5 000 €", mid: 3500 },
  { value: "5-15k", label: "5 000 € – 15 000 €", mid: 10000 },
  { value: "15-40k", label: "15 000 € – 40 000 €", mid: 27000 },
  { value: "40-80k", label: "40 000 € – 80 000 €", mid: 60000 },
  { value: "gt80k", label: "Plus de 80 000 €", mid: 110000 },
];

export function projetLabel(p: ProjetType): string {
  return PROJETS.find((x) => x.value === p)?.label ?? "Projet";
}

export function budgetMid(b: BudgetBucket): number {
  return BUDGETS.find((x) => x.value === b)?.mid ?? 0;
}

const EUR = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

export function formatEuros(n: number): string {
  return EUR.format(n);
}

export function formatCostRange(c: CostEstimate): string {
  return `${formatEuros(c.low)} – ${formatEuros(c.high)}`;
}

/* ------------------------------------------------------------------ */
/*  Aides au raisonnement (âge du bâti)                                */
/* ------------------------------------------------------------------ */

type AgeBucket =
  | "ancien" // avant 1948
  | "avant-rt" // 1948 – 1974
  | "premiere-iso" // 1975 – 1989
  | "recent" // 1990 – 2005
  | "moderne"; // après 2005

function ageBucket(annee: number): AgeBucket {
  if (annee < 1948) return "ancien";
  if (annee <= 1974) return "avant-rt";
  if (annee <= 1989) return "premiere-iso";
  if (annee <= 2005) return "recent";
  return "moderne";
}

/** Construction avant juillet 1997 : repérage amiante avant travaux. */
function risqueAmiante(annee: number): boolean {
  return annee < 1997;
}

/** Construction avant 1949 : peintures au plomb possibles (CREP). */
function risquePlomb(annee: number): boolean {
  return annee < 1949;
}

/* ------------------------------------------------------------------ */
/*  Bibliothèque d'étapes par type de projet                           */
/* ------------------------------------------------------------------ */

interface ProjetRecipe {
  summary: (i: PlannerInput) => string;
  prerequisites: string[];
  steps: PlanStep[];
  vigilance: string[];
  mistakes: string[];
  checklist: string[];
  guideSlugs: string[];
  /** Durée de base du chantier, en semaines [min, max]. */
  baseWeeks: [number, number];
  /** La durée croît-elle avec la surface ? */
  scaleWithSurface?: boolean;
  /** Niveau de difficulté du chantier (1 = accessible, 3 = élevée). */
  difficulty: Difficulty;
  /**
   * Modèle de coût indicatif (hors aides). `perM2` = fourchette €/m² liée à la
   * surface ; `fixed` = fourchette globale en €.
   */
  cost: { perM2?: [number, number]; fixed?: [number, number] };
}

const RECIPES: Record<ProjetType, ProjetRecipe> = {
  isolation: {
    summary: (i) =>
      `Isoler un ${i.logement === "maison" ? "logement" : "appartement"} de ${i.surface} m² est l'un des chantiers les plus rentables : il améliore le confort hiver comme été et fait baisser durablement la facture de chauffage.`,
    prerequisites: [
      "Vérifier l'état de la toiture et l'absence d'infiltration : on n'isole jamais sous une couverture qui fuit.",
      "Traiter au préalable toute trace d'humidité, de condensation ou de remontée capillaire sur les murs concernés.",
      "Prévoir une ventilation adaptée (VMC) car une enveloppe mieux isolée devient aussi plus étanche à l'air.",
    ],
    steps: [
      { title: "Diagnostic et hiérarchisation des déperditions", detail: "Repérer par où s'échappe la chaleur (toit, murs, fenêtres, planchers) pour traiter d'abord les postes les plus rentables. Un DPE ou un audit énergétique sert de point de départ." },
      { title: "Isolation des combles ou de la toiture", detail: "Premier poste de déperdition (jusqu'à 30 %). Combles perdus soufflés ou combles aménagés selon l'usage." },
      { title: "Isolation des murs", detail: "Par l'extérieur (ITE) pour traiter les ponts thermiques, ou par l'intérieur (ITI) si la façade ne peut pas être modifiée." },
      { title: "Remplacement des menuiseries", detail: "Double, voire triple vitrage, avec une attention particulière à l'étanchéité de la pose." },
      { title: "Isolation des planchers bas", detail: "Plancher sur cave, vide sanitaire ou terre-plein, souvent oublié alors qu'il pèse sur le confort." },
      { title: "Réglage de la ventilation", detail: "Adapter ou installer une VMC pour évacuer l'humidité produite à l'intérieur sans gaspiller la chaleur." },
    ],
    vigilance: [
      "L'ordre compte : isoler avant de changer le chauffage permet de le dimensionner plus juste (et moins cher).",
      "Soigner la continuité de l'isolant et l'étanchéité à l'air : un pont thermique ruine une partie du bénéfice.",
      "Une isolation performante sans ventilation efficace fait apparaître condensation et moisissures.",
    ],
    mistakes: [
      "Changer les fenêtres en premier alors que les combles, plus rentables, restent passoires.",
      "Négliger les ponts thermiques (planchers, balcons, tableaux de fenêtres).",
      "Choisir l'isolant le moins cher sans tenir compte du déphasage (confort d'été).",
    ],
    checklist: [
      "Réaliser un DPE ou un audit énergétique",
      "Comparer plusieurs devis détaillés (matériaux et épaisseurs précisés)",
      "Vérifier l'éligibilité aux aides (MaPrimeRénov', CEE)",
      "Choisir des artisans certifiés RGE pour conserver les aides",
      "Planifier la ventilation en parallèle de l'isolation",
      "Conserver les factures et attestations pour la revente",
    ],
    guideSlugs: [
      "guide-isolation-maison",
      "signes-mauvaise-isolation",
      "isoler-combles-perdus",
      "isolation-murs-ite-ou-iti",
      "isolation-fenetres-double-vitrage",
      "choisir-isolant-thermique",
      "traiter-ponts-thermiques",
      "isolation-ventilation-humidite",
    ],
    baseWeeks: [1, 4],
    scaleWithSurface: true,
    difficulty: 2,
    cost: { perM2: [60, 160] },
  },

  toiture: {
    summary: (i) =>
      `La toiture protège tout le logement : avant d'envisager ${i.priorite === "esthetique" ? "tout embellissement" : "des travaux d'isolation ou d'aménagement"}, elle doit être saine et étanche.`,
    prerequisites: [
      "Faire constater l'état réel de la couverture et de la charpente par un couvreur (devis et diagnostic).",
      "Vérifier l'absence de parasites (capricornes, mérule) et d'infiltration dans la charpente.",
      "En appartement ou en mitoyenneté, valider qui est responsable de la toiture (copropriété, voisin).",
    ],
    steps: [
      { title: "Diagnostic de la couverture et de la charpente", detail: "Tuiles ou ardoises cassées, mousses, faîtage, zinguerie, état du bois : on évalue s'il faut réparer, rénover ou refaire entièrement." },
      { title: "Traitement éventuel de la charpente", detail: "Traitement curatif ou préventif du bois avant toute nouvelle couverture." },
      { title: "Dépose et réfection de la couverture", detail: "Remplacement des éléments défaillants ou réfection complète avec écran sous-toiture." },
      { title: "Isolation de la toiture", detail: "Profiter du chantier pour isoler par l'extérieur (sarking) ou par l'intérieur — la toiture est le premier poste de déperdition." },
      { title: "Zinguerie et évacuation des eaux", detail: "Gouttières, descentes et solins : indispensables pour évacuer l'eau et protéger les façades." },
    ],
    vigilance: [
      "Une toiture refaite est l'occasion idéale d'isoler : ne pas dissocier les deux chantiers fait perdre de l'argent.",
      "Certaines communes imposent des matériaux ou des teintes : vérifier le PLU et déclarer les travaux en mairie.",
      "L'échafaudage représente un coût fixe important : regrouper les travaux en hauteur (façade, fenêtres de toit).",
    ],
    mistakes: [
      "Repeindre ou « hydrofuger » une toiture en fin de vie au lieu de la rénover.",
      "Oublier la déclaration préalable de travaux (obligatoire pour modifier l'aspect extérieur).",
      "Négliger la ventilation de la sous-toiture, source de condensation.",
    ],
    checklist: [
      "Faire diagnostiquer couverture ET charpente",
      "Déposer une déclaration préalable de travaux en mairie",
      "Comparer 2 à 3 devis de couvreurs",
      "Intégrer l'isolation au projet de toiture",
      "Vérifier l'assurance décennale de l'artisan",
      "Planifier le chantier hors période de gel et de fortes pluies",
    ],
    guideSlugs: [
      "guide-toiture",
      "quand-refaire-toiture",
      "isoler-combles-perdus",
      "isoler-combles-amenages",
      "signes-mauvaise-isolation",
    ],
    baseWeeks: [1, 3],
    scaleWithSurface: true,
    difficulty: 3,
    cost: { perM2: [120, 250] },
  },

  chauffage: {
    summary: (i) =>
      `Changer de système de chauffage est plus efficace une fois le logement bien isolé : on installe alors un équipement mieux dimensionné${i.priorite === "economies" ? ", donc moins cher à l'achat comme à l'usage" : ""}.`,
    prerequisites: [
      "Évaluer le niveau d'isolation : un bon chauffage sur une passoire thermique reste coûteux.",
      "Vérifier la ventilation et l'étanchéité à l'air pour ne pas chauffer dans le vide.",
      "Faire réaliser un bilan thermique pour dimensionner l'appareil au plus juste.",
    ],
    steps: [
      { title: "Bilan des besoins et de l'isolation", detail: "Déterminer la puissance réellement nécessaire selon la surface, l'isolation et la zone climatique." },
      { title: "Choix de l'énergie et du système", detail: "Pompe à chaleur, chaudière, poêle, radiateurs : on arbitre selon le confort visé, le budget et les aides." },
      { title: "Dépose de l'ancien équipement", detail: "Retrait et mise au rebut conforme de l'ancienne chaudière ou des anciens convecteurs." },
      { title: "Installation et raccordements", detail: "Pose de l'appareil, du réseau hydraulique ou des émetteurs, et mise en service par un professionnel." },
      { title: "Régulation et pilotage", detail: "Thermostat programmable ou connecté, robinets thermostatiques : jusqu'à 15 % d'économies à confort égal." },
    ],
    vigilance: [
      "Surdimensionner un système coûte cher et le fait fonctionner en deçà de son rendement optimal.",
      "Une pompe à chaleur exige un logement correctement isolé pour être réellement performante.",
      "L'entretien annuel est obligatoire pour la plupart des appareils et conditionne la garantie.",
    ],
    mistakes: [
      "Remplacer à l'identique sans réinterroger l'énergie ni le dimensionnement.",
      "Installer une PAC avant d'avoir isolé : facture d'électricité décevante.",
      "Ignorer la régulation, qui pèse autant que le choix de l'appareil sur la facture.",
    ],
    checklist: [
      "Faire réaliser un bilan thermique",
      "Comparer le coût global (achat + usage + entretien) sur 10 ans",
      "Vérifier l'éligibilité aux aides (MaPrimeRénov', CEE)",
      "Choisir un installateur RGE",
      "Prévoir le contrat d'entretien annuel",
      "Installer une régulation programmable",
    ],
    guideSlugs: [
      "guide-chauffage-maison",
      "reduire-consommation-chauffage",
      "bien-choisir-thermostat-connecte",
      "comprendre-dpe-logement",
    ],
    baseWeeks: [1, 2],
    difficulty: 2,
    cost: { fixed: [4000, 18000] },
  },

  ventilation: {
    summary: () =>
      "Une bonne ventilation est la clé d'un air sain et d'un logement protégé de l'humidité : elle accompagne tout projet d'isolation et limite condensation et moisissures.",
    prerequisites: [
      "Identifier la source d'humidité (production intérieure, infiltration, remontée capillaire) avant de choisir le système.",
      "Vérifier l'étanchéité à l'air du logement, qui conditionne l'efficacité de la VMC.",
      "S'assurer que les entrées d'air des menuiseries existent et ne sont pas obstruées.",
    ],
    steps: [
      { title: "Diagnostic de la qualité de l'air et de l'humidité", detail: "Mesurer le taux d'humidité, repérer les pièces humides et les éventuelles moisissures." },
      { title: "Choix du système de ventilation", detail: "Ventilation naturelle, VMC simple flux hygroréglable ou double flux avec récupération de chaleur." },
      { title: "Installation des bouches et du réseau", detail: "Bouches d'extraction dans les pièces humides, entrées d'air dans les pièces de vie, gaines isolées." },
      { title: "Mise en service et réglage des débits", detail: "Équilibrer les débits pièce par pièce pour un renouvellement d'air efficace et silencieux." },
      { title: "Entretien planifié", detail: "Nettoyage des bouches et remplacement des filtres pour conserver les performances." },
    ],
    vigilance: [
      "Une VMC double flux n'a de sens que dans un logement déjà étanche à l'air et bien isolé.",
      "Ne jamais boucher les entrées et bouches d'air pour « éviter les courants d'air » : c'est la cause n°1 de condensation.",
      "Le réseau de gaines doit être isolé et le plus court possible pour éviter les pertes et la condensation interne.",
    ],
    mistakes: [
      "Traiter les moisissures en surface sans rétablir une ventilation correcte.",
      "Sous-dimensionner les débits ou négliger l'équilibrage.",
      "Installer une double flux dans une passoire thermique, sans bénéfice réel.",
    ],
    checklist: [
      "Mesurer le taux d'humidité des pièces principales",
      "Vérifier et dégager toutes les entrées d'air",
      "Choisir le système adapté (simple flux hygro / double flux)",
      "Faire dimensionner les débits par un professionnel",
      "Planifier l'entretien (filtres, bouches)",
      "Traiter les causes d'humidité à la source",
    ],
    guideSlugs: [
      "vmc-simple-flux-double-flux",
      "installer-vmc-renovation",
      "ventilation-naturelle-aeration",
      "ameliorer-qualite-air-interieur",
      "taux-humidite-ideal-maison",
      "isolation-ventilation-humidite",
    ],
    baseWeeks: [1, 1],
    difficulty: 1,
    cost: { fixed: [1500, 8000] },
  },

  "salle-de-bain": {
    summary: () =>
      "Rénover une salle de bain croise plomberie, électricité, étanchéité et finitions : l'ordre des corps de métier est déterminant pour un résultat durable.",
    prerequisites: [
      "Vérifier l'état des réseaux d'eau et l'évacuation avant de refermer les murs.",
      "Traiter toute trace d'humidité ou de fuite existante.",
      "Anticiper l'étanchéité (douche, sol) avant la pose des revêtements.",
    ],
    steps: [
      { title: "Conception et plan d'implantation", detail: "Définir l'emplacement des arrivées et évacuations, l'éclairage et la ventilation selon l'usage réel." },
      { title: "Dépose et préparation", detail: "Retirer les anciens équipements, vérifier les supports et reprendre les réseaux si besoin." },
      { title: "Plomberie et électricité", detail: "Mise aux normes des arrivées d'eau, évacuations et circuits électriques (volumes de sécurité)." },
      { title: "Étanchéité et ventilation", detail: "Système d'étanchéité sous carrelage pour les zones humides et extraction d'air efficace." },
      { title: "Revêtements et finitions", detail: "Carrelage ou revêtement adapté aux pièces d'eau, puis pose des équipements sanitaires." },
      { title: "Pose des équipements et réglages", detail: "Douche, meuble, robinetterie, sèche-serviettes : vérifications d'usage avant réception." },
    ],
    vigilance: [
      "Respecter les volumes de sécurité électriques propres aux pièces d'eau.",
      "L'étanchéité est invisible mais essentielle : un défaut se paie en dégâts des eaux.",
      "Prévoir une ventilation efficace : la salle de bain est la pièce la plus humide du logement.",
    ],
    mistakes: [
      "Carreler sans système d'étanchéité dans la zone de douche.",
      "Sous-estimer la ventilation et favoriser les moisissures.",
      "Figer l'implantation sans penser aux rangements et à l'éclairage.",
    ],
    checklist: [
      "Dessiner le plan d'implantation et les réseaux",
      "Vérifier l'état de la plomberie avant fermeture des murs",
      "Prévoir l'étanchéité des zones humides",
      "Assurer une ventilation efficace",
      "Commander les équipements à l'avance (délais)",
      "Coordonner l'ordre des artisans",
    ],
    guideSlugs: [
      "renover-salle-de-bain-etapes",
      "choisir-artisan-renovation",
      "traiter-humidite-maison",
    ],
    baseWeeks: [2, 4],
    difficulty: 2,
    cost: { fixed: [5000, 15000] },
  },

  cuisine: {
    summary: () =>
      "Réaménager une cuisine combine implantation, réseaux et finitions : on planifie les arrivées d'eau, l'électricité et la ventilation avant de penser au mobilier.",
    prerequisites: [
      "Définir l'implantation (triangle d'activité) avant de déplacer eau, gaz et électricité.",
      "Vérifier la capacité du tableau électrique pour les gros appareils.",
      "Prévoir l'extraction de la hotte et l'aération de la pièce.",
    ],
    steps: [
      { title: "Conception de l'implantation", detail: "Organiser les zones (cuisson, lavage, stockage) et la circulation pour un usage confortable." },
      { title: "Reprise des réseaux", detail: "Déplacer si besoin les arrivées d'eau, l'évacuation, les circuits électriques dédiés et l'alimentation des appareils." },
      { title: "Préparation des supports", detail: "Mise à niveau des murs et sols, peinture ou crédence avant la pose des meubles." },
      { title: "Pose des meubles et du plan de travail", detail: "Caissons, plan de travail, évier et robinetterie, ajustés au millimètre." },
      { title: "Raccordement des équipements", detail: "Électroménager, hotte et éclairage, puis vérifications de sécurité avant mise en service." },
    ],
    vigilance: [
      "Les circuits des gros appareils (four, plaque, lave-vaisselle) doivent être dédiés et aux normes.",
      "Une hotte mal évacuée laisse l'humidité et les odeurs : privilégier l'évacuation vers l'extérieur quand c'est possible.",
      "Les délais de livraison du mobilier conditionnent le planning global.",
    ],
    mistakes: [
      "Choisir les meubles avant d'avoir figé l'implantation des réseaux.",
      "Sous-dimensionner l'électricité pour l'électroménager moderne.",
      "Négliger l'éclairage des plans de travail.",
    ],
    checklist: [
      "Valider le plan d'implantation et le triangle d'activité",
      "Vérifier le tableau et les circuits dédiés",
      "Prévoir l'évacuation de la hotte",
      "Commander mobilier et électroménager (délais)",
      "Coordonner plombier et électricien",
      "Planifier l'éclairage fonctionnel",
    ],
    guideSlugs: [
      "guide-renovation-maison",
      "choisir-artisan-renovation",
      "choisir-eclairage-interieur",
    ],
    baseWeeks: [1, 3],
    difficulty: 2,
    cost: { fixed: [5000, 20000] },
  },

  exterieur: {
    summary: () =>
      "Aménager ses extérieurs valorise le logement et agrandit l'espace de vie : on commence par les contraintes (sol, niveaux, réglementation) avant l'esthétique.",
    prerequisites: [
      "Vérifier les règles d'urbanisme (PLU) et les déclarations nécessaires selon les surfaces.",
      "Contrôler la nature et la stabilité du sol avant toute fondation ou terrasse.",
      "Penser l'évacuation des eaux pluviales pour éviter stagnation et dégâts.",
    ],
    steps: [
      { title: "Conception et implantation", detail: "Dessiner les usages (terrasse, allée, clôture, pergola) et leur cohérence avec la maison et le terrain." },
      { title: "Démarches administratives", detail: "Déclaration préalable ou permis selon les surfaces et hauteurs concernées." },
      { title: "Préparation du terrain", detail: "Terrassement, mise à niveau, drainage et fondations adaptées au projet." },
      { title: "Réalisation des ouvrages", detail: "Pose de la terrasse, de la clôture, du portail ou de la pergola selon les matériaux choisis." },
      { title: "Finitions et éclairage", detail: "Éclairage extérieur, plantations et finitions qui mettent en valeur l'ensemble." },
    ],
    vigilance: [
      "Au-delà de certaines surfaces, une déclaration préalable ou un permis est obligatoire.",
      "Le choix des matériaux (bois, composite, métal) engage l'entretien sur des années.",
      "Une bonne gestion des eaux de pluie évite l'enfoncement et la dégradation des ouvrages.",
    ],
    mistakes: [
      "Démarrer sans vérifier le PLU ni les limites de propriété.",
      "Négliger la préparation du sol, source d'affaissement.",
      "Choisir un matériau sans anticiper son entretien.",
    ],
    checklist: [
      "Vérifier le PLU et les règles de mitoyenneté",
      "Déposer la déclaration préalable si nécessaire",
      "Faire étudier le sol et l'évacuation des eaux",
      "Comparer les matériaux (durabilité, entretien)",
      "Planifier les travaux en saison favorable",
      "Prévoir l'éclairage extérieur",
    ],
    guideSlugs: [
      "guide-amenagement-exterieur",
      "terrasse-bois-ou-composite",
      "choisir-installer-pergola",
      "choisir-cloture-jardin",
      "choisir-portail-maison",
      "amenager-allee-jardin",
      "reussir-eclairage-exterieur",
    ],
    baseWeeks: [1, 4],
    difficulty: 2,
    cost: { fixed: [3000, 25000] },
  },

  complete: {
    summary: (i) =>
      `Rénover entièrement ${i.surface} m² demande de respecter un ordre précis : on sécurise d'abord le clos et le couvert, puis l'enveloppe thermique, les réseaux et enfin les finitions.`,
    prerequisites: [
      "Réaliser un audit complet (énergétique, structure, humidité, réseaux) avant tout chiffrage.",
      "Mettre le logement « hors d'eau, hors d'air » : toiture, façade et menuiseries saines avant le reste.",
      "Traiter l'humidité et assainir avant d'isoler et de refermer les murs.",
    ],
    steps: [
      { title: "Audit, conception et budget", detail: "Diagnostic global, plans, priorisation des postes et plan de financement (avec aides) avant de lancer le chantier." },
      { title: "Démolition et dépose", detail: "Retirer ce qui doit l'être, en gérant les déchets et les éventuels matériaux sensibles (amiante, plomb)." },
      { title: "Gros œuvre et mise hors d'eau / hors d'air", detail: "Toiture, charpente, façade, ouvertures : l'enveloppe doit être saine avant toute isolation." },
      { title: "Isolation et ventilation", detail: "Isoler l'ensemble de l'enveloppe puis installer une ventilation cohérente avec la nouvelle étanchéité." },
      { title: "Réseaux : électricité, plomberie, chauffage", detail: "Mise aux normes et passage des réseaux avant de refermer cloisons et plafonds." },
      { title: "Cloisons, plâtrerie et supports", detail: "Création des volumes, doublages et préparation des surfaces à recevoir les finitions." },
      { title: "Finitions : sols, peinture, cuisine, salle de bain", detail: "Revêtements puis pose des équipements et de la décoration en dernier." },
      { title: "Réception et levée des réserves", detail: "Vérification poste par poste, mise en service et conservation de toutes les attestations." },
    ],
    vigilance: [
      "L'ordre des travaux est non négociable : finir par les finitions, jamais par l'enveloppe.",
      "Un projet global se phase : mieux vaut étaler dans le bon ordre que tout faire à moitié.",
      "Coordonner les corps de métier évite les reprises coûteuses (ex. percer un mur fraîchement peint).",
    ],
    mistakes: [
      "Commencer par la décoration et l'esthétique avant l'enveloppe et les réseaux.",
      "Sous-estimer les imprévus : prévoir 10 à 15 % de marge budgétaire.",
      "Multiplier les artisans sans coordination ni planning d'ensemble.",
    ],
    checklist: [
      "Faire réaliser un audit énergétique et structurel",
      "Établir un planning par phases dans le bon ordre",
      "Constituer un budget avec marge pour imprévus (10–15 %)",
      "Monter les dossiers d'aides (MaPrimeRénov', CEE, éco-PTZ)",
      "Choisir des artisans RGE et vérifier les assurances",
      "Désigner un coordinateur (maître d'œuvre ou vous-même)",
      "Conserver devis, factures et attestations",
    ],
    guideSlugs: [
      "guide-renovation-maison",
      "choisir-artisan-renovation",
      "comprendre-dpe-logement",
      "guide-isolation-maison",
      "guide-chauffage-maison",
      "renover-salle-de-bain-etapes",
    ],
    baseWeeks: [8, 20],
    scaleWithSurface: true,
    difficulty: 3,
    cost: { perM2: [750, 1300] },
  },
};

/* ------------------------------------------------------------------ */
/*  Modificateurs transversaux                                         */
/* ------------------------------------------------------------------ */

/** Guides additionnels selon le contexte (humidité du bâti ancien, etc.). */
function contextGuides(i: PlannerInput): string[] {
  const extra: string[] = [];
  const age = ageBucket(i.annee);
  const concerneEnveloppe =
    i.projet === "isolation" ||
    i.projet === "complete" ||
    i.projet === "ventilation" ||
    i.projet === "toiture";

  if ((age === "ancien" || age === "avant-rt") && concerneEnveloppe) {
    extra.push("traiter-humidite-maison", "remontees-capillaires-traitement");
  }
  if (i.priorite === "economies" && i.projet !== "chauffage") {
    extra.push("comprendre-dpe-logement");
  }
  if (i.priorite === "valorisation") {
    extra.push("comprendre-dpe-logement");
  }
  return extra;
}

/** Prérequis additionnels selon l'âge du bâti et le type de logement. */
function contextPrerequisites(i: PlannerInput): string[] {
  const extra: string[] = [];
  if (risqueAmiante(i.annee) && i.projet !== "exterieur") {
    extra.push(
      "Logement antérieur à 1997 : faire réaliser un repérage amiante avant tous travaux touchant les matériaux (toiture, sols, colles, conduits).",
    );
  }
  if (risquePlomb(i.annee) && (i.projet === "complete" || i.projet === "salle-de-bain" || i.projet === "cuisine")) {
    extra.push(
      "Logement antérieur à 1949 : un constat de risque d'exposition au plomb (CREP) est recommandé avant de poncer ou décaper d'anciennes peintures.",
    );
  }
  if (i.logement === "appartement" && (i.projet === "toiture" || i.projet === "exterieur" || i.projet === "complete")) {
    extra.push(
      "En copropriété, les parties communes (toiture, façade, structure) nécessitent une autorisation de l'assemblée générale : à anticiper très en amont.",
    );
  }
  return extra;
}

/** Points de vigilance additionnels selon la priorité affichée. */
function contextVigilance(i: PlannerInput): string[] {
  const extra: string[] = [];
  if (i.priorite === "economies") {
    extra.push(
      "Pour viser les aides (MaPrimeRénov', CEE, éco-PTZ), faites établir les devis AVANT d'engager les travaux et passez par des artisans RGE.",
    );
  }
  if (i.priorite === "valorisation") {
    extra.push(
      "À la revente, l'étiquette DPE pèse fortement sur le prix : priorisez les travaux qui font gagner des classes énergétiques.",
    );
  }
  if (i.priorite === "confort" && (i.projet === "isolation" || i.projet === "complete")) {
    extra.push(
      "Pensez au confort d'été autant qu'à l'hiver : un isolant à fort déphasage limite la surchauffe sous les toits.",
    );
  }
  if (i.logement === "appartement" && i.projet === "ventilation") {
    extra.push(
      "En appartement, la VMC est souvent collective : vérifiez avant tout ce qui relève de votre lot et ce qui relève de la copropriété.",
    );
  }
  return extra;
}

/* ------------------------------------------------------------------ */
/*  Estimation de durée                                                */
/* ------------------------------------------------------------------ */

function estimateDuration(
  i: PlannerInput,
  recipe: ProjetRecipe,
): { short: string; long: string } {
  let [min, max] = recipe.baseWeeks;

  if (recipe.scaleWithSurface) {
    // Référence : ~90 m². Au-delà, on allonge proportionnellement.
    const factor = Math.max(0.6, Math.min(2.2, i.surface / 90));
    min = Math.round(min * factor);
    max = Math.round(max * factor);
  }

  // Le bâti ancien réserve plus d'imprévus.
  const age = ageBucket(i.annee);
  if (age === "ancien") max = Math.round(max * 1.2);

  min = Math.max(1, min);
  max = Math.max(min + 1, max);

  const unit = (n: number) => {
    if (n < 4) return `${n} semaine${n > 1 ? "s" : ""}`;
    const months = Math.round(n / 4.3);
    return `${months} mois`;
  };

  const short = `${unit(min)} à ${unit(max)}`;
  const long = `${short} de chantier, hors délais d'études, de devis et d'approvisionnement (comptez 1 à 3 mois de préparation en amont).`;
  return { short, long };
}

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  1: "Accessible",
  2: "Modérée",
  3: "Élevée",
};

/** Arrondit à la centaine la plus proche pour des fourchettes lisibles. */
function roundCost(n: number): number {
  if (n >= 10000) return Math.round(n / 1000) * 1000;
  return Math.round(n / 100) * 100;
}

function costEstimate(i: PlannerInput, recipe: ProjetRecipe): CostEstimate {
  const age = ageBucket(i.annee);
  // Le bâti ancien renchérit l'enveloppe (reprises, imprévus).
  const uplift = age === "ancien" ? 1.15 : 1;

  if (recipe.cost.perM2) {
    const [lo, hi] = recipe.cost.perM2;
    return {
      low: roundCost(i.surface * lo),
      high: roundCost(i.surface * hi * uplift),
      perM2: true,
    };
  }
  const [lo, hi] = recipe.cost.fixed ?? [0, 0];
  return { low: roundCost(lo), high: roundCost(hi * uplift), perM2: false };
}

/* ------------------------------------------------------------------ */
/*  Note budgétaire                                                    */
/* ------------------------------------------------------------------ */

function budgetNote(i: PlannerInput): string {
  const mid = budgetMid(i.budget);

  // Coût indicatif au m² pour les projets « enveloppe / global ».
  if (i.projet === "complete") {
    const low = i.surface * 700;
    const high = i.surface * 1200;
    if (mid < low * 0.7) {
      return `Pour une rénovation complète de ${i.surface} m², l'enveloppe budgétaire visée paraît serrée (une rénovation lourde se situe souvent entre ${Math.round(low / 1000)} k€ et ${Math.round(high / 1000)} k€). Mieux vaut phaser les travaux dans le bon ordre plutôt que tout entreprendre à moitié.`;
    }
    if (mid > high * 1.2) {
      return `Votre budget couvre confortablement une rénovation complète de ${i.surface} m². Profitez-en pour viser la performance énergétique et des matériaux durables, sans négliger la marge pour imprévus.`;
    }
    return `Pour ${i.surface} m², une rénovation complète se situe fréquemment entre ${Math.round(low / 1000)} k€ et ${Math.round(high / 1000)} k€. Gardez 10 à 15 % de marge pour les imprévus, fréquents sur ce type de chantier.`;
  }

  if (i.budget === "lt5k") {
    return "Avec un budget modéré, ciblez le poste le plus rentable plutôt que de disperser l'effort : un seul travail bien fait vaut mieux que plusieurs à moitié.";
  }
  if (i.budget === "gt80k") {
    return "Votre budget permet d'envisager un projet ambitieux : profitez-en pour traiter les postes dans le bon ordre et viser la performance, gage de valeur à la revente.";
  }
  return "Demandez systématiquement plusieurs devis détaillés et vérifiez ce qui est éligible aux aides : l'écart entre deux devis peut dépasser 30 % à prestation comparable.";
}

/* ------------------------------------------------------------------ */
/*  Génération du plan                                                 */
/* ------------------------------------------------------------------ */

/** Déduplique en préservant l'ordre. */
function uniq<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

export function generatePlan(input: PlannerInput): Plan {
  const recipe = RECIPES[input.projet];

  const prerequisites = uniq([
    ...contextPrerequisites(input),
    ...recipe.prerequisites,
  ]);

  const vigilance = uniq([...recipe.vigilance, ...contextVigilance(input)]);

  const guideSlugs = uniq([...recipe.guideSlugs, ...contextGuides(input)]);

  const checklist: ChecklistItem[] = recipe.checklist.map((label, idx) => ({
    id: `${input.projet}-${idx}`,
    label,
  }));

  const duration = estimateDuration(input, recipe);

  return {
    projetLabel: projetLabel(input.projet),
    summary: recipe.summary(input),
    durationLabel: duration.long,
    durationShort: duration.short,
    difficulty: recipe.difficulty,
    difficultyLabel: DIFFICULTY_LABELS[recipe.difficulty],
    cost: costEstimate(input, recipe),
    prerequisites,
    steps: recipe.steps,
    vigilance,
    mistakes: recipe.mistakes,
    budgetNote: budgetNote(input),
    checklist,
    guideSlugs,
  };
}

/* ------------------------------------------------------------------ */
/*  Sérialisation pour partage par URL (?l=..&a=..&s=..&p=..&b=..&pr=..) */
/* ------------------------------------------------------------------ */

export function encodeInput(i: PlannerInput): Record<string, string> {
  return {
    l: i.logement,
    a: String(i.annee),
    s: String(i.surface),
    p: i.projet,
    b: i.budget,
    pr: i.priorite,
  };
}

export function decodeInput(
  params: Record<string, string | undefined>,
): PlannerInput | null {
  const l = params.l;
  const p = params.p;
  const b = params.b;
  const pr = params.pr;
  const annee = Number(params.a);
  const surface = Number(params.s);

  const validLogement = l === "maison" || l === "appartement";
  const validProjet = PROJETS.some((x) => x.value === p);
  const validBudget = BUDGETS.some((x) => x.value === b);
  const validPriorite = PRIORITES.some((x) => x.value === pr);

  if (
    !validLogement ||
    !validProjet ||
    !validBudget ||
    !validPriorite ||
    !Number.isFinite(annee) ||
    !Number.isFinite(surface) ||
    annee < 1700 ||
    surface <= 0
  ) {
    return null;
  }

  return {
    logement: l as LogementType,
    annee,
    surface,
    projet: p as ProjetType,
    budget: b as BudgetBucket,
    priorite: pr as Priorite,
  };
}
