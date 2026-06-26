"use client";

import { useEffect, useState } from "react";
import {
  type PlannerInput,
  type Plan,
  type GuideLink,
  type LogementType,
  type ProjetType,
  type BudgetBucket,
  type Priorite,
  LOGEMENTS,
  PROJETS,
  BUDGETS,
  PRIORITES,
  generatePlan,
  encodeInput,
  decodeInput,
} from "@/lib/planner";
import { PlannerReport } from "@/components/outils/PlannerReport";
import { track, PlannerEvents } from "@/lib/analytics";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/icons";

interface Props {
  guides: Record<string, GuideLink>;
  currentYear: number;
}

interface Draft {
  logement?: LogementType;
  annee: string;
  surface: string;
  projet?: ProjetType;
  budget?: BudgetBucket;
  priorite?: Priorite;
}

const EMPTY_DRAFT: Draft = { annee: "", surface: "" };

const STEPS = ["Logement", "Projet", "Budget & priorité"] as const;

export function RenovationPlanner({ guides, currentYear }: Props) {
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [input, setInput] = useState<PlannerInput | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Restaure un plan partagé via l'URL (?l=..&a=..&s=..&p=..&b=..&pr=..).
  useEffect(() => {
    // Suivi : ouverture de l'outil.
    track(PlannerEvents.open);

    const params = new URLSearchParams(window.location.search);
    const decoded = decodeInput({
      l: params.get("l") ?? undefined,
      a: params.get("a") ?? undefined,
      s: params.get("s") ?? undefined,
      p: params.get("p") ?? undefined,
      b: params.get("b") ?? undefined,
      pr: params.get("pr") ?? undefined,
    });
    if (decoded) {
      setDraft({
        logement: decoded.logement,
        annee: String(decoded.annee),
        surface: String(decoded.surface),
        projet: decoded.projet,
        budget: decoded.budget,
        priorite: decoded.priorite,
      });
      setInput(decoded);
      setPlan(generatePlan(decoded));
      setStep(STEPS.length); // affiche directement le rapport
      // Suivi : plan affiché depuis un lien partagé.
      track(PlannerEvents.generate, { projet: decoded.projet, source: "lien_partage" });
    }
    // Exécuté une seule fois au montage.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = (patch: Partial<Draft>) => {
    setDraft((d) => ({ ...d, ...patch }));
    setError(null);
  };

  const validateStep = (s: number): string | null => {
    if (s === 0) {
      if (!draft.logement) return "Sélectionnez votre type de logement.";
      const annee = Number(draft.annee);
      if (!draft.annee || !Number.isFinite(annee) || annee < 1700 || annee > currentYear)
        return `Indiquez une année de construction valide (entre 1700 et ${currentYear}).`;
      const surface = Number(draft.surface);
      if (!draft.surface || !Number.isFinite(surface) || surface <= 0 || surface > 2000)
        return "Indiquez une surface approximative (en m²).";
    }
    if (s === 1 && !draft.projet) return "Choisissez votre type de projet.";
    if (s === 2) {
      if (!draft.budget) return "Sélectionnez une fourchette de budget.";
      if (!draft.priorite) return "Indiquez votre priorité principale.";
    }
    return null;
  };

  const goNext = () => {
    const err = validateStep(step);
    if (err) {
      setError(err);
      return;
    }
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
      return;
    }
    // Dernière étape : générer le plan.
    const built: PlannerInput = {
      logement: draft.logement!,
      annee: Number(draft.annee),
      surface: Number(draft.surface),
      projet: draft.projet!,
      budget: draft.budget!,
      priorite: draft.priorite!,
    };
    setInput(built);
    setPlan(generatePlan(built));
    const qs = new URLSearchParams(encodeInput(built)).toString();
    window.history.replaceState(null, "", `?${qs}`);
    setStep(STEPS.length); // étape « résultat »
    // Suivi : génération d'un plan depuis le questionnaire.
    track(PlannerEvents.generate, {
      projet: built.projet,
      logement: built.logement,
      priorite: built.priorite,
      budget: built.budget,
      source: "questionnaire",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    setError(null);
    setStep((s) => Math.max(0, s - 1));
  };

  const editAnswers = () => {
    setPlan(null);
    setStep(STEPS.length - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const restart = () => {
    setDraft(EMPTY_DRAFT);
    setPlan(null);
    setInput(null);
    setError(null);
    setStep(0);
    window.history.replaceState(null, "", window.location.pathname);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // -------------------------------------------------------------- Résultat
  if (plan && input && step >= STEPS.length) {
    return (
      <div id="planificateur" className="scroll-mt-24">
        <PlannerReport
          plan={plan}
          input={input}
          guides={guides}
          onEdit={editAnswers}
          onRestart={restart}
        />
      </div>
    );
  }

  // -------------------------------------------------------------- Formulaire
  return (
    <div id="planificateur" className="mx-auto max-w-2xl scroll-mt-24">
      {/* Progression */}
      <ol className="no-print flex items-center gap-2" aria-label="Progression">
        {STEPS.map((label, i) => {
          const state =
            i < step ? "done" : i === step ? "current" : "todo";
          return (
            <li key={label} className="flex flex-1 items-center gap-2">
              <div className="flex w-full flex-col gap-1.5">
                <span
                  className={`h-1.5 w-full rounded-full ${
                    state === "todo" ? "bg-line" : "bg-sage-dark"
                  }`}
                />
                <span
                  className={`text-xs ${
                    state === "current"
                      ? "font-semibold text-ink"
                      : "text-ink-faint"
                  }`}
                >
                  {i + 1}. {label}
                </span>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-8 rounded-2xl border border-line bg-bg p-6 sm:p-8">
        {step === 0 && (
          <Fieldset
            legend="Parlez-nous de votre logement"
            hint="Ces informations adaptent l'ordre des travaux et les points de vigilance."
          >
            <CardGroup label="Type de logement">
              {LOGEMENTS.map((o) => (
                <OptionCard
                  key={o.value}
                  name="logement"
                  label={o.label}
                  hint={o.hint}
                  selected={draft.logement === o.value}
                  onSelect={() => update({ logement: o.value })}
                />
              ))}
            </CardGroup>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <NumberField
                id="annee"
                label="Année de construction"
                placeholder="ex. 1985"
                value={draft.annee}
                min={1700}
                max={currentYear}
                onChange={(v) => update({ annee: v })}
              />
              <NumberField
                id="surface"
                label="Surface approximative (m²)"
                placeholder="ex. 90"
                value={draft.surface}
                min={1}
                max={2000}
                onChange={(v) => update({ surface: v })}
              />
            </div>
          </Fieldset>
        )}

        {step === 1 && (
          <Fieldset
            legend="Quel est votre projet ?"
            hint="Choisissez le chantier principal. Vous pourrez explorer les autres ensuite."
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {PROJETS.map((o) => (
                <OptionCard
                  key={o.value}
                  name="projet"
                  label={o.label}
                  hint={o.hint}
                  selected={draft.projet === o.value}
                  onSelect={() => update({ projet: o.value })}
                />
              ))}
            </div>
          </Fieldset>
        )}

        {step === 2 && (
          <Fieldset
            legend="Budget et priorité"
            hint="Pour ajuster le réalisme du plan et l'ordre des recommandations."
          >
            <CardGroup label="Budget estimé">
              {BUDGETS.map((o) => (
                <OptionCard
                  key={o.value}
                  name="budget"
                  label={o.label}
                  selected={draft.budget === o.value}
                  onSelect={() => update({ budget: o.value })}
                />
              ))}
            </CardGroup>

            <div className="mt-6">
              <CardGroup label="Votre priorité">
                {PRIORITES.map((o) => (
                  <OptionCard
                    key={o.value}
                    name="priorite"
                    label={o.label}
                    hint={o.hint}
                    selected={draft.priorite === o.value}
                    onSelect={() => update({ priorite: o.value })}
                  />
                ))}
              </CardGroup>
            </div>
          </Fieldset>
        )}

        {error && (
          <p role="alert" className="mt-5 text-sm font-medium text-terracotta-dark">
            {error}
          </p>
        )}

        <div className="mt-8 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 0}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-ink-soft transition-colors enabled:hover:text-ink disabled:opacity-0"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Précédent
          </button>
          <button
            type="button"
            onClick={goNext}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-bg transition-colors hover:bg-sage-dark"
          >
            {step === STEPS.length - 1 ? "Générer mon plan" : "Continuer"}
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sous-composants de formulaire                                      */
/* ------------------------------------------------------------------ */

function Fieldset({
  legend,
  hint,
  children,
}: {
  legend: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset>
      <legend className="font-serif text-xl font-semibold text-ink sm:text-2xl">
        {legend}
      </legend>
      {hint && <p className="mt-2 text-sm text-ink-soft">{hint}</p>}
      <div className="mt-6">{children}</div>
    </fieldset>
  );
}

function CardGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-faint">
        {label}
      </p>
      <div className="grid gap-3 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function OptionCard({
  name,
  label,
  hint,
  selected,
  onSelect,
}: {
  name: string;
  label: string;
  hint?: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
        selected
          ? "border-sage-dark bg-sage-soft/50 ring-1 ring-sage-dark"
          : "border-line bg-bg hover:border-sage hover:bg-sage-soft/20"
      }`}
    >
      <input
        type="radio"
        name={name}
        checked={selected}
        onChange={onSelect}
        className="mt-1 h-4 w-4 shrink-0 accent-sage-dark"
      />
      <span>
        <span className="block font-medium text-ink">{label}</span>
        {hint && (
          <span className="mt-0.5 block text-sm leading-snug text-ink-soft">
            {hint}
          </span>
        )}
      </span>
    </label>
  );
}

function NumberField({
  id,
  label,
  placeholder,
  value,
  min,
  max,
  onChange,
}: {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  min?: number;
  max?: number;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-ink">
        {label}
      </label>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        placeholder={placeholder}
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border border-line bg-bg px-4 py-3 text-ink outline-none transition-colors focus:border-sage-dark"
      />
    </div>
  );
}
