import type { SVGProps } from "react";

/**
 * Sceau « Cachet-Signet » — symbole de marque de Carnet Habitat.
 * Cercle (bleu nuit) + signet (papier) + pointe (ocre doré).
 * Les couleurs proviennent des tokens, sauf en variante inversée (fond foncé).
 */
export function Seal({
  reversed = false,
  ...props
}: SVGProps<SVGSVGElement> & { reversed?: boolean }) {
  const circle = reversed ? "var(--color-bg)" : "var(--color-sage-dark)";
  const signet = reversed ? "var(--color-sage-dark)" : "var(--color-bg)";
  const tip = "var(--color-gold)";

  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-label="Carnet Habitat"
      {...props}
    >
      <circle cx="32" cy="32" r="30" fill={circle} />
      <path d="M25 19h14v27l-7-5.5-7 5.5z" fill={signet} />
      <rect x="25" y="19" width="14" height="5" fill={tip} />
    </svg>
  );
}
