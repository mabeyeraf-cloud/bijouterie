import { db } from "./db";
import { contact, exemples, drawingFor, site, type Drawing } from "./site";

/** Un bijou tel qu'affiché sur le site : un bijou du catalogue, ou une pièce d'exemple dessinée. */
export type Piece = {
  id: string | null; // null = pièce d'exemple
  slug: string;
  name: string;
  category: string;
  material: string;
  description: string;
  priceXof: number | null;
  photoUrl: string | null;
  drawing: Drawing;
};

const champs = {
  id: true, slug: true, name: true, category: true, material: true, description: true,
  priceXof: true, photoType: true, updatedAt: true, position: true,
} as const;

type Row = { id: string; slug: string; name: string; category: string; material: string; description: string; priceXof: number | null; photoType: string | null; updatedAt: Date };

const versPiece = (b: Row, i: number): Piece => ({
  id: b.id, slug: b.slug, name: b.name, category: b.category, material: b.material, description: b.description,
  priceXof: b.priceXof,
  photoUrl: b.photoType ? `/photos/bijoux/${b.id}?v=${b.updatedAt.getTime()}` : null,
  drawing: drawingFor(b.category, i),
});

const exemplesEnPieces = (): Piece[] =>
  exemples.map((e) => ({ ...e, id: null, priceXof: null, photoUrl: null }));

/** Bijoux visibles, filtrés par catégorie. Catalogue vide (ou base indisponible) : pièces d'exemple. */
export async function getPieces(categorie?: string): Promise<{ pieces: Piece[]; exemple: boolean }> {
  try {
    const total = await db.bijou.count({ where: { active: true } });
    if (total > 0) {
      const rows = await db.bijou.findMany({
        where: { active: true, ...(categorie ? { category: categorie } : {}) },
        orderBy: [{ position: "asc" }, { createdAt: "desc" }],
        select: champs,
      });
      return { pieces: rows.map(versPiece), exemple: false };
    }
  } catch {
    /* base indisponible : pièces d'exemple */
  }
  const all = exemplesEnPieces();
  return { pieces: categorie ? all.filter((p) => p.category === categorie) : all, exemple: true };
}

/** Pièces de l'accueil : celles marquées « à la une », sinon les plus récentes. */
export async function getFeatured(limit = 4): Promise<Piece[]> {
  try {
    const une = await db.bijou.findMany({ where: { active: true, featured: true }, orderBy: [{ position: "asc" }, { createdAt: "desc" }], take: limit, select: champs });
    if (une.length > 0) return une.map(versPiece);
    const recents = await db.bijou.findMany({ where: { active: true }, orderBy: [{ position: "asc" }, { createdAt: "desc" }], take: limit, select: champs });
    if (recents.length > 0) return recents.map(versPiece);
  } catch {
    /* base indisponible */
  }
  return exemplesEnPieces().slice(0, limit);
}

/** Un bijou par son adresse. Les pièces d'exemple ne s'ouvrent que tant que le catalogue est vide. */
export async function getPiece(slug: string): Promise<Piece | null> {
  try {
    const b = await db.bijou.findUnique({ where: { slug }, select: { ...champs, active: true } });
    if (b?.active) {
      const rang = await db.bijou.count({ where: { active: true, category: b.category, position: { lt: b.position } } });
      return versPiece(b, rang);
    }
    if ((await db.bijou.count({ where: { active: true } })) > 0) return null;
  } catch {
    /* base indisponible */
  }
  return exemplesEnPieces().find((p) => p.slug === slug) ?? null;
}

/** Équipe de la page « La Maison » (sans les octets de la photo). */
export async function getTeam() {
  try {
    return await db.teamMember.findMany({
      orderBy: [{ position: "asc" }, { createdAt: "asc" }],
      select: { id: true, name: true, role: true, bio: true, photoType: true, updatedAt: true },
    });
  } catch {
    return [];
  }
}

export type Settings = {
  telephone: string; whatsapp: string; email: string; adresse: string; horaires: string;
  instagram: string; facebook: string; tiktok: string;
  notifyEmail: string; // adresse qui reçoit les alertes (jamais affichée sur le site)
};

/** Coordonnées du site : valeurs saisies dans /admin, sinon valeurs par défaut de src/lib/site.ts. */
export async function getSettings(): Promise<Settings> {
  const s: Settings = {
    telephone: contact.telephone, whatsapp: site.whatsapp, email: contact.email, adresse: contact.adresse,
    horaires: contact.horaires, instagram: "", facebook: "", tiktok: "",
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

/** Lien d'appel seulement si le numéro est renseigné (pas un texte à remplir). */
export const lienTel = (telephone: string) => {
  const digits = telephone.replace(/[^\d+]/g, "");
  return /\d{6,}/.test(digits) ? `tel:${digits}` : null;
};
