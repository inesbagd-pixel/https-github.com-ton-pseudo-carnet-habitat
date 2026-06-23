/**
 * Injecte un script JSON-LD (Schema.org) dans la page.
 * Accepte un objet unique ou un tableau d'objets.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          // Les données proviennent de notre code, pas d'une entrée utilisateur.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
