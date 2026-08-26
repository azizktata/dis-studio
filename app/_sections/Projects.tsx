"use client";

import Image from "next/image";
import { ArrowRight } from "../_components/Icons";
import PlanFigure from "../_components/PlanFigure";
import { projects } from "../_lib/content";
import { useSite } from "./SiteShell";

export default function Projects() {
  const { openProject } = useSite();

  return (
    <section className="section" id="projets">
      <div className="shell">
        <div className="sec-head">
          <h2 data-reveal>Projets récents</h2>
          <p className="label" data-reveal>
              cliquez pour agrandir
          </p>
        </div>
      </div>

      <div className="strip-wrap">
        <div className="strip">
          {projects.map((p) => (
            <button
              className="card"
              key={p.slug}
              onClick={() => openProject(p.slug)}
              aria-label={`${p.title} : ${p.category}, voir les images`}
            >
              <span className="card-frame">
                {/* Every project now carries a real render or drawing; the
                    PlanFigure fallback remains for any added without one. */}
                {p.images?.length ? (
                  <Image
                    src={p.images[0]}
                    alt={`${p.title}, ${p.category}`}
                    fill
                    /* Must track the card widths in site.css — mobile cards are
                       82vw. Under-declaring here makes the optimiser serve a
                       source narrower than the frame, which then magnifies. */
                    sizes="(min-width: 48rem) 24rem, 82vw"
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <span className="card-plan">
                    <PlanFigure variant={p.slug} />
                    <span className="card-sheets">
                      {p.software} · {p.sheets ? `${p.sheets} planches` : ""}
                    </span>
                  </span>
                )}
              </span>
              <span className="card-body">
                <span className="card-title">{p.title}</span>
                <span className="card-meta">
                  {p.category} · {p.year}
                </span>
              </span>
            </button>
          ))}
        </div>
        <p className="strip-hint">
          <ArrowRight size={14} />
          Faites défiler
        </p>
      </div>
    </section>
  );
}
