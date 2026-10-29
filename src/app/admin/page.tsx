import type { Metadata } from "next";
import Link from "next/link";
import Flash from "@/components/Flash";
import { JewelDrawing } from "@/components/Jewel";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { confirmAppointment, logout, saveSettings, setAppointmentStatus } from "@/lib/actions";
import { categories, drawingFor, exemples, prix, site } from "@/lib/site";

export const metadata: Metadata = { title: "Administration", robots: { index: false } };
export const dynamic = "force-dynamic";

const STATUT: Record<string, string> = { NEW: "À confirmer", CONFIRMED: "Confirmé", DONE: "Terminé", CANCELED: "Annulé" };
const quand = (d?: string | null, h?: string | null) => (d ? `${d.split("-").reverse().join("/")}${h ? ` à ${h}` : ""}` : "—");
const wa = (phone: string) => {
  const d = phone.replace(/\D/g, "");
  return d.length >= 9 ? `https://wa.me/${d.length === 9 ? `221${d}` : d}` : null;
};

/* Formulaire d'un bijou : ajout (sans bijou) ou modification. */
function FicheBijou({ b }: { b?: { id: string; slug: string; name: string; category: string; material: string; description: string; priceXof: number | null; featured: boolean; active: boolean; position: number; photoType: string | null; updatedAt: Date } }) {
  return (
    <form method="post" action="/admin/bijoux" encType="multipart/form-data" className="fiche-admin">
      {b && <input type="hidden" name="id" value={b.id} />}
      <div className="fiche-admin__side">
        {b?.photoType
          // eslint-disable-next-line @next/next/no-img-element
          ? <img className="fiche-admin__photo" src={`/photos/bijoux/${b.id}?v=${b.updatedAt.getTime()}`} alt={b.name} />
          : <div className="fiche-admin__photo">{b ? <JewelDrawing kind={drawingFor(b.category)} /> : <span className="fiche-admin__photo--vide">Nouveau bijou</span>}</div>}
        <label>Photo (JPG, PNG, WebP, 4 Mo max.)<input type="file" name="photo" accept="image/jpeg,image/png,image/webp" /></label>
        {b?.photoType && <label className="fiche-admin__check"><input type="checkbox" name="removePhoto" value="1" /> Retirer la photo</label>}
      </div>
      <div className="fiche-admin__fields">
        <label>Nom du bijou<input name="name" defaultValue={b?.name} placeholder="ex. Bague Awa" required maxLength={120} /></label>
        <label>Catégorie
          <select name="category" defaultValue={b?.category ?? ""} required>
            <option value="" disabled>Choisir</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </label>
        <label>Matière<input name="material" defaultValue={b?.material} placeholder="ex. Or 18 carats, diamant" maxLength={160} /></label>
        <label>Prix en FCFA (vide = « Prix sur demande »)<input name="price" inputMode="numeric" defaultValue={b?.priceXof ?? ""} placeholder="ex. 250000" /></label>
        <label className="plein">Description<textarea name="description" defaultValue={b?.description} rows={3} maxLength={2000} placeholder="Deux ou trois phrases sur la pièce." /></label>
        <label>Ordre d&apos;affichage<input name="position" type="number" defaultValue={b?.position ?? 0} /></label>
        <div style={{ display: "grid", gap: ".4rem", alignContent: "end" }}>
          <label className="fiche-admin__check"><input type="checkbox" name="featured" value="1" defaultChecked={b?.featured} /> À la une sur l&apos;accueil</label>
          {b && <label className="fiche-admin__check"><input type="checkbox" name="active" value="1" defaultChecked={b.active} /> Visible sur le site</label>}
        </div>
        <div className="fiche-admin__actions">
          <button className="btn btn--noir btn--sm" name="intent" value="save">{b ? "Enregistrer" : "Ajouter au catalogue"}</button>
          {b && <Link className="btn btn--ligne btn--sm" href={`/collections/${b.slug}`} target="_blank">Voir sur le site</Link>}
          {b && <button className="btn btn--ligne btn--sm" name="intent" value="delete">Supprimer</button>}
        </div>
      </div>
    </form>
  );
}

export default async function Admin({ searchParams }: { searchParams: Promise<{ erreur?: string; ok?: string }> }) {
  await requireAdmin();
  const { erreur, ok } = await searchParams;
  const [rdvs, contacts, bijoux, settingRows, team] = await Promise.all([
    db.appointmentRequest.findMany({ where: { kind: "RDV" }, orderBy: { createdAt: "desc" }, take: 100 }),
    db.appointmentRequest.findMany({ where: { kind: { not: "RDV" } }, orderBy: { createdAt: "desc" }, take: 100 }),
    db.bijou.findMany({
      orderBy: [{ position: "asc" }, { createdAt: "desc" }],
      select: { id: true, slug: true, name: true, category: true, material: true, description: true, priceXof: true, featured: true, active: true, position: true, photoType: true, updatedAt: true },
    }),
    db.siteSetting.findMany(),
    db.teamMember.findMany({
      orderBy: [{ position: "asc" }, { createdAt: "asc" }],
      select: { id: true, name: true, role: true, bio: true, email: true, phone: true, position: true, photoType: true, updatedAt: true },
    }),
  ]);
  const v = (k: string) => settingRows.find((r) => r.key === k)?.value ?? "";
  const visibles = bijoux.filter((b) => b.active).length;

  return (
    <section className="section admin">
      <div className="wrap">
        <span className="eyebrow">{site.name}</span>
        <h1>Administration</h1>
        <p className="muted">
          Aller à : <a href="#rendez-vous">Rendez-vous</a> · <a href="#messages">Messages</a> · <a href="#catalogue">Catalogue</a> ·{" "}
          <a href="#coordonnees">Coordonnées</a> · <a href="#alertes">Alertes</a> · <a href="#equipe">Équipe</a>
        </p>
        <Flash ok={ok ? "Modification enregistrée." : undefined} error={erreur} />

        <h2 id="rendez-vous">Rendez-vous demandés</h2>
        <p className="muted">Le client propose un jour et une heure. Confirmez-les (ou changez-les) : s&apos;il a laissé un email, il reçoit la confirmation. Sinon, prévenez-le par téléphone ou WhatsApp.</p>
        <div className="table-wrap"><table>
          <thead><tr><th>Reçu le</th><th>Client</th><th>Motif</th><th>Souhaité</th><th>Statut</th><th>Confirmer</th></tr></thead>
          <tbody>
            {rdvs.length === 0 && <tr><td colSpan={6} className="muted">Aucune demande pour l&apos;instant.</td></tr>}
            {rdvs.map((r) => (
              <tr key={r.id}>
                <td>{r.createdAt.toLocaleDateString("fr-FR")}</td>
                <td>
                  {r.name}<br />
                  <a href={`tel:${r.phone.replace(/\s/g, "")}`}>{r.phone}</a>
                  {wa(r.phone) && <> · <a href={wa(r.phone)!} target="_blank" rel="noopener noreferrer">WhatsApp</a></>}
                  <br /><span className="muted">{r.email ?? "—"}</span>
                </td>
                <td>{r.subject}{r.piece && <><br /><span className="muted">Pièce : {r.piece}</span></>}{r.message && <><br /><span className="muted">{r.message}</span></>}</td>
                <td>{quand(r.wantedDate, r.wantedTime)}</td>
                <td>
                  {STATUT[r.status] ?? r.status}
                  {r.confirmedDate && <><br /><span className="muted">{quand(r.confirmedDate, r.confirmedTime)}</span></>}
                  <form action={setAppointmentStatus} className="confirmform" style={{ marginTop: ".4rem" }}>
                    <input type="hidden" name="id" value={r.id} />
                    <select name="status" defaultValue={r.status} aria-label="Statut">
                      {Object.entries(STATUT).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
                    </select>
                    <button className="btn btn--ligne btn--sm">OK</button>
                  </form>
                </td>
                <td>
                  <form action={confirmAppointment} className="confirmform">
                    <input type="hidden" name="id" value={r.id} />
                    <input type="date" name="date" defaultValue={r.confirmedDate ?? r.wantedDate ?? ""} aria-label="Jour" required />
                    <input type="time" name="time" step={1800} defaultValue={r.confirmedTime ?? r.wantedTime ?? ""} aria-label="Heure" required />
                    <button className="btn btn--noir btn--sm">{r.status === "CONFIRMED" ? "Renvoyer" : "Confirmer"}</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table></div>

        <h2 id="messages">Messages reçus</h2>
        <div className="table-wrap"><table>
          <thead><tr><th>Date</th><th>Client</th><th>Sujet</th><th>Message</th><th></th></tr></thead>
          <tbody>
            {contacts.length === 0 && <tr><td colSpan={5} className="muted">Aucun message pour l&apos;instant.</td></tr>}
            {contacts.map((r) => (
              <tr key={r.id}>
                <td>{r.createdAt.toLocaleDateString("fr-FR")}</td>
                <td>{r.name}<br /><a href={`tel:${r.phone.replace(/\s/g, "")}`}>{r.phone}</a><br /><span className="muted">{r.email ?? "—"}</span></td>
                <td>{r.subject}</td>
                <td>{r.message}</td>
                <td>
                  {r.email && <a href={`mailto:${r.email}?subject=${encodeURIComponent(`${site.name} — réponse à votre message`)}`}>Répondre</a>}
                  {wa(r.phone) && <><br /><a href={wa(r.phone)!} target="_blank" rel="noopener noreferrer">WhatsApp</a></>}
                </td>
              </tr>
            ))}
          </tbody>
        </table></div>

        <h2 id="catalogue">Catalogue des bijoux</h2>
        <p className="muted">
          {bijoux.length === 0
            ? `Le catalogue est vide : le site montre pour l'instant ${exemples.length} pièces d'exemple dessinées. Dès que vous ajoutez votre premier bijou, ce sont vos vrais bijoux qui s'affichent.`
            : `${bijoux.length} bijou${bijoux.length > 1 ? "x" : ""} dans le catalogue, dont ${visibles} visible${visibles > 1 ? "s" : ""} sur le site. Sans photo, un bijou est montré avec un dessin doré.`}
        </p>
        <div className="encart">Conseil photo : un bijou seul, sur fond uni et sombre, photographié de près à la lumière du jour, au format portrait. Les prix s&apos;affichent ainsi : {prix(250000)}.</div>
        <h3 style={{ marginTop: "2rem" }}>Ajouter un bijou</h3>
        <FicheBijou />
        {bijoux.length > 0 && <h3 style={{ marginTop: "2.5rem" }}>Bijoux du catalogue</h3>}
        {bijoux.map((b) => (
          <div key={b.id}>
            <p style={{ margin: "1.6rem 0 0" }}>
              {b.featured && <span className="badge badge--or">À la une</span>} {!b.active && <span className="badge">Masqué</span>}
            </p>
            <FicheBijou b={b} />
          </div>
        ))}

        <h2 id="coordonnees">Coordonnées de la boutique</h2>
        <p className="muted">Affichées sur l&apos;accueil, la page Rendez-vous, les fiches des bijoux, le bouton WhatsApp et le pied de page. Un champ vide garde la valeur par défaut.</p>
        <form action={saveSettings} className="settings">
          <label>Téléphone (affiché)<input name="telephone" defaultValue={v("telephone")} placeholder="+221 77 000 00 00" /></label>
          <label>Numéro WhatsApp (avec 221, sans +)<input name="whatsapp" defaultValue={v("whatsapp")} placeholder="221770000000" /></label>
          <label>Email<input name="email" type="email" defaultValue={v("email")} placeholder="contact@exemple.sn" /></label>
          <label>Adresse<input name="adresse" defaultValue={v("adresse")} placeholder="Rue, quartier, Dakar" /></label>
          <label>Horaires d&apos;ouverture<input name="horaires" defaultValue={v("horaires")} placeholder="Lun–Sam, 10h–19h" /></label>
          <label>Instagram (lien)<input name="instagram" defaultValue={v("instagram")} placeholder="https://instagram.com/..." /></label>
          <label>Facebook (lien)<input name="facebook" defaultValue={v("facebook")} placeholder="https://facebook.com/..." /></label>
          <label>TikTok (lien)<input name="tiktok" defaultValue={v("tiktok")} placeholder="https://tiktok.com/@..." /></label>
          <div><button className="btn btn--noir">Enregistrer les coordonnées</button></div>
        </form>

        <h2 id="alertes">Alertes par email</h2>
        <p className="muted">Adresse qui reçoit un email à chaque demande de rendez-vous et à chaque message. Elle n&apos;est jamais affichée sur le site.</p>
        <form action={saveSettings} className="settings">
          <label>Email qui reçoit les alertes<input name="notifyEmail" type="email" defaultValue={v("notifyEmail")} placeholder="vous@exemple.com" /></label>
          <div><button className="btn btn--noir">Enregistrer l&apos;adresse</button></div>
        </form>

        <h2 id="equipe">Équipe (page « La Maison »)</h2>
        <p className="muted">Facultatif : la section n&apos;apparaît que si au moins une personne est ajoutée. Photo : JPG, PNG ou WebP, 2 Mo maximum. L&apos;ordre se règle avec le numéro (1 s&apos;affiche en premier).</p>
        {[...team, null].map((m) => (
          <form key={m?.id ?? "nouveau"} method="post" action="/admin/equipe" encType="multipart/form-data" className="fiche-admin">
            {m && <input type="hidden" name="id" value={m.id} />}
            <div className="fiche-admin__side">
              {m?.photoType
                // eslint-disable-next-line @next/next/no-img-element
                ? <img className="fiche-admin__photo" src={`/photos/equipe/${m.id}?v=${m.updatedAt.getTime()}`} alt={m.name} />
                : <div className="fiche-admin__photo"><span className="fiche-admin__photo--vide">{m ? "Pas de photo" : "Nouvelle personne"}</span></div>}
              <label>Photo<input type="file" name="photo" accept="image/jpeg,image/png,image/webp" /></label>
              {m?.photoType && <label className="fiche-admin__check"><input type="checkbox" name="removePhoto" value="1" /> Retirer la photo</label>}
            </div>
            <div className="fiche-admin__fields">
              <label>Nom et prénom<input name="name" defaultValue={m?.name} required /></label>
              <label>Rôle<input name="role" defaultValue={m?.role} placeholder="ex. Artisan bijoutier" required /></label>
              <label className="plein">Courte présentation<textarea name="bio" defaultValue={m?.bio} rows={2} /></label>
              <label>Ordre<input name="position" type="number" defaultValue={m?.position ?? 0} /></label>
              <div className="fiche-admin__actions">
                <button className="btn btn--noir btn--sm" name="intent" value="save">{m ? "Enregistrer" : "Ajouter"}</button>
                {m && <button className="btn btn--ligne btn--sm" name="intent" value="delete">Supprimer</button>}
              </div>
            </div>
          </form>
        ))}

        <form action={logout} style={{ marginTop: "3.5rem" }}><button className="btn btn--ligne">Se déconnecter</button></form>
      </div>
    </section>
  );
}
