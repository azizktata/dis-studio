import type { Metadata } from "next";
import { Bodoni_Moda, Public_Sans } from "next/font/google";
import "../globals.css";
import "./v2.css";
import "./overlays.css";

/* Editorial didone for display — high stroke contrast, gallery-caption feel. */
const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz"],
});

/* Humanist grotesque for body — quiet, legible, no personality contest. */
const publicSans = Public_Sans({
  variable: "--font-public",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DIS Studio — Conception, dessin technique et modélisation 3D",
  description:
    "Partenaire technique des firmes de design, cabinets d'architecture et fabricants de mobilier : conception, plans techniques 2D, modélisation et rendus 3D, documentation d'exécution.",
};

export default function V2Layout({ children }: LayoutProps<"/v2">) {
  return (
    <html lang="fr" className={`${bodoni.variable} ${publicSans.variable}`}>
      <body className="v2">{children}</body>
    </html>
  );
}
