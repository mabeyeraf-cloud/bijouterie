import { headers } from "next/headers";

const hits = new Map<string, number[]>();

/** Adresse IP du visiteur (derrière Nginx, elle vient de X-Forwarded-For). */
export async function clientIp() {
  const h = await headers();
  return (h.get("x-forwarded-for")?.split(",")[0] ?? h.get("x-real-ip") ?? "inconnue").trim();
}

/** Limite le nombre d'actions par clé (ex. IP) sur une fenêtre de temps. Retourne false si la limite est dépassée. */
export function rateLimit(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const list = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (list.length >= max) {
    hits.set(key, list);
    return false;
  }
  list.push(now);
  hits.set(key, list);
  if (hits.size > 5000) hits.clear();
  return true;
}

/** Champ piège rempli, ou formulaire envoyé trop vite / trop tard : c'est un robot. */
export function looksLikeBot(f: FormData) {
  if (String(f.get("hp_field") ?? "").trim() !== "") return true;
  const age = Date.now() - Number(f.get("t"));
  return !(age >= 1500 && age <= 7 * 24 * 3600 * 1000);
}
