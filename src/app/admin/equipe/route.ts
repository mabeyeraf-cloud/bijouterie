import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

const MAX_BYTES = 2 * 1024 * 1024;
const TYPES = ["image/jpeg", "image/png", "image/webp"];
const back = (q: string) => new Response(null, { status: 303, headers: { Location: `/admin?${q}#equipe` } });

export async function POST(req: Request) {
  await requireAdmin();
  const f = await req.formData();
  const s = (k: string) => String(f.get(k) ?? "").trim();
  const id = s("id");

  if (s("intent") === "delete") {
    if (id) await db.teamMember.delete({ where: { id } });
    revalidatePath("/a-propos");
    return back("ok=1");
  }

  const name = s("name"), role = s("role");
  if (!name || !role) return back("erreur=" + encodeURIComponent("Le nom et le poste sont obligatoires."));

  const file = f.get("photo");
  const upload = file instanceof File && file.size > 0 ? file : null;
  if (upload && !TYPES.includes(upload.type)) return back("erreur=" + encodeURIComponent("La photo doit être au format JPG, PNG ou WebP."));
  if (upload && upload.size > MAX_BYTES) return back("erreur=" + encodeURIComponent("La photo dépasse 2 Mo."));

  const photoData = upload
    ? { photo: new Uint8Array(await upload.arrayBuffer()), photoType: upload.type }
    : s("removePhoto") === "1"
      ? { photo: null, photoType: null }
      : {};

  const payload = {
    name, role, bio: s("bio"),
    email: s("email") || null, phone: s("phone") || null,
    position: parseInt(s("position"), 10) || 0,
    ...photoData,
  };
  if (id) await db.teamMember.update({ where: { id }, data: payload });
  else await db.teamMember.create({ data: payload });

  revalidatePath("/a-propos");
  return back("ok=1");
}
