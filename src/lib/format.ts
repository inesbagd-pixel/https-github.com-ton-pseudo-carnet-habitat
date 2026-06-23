/** Formatage des dates en français (ex. « 12 mars 2026 »). */
export function formatDate(iso: string): string {
  if (!iso) return "";
  const date = new Date(iso + "T00:00:00");
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

/** Format court (ex. « 12/03/2026 »). */
export function formatDateShort(iso: string): string {
  if (!iso) return "";
  const date = new Date(iso + "T00:00:00");
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("fr-FR").format(date);
}

/** « 7 min de lecture » */
export function formatReadingTime(minutes: number): string {
  return `${minutes} min de lecture`;
}
