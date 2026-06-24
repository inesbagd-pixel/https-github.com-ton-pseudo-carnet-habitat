/**
 * Avatar d'auteur sous forme de monogramme (initiales) — aucune photo de
 * personne. La couleur de fond est dérivée du nom pour varier d'un auteur
 * à l'autre, dans la palette du site.
 */

const ACCENTS = ["bg-sage", "bg-terracotta", "bg-sage-dark"];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

export function AuthorAvatar({
  name,
  className = "",
}: {
  name: string;
  /** Classes de dimension/typo, ex. "h-9 w-9 text-xs". */
  className?: string;
}) {
  const accent = ACCENTS[hashString(name) % ACCENTS.length];
  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-serif font-semibold leading-none text-bg ${accent} ${className}`}
    >
      {initialsOf(name)}
    </span>
  );
}
