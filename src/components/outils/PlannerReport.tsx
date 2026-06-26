"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  type Plan,
  type PlannerInput,
  type GuideLink,
  type Difficulty,
  LOGEMENTS,
  BUDGETS,
  PRIORITES,
  formatCostRange,
} from "@/lib/planner";
import { track, PlannerEvents } from "@/lib/analytics";
import {
  PrinterIcon,
  RefreshIcon,
  ArrowLeftIcon,
  AlertIcon,
  CheckIcon,
  ArrowRightIcon,
  ChevronRightIcon,
  ClockIcon,
  ToolsIcon,
} from "@/components/icons";

interface Props {
  plan: Plan;
  input: PlannerInput;
  guides: Record<string, GuideLink>;
  onEdit: () => void;
  onRestart: () => void;
}

function labelFor<T extends { value: string; label: string }>(
  list: T[],
  value: string,
): string {
  return list.find((x) => x.value === value)?.label ?? value;
}

export function PlannerReport({ plan, input, guides, onEdit, onRestart }: Props) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  const toggle = (id: string) =>
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  const doneCount = plan.checklist.filter((c) => checked[c.id]).length;

  const handlePrint = () => {
    track(PlannerEvents.print, { projet: input.projet });
    window.print();
  };

  const handleShare = async () => {
    const url = window.location.href;
    const shareData = {
      title: `Mon plan de rénovation — ${plan.projetLabel}`,
      text: "Voici le plan de rénovation que j'ai préparé sur Carnet Habitat.",
      url,
    };
    // Sur mobile : feuille de partage native si disponible.
    if (typeof navigator.share === "function") {
      try {
        await navigator.share(shareData);
        track(PlannerEvents.share, { projet: input.projet, methode: "native" });
        return;
      } catch {
        // Partage annulé par l'utilisateur : on ne fait rien.
        return;
      }
    }
    // Sinon : copie du lien dans le presse-papiers.
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
      track(PlannerEvents.share, { projet: input.projet, methode: "copie" });
    } catch {
      // Presse-papiers indisponible : on ignore silencieusement.
    }
  };

  const resolvedGuides = plan.guideSlugs
    .map((slug) => guides[slug])
    .filter((g): g is GuideLink => Boolean(g))
    .slice(0, 8);

  const recap = [
    labelFor(LOGEMENTS, input.logement),
    `${input.surface} m²`,
    `construit en ${input.annee}`,
    `budget : ${labelFor(BUDGETS, input.budget).toLowerCase()}`,
    `priorité : ${labelFor(PRIORITES, input.priorite).toLowerCase()}`,
  ].join(" · ");

  return (
    <div className="mx-auto max-w-3xl">
      {/* En-tête du rapport (visible à l'écran et à l'impression) */}
      <div className="overflow-hidden rounded-2xl border border-line">
        <div className="bg-ink px-6 py-6 text-bg sm:px-8 sm:py-7">
          <span className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-bg/70">
            Plan de rénovation personnalisé
          </span>
          <h2 className="mt-2 font-serif text-2xl font-semibold sm:text-3xl">
            {plan.projetLabel}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-bg/75">{recap}</p>
        </div>

        {/* Rangée de statistiques visuelles */}
        <div className="grid grid-cols-1 divide-y divide-line border-t border-line bg-bg-muted sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <StatCard
            icon={<ClockIcon className="h-4 w-4" />}
            label="Durée du chantier"
            value={plan.durationShort}
            hint="hors préparation"
          />
          <StatCard
            icon={<ToolsIcon className="h-4 w-4" />}
            label="Difficulté"
            value={plan.difficultyLabel}
            hint={<DifficultyMeter level={plan.difficulty} />}
          />
          <StatCard
            icon={<span className="text-sm font-semibold">€</span>}
            label="Coût estimatif"
            value={formatCostRange(plan.cost)}
            hint={plan.cost.perM2 ? "selon la surface, hors aides" : "indicatif, hors aides"}
          />
        </div>
      </div>

      <p className="mt-5 text-[1.02rem] leading-relaxed text-ink-soft">
        {plan.summary}
      </p>
      <p className="mt-3 flex items-start gap-2 rounded-xl border border-sage/40 bg-sage-soft/40 p-4 text-sm leading-relaxed text-ink-soft">
        <ClockIcon className="mt-0.5 h-4 w-4 shrink-0 text-sage-dark" />
        <span>
          <strong className="text-ink">Durée détaillée :</strong>{" "}
          {plan.durationLabel}
        </span>
      </p>

      {/* Barre d'actions — masquée à l'impression */}
      <div className="no-print mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-bg transition-colors hover:bg-sage-dark"
        >
          <PrinterIcon className="h-4 w-4" />
          Imprimer / Enregistrer en PDF
        </button>
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-2 rounded-full border border-sage-dark bg-sage-soft/40 px-5 py-2.5 text-sm font-medium text-sage-dark transition-colors hover:bg-sage-soft"
        >
          {copied ? (
            <>
              <CheckIcon className="h-4 w-4" /> Lien copié !
            </>
          ) : (
            <>
              <ShareGlyph /> Partager mon plan
            </>
          )}
        </button>
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-2 rounded-full border border-line bg-bg px-5 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:bg-bg-muted"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Modifier
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-ink-faint transition-colors hover:text-ink"
        >
          <RefreshIcon className="h-4 w-4" />
          Recommencer
        </button>
      </div>

      {/* Travaux à réaliser avant les autres */}
      <ReportSection
        eyebrow="À faire en priorité"
        title="Les travaux à réaliser avant les autres"
      >
        <ul className="space-y-3">
          {plan.prerequisites.map((p, i) => (
            <li
              key={i}
              className="flex gap-3 rounded-xl border border-terracotta/30 bg-terracotta-soft/40 p-4"
            >
              <AlertIcon className="mt-0.5 h-5 w-5 shrink-0 text-terracotta-dark" />
              <span className="text-[0.97rem] leading-relaxed text-ink-soft">
                {p}
              </span>
            </li>
          ))}
        </ul>
      </ReportSection>

      {/* Étapes recommandées — timeline verticale */}
      <ReportSection
        eyebrow="Le déroulé"
        title="Les étapes, dans le bon ordre"
      >
        <ol className="relative ml-4 space-y-7 border-l-2 border-line pl-8">
          {plan.steps.map((step, i) => (
            <li key={i} className="relative break-inside-avoid">
              <span
                aria-hidden
                className="absolute -left-[2.45rem] flex h-8 w-8 items-center justify-center rounded-full border-2 border-sage-dark bg-bg font-serif text-sm font-semibold text-sage-dark"
              >
                {i + 1}
              </span>
              <h3 className="font-serif text-lg font-medium text-ink">
                {step.title}
              </h3>
              <p className="mt-1 text-[0.97rem] leading-relaxed text-ink-soft">
                {step.detail}
              </p>
            </li>
          ))}
        </ol>
      </ReportSection>

      {/* Points de vigilance */}
      <ReportSection eyebrow="À surveiller" title="Points de vigilance">
        <ul className="space-y-2.5">
          {plan.vigilance.map((v, i) => (
            <li key={i} className="flex gap-3 text-[0.97rem] leading-relaxed text-ink-soft">
              <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sage" />
              {v}
            </li>
          ))}
        </ul>
      </ReportSection>

      {/* Erreurs fréquentes */}
      <ReportSection eyebrow="À éviter" title="Les erreurs fréquentes">
        <ul className="space-y-2.5">
          {plan.mistakes.map((m, i) => (
            <li key={i} className="flex gap-3 text-[0.97rem] leading-relaxed text-ink-soft">
              <span aria-hidden className="mt-0.5 shrink-0 font-semibold text-terracotta-dark">
                ✕
              </span>
              {m}
            </li>
          ))}
        </ul>
      </ReportSection>

      {/* Note budgétaire */}
      <ReportSection eyebrow="Budget" title="Cohérence budgétaire">
        <p className="rounded-xl border border-line bg-bg-muted p-4 text-[0.97rem] leading-relaxed text-ink-soft">
          {plan.budgetNote}
        </p>
      </ReportSection>

      {/* Checklist interactive */}
      <ReportSection
        eyebrow="Passez à l'action"
        title="Votre checklist"
        aside={
          <span className="text-sm font-medium text-ink-faint">
            {doneCount}/{plan.checklist.length}
          </span>
        }
      >
        <ul className="divide-y divide-line border-y border-line">
          {plan.checklist.map((item) => (
            <li key={item.id}>
              <label className="flex cursor-pointer items-start gap-3 py-3">
                <input
                  type="checkbox"
                  checked={Boolean(checked[item.id])}
                  onChange={() => toggle(item.id)}
                  className="mt-1 h-4 w-4 shrink-0 accent-sage-dark"
                />
                <span
                  className={`text-[0.97rem] leading-relaxed ${
                    checked[item.id]
                      ? "text-ink-faint line-through"
                      : "text-ink-soft"
                  }`}
                >
                  {item.label}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </ReportSection>

      {/* Guides recommandés (maillage interne) */}
      {resolvedGuides.length > 0 && (
        <ReportSection
          eyebrow="Pour aller plus loin"
          title="Les guides Carnet Habitat à lire"
        >
          <ul className="grid gap-3 sm:grid-cols-2">
            {resolvedGuides.map((g) => (
              <li key={g.slug}>
                <Link
                  href={g.href}
                  className="group flex h-full items-center justify-between gap-3 rounded-xl border border-line bg-bg p-4 transition-colors hover:border-sage hover:bg-sage-soft/30"
                >
                  <span>
                    <span className="block text-[0.7rem] uppercase tracking-wide text-terracotta-dark">
                      {g.categoryName}
                    </span>
                    <span className="mt-0.5 block font-serif text-[1.02rem] font-medium text-ink">
                      {g.title}
                    </span>
                  </span>
                  <ChevronRightIcon className="h-4 w-4 shrink-0 text-ink-faint transition-transform group-hover:translate-x-0.5" />
                </Link>
              </li>
            ))}
          </ul>
        </ReportSection>
      )}

      {/* Bloc de partage — bien visible */}
      <div className="no-print mt-12 rounded-2xl border border-line bg-bg-muted p-6 sm:p-8">
        <div className="flex flex-col gap-1 text-center sm:text-left">
          <h3 className="font-serif text-xl font-semibold text-ink">
            Gardez ce plan ou partagez-le
          </h3>
          <p className="text-sm leading-relaxed text-ink-soft">
            Ce lien contient toutes vos réponses : enregistrez-le pour revenir à
            votre plan, ou envoyez-le à un proche ou à un artisan.
          </p>
        </div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <label htmlFor="share-url" className="sr-only">
            Lien de votre plan
          </label>
          <input
            id="share-url"
            type="text"
            readOnly
            value={shareUrl}
            onFocus={(e) => e.currentTarget.select()}
            className="w-full truncate rounded-full border border-line bg-bg px-5 py-3 text-sm text-ink-soft outline-none focus:border-sage"
          />
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-bg transition-colors hover:bg-sage-dark"
          >
            {copied ? (
              <>
                <CheckIcon className="h-4 w-4" /> Lien copié !
              </>
            ) : (
              <>
                <ShareGlyph /> Partager
              </>
            )}
          </button>
        </div>
      </div>

      {/* Avertissement / CTA final */}
      <div className="no-print mt-6 rounded-2xl border border-line bg-bg-muted p-6 text-center sm:p-8">
        <h3 className="font-serif text-xl font-semibold text-ink">
          Un plan pour décider, pas un devis
        </h3>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">
          Ce plan personnalisé vous aide à prioriser et à poser les bonnes
          questions. Pour chiffrer précisément votre projet, faites établir
          plusieurs devis par des professionnels qualifiés.
        </p>
        <Link
          href="/travaux/choisir-artisan-renovation"
          className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-sage-dark transition-colors hover:text-ink"
        >
          Bien choisir ses artisans
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>

      <p className="mt-8 text-center text-xs text-ink-faint">
        Plan généré par le Planificateur de rénovation Carnet Habitat —
        carnethabitat.fr
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sous-composants                                                    */
/* ------------------------------------------------------------------ */

function StatCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint?: React.ReactNode;
}) {
  return (
    <div className="px-5 py-4 text-center sm:py-5">
      <span className="inline-flex items-center gap-1.5 text-[0.7rem] font-semibold uppercase tracking-wide text-ink-faint">
        <span className="text-sage-dark">{icon}</span>
        {label}
      </span>
      <p className="mt-1.5 font-serif text-lg font-semibold text-ink">{value}</p>
      {hint && <div className="mt-1 text-xs text-ink-faint">{hint}</div>}
    </div>
  );
}

function DifficultyMeter({ level }: { level: Difficulty }) {
  const color =
    level === 1 ? "bg-sage" : level === 2 ? "bg-terracotta" : "bg-terracotta-dark";
  return (
    <span className="mt-1 inline-flex items-center justify-center gap-1" aria-hidden>
      {[1, 2, 3].map((n) => (
        <span
          key={n}
          className={`h-1.5 w-6 rounded-full ${n <= level ? color : "bg-line"}`}
        />
      ))}
    </span>
  );
}

function ShareGlyph() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="h-4 w-4"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" />
    </svg>
  );
}

function ReportSection({
  eyebrow,
  title,
  aside,
  children,
}: {
  eyebrow: string;
  title: string;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10 break-inside-avoid">
      <div className="flex items-end justify-between gap-4">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h2 className="mt-1.5 font-serif text-xl font-semibold text-ink sm:text-2xl">
            {title}
          </h2>
        </div>
        {aside}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}
