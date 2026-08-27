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
        {/* <div className="intro-media" data-reveal>

          <Image
            src={ambience.archiVerriere.src}
            alt={ambience.archiVerriere.alt}
            fill
            sizes="(min-width: 56rem) 34vw, 92vw"
            style={{ objectFit: "cover" }}
          />
        </div> */}
          <div className="why-media" data-reveal>
                  <Image
                    src={ambience.archiVerriere.src}
                    alt={ambience.archiVerriere.alt}
                    fill
                    sizes="(min-width: 46rem) 24vw, 82vw"
                    /* A 16:9 render in a tall slot: centring it kept the empty sunlit
                       floor and cropped away the sample displays that make it read as
                       a showroom. Favour the upper band where that detail sits. */
                    style={{ objectFit: "cover", objectPosition: "50% 32%" }}
                  />
                  <span className="why-watermark" aria-hidden="true">
                    <Image src="/brand/logo-mark.png" alt="" width={464} height={298} />
                  </span>
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
