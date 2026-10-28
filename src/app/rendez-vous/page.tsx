import type { Metadata } from "next";
import Flash from "@/components/Flash";
import AntiSpamFields from "@/components/AntiSpamFields";
import { poles } from "@/lib/site";
import { getSettings } from "@/lib/content";
import { requestAppointment } from "@/lib/actions";

export const metadata: Metadata = { title: "Prendre rendez-vous" };

const heures = Array.from({ length: 19 }, (_, i) => {
  const m = 8 * 60 + i * 30;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${m % 60 === 0 ? "00" : "30"}`;
});

export default async function RendezVous({ searchParams }: { searchParams: Promise<{ ok?: string; erreur?: string }> }) {
  const { ok, erreur } = await searchParams;
  const settings = await getSettings();
  const tel = settings.telephone.replace(/\s/g, "");
  const aujourdhui = new Date().toISOString().slice(0, 10);
  return (
    <>
      <section className="hero">
        <div className="wrap">
          <h1>Prendre rendez-vous</h1>
          <p>Proposez un jour et une heure : nous les confirmons par email.</p>
        </div>
      </section>
      <section className="section">
        <div className="wrap grid2">
          <div>
            <Flash ok={ok ? "Demande envoyée. Vous recevrez un email pour confirmer le jour et l'heure du rendez-vous." : undefined} error={erreur} />
            <form action={requestAppointment} className="form">
              <AntiSpamFields />
              <label>Nom complet<input name="name" required autoComplete="name" /></label>
              <label>Téléphone<input name="phone" type="tel" required autoComplete="tel" /></label>
              <label>Email (pour recevoir la confirmation)<input name="email" type="email" required autoComplete="email" /></label>
              <label>Sujet
                <select name="pole">
                  {[...poles.map((p) => p.name), "SAGFA360", "Autre"].map((n) => <option key={n}>{n}</option>)}
                </select>
              </label>
              <label>Jour souhaité<input name="date" type="date" min={aujourdhui} required /></label>
              <label>Heure souhaitée
                <select name="time" required defaultValue="">
                  <option value="" disabled>Choisir une heure</option>
                  {heures.map((h) => <option key={h}>{h}</option>)}
                </select>
              </label>
              <button className="btn">Demander ce rendez-vous</button>
            </form>
          </div>
          <div>
            <h2>Nous joindre</h2>
            <ul className="list">
              <li>Téléphone : <a href={`tel:${tel}`}>{settings.telephone}</a></li>
              <li>WhatsApp : <a href={`https://wa.me/${settings.whatsapp}`}>{settings.telephone}</a></li>
              <li>Horaires : {settings.horaires}</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
