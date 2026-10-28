import type { Metadata } from "next";
import { legal } from "@/lib/site";
import { getSettings } from "@/lib/content";

export const metadata: Metadata = { title: "Politique de confidentialité", alternates: { canonical: "/confidentialite" } };

export default async function Confidentialite() {
  const contact = await getSettings();
  return (
    <section className="section">
      <div className="wrap prose">
        <h1>Politique de confidentialité</h1>
        <p>{legal.raisonSociale} protège les données personnelles de ses visiteurs. Voici ce que nous collectons et pourquoi.</p>

        <h2>Données collectées</h2>
        <p>
          Lorsque vous remplissez le formulaire de contact ou de rendez-vous, nous recueillons votre nom, votre numéro
          de téléphone, votre email (facultatif), le sujet de votre demande et votre message (facultatif).
        </p>

        <h2>Pourquoi nous les utilisons</h2>
        <p>Uniquement pour répondre à votre demande, vous rappeler et fixer un rendez-vous. Elles ne sont ni vendues, ni cédées à des tiers à des fins commerciales.</p>

        <h2>Qui y a accès</h2>
        <p>L’équipe de {legal.raisonSociale}, ainsi que nos prestataires techniques d’hébergement et d’envoi d’emails, strictement pour faire fonctionner le site.</p>

        <h2>Durée de conservation</h2>
        <p>Vos données sont conservées {legal.conservation}.</p>

        <h2>Vos droits</h2>
        <p>
          Conformément à la loi sénégalaise n° 2008-12 du 25 janvier 2008 sur la protection des données à caractère
          personnel, vous pouvez demander l’accès, la rectification ou la suppression de vos données, ou vous opposer à
          leur traitement. Écrivez-nous à {contact.email}. Vous pouvez aussi saisir la Commission de protection des
          données personnelles (CDP).
        </p>

        <h2>Cookies</h2>
        <p>Ce site n’utilise aucun cookie publicitaire ni outil de suivi. Un cookie technique de session n’est utilisé que pour l’accès à l’espace d’administration.</p>

        <h2>Sécurité</h2>
        <p>Les échanges avec le site sont chiffrés (HTTPS) et l’accès aux demandes est réservé à l’administration.</p>
      </div>
    </section>
  );
}
