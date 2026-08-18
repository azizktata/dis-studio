"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import Assistant from "../_components/Assistant";
import IntakeWizard from "../_components/IntakeWizard";
import Lightbox from "../_components/Lightbox";
import PortalDrawer from "../_components/PortalDrawer";
import { ambience, projects } from "../_lib/content";
import { useReveal } from "../_lib/useReveal";

export const heroSlides = [
  ambience.heroSalon,
  ambience.salonPoutres,
  ambience.sejourBois,
] as const;

type SiteState = {
  /** Nav switches to its solid treatment once the hero has scrolled past. */
  solid: boolean;
  /** Index of the visible hero slide; the headline tracks it. */
  slide: number;
  setSlide: (i: number) => void;
  openWizard: () => void;
  openPortal: () => void;
  openProject: (slug: string) => void;
};

const Ctx = createContext<SiteState | null>(null);

export function useSite() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSite must be used inside <SiteShell>");
  return ctx;
}

/**
 * Holds the state the sections share, plus the three overlays.
 *
 * The sections are otherwise independent, so this exists purely so `page.tsx`
 * can read as a list of sections instead of threading the same handlers
 * through every one of them.
 */
export default function SiteShell({ children }: { children: ReactNode }) {
  const [wizard, setWizard] = useState(false);
  const [portal, setPortal] = useState(false);
  const [slide, setSlide] = useState(0);
  const [solid, setSolid] = useState(false);
  const [project, setProject] = useState<string | null>(null);
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
      () => setSlide((s) => (s + 1) % heroSlides.length),
      7000,
    );
    return () => window.clearInterval(id);
  }, []);

  const value = useMemo<SiteState>(
    () => ({
      solid,
      slide,
      setSlide,
      openWizard: () => setWizard(true),
      openPortal: () => setPortal(true),
      openProject: (slug: string) => setProject(slug),
    }),
    [solid, slide],
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      <Assistant />
      <IntakeWizard open={wizard} onClose={() => setWizard(false)} />
      <PortalDrawer open={portal} onClose={() => setPortal(false)} />
      <Lightbox
        project={projects.find((p) => p.slug === project) ?? null}
        onClose={() => setProject(null)}
      />
    </Ctx.Provider>
  );
}
