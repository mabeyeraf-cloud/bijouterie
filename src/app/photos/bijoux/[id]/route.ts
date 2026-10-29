import { db } from "@/lib/db";

/* Photo d'un bijou du catalogue (stockée dans la base). */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = await db.bijou.findUnique({ where: { id }, select: { photo: true, photoType: true } });
  if (!row?.photo) return new Response("Introuvable", { status: 404 });
  return new Response(new Uint8Array(row.photo), {
    headers: {
      "Content-Type": row.photoType ?? "image/jpeg",
      // l'adresse contient ?v=<date de modification> : la photo peut rester longtemps en cache
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
