"use client";

import { useEffect, useRef } from "react";
import { motion, MotionConfig, useReducedMotion, useScroll, useTransform, type Variants } from "motion/react";
import Gem from "./Gem";
import { ease } from "@/lib/motion";

const viewport = { once: false, amount: 0.2 } as const;
const spring = { type: "spring", visualDuration: 0.8, bounce: 0.25 } as const;

const riseIn: Variants = {
  hidden: { opacity: 0, y: 60, scale: 0.94 },
  show: { opacity: 1, y: 0, scale: 1, transition: { ...spring, opacity: { duration: 0.6, ease } } },
};

/* Cartes « verre » : la lumière dorée suit la souris (variables --mx / --my lues par le CSS). */
const SPOTLIGHT = ".card, .float-card, .info";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (min-width: 700px)");
    let frame = 0;
    let last: PointerEvent | null = null;
    const apply = () => {
      frame = 0;
      const el = last && (last.target as Element).closest?.(SPOTLIGHT);
      if (!last || !(el instanceof HTMLElement)) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${last.clientX - r.left}px`);
      el.style.setProperty("--my", `${last.clientY - r.top}px`);
    };
    const onMove = (e: PointerEvent) => {
      if (!mq.matches) return;
      last = e;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

type Tag = "div" | "ul" | "li" | "section" | "h1" | "h2";

export function Reveal({ as = "div", from = "bottom", delay = 0, className, children }: { as?: Tag; from?: "left" | "bottom"; delay?: number; className?: string; children: React.ReactNode }) {
  const M = motion[as] as typeof motion.div;
  const offset = from === "left" ? { x: -60 } : { y: 60 };
  return (
    <M
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={viewport}
      transition={{ ...spring, delay, opacity: { duration: 0.6, ease, delay } }}
    >
      {children}
    </M>
  );
}

export function Stagger({ as = "div", gap = 0.1, delay = 0, className, children }: { as?: Tag; gap?: number; delay?: number; className?: string; children: React.ReactNode }) {
  const M = motion[as] as typeof motion.div;
  return (
    <M className={className} initial="hidden" whileInView="show" viewport={viewport}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap, delayChildren: delay } } }}>
      {children}
    </M>
  );
}

/* À placer directement dans un <Stagger>. */
export function Item({ as = "div", className, children }: { as?: Tag; className?: string; children: React.ReactNode }) {
  const M = motion[as] as typeof motion.div;
  return <M className={className} variants={riseIn}>{children}</M>;
}

/* Titre révélé mot par mot, avec un léger flou qui se dissipe. */
export function SplitTitle({ text, as = "h2", immediate, delay = 0, className }: { text: string; as?: "h1" | "h2"; immediate?: boolean; delay?: number; className?: string }) {
  const M = motion[as];
  const word: Variants = {
    hidden: { opacity: 0, y: 24, filter: "blur(10px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.8, ease } },
  };
  const parent: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: delay } } };
  const trigger = immediate ? { animate: "show" } : { whileInView: "show", viewport };
  return (
    <M className={className} initial="hidden" variants={parent} {...trigger}>
      {text.split(" ").map((w, i) => (
        <span key={i}>
          {i > 0 && " "}
          <motion.span className="split-word" variants={word}>{w}</motion.span>
        </span>
      ))}
    </M>
  );
}

export function Parallax({ speed = 60, className, children }: { speed?: number; className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed]);
  return <motion.div ref={ref} className={className} style={{ y: reduce ? 0 : y }}>{children}</motion.div>;
}

/* Appel à l'action : un faisceau de lumière descend sur le bijou. */
export function CtaBeam() {
  return (
    <motion.div className="beam" aria-hidden="true" initial="hidden" whileInView="show" viewport={viewport}>
      <motion.span className="beam-ray" variants={{ hidden: { opacity: 0, scaleY: 0 }, show: { opacity: 1, scaleY: 1, transition: { duration: 1.1, ease } } }} />
      <motion.span className="beam-gem" variants={{ hidden: { opacity: 0.2, scale: 0.85 }, show: { opacity: 1, scale: 1, transition: { ...spring, delay: 0.8, opacity: { duration: 0.6, delay: 0.8 } } } }}>
        <Gem size={64} />
      </motion.span>
      <motion.span className="beam-pool" variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.8, delay: 0.9 } } }} />
    </motion.div>
  );
}
