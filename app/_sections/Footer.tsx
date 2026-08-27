"use client";

import Image from "next/image";
import { studio } from "../_lib/content";
import { useSite } from "./SiteShell";

export default function Footer() {
  const { openPortal } = useSite();

  return (
    <footer className="foot">
      <div className="shell">
        <div className="foot-grid">
          <div>
            {/* The footer is already dark, so the full lockup sits on its
                native ground with no tile needed. */}
            <Image
              className="foot-logo"
              src="/brand/logo-full.jpg"
              alt="DIS Studio — Design Innovation Solutions"
              width={720}
              height={669}
            />
            <p style={{ marginTop: "1rem", maxWidth: "34ch", lineHeight: 1.7 }}>
              Augmentez votre capacité de production grâce à une équipe technique qui s’intègre à la vôtre
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
                <a href="#pourquoi">Pourquoi DIS</a>
              </li>
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
                <button onClick={openPortal}>Espace client</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
