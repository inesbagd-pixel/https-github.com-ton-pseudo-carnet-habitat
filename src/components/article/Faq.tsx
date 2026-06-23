import type { FaqItem } from "@/lib/articles";

export function Faq({ items }: { items: FaqItem[] }) {
  if (!items || items.length === 0) return null;

  return (
    <section aria-labelledby="faq-heading" className="mt-16">
      <span className="eyebrow">Questions fréquentes</span>
      <h2
        id="faq-heading"
        className="mt-2 font-serif text-2xl font-semibold text-ink sm:text-[1.75rem]"
      >
        Vos questions, nos réponses
      </h2>
      <div className="mt-6 divide-y divide-line border-y border-line">
        {items.map((item, i) => (
          <details key={i} className="group py-2">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-3 font-serif text-lg font-medium text-ink marker:hidden">
              {item.question}
              <span
                aria-hidden
                className="shrink-0 text-xl text-sage-dark transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="pb-4 text-[0.97rem] leading-relaxed text-ink-soft">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
