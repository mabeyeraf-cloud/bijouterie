import type { Metadata } from "next";
import { contact, whatsappLink } from "@/lib/site";

export const metadata: Metadata = { title: "Contact" };

export default function Page() {
  return (
    <section className="container section narrow page-top">
      <h1>Contact</h1>
      <dl className="info">
        <dt>Adresse</dt><dd>{contact.adresse}</dd>
        <dt>Téléphone</dt><dd>{contact.telephone}</dd>
        <dt>Horaires</dt><dd>{contact.horaires}</dd>
      </dl>
      <a className="btn" target="_blank" rel="noopener noreferrer" href={whatsappLink("Bonjour, je souhaite des informations.")}>Écrire sur WhatsApp</a>
    </section>
  );
}
