"use client";

import { useEffect, useId, useRef, useState } from "react";
import { chatFallback, chatIntro, chatScript } from "../_lib/content";
import { useOverlay } from "../_lib/useOverlay";
import { Close, Message, Send } from "./Icons";

type Turn = { role: "bot" | "user"; text: string };

/** Rule-based, no API: matches on the seeded questions, otherwise defers to email. */
function answerFor(input: string) {
  const q = input.toLowerCase();
  const hit = chatScript.find((s) => {
    const key = s.q.toLowerCase();
    if (q.includes(key.slice(0, 18))) return true;
    // Loose keyword match so free-typed questions still land.
    const words = key
      .replace(/[?»«.,]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 4);
    const overlap = words.filter((w) => q.includes(w)).length;
    return overlap >= 2;
  });
  return hit?.a ?? chatFallback;
}

export default function Assistant() {
  const [open, setOpen] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([{ role: "bot", text: chatIntro }]);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const panel = useOverlay(open, () => setOpen(false));
  const logRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [turns, pending]);

  const ask = (text: string) => {
    const clean = text.trim();
    if (!clean || pending) return;
    setTurns((t) => [...t, { role: "user", text: clean }]);
    setDraft("");
    setPending(true);
    // Brief pause so the reply reads as a response, not an instant paste.
    window.setTimeout(() => {
      setTurns((t) => [...t, { role: "bot", text: answerFor(clean) }]);
      setPending(false);
    }, 620);
  };

  const unasked = chatScript.filter(
    (s) => !turns.some((t) => t.role === "user" && t.text === s.q),
  );

  return (
    <>
      <button
        className="assist-trigger"
        onClick={() => setOpen(true)}
        aria-expanded={open}
      >
        <Message size={18} />
        <span>Assistant</span>
      </button>

      {open && (
        <div className="ov ov-corner" role="presentation">
          <button
            className="ov-scrim ov-scrim-soft"
            onClick={() => setOpen(false)}
            tabIndex={-1}
            aria-hidden="true"
          />
          <div
            className="ov-panel assist"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            ref={panel}
          >
            <header className="assist-head">
              <div>
                <h2 id={titleId} className="assist-title">
                  Assistant DIS
                </h2>
                <p className="assist-sub">Réponses courantes · lun–ven</p>
              </div>
              <button
                className="ov-close"
                onClick={() => setOpen(false)}
                aria-label="Fermer l’assistant"
              >
                <Close />
              </button>
            </header>

            <div className="assist-log" ref={logRef} role="log" aria-live="polite">
              {turns.map((t, i) => (
                <p key={i} className="assist-turn" data-role={t.role}>
                  {t.text}
                </p>
              ))}
              {pending && (
                <p className="assist-turn" data-role="bot" data-typing="true">
                  <span className="assist-dots" aria-label="L’assistant écrit">
                    <i />
                    <i />
                    <i />
                  </span>
                </p>
              )}
            </div>

            {unasked.length > 0 && (
              <div className="assist-suggest">
                {unasked.slice(0, 2).map((s) => (
                  <button key={s.q} onClick={() => ask(s.q)}>
                    {s.q}
                  </button>
                ))}
              </div>
            )}

            <form
              className="assist-form"
              onSubmit={(e) => {
                e.preventDefault();
                ask(draft);
              }}
            >
              <label htmlFor="assist-input" className="sr-only">
                Votre question
              </label>
              <input
                id="assist-input"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Posez votre question…"
                autoComplete="off"
              />
              <button type="submit" aria-label="Envoyer" disabled={!draft.trim()}>
                <Send />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
