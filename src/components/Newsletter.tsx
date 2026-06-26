"use client";

import { useState, type FormEvent } from "react";
import { CheckIcon, ArrowRightIcon } from "@/components/icons";

type Status = "idle" | "loading" | "success" | "error";

interface Props {
  /** "panel" : grand bloc (homepage / catégories). "inline" : compact (article). */
  variant?: "panel" | "inline";
  title?: string;
  description?: string;
}

export function Newsletter({
  variant = "panel",
  title = "Le Carnet, chaque mois dans votre boîte mail",
  description = "Nos meilleurs guides habitat, entretien et rénovation — une fois par mois, sans spam.",
}: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        message?: string;
      };

      if (res.ok) {
        setStatus("success");
        setMessage(
          data.message ?? "Merci ! Votre inscription est bien enregistrée.",
        );
        setEmail("");
      } else {
        setStatus("error");
        setMessage(
          data.message ??
            "Une erreur est survenue. Merci de réessayer dans un instant.",
        );
      }
    } catch {
      setStatus("error");
      setMessage("Connexion impossible. Merci de réessayer plus tard.");
    }
  }

  const isInline = variant === "inline";

  return (
    <section
      aria-labelledby="newsletter-heading"
      className={
        isInline
          ? "rounded-xl border border-line bg-bg-muted p-6 sm:p-8"
          : "overflow-hidden rounded-2xl border border-line bg-bg-muted px-6 py-12 sm:px-12 sm:py-16"
      }
    >
      <div className={isInline ? "" : "mx-auto max-w-2xl text-center"}>
        {!isInline && <span className="eyebrow">Newsletter</span>}
        <h2
          id="newsletter-heading"
          className={
            isInline
              ? "font-serif text-xl font-semibold text-ink"
              : "mt-3 font-serif text-2xl font-semibold text-ink sm:text-3xl"
          }
        >
          {title}
        </h2>
        <p
          className={
            isInline
              ? "mt-2 text-sm leading-relaxed text-ink-soft"
              : "mx-auto mt-3 max-w-xl text-[0.95rem] leading-relaxed text-ink-soft"
          }
        >
          {description}
        </p>

        {status === "success" ? (
          <p
            role="status"
            className={`mt-5 inline-flex items-center gap-2 rounded-full bg-bg px-4 py-2.5 text-sm font-medium text-sage-dark ${
              isInline ? "" : "mx-auto"
            }`}
          >
            <CheckIcon className="h-4 w-4" /> {message}
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className={`mt-6 flex flex-col gap-3 sm:flex-row ${
              isInline ? "" : "mx-auto max-w-md"
            }`}
            noValidate
          >
            <label htmlFor={`nl-email-${variant}`} className="sr-only">
              Adresse e-mail
            </label>
            <input
              id={`nl-email-${variant}`}
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.fr"
              className="w-full rounded-full border border-line bg-bg px-5 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-sage"
              disabled={status === "loading"}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-bg transition-colors hover:bg-sage-dark disabled:opacity-60"
            >
              {status === "loading" ? "Inscription…" : "S'inscrire"}
              {status !== "loading" && (
                <ArrowRightIcon className="h-4 w-4" />
              )}
            </button>
          </form>
        )}

        {status === "error" && (
          <p role="alert" className="mt-3 text-sm text-terracotta-dark">
            {message}
          </p>
        )}

        {status !== "success" && (
          <p
            className={`mt-3 text-xs text-ink-faint ${
              isInline ? "" : "mx-auto"
            }`}
          >
            En vous inscrivant, vous acceptez de recevoir nos e-mails. Désabonnement
            en un clic à tout moment.
          </p>
        )}
      </div>
    </section>
  );
}
