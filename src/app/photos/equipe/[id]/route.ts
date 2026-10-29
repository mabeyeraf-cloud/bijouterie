import { db } from "@/lib/db";

/* Photo d'un membre de l'équipe (stockée dans la base). */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = await db.teamMember.findUnique({ where: { id }, select: { photo: true, photoType: true } });
  if (!row?.photo) return new Response("Introuvable", { status: 404 });
  return new Response(new Uint8Array(row.photo), {
    headers: {
      "Content-Type": row.photoType ?? "image/jpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
