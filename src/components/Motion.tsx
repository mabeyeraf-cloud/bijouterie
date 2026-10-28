"use client";

import { Children, useEffect, useRef, useState } from "react";
import {
  animate,
  motion,
  MotionConfig,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "motion/react";
import { LogoMark } from "./Logo";

const ease = [0.22, 1, 0.36, 1] as const;
const viewport = { once: false, amount: 0.2 } as const;
const spring = { type: "spring", visualDuration: 0.8, bounce: 0.3 } as const;

const riseIn: Variants = {
  hidden: { opacity: 0, y: 60, scale: 0.94 },
  show: { opacity: 1, y: 0, scale: 1, transition: { ...spring, opacity: { duration: 0.6, ease } } },
};

const lightUp: Variants = {
  hidden: { opacity: 0.25, y: 24, filter: "brightness(0.6)", boxShadow: "0 0 0px -12px rgba(215, 195, 165, 0)" },
  show: {
    opacity: 1, y: 0, filter: "brightness(1)", boxShadow: "0 0 48px -12px rgba(215, 195, 165, 0.45)",
    transition: { duration: 0.7, ease },
  },
};

/* Cartes « verre » : la lumière suit la souris (variables --mx / --my lues par le CSS). */
const SPOTLIGHT = ".card, .pillars li, .benefit, .sector, .step, .why__item, .team__card, .contact__card, .plan";

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
  useEffect(() => {
    /* Liens vers une ancre de la page en cours : on défile nous-mêmes jusqu'à la section
       (scroll-padding-top la garde sous la barre fixe). Capture : passe avant le Link de Next. */
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest?.("a[href]");
      if (!(a instanceof HTMLAnchorElement)) return;
      a.closest("details[open]")?.removeAttribute("open");
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

type Tag = "div" | "ul" | "li" | "section";

export function Reveal({ as = "div", from = "left", delay = 0, className, children }: { as?: Tag; from?: "left" | "bottom"; delay?: number; className?: string; children: React.ReactNode }) {
  const M = motion[as];
  const offset = from === "left" ? { x: -60 } : { y: 60 };
  return (
    <M
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={viewport}
      transition={{ type: "spring", visualDuration: 0.8, bounce: 0.2, delay, opacity: { duration: 0.6, ease, delay } }}
    >
      {children}
    </M>
  );
}

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

/* À placer directement dans un <Stagger>. Utiliser `wrap` quand l'enfant a déjà son propre transform au survol. */
export function Item({ as = "div", wrap, light, className, children }: { as?: Tag; wrap?: boolean; light?: boolean; className?: string; children: React.ReactNode }) {
  const M = motion[as];
  return (
    <M className={wrap ? ["reveal-wrap", className].filter(Boolean).join(" ") : className} variants={light ? lightUp : riseIn}>
      {children}
    </M>
  );
}

/* Titre découpé en mots ; à placer dans un <Stagger>. */
/* `tight` colle le morceau au précédent, sans espace (ponctuation finale). */
export function SplitTitle({ parts }: { parts: { text: string; em?: boolean; tight?: boolean }[] }) {
  const word: Variants = {
    hidden: { opacity: 0, y: 24, filter: "blur(10px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease } },
  };
  const words = (text: string) =>
    text.split(" ").map((w, i) => (
      <span key={i}>
        {i > 0 && " "}
        <motion.span className="split-word" variants={word}>{w}</motion.span>
      </span>
    ));
  return (
    <motion.h1 variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}>
      {parts.map((p, i) => (
        <span key={i}>
          {i > 0 && !p.tight && " "}
          {p.em ? <em>{words(p.text)}</em> : words(p.text)}
        </span>
      ))}
    </motion.h1>
  );
}

export function Parallax({ speed = 60, className, children }: { speed?: number; className?: string; children: React.ReactNode }) {
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

export function HeroCard({ children }: { children: React.ReactNode }) {
  return (
    <Parallax speed={50}>
      <motion.div
        initial={{ opacity: 0, scale: 0.85, rotate: -6 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
        viewport={viewport}
        transition={{ ...spring, delay: 0.3, opacity: { duration: 0.6, ease, delay: 0.3 } }}
      >
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
        >
          {children}
        </motion.div>
      </motion.div>
    </Parallax>
  );
}

export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: false, amount: 0.6 });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    const m = value.match(/^(\D*)(\d+(?:[\s ]\d{3})*)(.*)$/);
    if (!el || reduce || !m || /^[.,]\d/.test(m[3])) return;
    const [, prefix, digits, suffix] = m;
    const target = Number(digits.replace(/\D/g, ""));
    const grouped = /\D/.test(digits);
    const format = (n: number) => (grouped ? Math.round(n).toLocaleString("fr-FR") : String(Math.round(n)));
    if (!inView) {
      el.textContent = prefix + format(0) + suffix;
      return;
    }
    let pop: { stop: () => void } | undefined;
    const count = animate(0, target, {
      duration: 2.2,
      ease: "easeOut",
      onUpdate: (n) => { el.textContent = prefix + format(n) + suffix; },
      onComplete: () => {
        el.textContent = value;
        pop = animate(el, { scale: [1, 1.15, 1] }, { duration: 0.5, ease: "backOut" });
      },
    });
    return () => { count.stop(); pop?.stop(); };
  }, [inView, reduce, value]);

  return <strong ref={ref}>{value}</strong>;
}

export function DashBars({ bars }: { bars: { h: string; tone?: string }[] }) {
  const curveRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 100, h: 100 });
  useEffect(() => {
    const el = curveRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setBox({ w: el.offsetWidth || 100, h: el.offsetHeight || 100 }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const pct = bars.map((b, i) => [((i + 0.5) / bars.length) * 100, 100 - parseFloat(b.h)]);
  const pts = pct.map(([x, y]) => [(x * box.w) / 100, (y * box.h) / 100]);
  const d = pts.map(([x, y], i) => {
    if (i === 0) return `M${x},${y}`;
    const [px, py] = pts[i - 1];
    const mx = (px + x) / 2;
    return `C${mx},${py} ${mx},${y} ${x},${y}`;
  }).join(" ");
  const [ex, ey] = pct[pct.length - 1];
  return (
    <motion.div
      className="dash__bars"
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.5 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } } }}
    >
      <div ref={curveRef} className="dash__curve">
        <svg viewBox={`0 0 ${box.w} ${box.h}`}>
          <motion.path
            d={d}
            fill="none"
            variants={{ hidden: { pathLength: 0, opacity: 0 }, show: { pathLength: 1, opacity: 1, transition: { duration: 1.4, ease: "easeInOut", delay: 0.5 } } }}
          />
        </svg>
        <motion.span
          className="dash__point"
          style={{ left: `${ex}%`, top: `${ey}%` }}
          variants={{ hidden: { opacity: 0, scale: 0 }, show: { opacity: 1, scale: 1, transition: { type: "spring", visualDuration: 0.4, bounce: 0.5, delay: 1.9 } } }}
        />
      </div>
      {bars.map((b, i) => (
        <motion.b
          key={i}
          className={b.tone}
          style={{ height: b.h, originY: 1 }}
          variants={{ hidden: { scaleY: 0 }, show: { scaleY: 1, transition: { type: "spring", visualDuration: 0.7, bounce: 0.45 } } }}
        />
      ))}
    </motion.div>
  );
}

/* Carrousel : la carte du milieu est mise en avant. */
export function Carousel({ label, children }: { label: string; children: React.ReactNode }) {
  const items = Children.toArray(children);
  const [index, setIndex] = useState(Math.min(1, items.length - 1));
  const [x, setX] = useState(0);
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const inView = useInView(viewportRef, { once: false, amount: 0.4 });
  const reduce = useReducedMotion();

  useEffect(() => {
    const view = viewportRef.current;
    const track = trackRef.current;
    if (!view || !track) return;
    const measure = () => {
      const item = track.children[index] as HTMLElement | undefined;
      if (!item) return;
      setX(view.offsetWidth / 2 - (item.offsetLeft + item.offsetWidth / 2));
    };
    measure();
    setReady(true);
    const ro = new ResizeObserver(measure);
    ro.observe(view);
    return () => ro.disconnect();
  }, [index]);

  useEffect(() => {
    if (reduce || paused || !inView || items.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % items.length), 4000);
    return () => clearInterval(id);
  }, [reduce, paused, inView, items.length]);

  const go = (i: number) => setIndex((i + items.length) % items.length);

  return (
    <div
      className="carousel"
      role="region"
      aria-roledescription="carrousel"
      aria-label={label}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div ref={viewportRef} className="carousel__viewport">
        <motion.div
          ref={trackRef}
          className="carousel__track"
          animate={{ x }}
          transition={ready ? { type: "spring", visualDuration: 0.6, bounce: 0.15 } : { duration: 0 }}
        >
          {items.map((item, i) => (
            <motion.div
              key={i}
              className={i === index ? "carousel__item is-active" : "carousel__item"}
              animate={{ scale: i === index ? 1 : 0.9, opacity: i === index ? 1 : 0.45 }}
              transition={{ duration: 0.5, ease }}
              onClick={() => go(i)}
            >
              {item}
            </motion.div>
          ))}
        </motion.div>
      </div>
      <div className="carousel__controls">
        <button type="button" onClick={() => go(index - 1)} aria-label="Précédent">‹</button>
        <div className="carousel__dots">
          {items.map((_, i) => (
            <button key={i} type="button" onClick={() => go(i)} aria-label={`${i + 1} / ${items.length}`} aria-current={i === index} className={i === index ? "is-active" : undefined} />
          ))}
        </div>
        <button type="button" onClick={() => go(index + 1)} aria-label="Suivant">›</button>
      </div>
    </div>
  );
}

/* Appel à l'action : un faisceau de lumière descend sur le logo. */
export function CtaBeam() {
  return (
    <motion.div
      className="beam"
      aria-hidden="true"
      initial="hidden"
      whileInView="show"
      viewport={viewport}
    >
      <motion.span
        className="beam__ray"
        variants={{ hidden: { opacity: 0, scaleY: 0 }, show: { opacity: 1, scaleY: 1, transition: { duration: 1.1, ease } } }}
      />
      <motion.span
        className="beam__logo"
        variants={{ hidden: { opacity: 0.25, scale: 0.9 }, show: { opacity: 1, scale: 1, transition: { ...spring, delay: 0.8, opacity: { duration: 0.6, delay: 0.8 } } } }}
      >
        <LogoMark variant="dark" />
      </motion.span>
      <motion.span
        className="beam__pool"
        variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.8, delay: 0.9 } } }}
      />
    </motion.div>
  );
}
