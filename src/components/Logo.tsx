import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-baseline gap-2 ${className}`}
      aria-label="Carnet Habitat — accueil"
    >
      <span className="font-serif text-xl font-semibold tracking-tight text-ink sm:text-[1.4rem]">
        Carnet
      </span>
      <span className="font-serif text-xl font-normal italic tracking-tight text-sage-dark sm:text-[1.4rem]">
        Habitat
      </span>
    </Link>
  );
}
