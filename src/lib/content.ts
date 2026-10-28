import { db } from "./db";
import { contact, site } from "./site";

/** Chiffres clés affichés sur le site (ceux dont la valeur est renseignée). Jamais d'erreur côté visiteur. */
export async function getKeyFigures() {
  try {
    const rows = await db.keyFigure.findMany({ orderBy: { position: "asc" } });
    return rows.filter((f) => f.value.trim() !== "");
  } catch {
    return [];
  }
}

export async function getReferences() {
  try {
    return await db.reference.findMany({ orderBy: { position: "asc" } });
  } catch {
    return [];
  }
}

/** Équipe de la page « À propos » (sans les octets de la photo). */
export async function getTeam() {
  try {
    return await db.teamMember.findMany({
      orderBy: [{ position: "asc" }, { createdAt: "asc" }],
      select: { id: true, name: true, role: true, bio: true, email: true, phone: true, photoType: true, updatedAt: true },
    });
  } catch {
    return [];
  }
}

export type Settings = {
  telephone: string; whatsapp: string; email: string; adresse: string; horaires: string;
  facebook: string; linkedin: string; instagram: string; x: string;
  notifyEmail: string; // adresse qui reçoit les alertes (jamais affichée sur le site)
};

/** Coordonnées du site : valeurs saisies dans /admin, sinon valeurs par défaut de src/lib/site.ts. */
export async function getSettings(): Promise<Settings> {
  const s: Settings = {
    telephone: contact.telephone, whatsapp: site.whatsapp, email: contact.email, adresse: contact.adresse,
    horaires: contact.horaires, facebook: "", linkedin: "", instagram: "", x: "",
    notifyEmail: process.env.NOTIFY_EMAIL ?? "",
  };
  try {
    const rows = await db.siteSetting.findMany();
    for (const r of rows) {
      if (r.value.trim() && r.key in s) s[r.key as keyof Settings] = r.value.trim();
    }
  } catch {
    /* base indisponible : valeurs par défaut */
  }
  return s;
}
