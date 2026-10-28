"use client";

import { motion, type Variants } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

/* Blocs du symbole, dans l'ordre d'apparition : les deux foncés, les deux sauge, puis le sable.
 * `from` = décalage de départ, dans l'axe d'inclinaison du bloc. */
const blocks = [
  { d: "M195 352 321 294V435L195 493Z", tone: "currentColor", from: { x: -40, y: 18 } },
  { d: "M340 252 465 194V333L340 391Z", tone: "currentColor", from: { x: 0, y: -50 } },
  { d: "M340 407 465 349V488L340 546Z", tone: "var(--sage)", from: { x: 0, y: 50 } },
  { d: "M485 296 609 354V491L485 433Z", tone: "var(--sage)", from: { x: 40, y: 18 } },
  { d: "M485 450 609 508V603L485 545Z", tone: "var(--sand)", from: { x: 40, y: 60 } },
];

const block: Variants = {
  hidden: (i: number) => ({ opacity: 0, ...blocks[i].from, transition: { duration: 0.2 } }),
  show: (i: number) => ({
    opacity: 1, x: 0, y: 0,
    transition: { type: "spring", visualDuration: 0.7, bounce: 0.3, delay: 0.15 + i * 0.12, opacity: { duration: 0.4, ease, delay: 0.15 + i * 0.12 } },
  }),
};
const word: Variants = {
  hidden: { opacity: 0, x: -14, transition: { duration: 0.2 } },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease, delay: 0.55 } },
};
const num: Variants = {
  hidden: { opacity: 0, y: 18, transition: { duration: 0.2 } },
  show: { opacity: 1, y: 0, transition: { type: "spring", visualDuration: 0.6, bounce: 0.35, delay: 0.85 } },
};
const tagline: Variants = {
  hidden: { opacity: 0, letterSpacing: "0.1em", transition: { duration: 0.2 } },
  show: { opacity: 1, letterSpacing: "0.32em", transition: { duration: 0.9, ease, delay: 1.05 } },
};

/** Logo SAGFA360 animé : le symbole (redessiné d'après le logo officiel) s'assemble bloc par bloc,
 *  puis le nom et la signature apparaissent — à chaque fois que le logo revient à l'écran.
 *  Les blocs foncés suivent `currentColor`. */
export default function Sagfa360Logo() {
  return (
    <motion.div className="s360-logo" initial="hidden" whileInView="show" viewport={{ amount: 0.6 }}>
      <svg className="s360-logo__mark" viewBox="180 180 445 440" aria-hidden="true" focusable="false">
        <g strokeWidth="10" strokeLinejoin="round">
          {blocks.map((b, i) => (
            <motion.path key={i} d={b.d} fill={b.tone} stroke={b.tone} custom={i} variants={block} />
          ))}
        </g>
      </svg>
      <div>
        <h1>
          <motion.span className="s360-logo__word" variants={word}>SAGFA</motion.span>
          <motion.em className="s360-logo__word" variants={num}>360</motion.em>
        </h1>
        <motion.span className="s360-logo__tagline" variants={tagline}>Plus loin ensemble</motion.span>
      </div>
    </motion.div>
  );
}
