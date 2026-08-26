"use client";

import Image from "next/image";
import { ArrowRight } from "../_components/Icons";
import { ambience } from "../_lib/content";
import { useSite } from "./SiteShell";

export default function Contact() {
  const { openWizard } = useSite();

  return (
    <section className="section shell contact" id="contact">
      <div className="contact-card" data-reveal>
        <Image
          src={ambience.salonBois.src}
          alt=""
          fill
          sizes="100vw"
          className="contact-img"
          style={{ objectFit: "cover" }}
        />
        <p className="label" style={{ color: "inherit", opacity: 0.8 }}>
          Démarrer
        </p>
        <h2>Besoin de capacité supplémentaire ?</h2>
        <p>
          Confiez-nous une partie ou la totalité de votre production technique. Nous nous adaptons à vos logiciels, vos standards, votre charge de travail et vos échéanciers.
        </p>
        {/* End of page: the visitor has seen the work and the offer. */}
        <button className="cta" onClick={openWizard}>
          Demander une soumission
          <ArrowRight className="arrow" />
        </button>
      </div>
    </section>
  );
}
