import Link from "next/link";

export default function NotFound() {
  return (
    <section className="page-hero">
      <div className="wrap notfound">
        <span className="eyebrow">Erreur 404</span>
        <h1>Cette page <em>n&apos;existe pas.</em></h1>
        <p className="lead">Le lien est peut-être erroné, ou la pièce n&apos;est plus présentée.</p>
        <div className="actions">
          <Link href="/collections" className="btn btn--gold">Voir les collections</Link>
          <Link href="/" className="btn btn--ligne">Retour à l&apos;accueil</Link>
        </div>
      </div>
    </section>
  );
}
