import type { Metadata } from "next";
import { Petrona, Signika_Negative } from "next/font/google";
import "../globals.css";
import "./v3.css";
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
  title: "DIS Studio — Intérieurs chaleureux, pensés pour y vivre",
  description:
    "Studio de design d'intérieur : concept, aménagement, matières et suivi de projet. Résidentiel, hospitalité et espaces commerciaux.",
};

export default function V3Layout({ children }: LayoutProps<"/v3">) {
  return (
    <html lang="fr" className={`${petrona.variable} ${signika.variable}`}>
      <body className="v3">{children}</body>
    </html>
  );
}
