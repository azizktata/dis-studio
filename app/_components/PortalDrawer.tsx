"use client";

import { useId } from "react";
import {
  loyalty,
  portalDocuments,
  portalMessages,
  portalRequest,
  requestStages,
} from "../_lib/content";
import { useOverlay } from "../_lib/useOverlay";
import { Close, Document, Download } from "./Icons";

type Props = { open: boolean; onClose: () => void };

export default function PortalDrawer({ open, onClose }: Props) {
  const panel = useOverlay(open, onClose);
  const titleId = useId();

  if (!open) return null;

  const pct = Math.round((loyalty.points / loyalty.nextAt) * 100);

  return (
    <div className="ov" role="presentation">
      <button className="ov-scrim" onClick={onClose} tabIndex={-1} aria-hidden="true" />
      <div
        className="ov-panel drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        ref={panel}
      >
        <header className="ov-head">
          <div>
            <p className="label">Aperçu de l’espace client</p>
            <h2 id={titleId} className="ov-title">
              Votre projet, suivi de bout en bout
            </h2>
          </div>
          <button className="ov-close" onClick={onClose} aria-label="Fermer">
            <Close />
          </button>
        </header>

        <p className="drawer-note">
          Démonstration de l’espace client. Les données présentées sont fictives.
        </p>

        <section className="drawer-sec">
          <div className="drawer-sec-head">
            <h3>Demande en cours</h3>
            <span className="drawer-ref">{portalRequest.reference}</span>
          </div>
          <p className="drawer-project">{portalRequest.title}</p>
          <p className="drawer-sub">
            {portalRequest.service} · mise à jour {portalRequest.updated}
          </p>

          {/* Stage tracker as a ruled sequence, not a row of pills. */}
          <ol className="track-line">
            {requestStages.map((stage, i) => (
              <li
                key={stage}
                data-state={
                  i < portalRequest.stageIndex
                    ? "done"
                    : i === portalRequest.stageIndex
                      ? "current"
                      : "todo"
                }
              >
                <span className="track-dot" aria-hidden="true" />
                <span className="track-label">{stage}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="drawer-sec">
          <h3>Documents</h3>
          <ul className="vault">
            {portalDocuments.map((d) => (
              <li key={d.name}>
                <span className="vault-icon" aria-hidden="true">
                  <Document />
                </span>
                <span className="vault-main">
                  <span className="vault-name">{d.name}</span>
                  <span className="vault-meta">
                    {d.kind} · {d.size} · {d.date}
                  </span>
                </span>
                <button className="vault-dl" aria-label={`Télécharger ${d.name}`}>
                  <Download />
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="drawer-sec">
          <h3>Échanges</h3>
          <ul className="thread">
            {portalMessages.map((m, i) => (
              <li key={i} data-self={m.from === "Vous"}>
                <span className="thread-from">
                  {m.from} <span className="thread-at">{m.at}</span>
                </span>
                <p>{m.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="drawer-sec">
          <h3>Fidélité</h3>
          <p className="loyalty-count">
            <strong>{loyalty.points}</strong> points
          </p>
          <p className="drawer-sub">
            Encore {loyalty.nextAt - loyalty.points} points avant la prochaine
            récompense.
          </p>
          <div
            className="loyalty-bar"
            role="progressbar"
            aria-valuenow={loyalty.points}
            aria-valuemin={0}
            aria-valuemax={loyalty.nextAt}
            aria-label="Progression fidélité"
          >
            <span style={{ width: `${pct}%` }} />
          </div>
          <ul className="rewards">
            {loyalty.rewards.map((r) => (
              <li key={r.at} data-unlocked={r.unlocked}>
                <span className="rewards-at">{r.at} pts</span>
                <span className="rewards-label">{r.label}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
