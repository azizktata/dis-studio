import Image from "next/image";
import { ambience, studio } from "../_lib/content";

/*
 * Bottom padding is dropped here (`section-joined`) so this and <WhyDis/> read
 * as one movement rather than two separate blocks.
 */
export default function Intro() {
  return (
    <section className="section section-joined shell">
      <div className="intro-grid">
        <div className="intro-media" data-reveal>
          {/* An architectural overview reads as "équipe de conception";
              the slot is 3:2 to match this source without cropping. */}
          <Image
            src={ambience.archiVerriere.src}
            alt={ambience.archiVerriere.alt}
            fill
            sizes="(min-width: 56rem) 34vw, 92vw"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div>
          <p className="label" data-reveal>
            L’équipe
          </p>
          {/* Serves as this section's heading — keeps h1 → h2 → h3 sequential. */}
          <h2 className="intro-lede" data-reveal style={{ marginTop: "1rem" }}>
            Une équipe de conception qui devient une extension de la vôtre.
          </h2>
          <p className="prose" data-reveal style={{ marginTop: "1.25rem" }}>
            {studio.positioning}
            <br />
            <br />
            Notre équipe s’adapte à vos méthodes, vos logiciels, vos standards
            et vos échéanciers. Confiez-nous une partie ou la totalité de vos
            besoins en conception, dessin technique et modélisation 3D.
          </p>
          <div className="intro-cols">
            {/* <div data-reveal data-delay="1">
              <h3>Une capacité de production adaptée à vos besoins</h3>
              <p></p>
            </div> */}
            {/* <div data-reveal data-delay="2">
              <h3>Pour les projets directs</h3>
              <p>
                Résidences, commerces et bureaux, du concept jusqu’au chantier,
                avec un interlocuteur unique.
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
}
