import { useMotionValue, useSpring } from "motion/react";

/* Inclinaison 3D d'une carte vers le pointeur (souris uniquement). */
export function useTilt(max = 8) {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 220, damping: 20 });
  const rotateY = useSpring(ry, { stiffness: 220, damping: 20 });
  return {
    style: { rotateX, rotateY, transformPerspective: 900 },
    onPointerMove(e: React.PointerEvent<HTMLElement>) {
      if (e.pointerType !== "mouse") return;
      const r = e.currentTarget.getBoundingClientRect();
      ry.set(((e.clientX - r.left) / r.width - 0.5) * max * 2);
      rx.set(-((e.clientY - r.top) / r.height - 0.5) * max * 2);
    },
    onPointerLeave() {
      rx.set(0);
      ry.set(0);
    },
  };
}
