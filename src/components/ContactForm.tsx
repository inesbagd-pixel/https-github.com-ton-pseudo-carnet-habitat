"use client";

import { useState, type FormEvent } from "react";
import { CheckIcon } from "@/components/icons";

type Status = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json().catch(() => ({}))) as { message?: string };
      if (res.ok) {
        setStatus("success");
        setMessage(
          json.message ?? "Merci, votre message a bien été envoyé.",
        );
        form.reset();
      } else {
        setStatus("error");
        setMessage(json.message ?? "Une erreur est survenue. Réessayez.");
      }
    } catch {
      setStatus("error");
      setMessage("Connexion impossible. Merci de réessayer plus tard.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-sage/40 bg-sage-soft/50 p-8 text-center">
        <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-bg text-sage-dark">
          <CheckIcon className="h-6 w-6" />
        </span>
        <p className="mt-4 font-serif text-xl text-ink">Message envoyé</p>
        <p className="mt-2 text-sm text-ink-soft">{message}</p>
      </div>
    );
  }

  const fieldClass =
    "w-full rounded-lg border border-line bg-bg px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-sage";

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-ink">
            Nom
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            className={fieldClass}
            placeholder="Votre nom"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className={fieldClass}
            placeholder="votre@email.fr"
          />
        </div>
      </div>
      <div>
        <label htmlFor="subject" className="mb-1.5 block text-sm font-medium text-ink">
          Sujet
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          required
          className={fieldClass}
          placeholder="L'objet de votre message"
        />
      </div>
      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-ink">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          className={`${fieldClass} resize-y`}
          placeholder="Votre message…"
        />
      </div>

      {status === "error" && (
        <p role="alert" className="text-sm text-terracotta-dark">
          {message}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex items-center justify-center rounded-full bg-ink px-7 py-3 text-sm font-medium text-bg transition-colors hover:bg-sage-dark disabled:opacity-60"
      >
        {status === "loading" ? "Envoi en cours…" : "Envoyer le message"}
      </button>
    </form>
  );
}
