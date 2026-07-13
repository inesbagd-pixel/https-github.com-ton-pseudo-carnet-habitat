"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Script from "next/script";

const STORAGE_KEY = "carnet-consent-v1";
const GA_ID = "G-MWEHH74X7Z";

type Choice = "granted" | "denied";

/**
 * Bandeau de consentement (RGPD/CNIL).
 * Google Analytics n'est chargé qu'après acceptation explicite : aucune
 * requête n'est envoyée à Google tant que le visiteur n'a pas choisi.
 * Le choix est mémorisé dans localStorage pour ne pas ré-afficher le bandeau.
 */
export function CookieConsent() {
  // undefined = pas encore lu (évite un flash au chargement)
  // null = aucun choix enregistré → afficher le bandeau
  const [choice, setChoice] = useState<Choice | null | undefined>(undefined);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      setChoice(saved === "granted" || saved === "denied" ? saved : null);
    } catch {
      setChoice(null);
    }
  }, []);

  function decide(value: Choice) {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* localStorage indisponible (navigation privée) : on continue sans mémoriser */
    }
    setChoice(value);
  }

  return (
    <>
      {choice === "granted" && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `}
          </Script>
        </>
      )}

      {choice === null && (
        <div
          role="dialog"
          aria-label="Gestion des cookies"
          className="no-print fixed inset-x-0 bottom-0 z-[90] border-t border-line bg-bg/95 backdrop-blur-sm"
        >
          <div className="container-editorial flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl text-sm leading-relaxed text-ink-soft">
              Nous utilisons des cookies de mesure d&apos;audience (Google
              Analytics) pour comprendre l&apos;usage du magazine et
              l&apos;améliorer. Vous pouvez les accepter ou les refuser.{" "}
              <Link
                href="/politique-de-confidentialite"
                className="text-ink underline decoration-line underline-offset-2 transition-colors hover:decoration-ink"
              >
                En savoir plus
              </Link>
            </p>
            <div className="flex shrink-0 gap-3">
              <button
                type="button"
                onClick={() => decide("denied")}
                className="rounded-md border border-line px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:border-ink hover:text-ink"
              >
                Refuser
              </button>
              <button
                type="button"
                onClick={() => decide("granted")}
                className="rounded-md bg-sage-dark px-4 py-2 text-sm font-medium text-bg transition-colors hover:bg-ink"
              >
                Accepter
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
