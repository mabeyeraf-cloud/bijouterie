import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container section center page-top">
      <h1>Page introuvable</h1>
      <p><Link className="btn" href="/">Retour à l'accueil</Link></p>
    </section>
  );
}
