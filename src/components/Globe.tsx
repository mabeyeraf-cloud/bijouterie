"use client";

import { useEffect, useRef } from "react";
import createGlobe from "cobe";
import { motion, useInView, useReducedMotion, useScroll, useSpring, useVelocity } from "motion/react";

const DAKAR: [number, number] = [14.7167, -17.4677];
const START_PHI = Math.PI - ((15 * Math.PI) / 180 - Math.PI / 2);
const THETA = 0.22;
const BASE_SPEED = 0.12;
const SCROLL_BOOST = 1.6;

const viewport = { once: false, amount: 0.3 } as const;
const spring = { type: "spring", visualDuration: 0.9, bounce: 0.25 } as const;

const particles = [
  { x: 8, y: 22, s: 5, d: 0 }, { x: 88, y: 14, s: 4, d: 1.2 }, { x: 94, y: 58, s: 6, d: 2.1 },
  { x: 4, y: 70, s: 4, d: 0.6 }, { x: 72, y: 92, s: 5, d: 1.7 }, { x: 22, y: 94, s: 3, d: 2.6 },
  { x: 50, y: 2, s: 3, d: 0.9 }, { x: 98, y: 32, s: 3, d: 3 },
];

/* Même projection que cobe : position du point à l'écran (0–1) et visibilité. */
function project([lat, lon]: [number, number], phi: number, theta: number) {
  const r = (lat * Math.PI) / 180;
  const a = (lon * Math.PI) / 180 - Math.PI;
  const p = [-Math.cos(r) * Math.cos(a) * 0.8, Math.sin(r) * 0.8, Math.cos(r) * Math.sin(a) * 0.8];
  const ct = Math.cos(theta), st = Math.sin(theta), cp = Math.cos(phi), sp = Math.sin(phi);
  const x = cp * p[0] + sp * p[2];
  const y = sp * st * p[0] + ct * p[1] - cp * st * p[2];
  const z = -sp * ct * p[0] + st * p[1] + cp * ct * p[2];
  return { x: (x + 1) / 2, y: (-y + 1) / 2, visible: z >= 0 };
}

export default function Globe() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dakarRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(wrapRef, viewport);
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const scrollSpeed = useSpring(useVelocity(scrollY), { stiffness: 80, damping: 30 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const dakar = dakarRef.current;
    if (!canvas || !dakar) return;
    const size = canvas.offsetWidth;
    let phi = START_PHI;
    const globe = createGlobe(canvas, {
      devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
      width: size,
      height: size,
      phi,
      theta: THETA,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [1, 1, 1],
      markerColor: [1, 1, 1],
      glowColor: [1, 1, 1],
      markers: [],
    });

    const place = () => {
      const pos = project(DAKAR, phi, THETA);
      dakar.style.transform = `translate(${pos.x * size}px, ${pos.y * size}px)`;
      dakar.style.opacity = pos.visible ? "1" : "0";
    };

    if (reduce || !inView) {
      globe.update({ phi });
      place();
      return () => globe.destroy();
    }

    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      const boost = Math.min(Math.abs(scrollSpeed.get()) / 1500, 1) * SCROLL_BOOST;
      phi += (BASE_SPEED + boost) * dt;
      globe.update({ phi });
      place();
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      globe.destroy();
    };
  }, [inView, reduce, scrollSpeed]);

  return (
    <div ref={wrapRef} className="globe" aria-hidden="true">
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <filter id="globe-tint" colorInterpolationFilters="sRGB">
          <feColorMatrix type="matrix" values="0.772 0 0 0 0.071  0.573 0 0 0 0.192  0.427 0 0 0 0.220  0 0 0 1 0" />
        </filter>
      </svg>
      <motion.div
        className="globe__halo"
        initial={{ opacity: 0 }}
        animate={{ opacity: inView ? 1 : 0 }}
        transition={{ duration: 0.9, delay: 0.2 }}
      >
        <motion.div
          className="globe__halo-glow"
          animate={reduce ? undefined : { scale: [1, 1.08, 1], opacity: [0.65, 1, 0.65] }}
          transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
        />
      </motion.div>
      {particles.map((p, i) => (
        <span
          key={i}
          className="globe__particle"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s, animationDelay: `${p.d}s` }}
        />
      ))}
      <motion.div
        className="globe__sphere"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }}
        transition={{ ...spring, opacity: { duration: 0.6 } }}
      >
        <canvas ref={canvasRef} />
        <span ref={dakarRef} className="globe__dakar" />
      </motion.div>
    </div>
  );
}
