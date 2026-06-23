import { NextResponse } from "next/server";

/**
 * Endpoint du formulaire de contact.
 *
 * Pour la démonstration, il valide les champs et renvoie un succès.
 * En production, branchez ici l'envoi d'e-mail (Brevo, Resend, SMTP…) :
 * il suffit de remplacer la section « TODO » par l'appel au service choisi.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: Record<string, unknown> = {};
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ message: "Requête invalide." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const subject = String(body.subject ?? "").trim();
  const message = String(body.message ?? "").trim();

  if (!name || !subject || message.length < 10 || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { message: "Merci de remplir correctement tous les champs." },
      { status: 422 },
    );
  }

  // TODO (production) : envoyer l'e-mail via votre fournisseur.
  // Exemple Brevo :
  //   await fetch("https://api.brevo.com/v3/smtp/email", { ... })

  return NextResponse.json({
    message:
      "Merci pour votre message, nous vous répondrons dans les meilleurs délais.",
  });
}
