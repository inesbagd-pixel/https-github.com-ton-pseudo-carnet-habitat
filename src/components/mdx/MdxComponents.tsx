import Link from "next/link";
import type { AnchorHTMLAttributes, ImgHTMLAttributes } from "react";

/**
 * Composants personnalisés injectés dans le rendu MDX.
 * Les articles sont écrits en Markdown standard ; ces composants assurent
 * un rendu cohérent (liens internes, images optimisées, encadrés).
 */

function MdxLink({
  href = "",
  children,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const isInternal = href.startsWith("/") || href.startsWith("#");
  if (isInternal) {
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
    </a>
  );
}

function MdxImg({ src = "", alt = "", ...rest }: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={typeof src === "string" ? src : ""}
      alt={alt}
      loading="lazy"
      decoding="async"
      {...rest}
    />
  );
}

/** Encadré « bon à savoir » utilisable dans les articles : <Note>…</Note> */
function Note({ children }: { children: React.ReactNode }) {
  return (
    <aside className="my-8 rounded-lg border-l-[3px] border-sage bg-sage-soft/50 p-5 text-[0.95rem] leading-relaxed text-ink-soft">
      <p className="mb-1 font-sans text-xs font-semibold uppercase tracking-wide text-sage-dark">
        Bon à savoir
      </p>
      {children}
    </aside>
  );
}

export const mdxComponents = {
  a: MdxLink,
  img: MdxImg,
  Note,
};
