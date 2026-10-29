import type { Metadata } from "next";
import Link from "next/link";
import Flash from "@/components/Flash";
import Icon from "@/components/Icon";
import AntiSpamFields from "@/components/AntiSpamFields";
import { Reveal } from "@/components/Motion";
import { getSettings, lienTel } from "@/lib/content";
import { requestAppointment } from "@/lib/actions";
import { lienWhatsApp, site } from "@/lib/site";
import { SUJETS, sujetLabel } from "@/lib/sujets";

export const metadata: Metadata = {
  title: "Prendre rendez-vous",
  description: "Essayage, alliances, création sur mesure : choisissez un jour et une heure pour venir en boutique.",
  alternates: { canonical: "/rendez-vous" },
};

const heures = Array.from({ length: 19 }, (_, i) => {
  const m = 9 * 60 + i * 30;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${m % 60 === 0 ? "00" : "30"}`;
});

type Props = { searchParams: Promise<{ ok?: string; erreur?: string; sujet?: string; piece?: string }> };

export default async function RendezVous({ searchParams }: Props) {
  const { ok, erreur, sujet, piece } = await searchParams;
  const settings = await getSettings();
  const tel = lienTel(settings.telephone);
  const wa = lienWhatsApp(settings.whatsapp, `Bonjour ${site.name}, je souhaite prendre rendez-vous.`);
  const aujourdhui = new Date().toISOString().slice(0, 10);
  const sujetParDefaut = sujetLabel(sujet) ?? (piece ? "Essayage d'une pièce" : SUJETS[0].label);

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <span className="eyebrow">Rendez-vous</span>
          <h1>Venez essayer, <em>prenez le temps.</em></h1>
          <p className="lead">Proposez un jour et une heure : nous vous confirmons le rendez-vous par email, téléphone ou WhatsApp.</p>
        </div>
      </section>
      <section className="section">
        <div className="wrap contact">
          <Reveal className="carte-form">
            <h2 style={{ fontSize: "2rem", fontWeight: 400 }}>Votre demande</h2>
            <Flash ok={ok ? "Demande envoyée. Nous vous recontactons très vite pour confirmer le jour et l'heure." : undefined} error={erreur} />
            <form action={requestAppointment} className="form form--2">
              <AntiSpamFields />
              <label>Nom complet<input name="name" required autoComplete="name" /></label>
              <label>Téléphone<input name="phone" type="tel" required autoComplete="tel" /></label>
              <label className="form__full">Email (facultatif, pour recevoir la confirmation)<input name="email" type="email" autoComplete="email" /></label>
              <label>Motif
                <select name="subject" defaultValue={sujetParDefaut}>
                  {SUJETS.map((s) => <option key={s.id}>{s.label}</option>)}
                </select>
              </label>
              <label>Pièce qui vous intéresse (facultatif)<input name="piece" defaultValue={piece ?? ""} maxLength={200} /></label>
              <label>Jour souhaité<input name="date" type="date" min={aujourdhui} required /></label>
              <label>Heure souhaitée
                <select name="time" required defaultValue="">
                  <option value="" disabled>Choisir une heure</option>
                  {heures.map((h) => <option key={h}>{h}</option>)}
                </select>
              </label>
              <label className="form__full">Précisions (facultatif)<textarea name="message" rows={3} placeholder="Taille de doigt, budget, idée de gravure…" /></label>
              <div className="form__full"><button className="btn btn--noir">Demander ce rendez-vous</button></div>
            </form>
          </Reveal>
          <Reveal delay={0.1}>
            <span className="eyebrow">La boutique</span>
            <h2 style={{ fontSize: "clamp(2rem, 3.4vw, 2.8rem)" }}>Nous <em>joindre.</em></h2>
            <dl className="coordonnees">
              <div><dt><span className="coordonnees__icone"><Icon name="pin" size={18} /></span>Adresse</dt><dd>{settings.adresse}</dd></div>
              <div><dt><span className="coordonnees__icone"><Icon name="clock" size={18} /></span>Horaires</dt><dd>{settings.horaires}</dd></div>
              <div><dt><span className="coordonnees__icone"><Icon name="phone" size={18} /></span>Téléphone</dt><dd>{tel ? <a href={tel}>{settings.telephone}</a> : settings.telephone}</dd></div>
              {wa.startsWith("http") && (
                <div><dt><span className="coordonnees__icone"><Icon name="chat" size={18} /></span>WhatsApp</dt><dd><a href={wa} target="_blank" rel="noopener noreferrer">Écrire sur WhatsApp</a></dd></div>
              )}
            </dl>
            <p className="muted" style={{ marginTop: "2rem" }}>
              Vous cherchez une pièce précise ? <Link href="/collections">Parcourez les collections</Link> puis cliquez sur « L&apos;essayer en boutique ».
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
