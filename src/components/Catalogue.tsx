"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import Gem from "./Gem";
import Tilt from "./Tilt";
import { categories, formatPrice, products, sizeChoices, type Product } from "@/lib/products";
import { site, whatsappLink } from "@/lib/site";
import { ease } from "@/lib/motion";

const materials = Array.from(new Set(products.map((p) => p.material)));
const catName = (slug: string) => categories.find((c) => c.slug === slug)?.name ?? "";

function orderLink(p: Product, size?: string, label?: string) {
  const extra = size && label ? `, ${label.toLowerCase()} ${size}` : "";
  return whatsappLink(`Bonjour ${site.name}, je suis intéressé(e) par : ${p.name} (${p.material})${extra}.`);
}

function Visual({ p, size }: { p: Product; size: number }) {
  return p.image ? <Image src={p.image} alt={p.name} fill sizes="(max-width:700px) 100vw, 25vw" style={{ objectFit: "cover" }} /> : <Gem size={size} />;
}

export default function Catalogue({ only }: { only?: string }) {
  const [cat, setCat] = useState(only ?? "tous");
  const [q, setQ] = useState("");
  const [material, setMaterial] = useState("tous");
  const [openId, setOpenId] = useState<string | null>(null);
  const [size, setSize] = useState(0);

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return products.filter(
      (p) =>
        (cat === "tous" || p.category === cat) &&
        (material === "tous" || p.material === material) &&
        (!term || `${p.name} ${p.description} ${p.material}`.toLowerCase().includes(term)),
    );
  }, [cat, q, material]);

  const index = list.findIndex((p) => p.id === openId);
  const current = index >= 0 ? list[index] : null;
  const step = (d: number) => { if (list.length) { setOpenId(list[(index + d + list.length) % list.length].id); setSize(0); } };
  const reset = () => { setQ(""); setMaterial("tous"); if (!only) setCat("tous"); };

  useEffect(() => {
    if (!current) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenId(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  });

  const opts = current ? sizeChoices[current.category] : undefined;

  return (
    <>
      {!only && (
        <div className="filters" role="group" aria-label="Filtrer par collection">
          {[{ slug: "tous", name: "Tout" }, ...categories].map((c) => (
            <button key={c.slug} className="chip" onClick={() => setCat(c.slug)} aria-pressed={c.slug === cat}>
              {c.slug === cat && <motion.span layoutId="chip-pill" className="chip-pill" transition={{ duration: 0.45, ease }} />}
              <span className="chip-label">{c.name}</span>
            </button>
          ))}
        </div>
      )}

      <div className="toolbar">
        <input className="search" type="search" placeholder="Rechercher un bijou…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Rechercher un bijou" />
        <select className="select" value={material} onChange={(e) => setMaterial(e.target.value)} aria-label="Filtrer par matière">
          <option value="tous">Toutes les matières</option>
          {materials.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        <p className="count" aria-live="polite">{list.length} pièce{list.length > 1 ? "s" : ""}</p>
      </div>

      <motion.div className="grid" layout>
        <AnimatePresence mode="popLayout">
          {list.map((p) => (
            <Tilt key={p.id} layout className="card" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} whileHover={{ y: -6 }} transition={{ duration: 0.6, ease }}>
              <button className="thumb thumb-btn" onClick={() => { setOpenId(p.id); setSize(0); }} aria-label={`Voir ${p.name}`}>
                <span className="thumb-in"><Visual p={p} size={56} /></span>
                <span className="card-badge">{catName(p.category)}</span>
                <span className="thumb-more">Voir le détail</span>
              </button>
              <div className="card-body">
                <p className="kicker">{p.material}</p>
                <h3>{p.name}</h3>
                <p>{p.description}</p>
                <p className="price">{formatPrice(p.price)}</p>
                <a className="link" target="_blank" rel="noopener noreferrer" href={orderLink(p)}>Commander sur WhatsApp <span aria-hidden="true">→</span></a>
              </div>
            </Tilt>
          ))}
        </AnimatePresence>
      </motion.div>

      {list.length === 0 && (
        <div className="empty">
          <p>Aucun bijou ne correspond à votre recherche.</p>
          <button className="btn outline" onClick={reset}>Réinitialiser les filtres</button>
        </div>
      )}

      <AnimatePresence>
        {current && (
          <motion.div className="modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} onClick={() => setOpenId(null)}>
            <motion.div className="modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, y: 40, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: 0.97 }} transition={{ duration: 0.5, ease }}>
              <button className="modal-close" onClick={() => setOpenId(null)} aria-label="Fermer" autoFocus>×</button>
              <div className="modal-visual"><Visual p={current} size={140} /></div>
              <div className="modal-info">
                <p className="kicker">{catName(current.category)} · {current.material}</p>
                <h3 id="modal-title">{current.name}</h3>
                <p>{current.description}</p>
                <p className="price">{formatPrice(current.price)}</p>
                {opts && (
                  <>
                    <p className="modal-label">{opts.label}</p>
                    <div className="modal-sizes">
                      {opts.values.map((v, k) => (
                        <button key={v} className={k === size ? "on" : ""} aria-pressed={k === size} onClick={() => setSize(k)}>{v.replace(" cm", "")}</button>
                      ))}
                    </div>
                  </>
                )}
                <a className="btn gold" target="_blank" rel="noopener noreferrer" href={orderLink(current, opts?.values[size], opts?.label)}>Commander sur WhatsApp</a>
                <div className="modal-nav">
                  <button onClick={() => step(-1)} aria-label="Bijou précédent">‹ Précédent</button>
                  <span>{index + 1} / {list.length}</span>
                  <button onClick={() => step(1)} aria-label="Bijou suivant">Suivant ›</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
