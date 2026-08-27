"use client";

import { useCallback, useMemo, useState } from "react";
import type { ServiceKey } from "./content";

/**
 * State machine behind the three-step intake wizard.
 *
 * Kept here rather than in a version folder so each version can render
 * their own markup around identical behaviour. Styling lives with the version.
 */

export type IntakeAnswers = {
  service: ServiceKey | null;
  surface: string;
  timeline: string;
  budget: string;
  volume: string;
  software: string[];
  name: string;
  email: string;
  message: string;
  createAccount: boolean;
};

const empty: IntakeAnswers = {
  service: null,
  surface: "",
  timeline: "",
  budget: "",
  volume: "",
  software: [],
  name: "",
  email: "",
  message: "",
  createAccount: true,
};

export const stepLabels = ["Prestation", "Votre projet", "Coordonnées"];

const emailLooksValid = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);

export function useIntake() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<IntakeAnswers>(empty);
  const [submitted, setSubmitted] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const set = useCallback(<K extends keyof IntakeAnswers>(key: K, value: IntakeAnswers[K]) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }, []);

  const toggleSoftware = useCallback((name: string) => {
    setAnswers((prev) => ({
      ...prev,
      software: prev.software.includes(name)
        ? prev.software.filter((s) => s !== name)
        : [...prev.software, name],
    }));
  }, []);

  const errors = useMemo(() => {
    const e: Partial<Record<keyof IntakeAnswers, string>> = {};
    // if (step === 0 && !answers.service) {
    //   e.service = "Choisissez une prestation pour continuer.";
    // }
    if (step === 1) {
    
        if (!answers.volume) e.volume = "Indiquez le volume envisagé.";
        if (answers.software.length === 0)
          e.software = "Sélectionnez au moins un logiciel.";
     
    }
    if (step === 2) {
      if (!answers.name.trim()) e.name = "Votre nom est requis.";
      if (!emailLooksValid(answers.email))
        e.email = "Saisissez une adresse courriel valide.";
    }
    return e;
  }, [step, answers]);

  const canAdvance = Object.keys(errors).length === 0;

  const next = useCallback(() => {
    if (!canAdvance) {
      setShowErrors(true);
      return;
    }
    setShowErrors(false);
    if (step === 2) {
      setSubmitted(true);
      return;
    }
    setStep((s) => Math.min(2, s + 1));
  }, [canAdvance, step]);

  const back = useCallback(() => {
    setShowErrors(false);
    setStep((s) => Math.max(0, s - 1));
  }, []);

  const reset = useCallback(() => {
    setStep(0);
    setAnswers(empty);
    setSubmitted(false);
    setShowErrors(false);
  }, []);

  return {
    step,
    answers,
    errors: showErrors ? errors : {},
    submitted,
    canAdvance,
    set,
    toggleSoftware,
    next,
    back,
    reset,
  };
}
