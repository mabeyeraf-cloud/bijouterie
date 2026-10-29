import type { Metadata } from "next";
import Link from "next/link";
import PieceCard from "@/components/PieceCard";
import { Item, Reveal, Stagger } from "@/components/Motion";
import { getPieces } from "@/lib/content";
import { categories } from "@/lib/site";

type Props = { searchParams: Promise<{ categorie?: string }> };

const trouver = (id?: string) => categories.find((c) => c.id === id);

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const cat = trouver((await searchParams).categorie);
  return {
    title: cat ? `${cat.label} en or` : "Collections",
    description: cat
      ? `${cat.label} en or, façonnés à Dakar. Commande sur WhatsApp ou essayage en boutique sur rendez-vous.`
      : "Bagues, colliers, boucles d'oreilles, bracelets et parures en or, façonnés à Dakar.",
    alternates: { canonical: cat ? `/collections?categorie=${cat.id}` : "/collections" },
  };
}

export default async function Collections({ searchParams }: Props) {
  const cat = trouver((await searchParams).categorie);
  const { pieces } = await getPieces(cat?.id);
  const n = pieces.length;
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <ol className="fil" aria-label="Fil d'Ariane">
            <li><Link href="/">Accueil</Link></li>
            <li>{cat ? <Link href="/collections">Collections</Link> : "Collections"}</li>
            {cat && <li>{cat.label}</li>}
          </ol>
          <span className="eyebrow">Collections</span>
          <h1>{cat ? <>{cat.label}, <em>en or.</em></> : <>Toutes nos <em>pièces.</em></>}</h1>
          <p className="lead">
            Chaque pièce peut être commandée sur WhatsApp, ou essayée en boutique sur rendez-vous. Tailles et gravures
            s&apos;ajustent à la demande.
          </p>
        </div>
      </section>

      <section className="section section--serre">
        <div className="wrap">
          <nav aria-label="Filtrer par catégorie">
            <ul className="filtres">
              <li><Link href="/collections" aria-current={!cat ? "page" : undefined}>Tout</Link></li>
              {categories.map((c) => (
                <li key={c.id}>
                  <Link href={`/collections?categorie=${c.id}`} aria-current={cat?.id === c.id ? "page" : undefined}>{c.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <p className="compte" role="status">{n === 0 ? "Aucune pièce" : n === 1 ? "1 pièce" : `${n} pièces`}</p>

          {n > 0 ? (
            <Stagger className="pieces" gap={0.06}>
              {pieces.map((p) => <Item key={p.slug}><PieceCard piece={p} /></Item>)}
            </Stagger>
          ) : (
            <Reveal className="vide">
              <h2>Bientôt dans cette collection.</h2>
              <p className="muted">
                Les {cat?.label.toLowerCase() ?? "pièces"} arrivent. En attendant, nous pouvons vous en montrer en boutique
                ou en créer une pour vous.
              </p>
              <div className="actions" style={{ justifyContent: "center" }}>
                <Link href="/rendez-vous?sujet=sur-mesure" className="btn btn--noir">Demander une création</Link>
                <Link href="/collections" className="btn btn--ligne">Voir toutes les pièces</Link>
              </div>
            </Reveal>
          )}
        </div>
      </section>
    </>
  );
}
