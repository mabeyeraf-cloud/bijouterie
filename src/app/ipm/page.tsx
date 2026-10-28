import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "IPM", description: "Institution de Prévoyance Maladie du Groupe SAGFA." };

export default function Ipm() {
  return (
    <>
      <section className="hero">
        <div className="wrap">
          <h1>IPM</h1>
          <p>Institution de Prévoyance Maladie : une couverture santé suivie de près pour vos équipes.</p>
        </div>
      </section>
      <section className="section">
        <div className="wrap split">
          <h2>Présentation</h2>
          <div>
            <p className="note">Contenu provisoire : à remplacer par la présentation réelle de l'IPM. L'espace adhérent (suivi et remboursements) sera ajouté dans la version complète.</p>
            <p><Link href="/contact" className="btn">Nous contacter</Link></p>
          </div>
        </div>
      </section>
    </>
  );
}
