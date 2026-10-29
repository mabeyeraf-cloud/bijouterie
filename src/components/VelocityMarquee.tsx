"use client";

import { useRef } from "react";
import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity, wrap } from "motion/react";

/* Bandeau qui défile en continu et s'accélère quand on fait défiler la page. */
export default function VelocityMarquee({ words, reverse, big }: { words: string[]; reverse?: boolean; big?: boolean }) {
  const reduce = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const boost = useTransform(velocity, [0, 1000], [0, 5], { clamp: false });
  const dir = useRef(1);
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    let move = dir.current * (reverse ? 2.2 : -2.2) * (delta / 1000);
    const b = boost.get();
    if (b < 0) dir.current = -1;
    else if (b > 0) dir.current = 1;
    move += dir.current * move * b;
    baseX.set(baseX.get() + move);
  });

  const list = [...words, ...words, ...words, ...words];
  return (
    <div className={big ? "marquee marquee-big" : "marquee"} aria-hidden="true">
      <motion.div className="marquee-track" style={{ x }}>
        {list.map((w, i) => (<span key={i}>{w}<i /></span>))}
      </motion.div>
    </div>
  );
}
