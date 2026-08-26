"use client";

import Image from "next/image";
import { projects } from "../_lib/content";
import { sizeOf } from "../_lib/imageSizes";
import { useSite } from "./SiteShell";

/**
 * Coloured 3D views only. `drawingsOnly` projects are excluded on purpose:
 * the dossiers now run to 165 technical sheets, which would bury the rendered
 * interiors here. They stay reachable from their project card.
 */
const galleryShots = projects
  .filter((p) => !p.drawingsOnly)
  .flatMap((p) => (p.images ?? []).map((src) => ({ src, project: p })));

export default function Gallery() {
  const { openProject } = useSite();

  return (
    <section className="section shell" id="galerie">
      <div className="sec-head">
        <h2 data-reveal>Galerie</h2>
        <p className="label" data-reveal>
         cliquez pour agrandir
        </p>
      </div>
      <div className="gal">
        {galleryShots.map(({ src, project }, i) => (
          <button
            className="gal-item"
            key={src}
            data-reveal
            data-delay={(i % 3) + 1}
            onClick={() => openProject(project.slug)}
            aria-label={`${project.title}, agrandir l’image`}
          >
            {/* Intrinsic width/height: the masonry keeps each image's own
                ratio, so the tile reserves the right space before load. */}
            <Image
              src={src}
              alt={`${project.title}, ${project.category}`}
              width={sizeOf(src).w}
              height={sizeOf(src).h}
              sizes="(min-width: 62rem) 31vw, (min-width: 34rem) 47vw, 92vw"
            />
            <span className="gal-cap">{project.title}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
