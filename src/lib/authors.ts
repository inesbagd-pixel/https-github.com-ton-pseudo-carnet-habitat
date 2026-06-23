/**
 * Équipe éditoriale (fictive pour la démonstration).
 * Les articles référencent un auteur via sa clé.
 */

export interface Author {
  key: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  /** Domaines de spécialité (affichés sur la page Équipe). */
  specialties: string[];
  /** Nombre d'années d'expérience dans le domaine. */
  since: string;
}

export const authors: Record<string, Author> = {
  "claire-deniau": {
    key: "claire-deniau",
    name: "Claire Deniau",
    role: "Rédactrice en chef",
    bio: "Journaliste habitat depuis quinze ans, Claire a couvert la rénovation, l'aménagement intérieur et la transition énergétique pour plusieurs magazines spécialisés. Elle veille à la ligne éditoriale et à la rigueur des contenus.",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=70",
    specialties: ["Maison", "Organisation", "Qualité de l'air"],
    since: "2011",
  },
  "marc-aubert": {
    key: "marc-aubert",
    name: "Marc Aubert",
    role: "Spécialiste travaux & rénovation",
    bio: "Ancien conducteur de travaux, Marc traduit le langage du chantier en conseils clairs pour les particuliers qui rénovent leur logement. Il connaît les pièges du gros œuvre comme du second œuvre.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=70",
    specialties: ["Rénovation", "Toiture", "Isolation"],
    since: "2008",
  },
  "lea-fontaine": {
    key: "lea-fontaine",
    name: "Léa Fontaine",
    role: "Journaliste jardin & extérieurs",
    bio: "Passionnée de jardinage durable, Léa partage des méthodes d'entretien simples et respectueuses des plantes et des sols. Elle couvre aussi l'aménagement des terrasses et des espaces extérieurs.",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=70",
    specialties: ["Jardin", "Terrasses", "Aménagement extérieur"],
    since: "2014",
  },
  "thomas-reynaud": {
    key: "thomas-reynaud",
    name: "Thomas Reynaud",
    role: "Expert énergie & confort thermique",
    bio: "Conseiller en rénovation énergétique, Thomas aide les ménages à réduire leur consommation sans sacrifier leur confort. Il décrypte les équipements de chauffage et les diagnostics énergétiques.",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=70",
    specialties: ["Chauffage", "Énergie", "Isolation thermique"],
    since: "2013",
  },
  "sophie-marchand": {
    key: "sophie-marchand",
    name: "Sophie Marchand",
    role: "Architecte d'intérieur & décoration",
    bio: "Architecte d'intérieur, Sophie défend une décoration intemporelle qui mise sur la lumière, les matières et l'harmonie des couleurs, loin des effets de mode éphémères.",
    avatar:
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=70",
    specialties: ["Décoration", "Aménagement", "Lumière & couleurs"],
    since: "2012",
  },
};

export const defaultAuthorKey = "claire-deniau";

export function getAuthor(key?: string): Author {
  if (key && authors[key]) return authors[key];
  return authors[defaultAuthorKey];
}
