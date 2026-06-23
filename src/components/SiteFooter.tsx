import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { categoryNav, footerNav } from "@/lib/nav";
import {
  InstagramIcon,
  PinterestIcon,
  FacebookIcon,
  YoutubeIcon,
} from "@/components/icons";

const socials = [
  { label: "Instagram", href: siteConfig.social.instagram, Icon: InstagramIcon },
  { label: "Pinterest", href: siteConfig.social.pinterest, Icon: PinterestIcon },
  { label: "Facebook", href: siteConfig.social.facebook, Icon: FacebookIcon },
  { label: "YouTube", href: siteConfig.social.youtube, Icon: YoutubeIcon },
];

export function SiteFooter() {
  const year = 2026;

  return (
    <footer className="mt-24 border-t border-line bg-bg-muted">
      <div className="container-editorial py-14">
        <div className="grid gap-10 md:grid-cols-12">
          {/* Marque */}
          <div className="md:col-span-5">
            <p className="font-serif text-lg">
              <span className="font-semibold text-ink">Carnet</span>{" "}
              <span className="italic text-sage-dark">Habitat</span>
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-soft">
              {siteConfig.tagline} Un magazine indépendant pour mieux entretenir,
              rénover et aménager votre logement.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:border-sage hover:text-sage-dark"
                >
                  <Icon className="h-[18px] w-[18px]" />
                </a>
              ))}
            </div>
          </div>

          {/* Rubriques */}
          <div className="md:col-span-3">
            <h2 className="eyebrow">Rubriques</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {categoryNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-ink-soft transition-colors hover:text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Le magazine */}
          <div className="md:col-span-4">
            <h2 className="eyebrow">Le magazine</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {footerNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-ink-soft transition-colors hover:text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-ink-soft transition-colors hover:text-ink"
                >
                  {siteConfig.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-line pt-6 text-xs text-ink-faint sm:flex-row sm:items-center">
          <p>
            © {year} {siteConfig.name}. Tous droits réservés.
          </p>
          <p>
            Magazine éditorial indépendant — conseils habitat fiables, à visée
            informative.
          </p>
        </div>
      </div>
    </footer>
  );
}
