import { NextResponse } from "next/server";

/**
 * Endpoint d'inscription à la newsletter.
 *
 * Prêt à être connecté à Brevo (ex-Sendinblue) : il suffit de renseigner les
 * variables d'environnement suivantes (voir .env.example) :
 *   - BREVO_API_KEY  : clé API Brevo (v3)
 *   - BREVO_LIST_ID  : identifiant de la liste de contacts (numérique)
 *
 * Sans configuration, l'endpoint valide l'e-mail et renvoie un succès simulé,
 * ce qui permet de développer et de démontrer le site sans dépendance externe.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let email = "";
  try {
    const body = (await request.json()) as { email?: unknown };
    email = typeof body.email === "string" ? body.email.trim() : "";
  } catch {
    return NextResponse.json(
      { message: "Requête invalide." },
      { status: 400 },
    );
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { message: "Merci d'indiquer une adresse e-mail valide." },
      { status: 422 },
    );
  }

  const apiKey = process.env.BREVO_API_KEY;
  const listId = process.env.BREVO_LIST_ID;

  // Mode démonstration : aucune clé configurée.
  if (!apiKey || !listId) {
    return NextResponse.json({
      message:
        "Merci ! Votre inscription est bien prise en compte (mode démonstration).",
      simulated: true,
    });
  }

  try {
    const res = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        email,
        listIds: [Number(listId)],
        updateEnabled: true,
      }),
    });

    // Brevo renvoie 201 (créé) ou 204 (mis à jour). 400 « duplicate_parameter »
    // signifie que le contact existe déjà : on considère l'inscription valide.
    if (res.ok) {
      return NextResponse.json({
        message: "Merci ! Votre inscription est bien enregistrée.",
      });
    }

    const error = (await res.json().catch(() => ({}))) as { code?: string };
    if (error.code === "duplicate_parameter") {
      return NextResponse.json({
        message: "Vous êtes déjà inscrit·e. Merci de votre fidélité !",
      });
    }

    return NextResponse.json(
      { message: "Inscription momentanément indisponible. Réessayez plus tard." },
      { status: 502 },
    );
  } catch {
    return NextResponse.json(
      { message: "Service indisponible. Merci de réessayer plus tard." },
      { status: 502 },
    );
  }
}
