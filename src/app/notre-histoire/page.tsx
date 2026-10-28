import type { Metadata } from "next";
import { Parallax } from "@/components/Motion";

export const metadata: Metadata = {
  title: "Notre histoire : Sokhna Astou Gawane Fall, dite Sagfa",
  description:
    "Le Groupe SAGFA porte le nom de Sokhna Astou Gawane Fall, dite Sagfa. Ce nom est au cœur de chacune de nos marques : Groupe SAGFA, IPM SAGFA et SAGFA360.",
  alternates: { canonical: "/notre-histoire" },
};

export default function NotreHistoire() {
  return (
    <section className="section story">
      <div className="wrap story__grid">
        {/* Portrait : utilisé tel quel (ni recadrage du visage, ni changement de teinte, ni effet), cerclage sable. */}
        <Parallax speed={40}><div className="story__portrait">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/photo-maman.jpg"
            alt="Portrait de Sokhna Astou Gawane Fall, dite Sagfa"
            width={700}
            height={700}
          />
        </div></Parallax>
        <div>
          <span className="eyebrow">L’origine du nom</span>
          <h1>Sagfa, un nom de famille</h1>
          <h2 className="story__name">Sokhna Astou<br />Gawane Fall</h2>
          <p className="story__aka">Dite Sagfa</p>
          <p>
            Le Groupe porte le nom de Sokhna Astou Gawane Fall, dite Sagfa. Ce nom est au cœur de chacune de nos
            marques : Groupe SAGFA, IPM SAGFA et SAGFA360.
          </p>
          <p>
            Son portrait accompagne la marque sur les supports d’honneur : couverture de brochure, page « Notre
            histoire » du site, événements, cérémonies.
          </p>
        </div>
      </div>
    </section>
  );
}
