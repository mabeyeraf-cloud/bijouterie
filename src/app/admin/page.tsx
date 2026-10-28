import type { Metadata } from "next";
import Flash from "@/components/Flash";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { confirmAppointment, deleteKeyFigure, deleteReference, initKeyFigures, logout, saveKeyFigure, saveReference, saveSettings } from "@/lib/actions";

export const metadata: Metadata = { title: "Administration", robots: { index: false } };
export const dynamic = "force-dynamic";

const STATUT: Record<string, string> = { NEW: "À confirmer", CONFIRMED: "Confirmé", DONE: "Terminé", CANCELED: "Annulé" };
const quand = (d?: string | null, h?: string | null) => (d ? `${d.split("-").reverse().join("/")}${h ? ` à ${h}` : ""}` : "—");

export default async function Admin({ searchParams }: { searchParams: Promise<{ erreur?: string; ok?: string }> }) {
  await requireAdmin();
  const { erreur, ok } = await searchParams;
  const [rdvs, contacts, figures, references, settingRows, team] = await Promise.all([
    db.appointmentRequest.findMany({ where: { kind: "RDV" }, orderBy: { createdAt: "desc" }, take: 100 }),
    db.appointmentRequest.findMany({ where: { kind: { not: "RDV" } }, orderBy: { createdAt: "desc" }, take: 100 }),
    db.keyFigure.findMany({ orderBy: { position: "asc" } }),
    db.reference.findMany({ orderBy: { position: "asc" } }),
    db.siteSetting.findMany(),
    db.teamMember.findMany({
      orderBy: [{ position: "asc" }, { createdAt: "asc" }],
      select: { id: true, name: true, role: true, bio: true, email: true, phone: true, position: true, photoType: true, updatedAt: true },
    }),
  ]);
  const v = (k: string) => settingRows.find((r) => r.key === k)?.value ?? "";
  return (
    <section className="section theme-classic">
      <div className="wrap">
        <h1 style={{ fontSize: "2.2rem" }}>Administration</h1>
        <Flash ok={ok ? "Modification enregistrée." : undefined} error={erreur} />

        <h2>Rendez-vous demandés</h2>
        <p className="muted">Le visiteur propose un jour et une heure. Confirme-les (ou change-les) : il reçoit alors un email avec le jour et l'heure.</p>
        <div className="table-wrap"><table>
          <thead><tr><th>Reçu le</th><th>Nom</th><th>Contact</th><th>Sujet</th><th>Souhaité</th><th>Statut</th><th>Confirmer</th></tr></thead>
          <tbody>{rdvs.map((r) => (
            <tr key={r.id}>
              <td>{r.createdAt.toLocaleDateString("fr-FR")}</td>
              <td>{r.name}</td>
              <td>{r.phone}<br /><span className="muted">{r.email ?? "—"}</span></td>
              <td>{r.pole}</td>
              <td>{quand(r.wantedDate, r.wantedTime)}</td>
              <td>{STATUT[r.status] ?? r.status}{r.confirmedDate && <><br /><span className="muted">{quand(r.confirmedDate, r.confirmedTime)}</span></>}</td>
              <td>
                <form action={confirmAppointment} className="confirmform">
                  <input type="hidden" name="id" value={r.id} />
                  <input type="date" name="date" defaultValue={r.confirmedDate ?? r.wantedDate ?? ""} aria-label="Jour" required />
                  <input type="time" name="time" step={1800} defaultValue={r.confirmedTime ?? r.wantedTime ?? ""} aria-label="Heure" required />
                  <button className="btn btn--sm">{r.status === "CONFIRMED" ? "Renvoyer l'email" : "Confirmer et envoyer"}</button>
                </form>
              </td>
            </tr>
          ))}</tbody>
        </table></div>

        <h2 style={{ marginTop: "3rem" }}>Messages reçus</h2>
        <div className="table-wrap"><table>
          <thead><tr><th>Date</th><th>Nom</th><th>Contact</th><th>Sujet</th><th>Message</th><th></th></tr></thead>
          <tbody>{contacts.map((r) => (
            <tr key={r.id}>
              <td>{r.createdAt.toLocaleDateString("fr-FR")}</td>
              <td>{r.name}</td>
              <td>{r.phone}<br /><span className="muted">{r.email ?? "—"}</span></td>
              <td>{r.pole}</td>
              <td>{r.message}</td>
              <td>{r.email && <a href={`mailto:${r.email}?subject=${encodeURIComponent("Groupe SAGFA — réponse à votre message")}`}>Répondre</a>}</td>
            </tr>
          ))}</tbody>
        </table></div>

        <h2 id="alertes">Alertes par email</h2>
        <p className="muted">Adresse qui reçoit un email à chaque demande de rendez-vous et à chaque message. Elle n'est jamais affichée sur le site.</p>
        <form action={saveSettings} className="settings">
          <label>Email qui reçoit les alertes<input name="notifyEmail" type="email" defaultValue={v("notifyEmail")} placeholder="sidikhsene43@gmail.com" /></label>
          <div><button className="btn">Enregistrer l'adresse</button></div>
        </form>

        <h2 id="coordonnees">Coordonnées du site</h2>
        <p className="muted">Affichées sur l'accueil, le bouton WhatsApp, la page Rendez-vous, les mentions légales et le pied de page. Un champ vide garde la valeur par défaut.</p>
        <form action={saveSettings} className="settings">
          <label>Téléphone<input name="telephone" defaultValue={v("telephone")} placeholder="+221 77 000 00 00" /></label>
          <label>Numéro WhatsApp (avec l'indicatif, sans +)<input name="whatsapp" defaultValue={v("whatsapp")} placeholder="221770000000" /></label>
          <label>Email<input name="email" type="email" defaultValue={v("email")} placeholder="contact@exemple.sn" /></label>
          <label>Adresse<input name="adresse" defaultValue={v("adresse")} placeholder="Rue, quartier, Dakar" /></label>
          <label>Horaires d'ouverture<input name="horaires" defaultValue={v("horaires")} placeholder="Lun–Ven 8h–17h" /></label>
          <label>Facebook (lien)<input name="facebook" defaultValue={v("facebook")} placeholder="https://facebook.com/..." /></label>
          <label>LinkedIn (lien)<input name="linkedin" defaultValue={v("linkedin")} placeholder="https://linkedin.com/company/..." /></label>
          <label>Instagram (lien)<input name="instagram" defaultValue={v("instagram")} placeholder="https://instagram.com/..." /></label>
          <label>X / Twitter (lien)<input name="x" defaultValue={v("x")} placeholder="https://x.com/..." /></label>
          <div><button className="btn">Enregistrer les coordonnées</button></div>
        </form>

        <h2 id="equipe" style={{ marginTop: "3rem" }}>Équipe (page « À propos »)</h2>
        <p className="muted">Photo : JPG, PNG ou WebP, 2 Mo maximum. L'ordre se règle avec le numéro (1 s'affiche en premier).</p>
        {team.map((m) => (
          <form key={m.id} method="post" action="/admin/equipe" encType="multipart/form-data" className="teamform">
            <input type="hidden" name="id" value={m.id} />
            <div className="teamform__side">
              {m.photoType
                ? <img className="teamform__photo" src={`/equipe/${m.id}/photo?v=${m.updatedAt.getTime()}`} alt={m.name} />
                : <div className="teamform__photo teamform__photo--empty">Pas de photo</div>}
              <input type="file" name="photo" accept="image/jpeg,image/png,image/webp" aria-label="Photo" />
              {m.photoType && <label className="teamform__check"><input type="checkbox" name="removePhoto" value="1" /> Retirer la photo</label>}
            </div>
            <div className="teamform__fields">
              <input name="name" defaultValue={m.name} placeholder="Nom et prénom" aria-label="Nom" required />
              <input name="role" defaultValue={m.role} placeholder="Poste" aria-label="Poste" required />
              <textarea name="bio" defaultValue={m.bio} rows={3} placeholder="Courte présentation" aria-label="Présentation" />
              <input name="email" type="email" defaultValue={m.email ?? ""} placeholder="Email" aria-label="Email" />
              <input name="phone" defaultValue={m.phone ?? ""} placeholder="Téléphone" aria-label="Téléphone" />
              <input name="position" type="number" defaultValue={m.position} placeholder="Ordre" aria-label="Ordre" />
              <div className="teamform__actions">
                <button className="btn btn--sm" name="intent" value="save">Enregistrer</button>
                <button className="btn btn--ghost btn--sm" name="intent" value="delete">Supprimer</button>
              </div>
            </div>
          </form>
        ))}
        <form method="post" action="/admin/equipe" encType="multipart/form-data" className="teamform">
          <div className="teamform__side">
            <div className="teamform__photo teamform__photo--empty">Nouveau membre</div>
            <input type="file" name="photo" accept="image/jpeg,image/png,image/webp" aria-label="Photo" />
          </div>
          <div className="teamform__fields">
            <input name="name" placeholder="Nom et prénom" aria-label="Nom" required />
            <input name="role" placeholder="Poste" aria-label="Poste" required />
            <textarea name="bio" rows={3} placeholder="Courte présentation" aria-label="Présentation" />
            <input name="email" type="email" placeholder="Email" aria-label="Email" />
            <input name="phone" placeholder="Téléphone" aria-label="Téléphone" />
            <input name="position" type="number" placeholder="Ordre" aria-label="Ordre" />
            <div className="teamform__actions"><button className="btn btn--sm" name="intent" value="save">Ajouter le membre</button></div>
          </div>
        </form>

        <h2 style={{ marginTop: "3rem" }}>Chiffres clés</h2>
        <p className="muted">Affichés sur l'accueil et la page « À propos ». Un chiffre dont la valeur est vide n'est pas affiché. Exemples de valeur : « 10 ans », « 150+ ».</p>
        {figures.length === 0 && (
          <form action={initKeyFigures}><button className="btn">Créer les 4 chiffres clés</button></form>
        )}
        {figures.map((f) => (
          <form key={f.id} action={saveKeyFigure} className="rowform">
            <input type="hidden" name="id" value={f.id} />
            <input name="label" defaultValue={f.label} aria-label="Libellé" required />
            <input name="value" defaultValue={f.value} aria-label="Valeur" placeholder="Valeur (ex. 150+)" />
            <input name="position" type="number" defaultValue={f.position} aria-label="Ordre" />
            <button className="btn btn--sm">Enregistrer</button>
            <button className="btn btn--ghost btn--sm" formAction={deleteKeyFigure}>Supprimer</button>
          </form>
        ))}
        {figures.length > 0 && (
          <form action={saveKeyFigure} className="rowform">
            <input name="label" placeholder="Nouveau chiffre : libellé" aria-label="Libellé" required />
            <input name="value" placeholder="Valeur" aria-label="Valeur" />
            <input name="position" type="number" placeholder="Ordre" aria-label="Ordre" />
            <button className="btn btn--sm">Ajouter</button>
          </form>
        )}

        <h2 style={{ marginTop: "3rem" }}>Références : entreprises accompagnées</h2>
        <p className="muted">Affichées dans la section Partenaires de l'accueil. Le logo est facultatif : mets l'image dans <code>public/references/</code> et écris son chemin (ex. /references/client.png).</p>
        {references.map((r) => (
          <form key={r.id} action={saveReference} className="rowform">
            <input type="hidden" name="id" value={r.id} />
            <input name="name" defaultValue={r.name} aria-label="Nom" required />
            <input name="logoUrl" defaultValue={r.logoUrl ?? ""} aria-label="Logo" placeholder="/references/logo.png" />
            <input name="position" type="number" defaultValue={r.position} aria-label="Ordre" />
            <button className="btn btn--sm">Enregistrer</button>
            <button className="btn btn--ghost btn--sm" formAction={deleteReference}>Supprimer</button>
          </form>
        ))}
        <form action={saveReference} className="rowform">
          <input name="name" placeholder="Nouvelle référence : nom de l'entreprise" aria-label="Nom" required />
          <input name="logoUrl" placeholder="Logo (facultatif)" aria-label="Logo" />
          <input name="position" type="number" placeholder="Ordre" aria-label="Ordre" />
          <button className="btn btn--sm">Ajouter</button>
        </form>

        <form action={logout} style={{ marginTop: "3rem" }}><button className="btn btn--ghost" style={{ cursor: "pointer" }}>Se déconnecter</button></form>
      </div>
    </section>
  );
}
