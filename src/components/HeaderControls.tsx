"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/lib/nav";
import type { SearchRecord } from "@/lib/search-core";
import { SearchDialog } from "@/components/search/SearchDialog";
import { SearchIcon, MenuIcon, CloseIcon } from "@/components/icons";

interface Props {
  navItems: NavItem[];
  index: SearchRecord[];
}

export function HeaderControls({ navItems, index }: Props) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Ferme le menu mobile lors d'un changement de page.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Raccourci clavier : Cmd/Ctrl + K pour ouvrir la recherche.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm text-ink-soft transition-colors hover:bg-bg-muted hover:text-ink"
          aria-label="Rechercher"
        >
          <SearchIcon className="h-[18px] w-[18px]" />
          <span className="hidden lg:inline">Rechercher</span>
        </button>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded-full p-2 text-ink transition-colors hover:bg-bg-muted md:hidden"
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={menuOpen}
          aria-controls="menu-mobile"
        >
          <MenuIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Drawer mobile */}
      {menuOpen && (
        <div className="fixed inset-0 z-[80] md:hidden" id="menu-mobile">
          <button
            type="button"
            aria-label="Fermer le menu"
            className="absolute inset-0 bg-ink/30 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          <nav className="absolute right-0 top-0 h-full w-[82%] max-w-xs overflow-y-auto border-l border-line bg-bg px-6 py-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <span className="eyebrow">Menu</span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="rounded-md p-1.5 text-ink-faint hover:bg-bg-muted hover:text-ink"
                aria-label="Fermer le menu"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
            <ul className="flex flex-col">
              {navItems.map((item) => {
                const active =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");
                return (
                  <li key={item.href} className="border-b border-line">
                    <Link
                      href={item.href}
                      className={`block py-3.5 font-serif text-lg ${
                        active ? "text-sage-dark" : "text-ink"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setSearchOpen(true);
              }}
              className="mt-6 inline-flex items-center gap-2 text-sm text-ink-soft"
            >
              <SearchIcon className="h-[18px] w-[18px]" /> Rechercher un
              article
            </button>
          </nav>
        </div>
      )}

      <SearchDialog
        index={index}
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </>
  );
}
