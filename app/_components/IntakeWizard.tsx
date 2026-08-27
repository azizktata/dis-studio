"use client";

import { useId } from "react";
import {
  b2bSoftware,
  b2bVolumes,
  budgets,
  intakeServices,
  surfaces,
  timelines,
} from "../_lib/content";
import { stepLabels, useIntake } from "../_lib/useIntake";
import { useOverlay } from "../_lib/useOverlay";
import { ArrowRight, Check, Close } from "./Icons";

type Props = { open: boolean; onClose: () => void };

export default function IntakeWizard({ open, onClose }: Props) {
  const panel = useOverlay(open, onClose);
  const titleId = useId();
  const {
    step,
    answers,
    errors,
    submitted,
    set,
    toggleSoftware,
    next,
    back,
    reset,
  } = useIntake();

  if (!open) return null;

  const close = () => {
    onClose();
    // Let the exit finish before wiping the answers.
    window.setTimeout(reset, 300);
  };

  return (
    <div className="ov" role="presentation">
      <button className="ov-scrim" onClick={close} tabIndex={-1} aria-hidden="true" />
      <div
        className="ov-panel wiz"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        ref={panel}
      >
        <header className="ov-head">
          <div>
            <p className="label">Demande de prestation</p>
            <h2 id={titleId} className="ov-title">
              {submitted ? "Demande envoyée" : "Parlons de votre projet"}
            </h2>
          </div>
          <button className="ov-close" onClick={close} aria-label="Fermer">
            <Close />
          </button>
        </header>

        {submitted ? (
          <div className="wiz-done">
            <span className="wiz-done-mark" aria-hidden="true">
              <Check size={22} />
            </span>
            <h3>Merci, {answers.name.split(" ")[0] || "à bientôt"}.</h3>
            <p className="prose">
              Nous revenons vers vous rapidement à l’adresse{" "}
              <strong>{answers.email}</strong>.
              {answers.createAccount
                ? " Votre espace client est prêt : vous y suivrez l’avancement et y retrouverez vos documents."
                : " Vous pouvez ouvrir un espace client à tout moment pour suivre l’avancement."}
            </p>
            <button className="cta" onClick={close}>
              Fermer <ArrowRight className="arrow" />
            </button>
          </div>
        ) : (
          <>
            {/* Progress as a typeset rule, not a row of pills. */}
            <ol className="wiz-steps" aria-label="Étapes">
              {stepLabels.map((lbl, i) => (
                <li
                  key={lbl}
                  className="wiz-step"
                  data-state={i === step ? "current" : i < step ? "done" : "todo"}
                  aria-current={i === step ? "step" : undefined}
                >
                  <span className="wiz-step-n">{String(i + 1).padStart(2, "0")}</span>
                  <span className="wiz-step-l">{lbl}</span>
                </li>
              ))}
            </ol>

            <div className="wiz-body">
              {step === 0 && (
                <fieldset className="wiz-field">
                  <legend className="wiz-legend">
                    Processus de collaboration
                  </legend>
                  <div className="wiz-choices">
                    {intakeServices.map((s) => (
                      <label
                        key={s.key}
                        className="wiz-choice"
                        data-checked={answers.service === s.key}
                      >
                       
                        <span className="wiz-choice-t">{s.label}</span>
                        <span className="wiz-choice-h">{s.hint}</span>
                      </label>
                    ))}
                  </div>
                  {errors.service && <p className="wiz-error">{errors.service}</p>}
                </fieldset>
              )}

              {step === 1 && ( 
                <div className="wiz-stack">
                  <>
                      <Choice
                        label="Quel volume envisagez-vous ?"
                        name="volume"
                        options={b2bVolumes}
                        value={answers.volume}
                        onChange={(v) => set("volume", v)}
                        error={errors.volume}
                      />
                      <fieldset className="wiz-field">
                        <legend className="wiz-legend">
                          Quels logiciels vous faut-il&nbsp;?
                        </legend>
                        <div className="wiz-inline">
                          {b2bSoftware.map((s) => (
                            <label
                              key={s}
                              className="wiz-check"
                              data-checked={answers.software.includes(s)}
                            >
                              <input
                                type="checkbox"
                                checked={answers.software.includes(s)}
                                onChange={() => toggleSoftware(s)}
                              />
                              <span>{s}</span>
                            </label>
                          ))}
                        </div>
                        {errors.software && <p className="wiz-error">{errors.software}</p>}
                      </fieldset>
                      <Choice
                        label="Sous quelle échéance ?"
                        name="timeline"
                        options={timelines}
                        value={answers.timeline}
                        onChange={(v) => set("timeline", v)}
                      />
                  
                      {/* <Choice
                        label="Quelle surface approximative ?"
                        name="surface"
                        options={surfaces}
                        value={answers.surface}
                        onChange={(v) => set("surface", v)}
                        error={errors.surface}
                      />
                      <Choice
                        label="Sous quelle échéance ?"
                        name="timeline"
                        options={timelines}
                        value={answers.timeline}
                        onChange={(v) => set("timeline", v)}
                        error={errors.timeline}
                      />
                      <Choice
                        label="Quelle enveloppe budgétaire ?"
                        name="budget"
                        options={budgets}
                        value={answers.budget}
                        onChange={(v) => set("budget", v)}
                      /> */}
                    
                    </>
                  
                </div>
              )}

              {step === 2 && (
                <div className="wiz-stack">
                  <div className="wiz-row">
                    <Field
                      label="Nom"
                      value={answers.name}
                      onChange={(v) => set("name", v)}
                      error={errors.name}
                      autoComplete="name"
                    />
                    <Field
                      label="Courriel"
                      type="email"
                      value={answers.email}
                      onChange={(v) => set("email", v)}
                      error={errors.email}
                      autoComplete="email"
                    />
                  </div>
                  <Field
                    label="Votre projet en quelques mots"
                    value={answers.message}
                    onChange={(v) => set("message", v)}
                    textarea
                    optional
                  />
                  {/* <label className="wiz-check wiz-check-wide" data-checked={answers.createAccount}>
                    <input
                      type="checkbox"
                      checked={answers.createAccount}
                      onChange={(e) => set("createAccount", e.target.checked)}
                    />
                    <span>
                      Ouvrir mon espace client pour suivre l’avancement
                      <em>Suivi du dossier, documents et échanges au même endroit.</em>
                    </span>
                  </label> */}
                </div>
              )}
            </div>

            <footer className="wiz-foot">
              {step > 0 ? (
                <button className="ghost" onClick={back}>
                  Retour
                </button>
              ) : (
                <span />
              )}
              <button className="cta" onClick={next}>
                {step === 2 ? "Envoyer la demande" : "Continuer"}
                <ArrowRight className="arrow" />
              </button>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}

function Choice({
  label,
  name,
  options,
  value,
  onChange,
  error,
}: {
  label: string;
  name: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <fieldset className="wiz-field">
      <legend className="wiz-legend">{label}</legend>
      <div className="wiz-inline">
        {options.map((o) => (
          <label key={o} className="wiz-check" data-checked={value === o}>
            <input
              type="radio"
              name={name}
              value={o}
              checked={value === o}
              onChange={() => onChange(o)}
            />
            <span>{o}</span>
          </label>
        ))}
      </div>
      {error && <p className="wiz-error">{error}</p>}
    </fieldset>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  type = "text",
  textarea,
  optional,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: string;
  textarea?: boolean;
  optional?: boolean;
  autoComplete?: string;
}) {
  const id = useId();
  return (
    <p className="wiz-input">
      <label htmlFor={id} className="wiz-legend">
        {label}
        {optional && <span className="wiz-opt"> (facultatif)</span>}
      </label>
      {textarea ? (
        <textarea
          id={id}
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={error ? true : undefined}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          autoComplete={autoComplete}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={error ? true : undefined}
        />
      )}
      {error && <span className="wiz-error">{error}</span>}
    </p>
  );
}
