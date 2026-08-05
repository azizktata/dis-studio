import type { Metadata } from "next";
import { Bodoni_Moda, Public_Sans } from "next/font/google";
import "../globals.css";
import "./v1.css";
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
  title: "DIS Studio — Atelier de design d'intérieur",
  description:
    "Des intérieurs réfléchis, du premier concept aux dessins prêts pour la production. Studio de design d'intérieur entre Montréal et Tunis.",
};

export default function V1Layout({ children }: LayoutProps<"/v1">) {
  return (
    <html lang="fr" className={`${bodoni.variable} ${publicSans.variable}`}>
      <body className="v1">{children}</body>
    </html>
  );
}
