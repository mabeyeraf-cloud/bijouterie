"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import Gem from "./Gem";
import { SplitTitle } from "./Motion";
import { ease } from "@/lib/motion";
import { heroImage, whatsappLink } from "@/lib/site";

const sparkles = [
  [8, 22, 0], [18, 64, 1.2], [27, 38, 2.1], [38, 80, .6], [62, 18, 1.7], [72, 70, 2.6],
  [82, 34, .9], [91, 58, 1.9], [14, 86, 2.9], [54, 90, .3], [47, 12, 2.3], [88, 12, 1.4],
];

const ringText = "L'ART DE CRÉER DES BIJOUX DIGNES DE VOTRE UNICITÉ • ";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const giantY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const stageY = useTransform(scrollYProgress, [0, 1], [0, 70]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 18 });
  const smy = useSpring(my, { stiffness: 60, damping: 18 });
  const giantX = useTransform(smx, [-0.5, 0.5], [40, -40]);
  const stageX = useTransform(smx, [-0.5, 0.5], [-26, 26]);
  const coreRY = useTransform(smx, [-0.5, 0.5], [-22, 22]);
  const coreRX = useTransform(smy, [-0.5, 0.5], [16, -16]);
  const cardL = useTransform(smx, [-0.5, 0.5], [-16, 16]);
  const cardR = useTransform(smx, [-0.5, 0.5], [16, -16]);
  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };

  return (
    <section className="hero" ref={ref} onPointerMove={onMove}>
      <motion.div className="giant" style={{ y: giantY, x: giantX, opacity: fade }} aria-hidden="true">
        {"DAROU KARIM".split("").map((c, i) => (
          <motion.span key={i} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease, delay: 0.1 + i * 0.06 }}>
            {c === " " ? " " : c}
          </motion.span>
        ))}
      </motion.div>

      {sparkles.map(([x, y, d], i) => (
        <span key={i} className="sparkle" style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${d}s` }} aria-hidden="true" />
      ))}

      <motion.div className="stage" style={{ y: stageY, x: stageX }}>
        <motion.svg className="ring" viewBox="0 0 400 400" aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: 0.6 }}>
          <motion.circle cx="200" cy="200" r="150" fill="none" stroke="currentColor" strokeWidth="0.8"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.2, ease, delay: 0.5 }} />
          <motion.g animate={{ rotate: 360 }} transition={{ duration: 70, ease: "linear", repeat: Infinity }}>
            <path id="ringpath" d="M200,200 m-172,0 a172,172 0 1,1 344,0 a172,172 0 1,1 -344,0" fill="none" />
            <text fontSize="13" letterSpacing="3" fill="currentColor">
              <textPath href="#ringpath" textLength="1070" lengthAdjust="spacing">{ringText.repeat(2)}</textPath>
            </text>
          </motion.g>
        </motion.svg>
        <motion.div className="stage-core" style={{ rotateX: coreRX, rotateY: coreRY, transformPerspective: 800 }} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.4, ease, delay: 0.7 }}>
          {heroImage ? <Image src={heroImage} alt="" fill priority sizes="320px" style={{ objectFit: "cover" }} /> : <Gem size={150} />}
        </motion.div>
      </motion.div>

      <motion.aside className="float-card left" style={{ x: cardL }} initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, ease, delay: 1.4 }}>
        <Gem size={34} />
        <strong>Savoir-faire</strong>
        <span>Chaque pièce est choisie pour sa qualité et sa finition.</span>
      </motion.aside>
      <motion.aside className="float-card right" style={{ x: cardR }} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, ease, delay: 1.5 }}>
        <strong>Sur mesure</strong>
        <span>Gravure, alliances et créations selon vos envies.</span>
      </motion.aside>

      <motion.div className="container hero-copy" style={{ opacity: fade }}>
        <motion.p className="eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1 }}>Or · Argent · Créations</motion.p>
        <SplitTitle as="h1" immediate delay={1} text="L'éclat qui accompagne vos plus beaux moments" />
        <motion.div className="actions" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 1.3 }}>
          <Link className="btn gold" href="/catalogue">Découvrir le catalogue</Link>
          <a className="btn ghost-light" target="_blank" rel="noopener noreferrer" href={whatsappLink("Bonjour, je souhaite des informations sur vos bijoux.")}>Écrire sur WhatsApp</a>
        </motion.div>
      </motion.div>
    </section>
  );
}
