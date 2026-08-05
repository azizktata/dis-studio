"use client";

import { useEffect } from "react";

/**
 * Adds `data-revealed` to any `[data-reveal]` element as it enters the
 * viewport, so the CSS in each version can run its own entrance. Elements are
 * revealed immediately when the visitor prefers reduced motion.
 */
export function useReveal() {
  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-revealed])"),
    );
    if (nodes.length === 0) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      nodes.forEach((n) => n.setAttribute("data-revealed", ""));
      return;
    }

    /*
     * Only now do we let the hidden state apply: without this the content would
     * stay invisible if scripting never ran. It also means a full-page capture
     * can force everything visible by removing the class.
     */
    document.body.classList.add("reveal-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute("data-revealed", "");
          observer.unobserve(entry.target);
        });
      },
      /*
       * `threshold: 0` matters: a tall element (the intro portrait, a masonry
       * tile) can span the whole viewport without ever showing 12% of itself
       * at once, and would then never reveal. The negative bottom margin still
       * holds the entrance back until the element is properly on screen.
       */
      { rootMargin: "0px 0px -6% 0px", threshold: 0 },
    );

    nodes.forEach((n) => observer.observe(n));

    /*
     * Safety net. An IntersectionObserver can leave content hidden when the
     * page starts past the fold (hot reload, restored scroll, in-page anchor)
     * or when scrolling outruns its callback. A blank section is far worse
     * than a missed animation, so a rAF-driven sweep reveals anything already
     * on screen, and stops as soon as everything has been shown.
     */
    let frame = 0;
    const sweep = () => {
      let remaining = 0;
      for (const n of nodes) {
        if (n.hasAttribute("data-revealed")) continue;
        const r = n.getBoundingClientRect();
        /*
         * Reveal anything at or above the fold — `bottom < innerHeight` also
         * catches elements the viewport has scrolled *past*. Testing only for
         * "currently on screen" leaves those permanently blank when scrolling
         * outruns the observer.
         */
        if (r.bottom < window.innerHeight || (r.top < window.innerHeight && r.bottom > 0)) {
          n.setAttribute("data-revealed", "");
          observer.unobserve(n);
        } else {
          remaining++;
        }
      }
      frame = remaining ? requestAnimationFrame(sweep) : 0;
    };
    frame = requestAnimationFrame(sweep);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      observer.disconnect();
      document.body.classList.remove("reveal-ready");
    };
  }, []);
}
