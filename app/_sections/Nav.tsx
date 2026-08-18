"use client";

import Image from "next/image";
import { Portal } from "../_components/Icons";
import { useSite } from "./SiteShell";

export default function Nav() {
  const { solid, openPortal, openWizard } = useSite();

  return (
    <header className="nav" data-solid={solid}>
      {/* Inner column matches .shell so the bar aligns with the hero text. */}
      <div className="nav-inner">
        {/*
          The mark keeps its obsidian ground — it is gold and off-white, so it
          only reads against dark. The tile is the honest treatment for raster
          artwork and echoes the logo's own construction.
        */}
        <a href="#top" className="wordmark" aria-label="DIS Studio, accueil">
          <span className="wordmark-tile">
            <Image
              src="/brand/logo-mark.jpg"
              alt=""
              width={480}
              height={314}
              priority
            />
          </span>
          <span className="wordmark-text">
            DIS Studio
            <em>Design Innovation Solutions</em>
          </span>
        </a>

        <nav className="nav-links" aria-label="Principale">
          <a href="#pourquoi">Pourquoi DIS</a>
          <a href="#projets">Projets</a>
          <a href="#galerie">Galerie</a>
          <a href="#services">Processus</a>
          <a href="#studios">Partenaire technique</a>
          <a href="#contact">Contact</a>
        </nav>

        <div className="nav-actions">
          <button className="nav-portal" onClick={openPortal}>
            <Portal size={16} />
            Espace client
          </button>
          <button
            className="icon-btn icon-only"
            onClick={openPortal}
            aria-label="Espace client"
          >
            <Portal size={20} />
          </button>
          <button className="cta" onClick={openWizard}>
            Mon projet
          </button>
        </div>
      </div>
    </header>
  );
}
