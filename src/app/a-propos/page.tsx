import type { Metadata } from "next";
import Link from "next/link";
import { getKeyFigures, getTeam } from "@/lib/content";

export const metadata: Metadata = {
  title: "À propos",
  description: "GROUPE SAGFA SUARL, cabinet de gestion à Dakar : notre approche, nos valeurs et notre équipe.",
  alternates: { canonical: "/a-propos" },
};

const initiales = (nom: string) =>
  nom.startsWith("[") ? "SA" : nom.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

export default async function APropos() {
  const [figures, equipe] = await Promise.all([getKeyFigures(), getTeam()]);
  return (
    <>
      <section className="hero">
        <div className="wrap">
          <span className="eyebrow">À propos</span>
          <h1>Un cabinet de gestion, <em>un seul interlocuteur.</em></h1>
          <p className="lead">
            GROUPE SAGFA SUARL est un cabinet de gestion implanté à Dakar. Nous prenons en charge la comptabilité,
            la fiscalité, la GRH (paie, cotisations sociales et gestion du personnel), l’IPM et l’informatique
            des entreprises, partout dans le monde.
          </p>
        </div>
      </section>

      {figures.length > 0 && (
        <section className="section section--green figures-band">
          <div className="wrap">
            <ul className="figures">
              {figures.map((f) => <li key={f.id}><strong>{f.value}</strong><span>{f.label}</span></li>)}
            </ul>
          </div>
        </section>
      )}

      <section className="section section--white">
        <div className="wrap">
          <span className="eyebrow">Nos valeurs</span>
          <h2>Ce qui guide notre travail.</h2>
          <div className="benefits benefits--3">
            <div className="benefit"><h3>Expertise</h3><p>Des spécialistes de la réglementation sociale et fiscale sénégalaise.</p></div>
            <div className="benefit"><h3>Plateforme</h3><p>Un seul outil, SAGFA360, conçu et maintenu par nos équipes.</p></div>
            <div className="benefit"><h3>Proximité</h3><p>Un interlocuteur dédié, dans vos locaux ou à distance.</p></div>
          </div>
        </div>
      </section>

      {equipe.length > 0 && (
        <section className="section">
          <div className="wrap">
            <span className="eyebrow">Notre équipe</span>
            <h2>Les personnes qui gèrent votre dossier.</h2>
            <ul className="team">
              {equipe.map((m) => (
                <li key={m.id} className="team__card">
                  <div className="team__photo">
                    {m.photoType ? <img src={`/equipe/${m.id}/photo?v=${m.updatedAt.getTime()}`} alt={m.name} /> : <span>{initiales(m.name)}</span>}
                  </div>
                  <h3>{m.name}</h3>
                  <p>{m.role}</p>
                  {m.bio && <p className="team__bio">{m.bio}</p>}
                  {(m.email || m.phone) && (
                    <p className="team__contact">
                      {m.email && <a href={`mailto:${m.email}`}>{m.email}</a>}
                      {m.phone && <a href={`tel:${m.phone.replace(/\s/g, "")}`}>{m.phone}</a>}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="section section--dark">
        <div className="wrap">
          <h2>Parlons de votre gestion.</h2>
          <p className="muted">Un premier rendez-vous vous est offert pour faire le point sur votre organisation.</p>
          <Link href="/rendez-vous" className="btn btn--light">Prendre rendez-vous</Link>
        </div>
      </section>
    </>
  );
}
