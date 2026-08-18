"use client";

import Image from "next/image";
import { ArrowRight } from "../_components/Icons";
import { studio } from "../_lib/content";
import { heroSlides, useSite } from "./SiteShell";

export default function Hero() {
  const { slide, setSlide } = useSite();

  return (
    <section className="hero">
      {heroSlides.map((s, i) => (
        <div key={s.key} className="hero-slide" data-active={i === slide}>
          <Image
            src={s.src}
            alt={i === slide ? s.alt : ""}
            fill
            priority={i === 0}
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
        </div>
      ))}
      <div className="hero-scrim" />

      <div className="shell hero-inner">
        {/*
          The headline changes with the slide. `key` forces a remount so each
          one fades in rather than swapping mid-word. aria-live is deliberately
          off: this rotates on a timer, and announcing every change would talk
          over a screen-reader user.
        */}
        <h1 className="disp hero-title" key={slide}>
          <span className="hero-line">{studio.heroTitles[slide].lead}</span>
          <em className="hero-line">{studio.heroTitles[slide].accent}</em>
        </h1>
        <p className="hero-lede">{studio.heroLede}</p>

        <div className="hero-actions">
          {/*
            A first-time visitor has not yet been told what DIS Studio does, so
            the primary action answers "why you?" rather than asking for a
            quote. The soumission CTAs live further down, once the offer has
            landed.
          */}
          <a className="cta" href="#pourquoi">
            Pourquoi DIS&nbsp;?
            <ArrowRight className="arrow" />
          </a>
          <a className="ghost" href="#projets">
            Voir les projets
            <ArrowRight className="arrow" />
          </a>
        </div>

        <div className="hero-foot">
          <div className="hero-nav" role="tablist" aria-label="Images">
            {heroSlides.map((s, i) => (
              <button
                key={s.key}
                role="tab"
                aria-current={i === slide}
                aria-label={`Image ${i + 1} sur ${heroSlides.length}`}
                onClick={() => setSlide(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
