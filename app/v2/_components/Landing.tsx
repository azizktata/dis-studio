"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
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
import Assistant from "../../_components/Assistant";
import { ArrowRight, Portal } from "../../_components/Icons";
import IntakeWizard from "../../_components/IntakeWizard";
import Lightbox from "../../_components/Lightbox";
import PlanFigure from "../../_components/PlanFigure";
import PortalDrawer from "../../_components/PortalDrawer";
import VersionSwitch from "../../_components/VersionSwitch";

type Track = "clients" | "studios";

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
  const [track, setTrack] = useState<Track>("clients");
  const [solid, setSolid] = useState(false);
  const [openProject, setOpenProject] = useState<string | null>(null);
  useReveal();

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > window.innerHeight * 0.82);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const forStudios = track === "studios";

  /*
   * The segmenter re-weights the page rather than just swapping a label: the
   * studios track shows the production work — drawing sets and modelling —
   * which is what a partner studio is buying.
   */
  const shown = forStudios ? projects.filter((p) => p.drawingsOnly) : projects;

  return (
    <>
      <header className="nav" data-solid={solid}>
        {/* Inner column matches .shell so the bar aligns with the hero text. */}
        <div className="nav-inner">
        <a href="#top" className="wordmark">
          DIS Studio
        </a>
        <nav className="nav-links" aria-label="Principale">
          <a href="#realisations">Réalisations</a>
          <a href="#galerie">Galerie</a>
          <a href="#services">Processus</a>
          <a href="#studios">Partenaire technique</a>
          <a href="#contact">Contact</a>
        </nav>
        <div className="nav-actions">
          <button className="nav-portal" onClick={() => setPortal(true)}>
            <Portal />
            <span>Espace client</span>
          </button>
          <button
            className="nav-portal-sm"
            onClick={() => setPortal(true)}
            aria-label="Espace client"
          >
            <Portal size={20} />
          </button>
          <button className="cta" onClick={() => setWizard(true)}>
            {/* Short label on mobile; the hero already carries the full CTA. */}
            <span className="cta-long">Démarrer un projet</span>
            <span className="cta-short">Demander</span>
            <ArrowRight className="arrow" />
          </button>
        </div>
        </div>
      </header>

      <main id="top">
        {/* ---------- hero ---------- */}
        <section className="hero">
          <div className="hero-media">
            <Image
              src={ambience.heroSalon.src}
              alt={ambience.heroSalon.alt}
              fill
              priority
              sizes="100vw"
              style={{ objectFit: "cover" }}
            />
            <div className="hero-scrim" />
          </div>

          <div className="shell hero-inner">
            <div>
              <h1 className="serif hero-title">
                {studio.heroTitle} <em>{studio.heroTitleAccent}</em>
              </h1>
            </div>

            <div className="hero-foot">
              <p className="hero-blurb">{studio.heroLede}</p>
              <div className="hero-actions">
                <button className="cta" onClick={() => setWizard(true)}>
                  Démarrer un projet
                  <ArrowRight className="arrow" />
                </button>
                <a className="ghost" href="#realisations">
                  Voir les réalisations
                  <ArrowRight className="arrow" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- dual-track segmenter ---------- */}
        <div className="segmenter">
          <div className="shell">
            <div className="seg-inner" role="tablist" aria-label="Deux offres">
              <button
                role="tab"
                className="seg-btn"
                aria-selected={!forStudios}
                onClick={() => setTrack("clients")}
              >
                <span className="seg-index">01</span>
                <span className="seg-name">Projets directs</span>
              </button>
              <button
                role="tab"
                className="seg-btn"
                aria-selected={forStudios}
                onClick={() => setTrack("studios")}
              >
                <span className="seg-index">02</span>
                <span className="seg-name">Firmes &amp; cabinets</span>
              </button>
            </div>
          </div>
        </div>

        {/* ---------- intro ---------- */}
        <section className="section shell">
          <div className="intro-grid">
            <p className="label" data-reveal>
              {forStudios ? "Partenaire technique" : "L’équipe"}
            </p>
            <div className="intro-body">
              {/* The positioning statement is this section's heading — keeps
                  h1 → h2 → h3 sequential for screen readers. */}
              <h2 className="lede serif" data-reveal style={{ lineHeight: 1.3 }}>
                {forStudios
                  ? "Nous produisons pour d’autres équipes de conception, à vos gabarits et sous votre nom."
                  : studio.positioning}
              </h2>
              <div className="intro-tracks">
                <div className="track" data-reveal data-delay="1">
                  <h3>Conception</h3>
                  <p>
                    Concept, aménagement et matières, jusqu’aux plans que vos
                    équipes et vos entrepreneurs peuvent suivre sans
                    interprétation.
                  </p>
                </div>
                <div className="track" data-reveal data-delay="2">
                  <h3>Dessin technique &amp; 3D</h3>
                  <p>
                    Plans cotés, modélisation et rendus produits à vos gabarits,
                    livrés en fichiers sources exploitables.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- portfolio ---------- */}
        <section className="section shell" id="realisations">
          <div className="sec-head">
            <h2 data-reveal>
              {forStudios ? "Production livrée" : "Réalisations"}
            </h2>
            <p className="label" data-reveal>
              {shown.length} projets · 4 catégories
            </p>
          </div>

          <div className="folio">
            {shown.map((p, i) => (
              <button
                className="folio-item"
                key={p.slug}
                data-reveal
                data-delay={(i % 3) + 1}
                onClick={() => setOpenProject(p.slug)}
                aria-label={`${p.title}, voir les images`}
              >
                <span className="folio-frame">
                  {/* Every project now carries a real render or drawing; the
                      PlanFigure fallback remains for any added without one. */}
                  {p.images?.length ? (
                    <Image
                      src={p.images[0]}
                      alt={`${p.title}, ${p.category}`}
                      fill
                      sizes="(min-width: 48rem) 46vw, 92vw"
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <span className="folio-sheet">
                      <PlanFigure variant={p.slug} className="folio-plan" />
                      <span className="folio-sheet-foot">
                        <span>{p.software}</span>
                        <span>{p.sheets ? `${p.sheets} planches` : ""}</span>
                      </span>
                    </span>
                  )}
                </span>
                <span className="folio-caption">
                  <span className="folio-title">{p.title}</span>
                  <span className="folio-meta">
                    <span>{p.category}</span>
                    <span>{p.software}</span>
                    <span>{p.year}</span>
                  </span>
                </span>
              </button>
            ))}
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
                aria-label={`${project.title}, agrandir`}
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
          <div className="services">
            {services.map((s) => (
              <article className="service" key={s.index} data-reveal>
                <span className="service-index">{s.index}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p style={{ marginTop: "0.5rem" }}>{s.summary}</p>
                </div>
                <ul className="service-detail">
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
            <div className="b2b-media" data-reveal>
            {/* Collaboration over technical drawings — the section is about
                partnership, and the dimensioned sheets read as busy here. */}
              <Image
                src={ambience.atelierDessin.src}
                alt={ambience.atelierDessin.alt}
                fill
                sizes="(min-width: 62rem) 38vw, 92vw"
                style={{ objectFit: "cover" }}
              />
            </div>
            <div>
              <p className="label" data-reveal>
                {b2b.title}
              </p>
              <h2
                className="serif"
                data-reveal
                style={{ fontSize: "var(--t-h2)", marginTop: "1rem", maxWidth: "22ch" }}
              >
                {b2b.lede}
              </h2>
              <p className="prose" data-reveal style={{ marginTop: "1.25rem" }}>
                {b2b.body}
              </p>
              <div className="b2b-points">
                {b2b.points.map((pt, i) => (
                  <div className="b2b-point" key={pt.title} data-reveal data-delay={i + 1}>
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
              <p style={{ marginTop: "2rem" }}>
                <button className="cta" onClick={() => setWizard(true)}>
                  Demander une soumission
                  <ArrowRight className="arrow" />
                </button>
              </p>
            </div>
          </div>
        </section>

        {/* ---------- software ---------- */}
        <section className="section shell">
          <div className="sec-head">
            <h2 data-reveal>Logiciels &amp; livrables</h2>
            <p className="label" data-reveal>
              Fichiers sources fournis
            </p>
          </div>
          <div className="soft">
            {software.map((s) => (
              <div className="soft-row" key={s.name} data-reveal>
                <span className="soft-name serif">{s.name}</span>
                <span className="soft-use">{s.use}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- contact ---------- */}
        <section className="section contact" id="contact">
          <div className="contact-media">
            <Image
              src={ambience.salonPoutres.src}
              alt=""
              fill
              sizes="100vw"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="shell contact-inner">
            <p className="label" style={{ color: "inherit", opacity: 0.7 }} data-reveal>
              Demande de prestation
            </p>
            <h2 data-reveal>Dites-nous où vous en êtes</h2>
            <p data-reveal>
              Quelques questions adaptées à votre projet, et nous revenons vers vous
              rapidement avec une première lecture.
            </p>
            <button className="cta" onClick={() => setWizard(true)} data-reveal>
              Ouvrir le formulaire
              <ArrowRight className="arrow" />
            </button>
          </div>
        </section>
      </main>

      <footer className="foot">
        <div className="shell">
          <div className="foot-grid">
            <div>
              <p className="wordmark" style={{ color: "var(--os)" }}>
                DIS Studio
              </p>
              <p style={{ marginTop: "0.75rem", maxWidth: "34ch", lineHeight: 1.7 }}>
                {studio.tagline}. Conception et production à Tunis.
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
                  <a href="#realisations">Réalisations</a>
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
