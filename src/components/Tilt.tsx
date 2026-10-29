"use client";

import { motion, type HTMLMotionProps } from "motion/react";
import { useTilt } from "@/lib/useTilt";

/* <article> qui s'incline vers la souris. Accepte toutes les props de motion.article. */
export default function Tilt({ max = 8, style, ...props }: HTMLMotionProps<"article"> & { max?: number }) {
  const t = useTilt(max);
  return <motion.article {...props} style={{ ...style, ...t.style }} onPointerMove={t.onPointerMove} onPointerLeave={t.onPointerLeave} />;
}
