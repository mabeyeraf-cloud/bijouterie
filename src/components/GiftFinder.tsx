"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Gem from "./Gem";
import Tilt from "./Tilt";
import { formatPrice, products } from "@/lib/products";
import { site, whatsappLink } from "@/lib/site";
import { ease } from "@/lib/motion";
import Link from "next/link";

const occasions = [
  { key: "mariage", label: "Mariage", cats: ["alliances", "parures", "bagues"] },
  { key: "anniversaire", label: "Anniversaire", cats: ["colliers", "bracelets", "boucles"] },
  { key: "naissance", label: "Naissance & baptême", cats: ["bracelets", "colliers"] },
  { key: "fete", label: "Grande fête", cats: ["parures", "boucles", "colliers"] },
  { key: "plaisir", label: "Se faire plaisir", cats: ["bagues", "boucles", "bracelets"] },
];

const budgets = [50000, 100000, 200000, 500000];
const hasPrices = products.some((p) => p.price);

export default function GiftFinder() {
  const [occ, setOcc] = useState(occasions[0].key);
  const [budget, setBudget] = useState<number | null>(null);

  const results = useMemo(() => {
    const cats = occasions.find((o) => o.key === occ)!.cats;
    return products
      .filter((p) => cats.includes(p.category) && (!budget || !p.price || p.price <= budget))
      .sort((a, b) => cats.indexOf(a.category) - cats.indexOf(b.category))
      .slice(0, 4);
  }, [occ, budget]);

  return (
    <section className="gift">
      <div className="container">
        <p className="eyebrow">Assistant cadeau</p>
        <h2>Besoin d'inspiration ?</h2>
        <div className="gift-row" role="group" aria-label="Choisir une occasion">
          <span className="gift-q">Je cherche un bijou pour</span>
          {occasions.map((o) => (
            <button key={o.key} className="gift-chip" aria-pressed={o.key === occ} onClick={() => setOcc(o.key)}>
              {o.key === occ && <motion.span layoutId="gift-pill" className="gift-pill" transition={{ duration: 0.45, ease }} />}
              <span>{o.label}</span>
            </button>
          ))}
        </div>
        {hasPrices && (
          <div className="gift-row" role="group" aria-label="Budget maximum">
            <span className="gift-q">Budget maximum</span>
            {[null, ...budgets].map((b) => (
              <button key={String(b)} className="gift-chip" aria-pressed={b === budget} onClick={() => setBudget(b)}>
                {b === budget && <motion.span layoutId="gift-pill-b" className="gift-pill" transition={{ duration: 0.45, ease }} />}
                <span>{b ? `${b.toLocaleString("fr-FR")} FCFA` : "Sans limite"}</span>
              </button>
            ))}
          </div>
        )}

        <motion.div className="gift-results" layout>
          <AnimatePresence mode="popLayout">
            {results.map((p) => (
              <Tilt key={p.id} layout className="gift-card" max={10} initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }} transition={{ duration: 0.55, ease }}>
                <div className="gift-art"><Gem size={52} /></div>
                <p className="kicker">{p.material}</p>
                <h3>{p.name}</h3>
                <p className="gift-price">{formatPrice(p.price)}</p>
                <a className="link" target="_blank" rel="noopener noreferrer" href={whatsappLink(`Bonjour ${site.name}, je cherche un cadeau (${occasions.find((o) => o.key === occ)!.label}). Je suis intéressé(e) par : ${p.name}.`)}>
                  Commander <span aria-hidden="true">→</span>
                </a>
              </Tilt>
            ))}
          </AnimatePresence>
        </motion.div>
        {results.length === 0 && <p className="gift-empty">Aucune pièce ne correspond. <Link href="/catalogue">Voir tout le catalogue</Link></p>}
        <p className="gift-more"><Link href="/catalogue">Voir tout le catalogue →</Link></p>
      </div>
    </section>
  );
}
