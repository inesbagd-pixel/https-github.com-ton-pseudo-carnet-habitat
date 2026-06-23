import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";

interface Props {
  eyebrow?: string;
  title: string;
  description?: string;
  link?: { label: string; href: string };
}

export function SectionHeading({ eyebrow, title, description, link }: Props) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2 className="mt-2 font-serif text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-soft">
            {description}
          </p>
        )}
      </div>
      {link && (
        <Link
          href={link.href}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-sage-dark transition-colors hover:text-ink"
        >
          {link.label}
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
