import Link from "next/link";
import { Seal } from "@/components/Seal";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2.5 ${className}`}
      aria-label="Carnet Habitat — accueil"
    >
      <Seal className="h-9 w-9 shrink-0" aria-hidden />
      <span className="flex flex-col leading-none">
        <span className="font-serif text-xl font-semibold tracking-tight text-ink sm:text-[1.4rem]">
          Carnet
        </span>
        <span className="mt-1 font-sans text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-sage-dark">
          Habitat
        </span>
      </span>
    </Link>
  );
}
