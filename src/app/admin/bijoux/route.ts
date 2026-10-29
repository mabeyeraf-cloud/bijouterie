import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { categories, slugify } from "@/lib/site";

const MAX_BYTES = 4 * 1024 * 1024;
const TYPES = ["image/jpeg", "image/png", "image/webp"];
const back = (q: string) => new Response(null, { status: 303, headers: { Location: `/admin?${q}#catalogue` } });
const erreur = (m: string) => back("erreur=" + encodeURIComponent(m));

/* Adresse unique pour un bijou : « solitaire », puis « solitaire-2 », etc. */
async function slugLibre(base: string, id?: string) {
  let slug = base, n = 1;
  while (true) {
    const pris = await db.bijou.findUnique({ where: { slug }, select: { id: true } });
    if (!pris || pris.id === id) return slug;
    slug = `${base}-${++n}`;
  }
}

function toutRevalider(slug?: string) {
  revalidatePath("/");
  revalidatePath("/collections");
  if (slug) revalidatePath(`/collections/${slug}`);
}

/* Ajout, modification et suppression d'un bijou du catalogue (formulaire de /admin). */
export async function POST(req: Request) {
  await requireAdmin();
  const f = await req.formData();
  const s = (k: string) => String(f.get(k) ?? "").trim();
  const id = s("id");

  if (s("intent") === "delete") {
    if (id) {
      const b = await db.bijou.delete({ where: { id }, select: { slug: true } }).catch(() => null);
      toutRevalider(b?.slug);
    }
    return back("ok=1");
  }

  const name = s("name").slice(0, 120);
  const category = s("category");
  if (!name) return erreur("Le nom du bijou est obligatoire.");
  if (!categories.some((c) => c.id === category)) return erreur("Choisissez une catégorie.");

  const prixTexte = s("price").replace(/\D/g, "");
  const priceXof = prixTexte ? Math.min(parseInt(prixTexte, 10), 2_000_000_000) : null;

  const file = f.get("photo");
  const upload = file instanceof File && file.size > 0 ? file : null;
  if (upload && !TYPES.includes(upload.type)) return erreur("La photo doit être au format JPG, PNG ou WebP.");
  if (upload && upload.size > MAX_BYTES) return erreur("La photo dépasse 4 Mo : réduisez-la avant de l'envoyer.");

  const photoData = upload
    ? { photo: new Uint8Array(await upload.arrayBuffer()), photoType: upload.type }
    : s("removePhoto") === "1"
      ? { photo: null, photoType: null }
      : {};

  const ancien = id ? await db.bijou.findUnique({ where: { id }, select: { slug: true, name: true } }) : null;
  // L'adresse suit le nom ; elle ne change pas tant que le nom ne change pas.
  const slug = ancien && ancien.name === name ? ancien.slug : await slugLibre(slugify(name), id || undefined);

  const payload = {
    name, slug, category,
    material: s("material").slice(0, 160),
    description: s("description").slice(0, 2000),
    priceXof,
    featured: s("featured") === "1",
    active: id ? s("active") === "1" : true,
    position: parseInt(s("position"), 10) || 0,
    ...photoData,
  };
  if (id) await db.bijou.update({ where: { id }, data: payload });
  else await db.bijou.create({ data: payload });

  toutRevalider(slug);
  if (ancien && ancien.slug !== slug) revalidatePath(`/collections/${ancien.slug}`);
  return back("ok=1");
}
