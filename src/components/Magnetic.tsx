"use client";

import { useEffect } from "react";
import { animate } from "motion/react";

const MAGNETIC = ".btn, .pill, .coll-btn";

/* Les boutons se rapprochent légèrement de la souris. Réservé aux appareils à souris. */
export default function Magnetic() {
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 900px)");
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!mq.matches || rm.matches) return;

    let magnet: HTMLElement | null = null;
    const release = () => {
      if (!magnet) return;
      animate(magnet, { x: 0, y: 0 }, { type: "spring", stiffness: 300, damping: 18 });
      magnet = null;
    };
    const onMove = (e: PointerEvent) => {
      const el = (e.target as Element).closest?.(MAGNETIC);
      if (!(el instanceof HTMLElement)) return release();
      if (magnet && magnet !== el) release();
      magnet = el;
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      animate(el, { x: dx * 0.25, y: dy * 0.35 }, { type: "spring", stiffness: 250, damping: 20 });
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", release);
    return () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", release);
    };
  }, []);

  return null;
}
