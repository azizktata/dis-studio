"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useState } from "react";
import type { Project } from "../_lib/content";
import { useOverlay } from "../_lib/useOverlay";
import { ArrowRight, Close } from "./Icons";

type Props = {
  project: Project | null;
  onClose: () => void;
};

/**
 * Full-bleed viewer for a project's image set.
 *
 * Shared by v1 and v3 — behaviour here, appearance in each version's CSS, the
 * same split the wizard and drawer already use. Reuses `useOverlay` for the
 * focus trap, Escape handling and scroll lock.
 */
export default function Lightbox({ project, onClose }: Props) {
  const [index, setIndex] = useState(0);
  /*
   * Reset to the first image when a different project opens. Tracking the slug
   * in state and comparing during render is React's adjust-state-on-props
   * pattern — an effect here would cause a second, cascading render.
   */
  const [shownSlug, setShownSlug] = useState(project?.slug);
  const panel = useOverlay(!!project, onClose);
  const titleId = useId();

  const count = project?.images?.length ?? 0;

  if (project?.slug !== shownSlug) {
    setShownSlug(project?.slug);
    setIndex(0);
  }

  const step = useCallback(
    (delta: number) => {
      if (count < 2) return;
      setIndex((i) => (i + delta + count) % count);
    },
    [count],
  );

  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        step(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        step(-1);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [project, step]);

  if (!project || !project.images?.length) return null;

  return (
    <div className="ov lb" role="presentation">
      <button className="ov-scrim" onClick={onClose} tabIndex={-1} aria-hidden="true" />
      <div
        className="lb-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        ref={panel}
      >
        <header className="lb-head">
          <div>
            <h2 id={titleId} className="lb-title">
              {project.title}
            </h2>
            <p className="lb-meta">
              {project.category} · {project.software} · {project.year}
            </p>
          </div>
          <button className="ov-close" onClick={onClose} aria-label="Fermer">
            <Close />
          </button>
        </header>

        <div className="lb-stage">
          <Image
            key={project.images[index]}
            src={project.images[index]}
            alt={`${project.title}, vue ${index + 1} sur ${count}`}
            fill
            sizes="(min-width: 60rem) 76vw, 96vw"
            style={{ objectFit: "contain" }}
            /* No `priority`: the lightbox opens on demand, and a 70-page
               dossier should never preload. */
          />
        </div>

        <footer className="lb-foot">
          {/* Count as typeset text rather than a row of dots. */}
          <p className="lb-count" aria-live="polite">
            {String(index + 1).padStart(2, "0")}
            <span> / {String(count).padStart(2, "0")}</span>
          </p>
          <p className="lb-deliverable">{project.deliverable}</p>
          {count > 1 && (
            <div className="lb-nav">
              <button onClick={() => step(-1)} aria-label="Image précédente">
                <ArrowRight className="lb-prev" size={17} />
              </button>
              <button onClick={() => step(1)} aria-label="Image suivante">
                <ArrowRight size={17} />
              </button>
            </div>
          )}
        </footer>
      </div>
    </div>
  );
}
