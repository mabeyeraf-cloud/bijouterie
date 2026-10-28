import { db } from "@/lib/db";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = await db.teamMember.findUnique({ where: { id }, select: { photo: true, photoType: true } });
  if (!row?.photo) return new Response("Introuvable", { status: 404 });
  return new Response(new Uint8Array(row.photo), {
    headers: {
      "Content-Type": row.photoType ?? "image/jpeg",
      // l'adresse contient ?v=<date de modification> : on peut garder la photo en cache longtemps
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
