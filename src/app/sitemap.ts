import type { MetadataRoute } from "next";
import { categories } from "@/lib/products";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/catalogue", ...categories.map((c) => `/catalogue/${c.slug}`), "/a-propos", "/contact"].map((p) => ({ url: `${site.url}${p}` }));
}
