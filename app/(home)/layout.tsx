import type { Metadata } from "next";
import "../globals.css";

/**
 * Root layout for the home route only.
 *
 * Each concept (/v1, /v3) is its own root layout so it can own its fonts
 * and <html>. There is deliberately no shared `app/layout.tsx`: a parent root
 * layout would render a second <html>/<body> around them and break hydration.
 */
export const metadata: Metadata = {
  title: "DIS Studio",
};

export default function HomeLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
