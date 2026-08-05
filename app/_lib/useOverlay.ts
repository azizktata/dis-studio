"use client";

import { useEffect, useRef } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Accessibility plumbing shared by the wizard, the client-space drawer and the
 * assistant panel: Escape to close, focus trapped inside while open, focus
 * returned to the trigger on close, and the page behind locked from scrolling.
 */
export function useOverlay(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  const restoreTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    restoreTo.current = document.activeElement as HTMLElement | null;

    const node = ref.current;
    const first = node?.querySelector<HTMLElement>(FOCUSABLE);
    /*
     * Defer so the element exists and any entrance transition has started.
     * `preventScroll` matters: focusing without it makes the browser scroll the
     * target into view, which snaps a scrolled panel back to the top and reads
     * as a flicker.
     */
    const raf = requestAnimationFrame(() => first?.focus({ preventScroll: true }));

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !node) return;

      const items = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement,
      );
      if (items.length === 0) return;

      const firstItem = items[0];
      const lastItem = items[items.length - 1];
      const active = document.activeElement;

      // preventScroll on the wrap-around too, for the same reason as above.
      if (event.shiftKey && (active === firstItem || !node.contains(active))) {
        event.preventDefault();
        lastItem.focus({ preventScroll: true });
      } else if (!event.shiftKey && active === lastItem) {
        event.preventDefault();
        firstItem.focus({ preventScroll: true });
      }
    };

    const { overflow, paddingRight } = document.body.style;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    // Compensate for the scrollbar so the page behind doesn't shift.
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;

    document.addEventListener("keydown", onKeyDown, true);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKeyDown, true);
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      restoreTo.current?.focus?.();
    };
  }, [open, onClose]);

  return ref;
}
