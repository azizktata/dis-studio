"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Assistant from "../../_components/Assistant";
import { ArrowRight, Portal } from "../../_components/Icons";
import IntakeWizard from "../../_components/IntakeWizard";
import Lightbox from "../../_components/Lightbox";
import PlanFigure from "../../_components/PlanFigure";
import PortalDrawer from "../../_components/PortalDrawer";
import VersionSwitch from "../../_components/VersionSwitch";
import {
  ambience,
  b2b,
  projects,
  services,
  software,
  studio,
} from "../../_lib/content";
import { sizeOf } from "../../_lib/imageSizes";
import { useReveal } from "../../_lib/useReveal";

const slides = [
  ambience.heroSalon,
  ambience.salonPoutres,
  ambience.sejourBois,
] as const;

/**
 * The gallery shows coloured 3D views only. Dimensioned drawings stay on their
 * project card and in the lightbox, where the detail is actually readable.
 */
const galleryShots = projects
  .filter((p) => !p.drawingsOnly)
  .flatMap((p) => (p.images ?? []).map((src) => ({ src, project: p })));

export default function Landing() {
  const [wizard, setWizard] = useState(false);
  const [portal, setPortal] = useState(false);
  const [slide, setSlide] = useState(0);
  const [solid, setSolid] = useState(false);
  const [openProject, setOpenProject] = useState<string | null>(null);
  useReveal();

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Auto-advance, paused for visitors who prefer reduced motion. */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(
      () => setSlide((s) => (s + 1) % slides.length),
      7000,
    );
    return () => window.clearInterval(id);
  }, []);

  return (
    <>
      <header className="nav" data-solid={solid}>
        {/* Inner column matches .shell so the bar aligns with the hero text. */}
        <div className="nav-inner">
        <a href="#top" className="wordmark">
          DIS Studio
        </a>
        <nav className="nav-links" aria-label="Principale">
          <a href="#projets">Projets</a>
          <a href="#galerie">Galerie</a>
          <a href="#services">Processus</a>
          <a href="#studios">Partenaire technique</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="nav-actions">
          <button className="nav-portal" onClick={() => setPortal(true)}>
            <Portal size={16} />
            Espace client
          </button>
          <button
            className="icon-btn icon-only"
            onClick={() => setPortal(true)}
            aria-label="Espace client"
          >
            <Portal size={20} />
          </button>
          <button className="cta" onClick={() => setWizard(true)}>
            Mon projet
          </button>
        </div>
        </div>
      </header>

      <main id="top">
        {/* ---------- hero carousel ---------- */}
        <section className="hero">
          {slides.map((s, i) => (
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
            {/* <p className="label" style={{ color: "inherit", opacity: 0.8 }}>
              {studio.location} · Depuis {studio.since}
            </p> */}
            <h1 className="disp">
              {studio.heroTitle} <em>{studio.heroTitleAccent}</em>
            </h1>
            <p className="hero-lede">{studio.heroLede}</p>
            <div className="hero-actions">
              <button className="cta" onClick={() => setWizard(true)}>
                Parler de mon projet
                <ArrowRight className="arrow" />
              </button>
              <a className="ghost" href="#projets">
                Voir les projets
                <ArrowRight className="arrow" />
              </a>
            </div>

            <div className="hero-foot">
              <div className="hero-nav" role="tablist" aria-label="Images">
                {slides.map((s, i) => (
                  <button
                    key={s.key}
                    role="tab"
                    aria-current={i === slide}
                    aria-label={`Image ${i + 1} sur ${slides.length}`}
                    onClick={() => setSlide(i)}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ---------- intro ---------- */}
        <section className="section shell">
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
              </p>
              <div className="intro-cols">
                <div data-reveal data-delay="1">
                  <h3>Pour les firmes &amp; cabinets</h3>
                  <p>
                    Plans techniques, modélisation et documentation produits à
                    vos gabarits et livrés sous votre nom.
                  </p>
                </div>
                <div data-reveal data-delay="2">
                  <h3>Pour les projets directs</h3>
                  <p>
                    Résidences, commerces et bureaux, du concept jusqu’au
                    chantier, avec un interlocuteur unique.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- film-strip portfolio ---------- */}
        <section className="section" id="projets">
          <div className="shell">
            <div className="sec-head">
              <h2 data-reveal>Projets récents</h2>
              <p className="label" data-reveal>
                {projects.length} réalisations
              </p>
            </div>
          </div>

          <div className="strip-wrap">
            <div className="strip">
              {projects.map((p) => (
                <button
                  className="card"
                  key={p.slug}
                  onClick={() => setOpenProject(p.slug)}
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
                        sizes="(min-width: 48rem) 24rem, 68vw"
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

        {/* ---------- gallery ---------- */}
        <section className="section shell" id="galerie">
          <div className="sec-head">
            <h2 data-reveal>Galerie</h2>
            <p className="label" data-reveal>
              {galleryShots.length} vues · cliquez pour agrandir
            </p>
          </div>
          <div className="gal">
            {galleryShots.map(({ src, project }, i) => (
              <button
                className="gal-item"
                key={src}
                data-reveal
                data-delay={(i % 3) + 1}
                onClick={() => setOpenProject(project.slug)}
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

        {/* ---------- services ---------- */}
        <section className="section shell" id="services">
          <div className="sec-head">
            <h2 data-reveal>Notre processus de collaboration</h2>
          </div>
          <div className="svc">
            {services.map((s, i) => (
              <article key={s.index} data-reveal data-delay={(i % 3) + 1}>
                <span className="svc-i">{s.index}</span>
                <h3>{s.title}</h3>
                <p>{s.summary}</p>
                <ul>
                  {s.detail.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        {/* ---------- b2b ---------- */}
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
                <button className="cta" onClick={() => setWizard(true)}>
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

        {/* ---------- software ---------- */}
        <section className="section shell">
          <div className="sec-head">
            <h2 data-reveal>Nos outils</h2>
            <p className="label" data-reveal>
              Fichiers sources fournis
            </p>
          </div>
          <div className="soft">
            {software.map((s) => (
              <div key={s.name} data-reveal>
                <span className="soft-n">{s.name}</span>
                <span className="soft-u">{s.use}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- contact ---------- */}
        <section className="section shell contact" id="contact">
          <div className="contact-card" data-reveal>
            <Image
              src={ambience.chambreChaude.src}
              alt=""
              fill
              sizes="100vw"
              className="contact-img"
              style={{ objectFit: "cover" }}
            />
            <p className="label" style={{ color: "inherit", opacity: 0.8 }}>
              Démarrer
            </p>
            <h2>Racontez-nous votre lieu</h2>
            <p>
              Quelques questions adaptées à votre projet, et nous revenons vers
              vous rapidement avec une première lecture, sans engagement.
            </p>
            <button className="cta" onClick={() => setWizard(true)}>
              Parler de mon projet
              <ArrowRight className="arrow" />
            </button>
          </div>
        </section>
      </main>

      <footer className="foot">
        <div className="shell">
          <div className="foot-grid">
            <div>
              <p className="wordmark">DIS Studio</p>
              <p style={{ marginTop: "0.7rem", maxWidth: "34ch", lineHeight: 1.7 }}>
                {studio.tagline}. Conception et production à Tunis.
                    {/* <p>© {studio.since} DIS Studio</p> */}
              </p>
            </div>
            
            <div>
              <h3>Studio</h3>
              <ul style={{ display: "grid", gap: "0.4rem" }}>
                <li>{studio.location}</li>
                <li>
                  <a href={`mailto:${studio.email}`}>{studio.email}</a>
                </li>
              </ul>
            </div>
            <div>
              <h3>Naviguer</h3>
              <ul style={{ display: "grid", gap: "0.4rem" }}>
                <li>
                  <a href="#projets">Projets</a>
                </li>
                <li>
                  <a href="#services">Processus</a>
                </li>
                <li>
                  <a href="#studios">Partenaire technique</a>
                </li>
                <li>
                  <button onClick={() => setPortal(true)}>Espace client</button>
                </li>
              </ul>
            </div>
          </div>
          {/* <div className="foot-base">
            <p>{photoCredit}</p>
            <p>© {studio.since} DIS Studio</p>
          </div> */}
        </div>
      </footer>

      <VersionSwitch />
      <Assistant />
      <IntakeWizard open={wizard} onClose={() => setWizard(false)} />
      <PortalDrawer open={portal} onClose={() => setPortal(false)} />
      <Lightbox
        project={projects.find((p) => p.slug === openProject) ?? null}
        onClose={() => setOpenProject(null)}
      />
    </>
  );
}
