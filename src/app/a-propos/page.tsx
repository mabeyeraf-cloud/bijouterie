import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "À propos" };

/* ⚠️ Texte provisoire : à remplacer par l'histoire réelle de la boutique. */
export default function Page() {
  return (
    <section className="container section narrow page-top">
      <h1>À propos</h1>
      <p>{site.name} vous propose des bijoux en or et en argent, des alliances et des parures pour toutes les occasions : mariages, baptêmes, fêtes et cadeaux.</p>
      <p>Chaque pièce est choisie pour sa qualité et sa finition. Nous réalisons aussi des créations et des gravures sur mesure.</p>
      <p>Venez en boutique ou écrivez-nous sur WhatsApp : nous vous conseillons avec plaisir.</p>
    </section>
  );
}
