import type { Metadata } from "next";
import { Petrona, Signika_Negative } from "next/font/google";
import "../globals.css";
import "./v1.css";
import "./overlays.css";

/* Petrona: a warm, slightly irregular text serif — softer than a didone. */
const petrona = Petrona({
  variable: "--font-petrona",
  subsets: ["latin"],
  display: "swap",
});

/* Signika Negative: humanist, gently rounded terminals. */
const signika = Signika_Negative({
  variable: "--font-signika",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DIS Studio — Conception, dessin technique et modélisation 3D",
  description:
    "Partenaire technique des firmes de design, cabinets d'architecture et fabricants de mobilier : conception, plans techniques 2D, modélisation et rendus 3D, documentation d'exécution.",
};

export default function V1Layout({ children }: LayoutProps<"/v1">) {
  return (
    <html lang="fr" className={`${petrona.variable} ${signika.variable}`}>
      <body className="v1">{children}</body>
    </html>
  );
}
