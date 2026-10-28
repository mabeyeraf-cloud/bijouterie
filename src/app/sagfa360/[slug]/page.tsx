import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { modules } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return modules.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const m = modules.find((x) => x.slug === slug);
  if (!m) return {};
  return {
    title: `${m.name} — SAGFA360`,
    description: `${m.tagline} Module ${m.name} de SAGFA360, la plateforme de gestion du Groupe SAGFA à Dakar.`,
    alternates: { canonical: `/sagfa360/${m.slug}` },
  };
}

export default async function Module({ params }: Props) {
  const { slug } = await params;
  const m = modules.find((x) => x.slug === slug);
  if (!m) notFound();
  const autres = modules.filter((x) => x.slug !== slug);
  return (
    <>
      <section className="hero">
        <div className="wrap">
          <Link href="/sagfa360" className="breadcrumb">← SAGFA360</Link>
          <span className="eyebrow">Module SAGFA360</span>
          <h1>{m!.name}</h1>
          {m!.soon && <span className="badge-soon">Bientôt disponible</span>}
          <p className="lead">{m!.tagline}</p>
          <div className="hero__actions">
            <Link href="/rendez-vous" className="btn">Demander une démonstration</Link>
          </div>
        </div>
      </section>
      <section className="section section--white">
        <div className="wrap grid2">
          <div>
            <h2>À quoi sert ce module ?</h2>
            <p>{m!.description}</p>
          </div>
          <div>
            <h2>{m!.soon ? "Fonctions prévues" : "Fonctions"}</h2>
            <ul className="check-list">
              {m!.functions.map((f) => <li key={f}>{f}</li>)}
            </ul>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          <h2>Ce que vous y gagnez</h2>
          <div className="benefits benefits--3">
            {m!.benefits.map((b) => (
              <div key={b.title} className="benefit"><h3>{b.title}</h3><p>{b.text}</p></div>
            ))}
          </div>
        </div>
      </section>
      <section className="section section--dark">
        <div className="wrap">
          <h2>Les autres modules</h2>
          <ul className="tags">
            {autres.map((x) => <li key={x.slug}><Link href={`/sagfa360/${x.slug}`}>{x.name}</Link></li>)}
          </ul>
        </div>
      </section>
    </>
  );
}
