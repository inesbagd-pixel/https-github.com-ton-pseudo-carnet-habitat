import { Breadcrumbs } from "@/components/Breadcrumbs";
import type { Crumb } from "@/lib/seo";

export function PageHeader({
  eyebrow,
  title,
  lead,
  crumbs,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  crumbs?: Crumb[];
}) {
  return (
    <header className="border-b border-line">
      <div className="container-editorial py-12 sm:py-16">
        {crumbs && <Breadcrumbs items={crumbs} />}
        <div className={crumbs ? "mt-6 max-w-3xl" : "max-w-3xl"}>
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-ink sm:text-4xl lg:text-[2.75rem]">
            {title}
          </h1>
          {lead && (
            <p className="mt-4 text-lg leading-relaxed text-ink-soft">{lead}</p>
          )}
        </div>
      </div>
    </header>
  );
}
