/**
 * Configuration centrale du site Carnet Habitat.
 * Modifier ces valeurs met à jour l'ensemble du site (SEO, métadonnées, footer…).
 */

export const siteConfig = {
  name: "Carnet Habitat",
  shortName: "Carnet Habitat",
  // L'URL de production. À surcharger via la variable d'environnement
  // NEXT_PUBLIC_SITE_URL lors du déploiement (Vercel).
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://www.carnethabitat.fr",
  locale: "fr_FR",
  lang: "fr",
  description:
    "Carnet Habitat est un magazine en ligne dédié à l'habitat : conseils pratiques pour améliorer votre maison, vos travaux, votre jardin, votre confort énergétique et votre décoration.",
  tagline:
    "Conseils pratiques pour améliorer votre maison, votre confort et vos espaces extérieurs.",
  publisher: "Carnet Habitat",
  // Adresse e-mail de contact éditorial.
  email: "redaction@carnethabitat.fr",
  // Image Open Graph par défaut (générée dynamiquement, voir app/opengraph-image).
  defaultOgImage: "/opengraph-image",
  // Réseaux sociaux (comptes fictifs pour la démonstration).
  social: {
    instagram: "https://instagram.com/carnethabitat",
    pinterest: "https://pinterest.com/carnethabitat",
    facebook: "https://facebook.com/carnethabitat",
    youtube: "https://youtube.com/@carnethabitat",
  },
  // Nombre d'articles par page sur les pages catégories.
  // (Réglé à 3 pour démontrer la pagination ; à ajuster selon le volume.)
  postsPerPage: 3,
} as const;

export type SiteConfig = typeof siteConfig;

/** Construit une URL absolue à partir d'un chemin relatif. */
export function absoluteUrl(path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${clean}`;
}
