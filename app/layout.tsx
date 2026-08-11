import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import "./site.css";
import "./overlays.css";

/*
 * Montserrat, per the brand guide: geometric, wide, and coherent with the
 * logo's construction. One family throughout — the identity names no second
 * face. Loaded as a variable font so Light (300) through SemiBold (600) all
 * come from a single file.
 */
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DIS Studio — Design Innovation Solutions",
  description:
    "Partenaire technique des firmes de design, cabinets d'architecture et fabricants de mobilier : conception, plans techniques 2D, modélisation et rendus 3D, documentation d'exécution.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={montserrat.variable}>
      <body className="site">{children}</body>
    </html>
  );
}
