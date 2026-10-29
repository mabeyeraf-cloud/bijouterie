import type { Metadata } from "next";
import { legal, site } from "@/lib/site";
import { getSettings } from "@/lib/content";

export const metadata: Metadata = { title: "Mentions légales", alternates: { canonical: "/mentions-legales" } };

export default async function MentionsLegales() {
  const contact = await getSettings();
  return (
    <section className="section">
      <div className="wrap prose">
        <span className="eyebrow">Informations</span>
        <h1>Mentions légales</h1>

        <h2>Éditeur du site</h2>
        <p>
          {legal.raisonSociale}, {legal.formeJuridique}<br />
          Capital : {legal.capital}<br />
          NINEA : {legal.ninea} · RCCM : {legal.rccm}<br />
          Siège : {contact.adresse}<br />
          Téléphone : {contact.telephone} · Email : {contact.email}<br />
          Responsable de la publication : {legal.responsablePublication}
        </p>

        <h2>Hébergement</h2>
        <p>Le site {site.url} est hébergé par : {legal.hebergeur}.</p>

        <h2>Propriété intellectuelle</h2>
        <p>
          Les textes, logos, dessins, photographies de bijoux et éléments du site appartiennent à
          {" "}{legal.raisonSociale}. Toute reproduction sans autorisation écrite est interdite.
        </p>

        <h2>Responsabilité</h2>
        <p>
          Nous veillons à l’exactitude des informations publiées (descriptions, prix, disponibilité), mais elles sont
          données à titre indicatif et peuvent évoluer ; le prix et la disponibilité d’une pièce sont confirmés au moment
          de la commande. {legal.raisonSociale} ne saurait être tenue responsable d’une erreur ou d’une indisponibilité du site.
        </p>

        <h2>Données personnelles</h2>
        <p>Le traitement des données collectées sur ce site est décrit dans notre <a href="/confidentialite">politique de confidentialité</a>.</p>

        <h2>Droit applicable</h2>
        <p>Le présent site est soumis au droit sénégalais. En cas de litige, les tribunaux de Dakar sont compétents.</p>
      </div>
    </section>
  );
}
