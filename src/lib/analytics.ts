/**
 * Suivi d'événements — sans dépendance ni script tiers.
 *
 * `track()` n'émet un événement QUE si une solution de mesure est déjà
 * présente dans la page au moment de l'exécution (Google Analytics / gtag,
 * Plausible, Umami, ou un dataLayer GTM). Si aucune n'est installée, l'appel
 * est silencieux (no-op). Le jour où une solution est ajoutée, le suivi
 * fonctionne automatiquement, sans modifier ce code.
 */

export type AnalyticsProps = Record<string, string | number | boolean | undefined>;

interface AnalyticsWindow {
  gtag?: (command: "event", event: string, params?: AnalyticsProps) => void;
  plausible?: (event: string, options?: { props?: AnalyticsProps }) => void;
  umami?: { track?: (event: string, props?: AnalyticsProps) => void };
  dataLayer?: Array<Record<string, unknown>>;
}

export function track(event: string, props: AnalyticsProps = {}): void {
  if (typeof window === "undefined") return;
  const w = window as unknown as AnalyticsWindow;

  try {
    if (typeof w.gtag === "function") {
      w.gtag("event", event, props);
    } else if (typeof w.plausible === "function") {
      w.plausible(event, { props });
    } else if (w.umami && typeof w.umami.track === "function") {
      w.umami.track(event, props);
    } else if (Array.isArray(w.dataLayer)) {
      w.dataLayer.push({ event, ...props });
    }
    // Aucune solution de mesure installée → no-op silencieux.
  } catch {
    // Le suivi ne doit jamais casser l'expérience utilisateur.
  }
}

/** Noms d'événements du planificateur de rénovation (centralisés). */
export const PlannerEvents = {
  open: "planificateur_ouvert",
  generate: "planificateur_plan_genere",
  print: "planificateur_impression",
  share: "planificateur_partage",
} as const;
