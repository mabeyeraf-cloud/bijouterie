import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import PieceCard, { PieceVisual } from "@/components/PieceCard";
import { Item, Reveal, Stagger } from "@/components/Motion";
import { getPiece, getPieces, getSettings } from "@/lib/content";
import { categories, categoryLabel, lienWhatsApp, prix, site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const piece = await getPiece((await params).slug);
  if (!piece) return { title: "Pièce introuvable" };
  return {
    title: `${piece.name} — ${categoryLabel(piece.category)}`,
    description: piece.description || `${piece.name}, ${piece.material}. Bijou façonné à Dakar par ${site.name}.`,
    alternates: { canonical: `/collections/${piece.slug}` },
    openGraph: piece.photoUrl ? { images: [{ url: piece.photoUrl }] } : undefined,
  };
}

export default async function Fiche({ params }: Props) {
  const piece = await getPiece((await params).slug);
  if (!piece) notFound();
  const [settings, memes] = await Promise.all([getSettings(), getPieces(piece.category)]);
  let autres = memes.pieces.filter((p) => p.slug !== piece.slug);
  if (autres.length < 4) {
    const toutes = (await getPieces()).pieces.filter((p) => p.slug !== piece.slug && !autres.some((a) => a.slug === p.slug));
    autres = [...autres, ...toutes];
  }
  autres = autres.slice(0, 4);

  const cat = categories.find((c) => c.id === piece.category);
  const commander = lienWhatsApp(
    settings.whatsapp,
    `Bonjour ${site.name}, je suis intéressé(e) par « ${piece.name} » (${categoryLabel(piece.category)}) vu sur votre site. Est-il disponible ?`
  );
  const externe = commander.startsWith("http");

  return (
    <>
      <section className="section" style={{ paddingTop: "clamp(2.5rem, 5vw, 4rem)" }}>
        <div className="wrap">
          <ol className="fil" aria-label="Fil d'Ariane">
            <li><Link href="/collections">Collections</Link></li>
            {cat && <li><Link href={`/collections?categorie=${cat.id}`}>{cat.label}</Link></li>}
            <li aria-current="page">{piece.name}</li>
          </ol>
          <div className="fiche">
            <Reveal className="fiche__visuel"><PieceVisual piece={piece} large /></Reveal>
            <Reveal delay={0.1}>
              <span className="eyebrow">{categoryLabel(piece.category)}</span>
              <h1>{piece.name}</h1>
              {piece.material && <p className="fiche__matiere">{piece.material}</p>}
              <p className="fiche__prix">{prix(piece.priceXof)}</p>
              {piece.description && <p className="fiche__desc">{piece.description}</p>}
              <div className="actions">
                <a href={commander} className="btn btn--noir" {...(externe ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                  <Icon name="chat" size={18} />Commander sur WhatsApp
                </a>
                <Link href={`/rendez-vous?sujet=essayage&piece=${encodeURIComponent(piece.name)}`} className="btn btn--ligne">
                  <Icon name="calendar" size={18} />L&apos;essayer en boutique
                </Link>
              </div>
              <ul className="filets">
                <li>Taille ajustée à votre doigt ou à votre poignet</li>
                <li>Gravure possible : un prénom, une date</li>
                <li>Remis dans son écrin, en boutique ou livré à Dakar</li>
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {autres.length > 0 && (
        <section className="section section--ivoire">
          <div className="wrap">
            <Reveal className="section__head">
              <div>
                <span className="eyebrow">À découvrir aussi</span>
                <h2>Dans la même <em>veine.</em></h2>
              </div>
            </Reveal>
            <Stagger className="pieces" gap={0.08}>
              {autres.map((p) => <Item key={p.slug}><PieceCard piece={p} /></Item>)}
            </Stagger>
          </div>
        </section>
      )}
    </>
  );
}
