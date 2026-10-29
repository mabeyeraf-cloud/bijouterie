import type { Metadata } from "next";
import Link from "next/link";
import { Medallion } from "@/components/Jewel";
import { Item, Parallax, Reveal, Stagger } from "@/components/Motion";
import { getTeam } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "La Maison",
  description: `${site.name}, bijouterie à Dakar : le savoir-faire du filigrane, nos valeurs et nos artisans.`,
  alternates: { canonical: "/la-maison" },
};

const initiales = (nom: string) => nom.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

export default async function LaMaison() {
  const equipe = await getTeam();
  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <span className="eyebrow">La Maison</span>
          <h1>L&apos;or, <em>travaillé à la main.</em></h1>
          <p className="lead">
            {site.name} est une bijouterie de Dakar. Nous dessinons, façonnons et réparons des bijoux en or, pour les
            jours ordinaires comme pour les grandes occasions.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap split">
          <Reveal>
            <Parallax speed={24}>
              <div className="panneau" style={{ aspectRatio: "1 / 1" }}>
                <Medallion />
                <p className="panneau__legende">Motif filigrane</p>
              </div>
            </Parallax>
          </Reveal>
          <Reveal delay={0.1}>
            <span className="eyebrow">Savoir-faire</span>
            <h2>Le filigrane, <em>une dentelle d&apos;or.</em></h2>
            <p className="lead">
              Le filigrane fait partie du patrimoine des bijoutiers sénégalais. De fins fils d&apos;or sont étirés,
              torsadés puis assemblés brin par brin, jusqu&apos;à former des motifs légers qui accrochent la lumière.
            </p>
            <p>
              C&apos;est un travail de patience, que nous mettons au service de pièces d&apos;aujourd&apos;hui : bagues,
              pendentifs, boucles d&apos;oreilles et parures de mariage.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section section--ivoire">
        <div className="wrap">
          <Reveal className="section__head">
            <div>
              <span className="eyebrow">Ce qui nous guide</span>
              <h2>Trois exigences, <em>à chaque pièce.</em></h2>
            </div>
          </Reveal>
          <Stagger as="ul" className="valeurs" gap={0.1}>
            <Item as="li"><h3>Le geste</h3><p>Chaque bijou passe entre les mains de l&apos;artisan, du dessin au dernier coup de polissoir.</p></Item>
            <Item as="li"><h3>Le conseil</h3><p>Nous prenons le temps de comprendre ce que vous cherchez, sans vous presser.</p></Item>
            <Item as="li"><h3>La transmission</h3><p>Des pièces faites pour durer, être entretenues, et passer d&apos;une génération à l&apos;autre.</p></Item>
          </Stagger>
        </div>
      </section>

      {equipe.length > 0 && (
        <section className="section">
          <div className="wrap">
            <Reveal className="section__head">
              <div>
                <span className="eyebrow">L&apos;équipe</span>
                <h2>Les mains <em>derrière vos bijoux.</em></h2>
              </div>
            </Reveal>
            <Stagger as="ul" className="equipe" gap={0.08}>
              {equipe.map((m) => (
                <Item as="li" key={m.id}>
                  <div className="equipe__photo">
                    {m.photoType
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={`/photos/equipe/${m.id}?v=${m.updatedAt.getTime()}`} alt={m.name} loading="lazy" />
                      : <span aria-hidden="true">{initiales(m.name)}</span>}
                  </div>
                  <h3>{m.name}</h3>
                  <p className="equipe__role">{m.role}</p>
                  {m.bio && <p className="equipe__bio">{m.bio}</p>}
                </Item>
              ))}
            </Stagger>
          </div>
        </section>
      )}

      <section className="section section--sombre appel">
        <div className="wrap">
          <Reveal>
            <span className="eyebrow">Rendez-vous</span>
            <h2>Venez voir les pièces <em>de près.</em></h2>
            <p>Essayage, conseils, création sur mesure : nous vous recevons en boutique.</p>
            <div className="actions">
              <Link href="/rendez-vous" className="btn btn--gold">Prendre rendez-vous</Link>
              <Link href="/collections" className="btn btn--ligne">Voir les collections</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
