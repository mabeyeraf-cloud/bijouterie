import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { categories, exemples, site } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let bijoux: { slug: string; updatedAt: Date }[] = [];
  try {
    bijoux = await db.bijou.findMany({ where: { active: true }, select: { slug: true, updatedAt: true } });
  } catch {
    /* base indisponible */
  }
  const pieces = bijoux.length > 0 ? bijoux : exemples.map((e) => ({ slug: e.slug, updatedAt: new Date() }));
  const pages = ["", "/collections", "/la-maison", "/rendez-vous", "/mentions-legales", "/confidentialite", ...categories.map((c) => `/collections?categorie=${c.id}`)];
  return [
    ...pages.map((path) => ({ url: `${site.url}${path}`, lastModified: new Date() })),
    ...pieces.map((p) => ({ url: `${site.url}/collections/${p.slug}`, lastModified: p.updatedAt })),
  ];
}
