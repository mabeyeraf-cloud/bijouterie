import Link from "next/link";
import Logo from "./Logo";
import { getSettings } from "@/lib/content";

export default async function Footer() {
  const s = await getSettings();
  const reseaux = [["Facebook", s.facebook], ["LinkedIn", s.linkedin], ["Instagram", s.instagram], ["X", s.x]].filter(([, url]) => url);
  return (
    <footer className="footer">
      <div className="wrap footer__bar">
        <Link href="/" aria-label="Groupe Sagfa — accueil"><Logo variant="dark" /></Link>
        <p className="footer__motto">Structure — Vision — Cohérence — Clarté</p>
        {reseaux.length > 0 && (
          <nav className="footer__links" aria-label="Réseaux sociaux">
            {reseaux.map(([nom, url]) => <a key={nom} href={url} target="_blank" rel="noopener noreferrer">{nom}</a>)}
          </nav>
        )}
        <nav className="footer__links" aria-label="Informations légales">
          <Link href="/mentions-legales">Mentions légales</Link>
          <Link href="/confidentialite">Confidentialité</Link>
        </nav>
        <p className="footer__legal">© {new Date().getFullYear()} GROUPE SAGFA SUARL · Dakar, Sénégal</p>
      </div>
    </footer>
  );
}
