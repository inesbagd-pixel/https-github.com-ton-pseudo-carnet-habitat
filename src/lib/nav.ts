import { categories } from "./categories";

export interface NavItem {
  label: string;
  href: string;
}

/** Catégories éditoriales pour la navigation principale. */
export const categoryNav: NavItem[] = categories.map((c) => ({
  label: c.name,
  href: `/${c.slug}`,
}));

/** Navigation principale (header) : catégories + À propos. */
export const mainNav: NavItem[] = [
  ...categoryNav,
  { label: "À propos", href: "/a-propos" },
];

/** Liens secondaires (footer — institutionnel). */
export const footerNav: NavItem[] = [
  { label: "À propos", href: "/a-propos" },
  { label: "Contact", href: "/contact" },
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "Politique de confidentialité", href: "/politique-de-confidentialite" },
];
