"use client";

import Image from "next/image";
import { ArrowRight } from "../_components/Icons";
import { ambience, b2b } from "../_lib/content";
import { useSite } from "./SiteShell";

export default function B2B() {
  const { openWizard } = useSite();

  return (
    <section className="section b2b" id="studios">
      <div className="shell b2b-grid">
        <div>
          <p className="label" data-reveal>
            {b2b.title}
          </p>
          <h2
            className="disp"
            data-reveal
            style={{ fontSize: "var(--t-h2)", marginTop: "0.85rem", maxWidth: "22ch" }}
          >
            {b2b.lede}
          </h2>
          <p className="prose" data-reveal style={{ marginTop: "1.1rem" }}>
            {b2b.body}
          </p>
          <div className="b2b-list">
            {b2b.points.map((pt, i) => (
              <div key={pt.title} data-reveal data-delay={i + 1}>
                <h3>{pt.title}</h3>
                <p>{pt.body}</p>
              </div>
            ))}
          </div>
          {/* Typeset as ruled lines — never pills. */}
          <ul className="b2b-reasons" data-reveal>
            {b2b.reasons.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
          <p style={{ marginTop: "1.9rem" }}>
            {/* Mid-page: by now the visitor knows the offer, so asking for a
                quote is the right action here. */}
            <button className="cta" onClick={openWizard}>
              Demander une soumission
              <ArrowRight className="arrow" />
            </button>
          </p>
        </div>
        {/* Collaboration over technical drawings — the section is about
            partnership, and the dimensioned sheets read as busy here. */}
        <div className="b2b-media" data-reveal>
          <Image
            src={ambience.atelierDessin.src}
            alt={ambience.atelierDessin.alt}
            fill
            sizes="(min-width: 58rem) 46vw, 92vw"
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>
    </section>
  );
}
