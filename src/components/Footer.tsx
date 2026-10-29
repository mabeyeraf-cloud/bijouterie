import Link from "next/link";
import { contact, site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-in">
        <div>
          <strong className="brand">{site.name}</strong>
          <p>{contact.adresse}</p>
          <p>{contact.telephone}</p>
          <p>{contact.horaires}</p>
        </div>
        <nav aria-label="Pied de page">
          <Link href="/catalogue">Catalogue</Link>
          <Link href="/a-propos">À propos</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </div>
      <p className="copy">© {new Date().getFullYear()} {site.name}. Tous droits réservés.</p>
    </footer>
  );
}
