import Link from "next/link";
import Flash from "@/components/Flash";
import AntiSpamFields from "@/components/AntiSpamFields";
import Icon from "@/components/Icon";
import PieceCard from "@/components/PieceCard";
import { Medallion, Rings } from "@/components/Jewel";
import { Item, Parallax, Reveal, SplitTitle, Stagger } from "@/components/Motion";
import { sendContact } from "@/lib/actions";
import { getFeatured, getSettings, lienTel } from "@/lib/content";
import { categories, lienWhatsApp, site } from "@/lib/site";
import { SUJETS } from "@/lib/sujets";

export default async function Home({ searchParams }: { searchParams: Promise<{ ok?: string; erreur?: string }> }) {
  const { ok, erreur } = await searchParams;
  const [pieces, settings] = await Promise.all([getFeatured(4), getSettings()]);
  const tel = lienTel(settings.telephone);
  const commander = lienWhatsApp(settings.whatsapp, `Bonjour ${site.name}, je souhaite des renseignements sur vos bijoux.`);
  const externe = commander.startsWith("http");

  return (
    <>
      {/* OUVERTURE */}
      <section className="hero-home">
        <div className="wrap hero-home__grid">
          <Stagger gap={0.12}>
            <Item><span className="eyebrow">Bijouterie · Joaillerie · Dakar</span></Item>
            <SplitTitle parts={[{ text: "L'éclat de l'or," }, { text: "façonné à Dakar.", em: true, br: true }]} />
            <Item>
              <p className="lead">
                Bagues, colliers, alliances et parures de mariage : chaque pièce est dessinée, ajustée et finie à la
                main, puis remise dans son écrin.
              </p>
            </Item>
            <Item className="actions">
              <a href={commander} className="btn btn--gold" {...(externe ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                <Icon name="chat" size={18} />Commander sur WhatsApp
              </a>
              <Link href="/collections" className="btn btn--ligne">Voir les collections</Link>
            </Item>
            <Item className="hero-home__note">
              <span>Création sur mesure</span>
              <span>Alliances gravées</span>
              <span>Sur rendez-vous</span>
            </Item>
          </Stagger>
          <Parallax speed={30} className="hero-home__art">
            <Medallion />
          </Parallax>
        </div>
      </section>

      {/* SERVICES */}
      <section className="services" aria-label="Nos services">
        <div className="wrap">
          <Stagger as="ul" className="services__list" gap={0.08}>
            <Item as="li"><Icon name="compas" size={26} /><h3>Création sur mesure</h3><p>Votre idée, dessinée puis façonnée.</p></Item>
            <Item as="li"><Icon name="gravure" size={26} /><h3>Gravure personnalisée</h3><p>Un prénom, une date, quelques mots.</p></Item>
            <Item as="li"><Icon name="eclat" size={26} /><h3>Entretien & retouche</h3><p>Nettoyage, polissage, mise à taille.</p></Item>
            <Item as="li"><Icon name="ecrin" size={26} /><h3>Remis en écrin</h3><p>En boutique ou livré à Dakar.</p></Item>
          </Stagger>
        </div>
      </section>

      {/* 01 — COLLECTIONS */}
      <section id="pieces" className="section">
        <div className="wrap">
          <Reveal className="section__head">
            <div>
              <span className="eyebrow">01 — Collections</span>
              <h2>Des pièces pensées pour être portées, <em>puis transmises.</em></h2>
            </div>
            <p>De l&apos;anneau du quotidien à la parure des grands jours, chaque bijou est fait pour durer.</p>
          </Reveal>
          <Reveal as="ul" className="categories">
            {categories.map((c) => (
              <li key={c.id}><Link href={`/collections?categorie=${c.id}`}>{c.label}</Link></li>
            ))}
          </Reveal>
          <Stagger className="pieces" gap={0.1}>
            {pieces.map((p) => <Item key={p.slug}><PieceCard piece={p} /></Item>)}
          </Stagger>
          <div className="section__foot">
            <Link href="/collections" className="lien-fleche">Toutes les pièces <Icon name="arrow" size={16} /></Link>
          </div>
        </div>
      </section>

      {/* 02 — MARIAGE */}
      <section id="mariage" className="section section--ivoire">
        <div className="wrap split">
          <Reveal>
            <div className="panneau">
              <Rings />
              <p className="panneau__legende">Alliances · Parures</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <span className="eyebrow">02 — Mariage</span>
            <h2>Alliances & parures, <em>pour le plus beau des jours.</em></h2>
            <p className="lead">
              Du choix des alliances à la parure de la mariée, nous vous accompagnons jusqu&apos;au jour J, avec le temps
              qu&apos;il faut pour essayer, comparer et décider.
            </p>
            <ul className="filets">
              <li>Alliances assorties, pour elle et pour lui</li>
              <li>Gravure à l&apos;intérieur de l&apos;anneau</li>
              <li>Parures complètes : collier, boucles d&apos;oreilles, bracelet</li>
              <li>Essayage en boutique, sur rendez-vous</li>
            </ul>
            <div className="actions">
              <Link href="/rendez-vous?sujet=mariage" className="btn btn--noir">Prendre rendez-vous</Link>
              <Link href="/collections?categorie=bagues" className="btn btn--ligne">Voir les bagues</Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 03 — SUR MESURE */}
      <section id="sur-mesure" className="section section--sombre">
        <div className="wrap">
          <Reveal className="section__head">
            <div>
              <span className="eyebrow">03 — Sur mesure</span>
              <h2>Votre bijou, <em>dessiné pour vous.</em></h2>
            </div>
            <p>Une idée, une photo, un bijou de famille à refaire : on part de votre histoire.</p>
          </Reveal>
          <Stagger as="ol" className="etapes" gap={0.12}>
            <Item as="li" className="etape"><span className="etape__num">I.</span><h3>Rendez-vous</h3><p>Nous écoutons votre idée, votre style et votre budget.</p></Item>
            <Item as="li" className="etape"><span className="etape__num">II.</span><h3>Dessin</h3><p>Nous dessinons la pièce et choisissons ensemble le métal et les pierres.</p></Item>
            <Item as="li" className="etape"><span className="etape__num">III.</span><h3>Fabrication</h3><p>Le bijou est façonné, serti et poli à la main.</p></Item>
            <Item as="li" className="etape"><span className="etape__num">IV.</span><h3>Remise</h3><p>Vous le découvrez, gravé si vous le souhaitez, dans son écrin.</p></Item>
          </Stagger>
          <div className="actions">
            <Link href="/rendez-vous?sujet=sur-mesure" className="btn btn--gold">Parler de mon projet</Link>
          </div>
        </div>
      </section>

      {/* 04 — SAVOIR-FAIRE */}
      <section id="savoir-faire" className="section savoir">
        <div className="savoir__ornement" aria-hidden="true"><Medallion /></div>
        <div className="wrap split">
          <Reveal>
            <span className="eyebrow">04 — Savoir-faire</span>
            <p className="citation">Chaque fil d&apos;or est torsadé, posé et soudé à la main.</p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="lead">
              Le filigrane fait partie du patrimoine des bijoutiers sénégalais : de fins fils d&apos;or, tressés puis
              assemblés en motifs, donnent aux bijoux leur légèreté et leur éclat.
            </p>
            <dl className="details">
              <div><dt>Le fil</dt><dd>Étiré, puis torsadé pour accrocher la lumière.</dd></div>
              <div><dt>Le motif</dt><dd>Posé brin par brin, comme une dentelle d&apos;or.</dd></div>
              <div><dt>La finition</dt><dd>Soudé, nettoyé, poli jusqu&apos;au miroir.</dd></div>
            </dl>
            <Link href="/la-maison" className="lien-fleche">Découvrir la maison <Icon name="arrow" size={16} /></Link>
          </Reveal>
        </div>
      </section>

      {/* 05 — CONTACT */}
      <section id="contact" className="section section--ivoire">
        <div className="wrap contact">
          <Reveal>
            <span className="eyebrow">05 — Nous trouver</span>
            <h2>Venez nous <em>rendre visite.</em></h2>
            <p className="lead">Essayer une bague, choisir des alliances, parler d&apos;une création : nous vous recevons en boutique.</p>
            <dl className="coordonnees">
              <div><dt><span className="coordonnees__icone"><Icon name="pin" size={18} /></span>Adresse</dt><dd>{settings.adresse}</dd></div>
              <div><dt><span className="coordonnees__icone"><Icon name="clock" size={18} /></span>Horaires</dt><dd>{settings.horaires}</dd></div>
              <div><dt><span className="coordonnees__icone"><Icon name="phone" size={18} /></span>Téléphone</dt><dd>
                {tel ? <a href={tel}>{settings.telephone}</a> : settings.telephone}
              </dd></div>
              <div><dt><span className="coordonnees__icone"><Icon name="mail" size={18} /></span>Email</dt><dd>
                {settings.email.includes("@") ? <a href={`mailto:${settings.email}`}>{settings.email}</a> : settings.email}
              </dd></div>
            </dl>
          </Reveal>
          <Reveal delay={0.1} className="carte-form">
            <h3>Nous écrire</h3>
            <p>Une question sur un bijou, une taille, un délai ? Nous vous répondons rapidement. Pour venir en boutique, <Link href="/rendez-vous">choisissez un jour et une heure</Link>.</p>
            <Flash ok={ok ? "Message envoyé. Nous vous répondons très prochainement." : undefined} error={erreur} />
            <form action={sendContact} className="form form--2">
              <AntiSpamFields />
              <label>Nom complet<input name="name" required autoComplete="name" /></label>
              <label>Téléphone<input name="phone" type="tel" required autoComplete="tel" /></label>
              <label>Email (facultatif)<input name="email" type="email" autoComplete="email" /></label>
              <label>Sujet
                <select name="subject" defaultValue={SUJETS[0].label}>
                  {SUJETS.map((s) => <option key={s.id}>{s.label}</option>)}
                </select>
              </label>
              <label className="form__full">Message<textarea name="message" rows={4} /></label>
              <div className="form__full"><button className="btn btn--noir">Envoyer le message</button></div>
            </form>
          </Reveal>
        </div>
      </section>
    </>
  );
}
