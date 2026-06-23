import Link from "next/link";
import { Logo } from "@/components/Logo";
import { HeaderControls } from "@/components/HeaderControls";
import { mainNav } from "@/lib/nav";
import { getSearchIndex } from "@/lib/search";

export function SiteHeader() {
  const index = getSearchIndex();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg/85 backdrop-blur-md">
      <div className="container-editorial">
        <div className="flex h-16 items-center justify-between gap-4">
          <Logo />

          <nav aria-label="Navigation principale" className="hidden md:block">
            <ul className="flex items-center gap-1">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="relative rounded-full px-3.5 py-2 text-sm font-medium text-ink-soft transition-colors hover:text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <HeaderControls navItems={mainNav} index={index} />
        </div>
      </div>
    </header>
  );
}
