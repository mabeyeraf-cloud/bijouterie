import type { Metadata } from "next";
import Link from "next/link";
import { modules } from "@/lib/site";
import CardArrow from "@/components/CardArrow";
import DemoVideo from "@/components/DemoVideo";
import Sagfa360Logo from "@/components/Sagfa360Logo";

export const metadata: Metadata = {
  title: "SAGFA360, la plateforme de gestion",
  description: "SAGFA360 : paie, comptabilité, fiscalité, stock, facturation et IPM dans un seul outil, conçu par le Groupe SAGFA à Dakar.",
  alternates: { canonical: "/sagfa360" },
};

export default function Sagfa360() {
  return (
    <>
      <section className="hero">
        <div className="wrap hero__grid hero__grid--demo">
          <div>
            <span className="eyebrow">Notre plateforme</span>
            <Sagfa360Logo />
            <p className="lead">
              Des modules distincts, une vision d’ensemble.
              <br />
              Chaque module répond à un besoin précis, et tous partagent les mêmes données.
            </p>
          </div>
          <DemoVideo
            src="/videos/sagfa360-demo.mp4"
            poster="/videos/sagfa360-demo-poster.jpg"
            label="Démonstration de SAGFA360 : calcul de la paie, comptabilité et autres modules"
          />
        </div>
      </section>
      <section className="section section--white">
        <div className="wrap">
          <span className="eyebrow">Les modules</span>
          <h2>Choisissez le module qui vous intéresse.</h2>
          <div className="cards">
            {modules.map((m) => (
              <article key={m.slug} className="card card--link">
                <CardArrow />
                {m.soon && <span className="badge-soon">Bientôt disponible</span>}
                <h3><Link href={`/sagfa360/${m.slug}`}>{m.name}</Link></h3>
                <p>{m.tagline}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section section--dark">
        <div className="wrap">
          <h2>Envie de voir SAGFA360 en action ?</h2>
          <p className="muted">Une démonstration vous est offerte lors d’un premier rendez-vous.</p>
          <Link href="/rendez-vous" className="btn btn--light">Demander une démonstration</Link>
        </div>
      </section>
    </>
  );
}
