import Link from "next/link";
import Image from "next/image";
import type { Category } from "@/lib/categories";
import { ArrowRightIcon } from "@/components/icons";

export function CategoryCard({
  category,
  count,
}: {
  category: Category;
  count?: number;
}) {
  return (
    <Link
      href={`/${category.slug}`}
      className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-lg bg-bg-muted p-5"
    >
      <Image
        src={category.image}
        alt=""
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/25 to-transparent"
        aria-hidden
      />
      <div className="relative">
        <h3 className="font-serif text-xl font-semibold text-bg">
          {category.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-[0.8rem] leading-snug text-bg/85">
          {category.blurb}
        </p>
        <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-bg/90">
          {typeof count === "number"
            ? `${count} article${count > 1 ? "s" : ""}`
            : "Explorer"}
          <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
