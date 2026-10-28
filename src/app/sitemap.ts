import type { MetadataRoute } from "next";
import { site, poles, modules } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/a-propos", "/notre-histoire", "/rendez-vous", "/sagfa360", "/mentions-legales", "/confidentialite", ...poles.map((p) => `/metiers/${p.slug}`), ...modules.map((m) => `/sagfa360/${m.slug}`)];
  return paths.map((path) => ({ url: `${site.url}${path}`, lastModified: new Date() }));
}
