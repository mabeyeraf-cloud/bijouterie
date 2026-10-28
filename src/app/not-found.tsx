import Link from "next/link";

export default function NotFound() {
  return (
    <section className="hero">
      <div className="wrap notfound">
        <span className="eyebrow">Erreur 404</span>
        <h1>Cette page <em>n’existe pas.</em></h1>
        <p className="lead">Le lien est peut-être erroné, ou la page a été déplacée.</p>
        <div className="hero__actions">
          <Link href="/" className="btn">Retour à l’accueil</Link>
          <Link href="/rendez-vous" className="btn btn--ghost">Prendre rendez-vous</Link>
        </div>
      </div>
    </section>
  );
}
