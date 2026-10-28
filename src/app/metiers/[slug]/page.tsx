import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { poles } from "@/lib/site";
import { getSettings } from "@/lib/content";
import { CtaBeam, Item, Stagger } from "@/components/Motion";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return poles.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = poles.find((x) => x.slug === slug);
  if (!p) return {};
  return {
    title: `${p.name} à Dakar`,
    description: `${p.summary} Groupe SAGFA, cabinet de gestion à Dakar.`,
    alternates: { canonical: `/metiers/${p.slug}` },
  };
}

export default async function Metier({ params }: Props) {
  const { slug } = await params;
  const p = poles.find((x) => x.slug === slug);
  if (!p) notFound();
  const { whatsapp } = await getSettings();
  const numero = whatsapp.replace(/\D/g, "");
  const lienWhatsApp = `https://wa.me/${numero}?text=${encodeURIComponent(p!.whatsappMessage)}`;
  return (
    <>
      <section className="hero">
        <div className="wrap">
          <span className="eyebrow">Nos métiers</span>
          <h1>{p!.h1}</h1>
          {p!.introHighlight ? (
            <Stagger gap={0.25}>
              <Item><p className="lead-highlight">{p!.introHighlight}</p></Item>
              <Item><p className="lead">{p!.intro}</p></Item>
            </Stagger>
          ) : (
            <p className="lead">{p!.intro}</p>
          )}
          <div className="hero__actions">
            <Link href="/rendez-vous" className="btn">Prendre rendez-vous</Link>
            <Link href="/#services" className="btn btn--ghost">Tous nos services</Link>
          </div>
        </div>
      </section>

      <section className="section section--white">
        <div className="wrap metier-grid">
          <h2>Nos prestations</h2>
          <ul className="check-list">
            {p!.services.map((s) => <li key={s}>{s}</li>)}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <span className="eyebrow">Notre engagement</span>
          <h2>Pourquoi choisir SAGFA ?</h2>
          <div className="why">
            {p!.why.map((w) => (
              <div key={w.title} className="why__item">
                <h3>{w.title}</h3>
                <p>{w.text.charAt(0).toUpperCase() + w.text.slice(1)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--green cta-band">
        <CtaBeam />
        <div className="wrap">
          <h2>{p!.cta}</h2>
          {numero && (
            <a href={lienWhatsApp} target="_blank" rel="noopener noreferrer" className="btn btn--light">Écrire sur WhatsApp</a>
          )}
          <Link href="/rendez-vous" className="btn btn--light">Prendre rendez-vous</Link>
        </div>
      </section>
    </>
  );
}
