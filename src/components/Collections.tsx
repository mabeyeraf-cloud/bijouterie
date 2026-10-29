"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useReducedMotion } from "motion/react";
import Icon from "./Icon";
import { Reveal, SplitTitle } from "./Motion";
import { categories, products } from "@/lib/products";
import { whatsappLink } from "@/lib/site";
import { ease } from "@/lib/motion";

const DELAY = 4000;

export default function Collections() {
  const n = categories.length;
  const [index, setIndex] = useState(2);
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const spread = useInView(ref, { amount: 0.3, once: true });
  const reduce = useReducedMotion();
  const go = (i: number) => setIndex(((i % n) + n) % n);
  const running = !reduce && !paused && inView;

  useEffect(() => {
    if (!running) return;
    const id = setTimeout(() => setIndex((i) => (i + 1) % n), DELAY);
    return () => clearTimeout(id);
  }, [running, index, n]);

  return (
    <section className="colls" ref={ref} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onKeyDown={(e) => { if (e.key === "ArrowRight") go(index + 1); if (e.key === "ArrowLeft") go(index - 1); }}>
      <span className="colls-orb a" aria-hidden="true" />
      <span className="colls-orb b" aria-hidden="true" />
      <span className="colls-orb c" aria-hidden="true" />
      <div className="container">
        <Reveal><p className="eyebrow dark center-text">Nos collections</p></Reveal>
        <SplitTitle text="Six collections pour chaque occasion" className="colls-title" />
        <Reveal delay={0.2}><p className="colls-sub">Chaque collection réunit des pièces choisies pour leur qualité et leur finition.</p></Reveal>

        <div className="colls-stage">
          <motion.button className="colls-arrow left" onClick={() => go(index - 1)} aria-label="Collection précédente" whileTap={{ scale: 0.88 }} animate={{ x: [0, -5, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}>‹</motion.button>
          {categories.map((c, i) => {
            const o = ((i - index + n + n / 2) % n) - n / 2;
            const active = o === 0;
            const count = products.filter((p) => p.category === c.slug).length;
            const shown = Math.abs(o) <= 2;
            return (
              <motion.article
                key={c.slug}
                className={active ? "coll is-active" : "coll"}
                style={{ zIndex: 10 - Math.abs(o), pointerEvents: shown && spread ? "auto" : "none", transformPerspective: 1100 }}
                initial={false}
                animate={spread
                  ? { x: `${o * 106}%`, rotateY: o * -22, scale: active ? 1.08 : 1 - Math.abs(o) * 0.05, y: active ? -10 : Math.abs(o) * 10, opacity: shown ? 1 : 0 }
                  : { x: "0%", rotateY: 0, scale: 0.6, y: 40, opacity: 0 }}
                transition={{ duration: 0.8, ease, delay: spread ? 0 : 0 }}
                onClick={() => !active && go(i)}
              >
                <motion.span className="coll-badge" key={active ? "a" : "i"} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.4, ease }}>0{i + 1}</motion.span>
                <div className="coll-art">
                  {c.image ? <Image src={c.image} alt="" fill sizes="280px" style={{ objectFit: "cover" }} /> : (
                    <motion.span className="coll-float" animate={{ y: [0, -8, 0], rotate: [-3, 3, -3] }} transition={{ duration: 4 + (i % 3), ease: "easeInOut", repeat: Infinity }}>
                      <Icon name={c.slug} size={84} />
                    </motion.span>
                  )}
                </div>
                <div className="coll-dots" aria-hidden="true">{[0, 1, 2].map((d) => <i key={d} className={d === 1 ? "on" : ""} />)}</div>
                <h3>{c.name}</h3>
                <p>{c.text}</p>
                <div className="coll-foot">
                  <strong>{count} modèle{count > 1 ? "s" : ""}</strong>
                  {active && (
                    <motion.span initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, ease, delay: 0.25 }}>
                      <Link className="coll-btn" href={`/catalogue/${c.slug}`}>Voir la collection</Link>
                    </motion.span>
                  )}
                </div>
              </motion.article>
            );
          })}
          <motion.button className="colls-arrow right" onClick={() => go(index + 1)} aria-label="Collection suivante" whileTap={{ scale: 0.88 }} animate={{ x: [0, 5, 0] }} transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}>›</motion.button>
        </div>

        <div className="colls-pager">
          {categories.map((c, i) => (
            <button key={c.slug} className={i === index ? "on" : ""} onClick={() => go(i)} aria-label={c.name} aria-current={i === index} />
          ))}
        </div>
        <div className="colls-bar" aria-hidden="true">
          <motion.span key={`${index}-${running}`} initial={{ scaleX: 0 }} animate={{ scaleX: running ? 1 : 0 }} transition={{ duration: running ? DELAY / 1000 : 0.3, ease: "linear" }} />
        </div>
        <p className="colls-custom">
          Un projet particulier ? <a target="_blank" rel="noopener noreferrer" href={whatsappLink("Bonjour, je souhaite un bijou sur mesure.")}>Demandez une pièce sur mesure</a>
        </p>
      </div>
    </section>
  );
}
