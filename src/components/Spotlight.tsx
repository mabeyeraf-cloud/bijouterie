"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type Variants } from "motion/react";
import Gem from "./Gem";
import { Reveal } from "./Motion";
import { categories, formatPrice, products, sizeChoices as sizes } from "@/lib/products";
import { site, whatsappLink } from "@/lib/site";
import { ease } from "@/lib/motion";

const tones = ["#5a0f1a", "#5b3a14", "#14202e", "#3b1a3a", "#1f3a2e", "#4a2412"];
const DELAY = 6000;

const textV: Variants = {
  enter: (d: number) => ({ opacity: 0, x: d * 56, filter: "blur(8px)" }),
  center: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.6, ease } },
  exit: (d: number) => ({ opacity: 0, x: d * -56, filter: "blur(8px)", transition: { duration: 0.35, ease } }),
};

export default function Spotlight() {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [size, setSize] = useState(0);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduce = useReducedMotion();
  const n = products.length;
  const p = products[i];
  const opts = sizes[p.category];
  const running = !reduce && !paused && inView;

  const step = (d: number) => { setDir(d); setI((v) => (((v + d) % n) + n) % n); setSize(0); };

  useEffect(() => {
    if (!running) return;
    const id = setTimeout(() => { setDir(1); setI((v) => (v + 1) % n); setSize(0); }, DELAY);
    return () => clearTimeout(id);
  }, [running, i, n]);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 80, damping: 16 });
  const sy = useSpring(my, { stiffness: 80, damping: 16 });
  const rotY = useTransform(sx, [-0.5, 0.5], [-20, 20]);
  const rotX = useTransform(sy, [-0.5, 0.5], [14, -14]);
  const px = useTransform(sx, [-0.5, 0.5], [-24, 24]);
  const shX = useTransform(sx, [-0.5, 0.5], [36, -36]);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const spin = useTransform(scrollYProgress, [0, 1], [-14, 14]);

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
    ref.current.style.setProperty("--sx", `${e.clientX - r.left}px`);
    ref.current.style.setProperty("--sy", `${e.clientY - r.top}px`);
  };

  const choice = opts ? opts.values[size] : "";
  const message = `Bonjour ${site.name}, je suis intéressé(e) par : ${p.name} (${p.material})${choice ? `, ${opts!.label.toLowerCase()} ${choice}` : ""}.`;

  return (
    <motion.section className="spot" ref={ref} animate={{ backgroundColor: tones[i % tones.length] }} transition={{ duration: 0.9, ease }}
      onPointerMove={onMove} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onKeyDown={(e) => { if (e.key === "ArrowRight") step(1); if (e.key === "ArrowLeft") step(-1); }}>
      <div className="container spot-grid">
        <motion.div className="spot-left" initial={{ opacity: 0, x: -70 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ amount: 0.2 }} transition={{ duration: 0.9, ease }}>
          <div className="spot-arrows">
            <motion.button onClick={() => step(-1)} aria-label="Précédent" whileTap={{ scale: 0.85 }}>‹</motion.button>
            <motion.button onClick={() => step(1)} aria-label="Suivant" whileTap={{ scale: 0.85 }}>›</motion.button>
            <span className="spot-count">
              <AnimatePresence mode="wait" initial={false}>
                <motion.b key={i} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }} transition={{ duration: 0.25 }}>{String(i + 1).padStart(2, "0")}</motion.b>
              </AnimatePresence>
              {" / "}{String(n).padStart(2, "0")}
            </span>
          </div>
          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <motion.div key={p.id} custom={dir} variants={textV} initial="enter" animate="center" exit="exit">
              <p className="eyebrow">{categories.find((c) => c.slug === p.category)?.name} · {p.material}</p>
              <h2>{p.name}</h2>
              <p className="spot-text">{p.description}</p>
              <a className="btn light" target="_blank" rel="noopener noreferrer" href={whatsappLink(message)}>Commander ›</a>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <div className="spot-center">
          {[0, 1, 2].map((k) => (
            <motion.span key={k} className="spot-ring" aria-hidden="true" animate={{ scale: [0.55, 1.4], opacity: [0.5, 0] }} transition={{ duration: 4, ease: "easeOut", repeat: Infinity, delay: k * 1.3 }} />
          ))}
          <motion.div className="spot-orbit" aria-hidden="true" animate={{ rotate: 360 }} transition={{ duration: 16, ease: "linear", repeat: Infinity }}>
            <i /><i /><i />
          </motion.div>
          <motion.div className="spot-tilt" style={{ x: px, rotateX: rotX, rotateY: rotY, rotateZ: spin, transformPerspective: 900 }}>
            <AnimatePresence mode="wait" custom={dir} initial={false}>
              <motion.div
                key={p.id}
                className="spot-piece"
                custom={dir}
                variants={{
                  enter: (d: number) => ({ opacity: 0, scale: 0.7, rotateY: d * 100 }),
                  center: { opacity: 1, scale: 1, rotateY: 0, transition: { duration: 0.8, ease } },
                  exit: (d: number) => ({ opacity: 0, scale: 0.75, rotateY: d * -100, transition: { duration: 0.4, ease } }),
                }}
                initial="enter" animate="center" exit="exit"
              >
                <motion.div animate={{ y: [0, -16, 0] }} transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }}>
                  {p.image ? <Image src={p.image} alt={p.name} width={320} height={320} /> : <Gem size={220} />}
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
          <motion.div className="spot-shadow" style={{ x: shX }} animate={{ scaleX: [1, 0.8, 1], opacity: [0.5, 0.3, 0.5] }} transition={{ duration: 5, ease: "easeInOut", repeat: Infinity }} />
        </div>

        <motion.div className="spot-right" initial={{ opacity: 0, x: 70 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ amount: 0.2 }} transition={{ duration: 0.9, ease }}>
          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <motion.div key={p.id} custom={dir} variants={textV} initial="enter" animate="center" exit="exit">
              <p className="spot-price">{formatPrice(p.price)}</p>
              {opts && (
                <>
                  <p className="spot-label">{opts.label}</p>
                  <div className="spot-sizes">
                    {opts.values.map((v, k) => (
                      <motion.button key={v} className={k === size ? "on" : ""} aria-pressed={k === size} onClick={() => setSize(k)}
                        initial={{ scale: 0 }} animate={{ scale: 1 }} whileTap={{ scale: 0.88 }} transition={{ type: "spring", visualDuration: 0.5, bounce: 0.4, delay: 0.25 + k * 0.1 }}>
                        {v.replace(" cm", "")}
                      </motion.button>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
      <Reveal><p className="spot-tagline">L'éclat, porté avec confiance.</p></Reveal>
      <motion.span key={`${i}-${running}`} className="spot-progress" aria-hidden="true" initial={{ scaleX: 0 }} animate={{ scaleX: running ? 1 : 0 }} transition={{ duration: running ? DELAY / 1000 : 0.3, ease: "linear" }} />
    </motion.section>
  );
}
