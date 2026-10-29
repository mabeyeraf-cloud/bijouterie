"use client";

import { useEffect, useRef } from "react";
import { motion, MotionConfig, useReducedMotion, useScroll, useTransform, type Variants } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;
const viewport = { once: true, amount: 0.2 } as const;

const riseIn: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } },
};

export function MotionProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    /* Liens vers une ancre de la page en cours : défilement doux jusqu'à la section
       (scroll-padding-top la garde sous la barre fixe). Capture : passe avant le Link de Next. */
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest?.("a[href]");
      if (!(a instanceof HTMLAnchorElement)) return;
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target) return;
      const url = new URL(a.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search) return;
      const target = url.hash ? document.getElementById(decodeURIComponent(url.hash.slice(1))) : null;
      if (url.hash && !target) return;
      e.preventDefault();
      const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
      history.replaceState(history.state, "", url.pathname + url.search + url.hash);
      if (target) target.scrollIntoView({ behavior, block: "start" });
      else window.scrollTo({ top: 0, behavior });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

type Tag = "div" | "ul" | "li" | "section" | "ol";

/** Apparition douce à l'entrée dans l'écran. */
export function Reveal({ as = "div", delay = 0, className, children }: { as?: Tag; delay?: number; className?: string; children: React.ReactNode }) {
  const M = motion[as];
  return (
    <M
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration: 0.9, ease, delay }}
    >
      {children}
    </M>
  );
}

/** Conteneur dont les enfants <Item> apparaissent l'un après l'autre. */
export function Stagger({ as = "div", gap = 0.1, delay = 0, className, children }: { as?: Tag; gap?: number; delay?: number; className?: string; children: React.ReactNode }) {
  const M = motion[as];
  return (
    <M
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap, delayChildren: delay } } }}
    >
      {children}
    </M>
  );
}

/** À placer directement dans un <Stagger>. */
export function Item({ as = "div", className, children }: { as?: Tag; className?: string; children: React.ReactNode }) {
  const M = motion[as];
  return <M className={className} variants={riseIn}>{children}</M>;
}

/** Titre découpé en mots ; à placer dans un <Stagger>. `em` met le morceau en italique doré. */
export function SplitTitle({ parts }: { parts: { text: string; em?: boolean; br?: boolean }[] }) {
  const word: Variants = {
    hidden: { opacity: 0, y: 22, filter: "blur(8px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.9, ease } },
  };
  const words = (text: string) =>
    text.split(" ").map((w, i) => (
      <span key={i}>
        {i > 0 && " "}
        <motion.span className="split-word" variants={word}>{w}</motion.span>
      </span>
    ));
  return (
    <motion.h1 variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}>
      {parts.map((p, i) => (
        <span key={i}>
          {p.br ? <br /> : i > 0 && " "}
          {p.em ? <em>{words(p.text)}</em> : words(p.text)}
        </span>
      ))}
    </motion.h1>
  );
}

/** Léger décalage au défilement. */
export function Parallax({ speed = 40, className, children }: { speed?: number; className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed]);
  return (
    <motion.div ref={ref} className={className} style={{ y: reduce ? 0 : y }}>
      {children}
    </motion.div>
  );
}
