import Link from "next/link";
import Logo from "./Logo";
import { getSettings, lienTel } from "@/lib/content";
import { categories, site } from "@/lib/site";

export default async function Footer() {
  const s = await getSettings();
  const tel = lienTel(s.telephone);
  const reseaux = [["Instagram", s.instagram], ["Facebook", s.facebook], ["TikTok", s.tiktok]].filter(([, url]) => url);
  return (
    <footer className="footer">
      <div className="wrap footer__grid">
        <div className="footer__brand">
          <Link href="/" aria-label={`${site.name} — accueil`}><Logo /></Link>
          <p>Bijoux en or façonnés à Dakar, pour les jours ordinaires et les jours qui comptent.</p>
        </div>
        <nav aria-label="Collections">
          <h2 className="footer__title">Collections</h2>
          <ul>
            {categories.map((c) => <li key={c.id}><Link href={`/collections?categorie=${c.id}`}>{c.label}</Link></li>)}
          </ul>
        </nav>
        <nav aria-label="La maison">
          <h2 className="footer__title">La maison</h2>
          <ul>
            <li><Link href="/#mariage">Alliances & mariage</Link></li>
            <li><Link href="/#sur-mesure">Création sur mesure</Link></li>
            <li><Link href="/la-maison">Savoir-faire</Link></li>
            <li><Link href="/rendez-vous">Prendre rendez-vous</Link></li>
          </ul>
        </nav>
        <div>
          <h2 className="footer__title">Boutique</h2>
          <ul>
            <li>{s.adresse}</li>
            <li>{s.horaires}</li>
            <li>{tel ? <a href={tel}>{s.telephone}</a> : s.telephone}</li>
            {reseaux.map(([nom, url]) => <li key={nom}><a href={url} target="_blank" rel="noopener noreferrer">{nom}</a></li>)}
          </ul>
        </div>
      </div>
      <div className="wrap">
        <div className="footer__bar">
          <p>© {new Date().getFullYear()} {site.name} · Dakar, Sénégal</p>
          <nav aria-label="Informations légales">
            <Link href="/mentions-legales">Mentions légales</Link>
            <Link href="/confidentialite">Confidentialité</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
