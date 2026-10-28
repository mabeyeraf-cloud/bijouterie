import Link from "next/link";
import CardArrow from "@/components/CardArrow";
import { LogoMark } from "@/components/Logo";
import Flash from "@/components/Flash";
import { secteurs } from "@/lib/site";
import { sendContact } from "@/lib/actions";
import AntiSpamFields from "@/components/AntiSpamFields";
import Globe from "@/components/Globe";
import { getKeyFigures, getReferences, getSettings } from "@/lib/content";
import { modules, poles } from "@/lib/site";
import { Carousel, CountUp, CtaBeam, DashBars, HeroCard, Item, Parallax, Reveal, SplitTitle, Stagger } from "@/components/Motion";


const icons: Record<string, React.ReactNode> = {
  compta: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  fisc: <path d="M6 3h9l4 4v14H6zM14 3v5h5M9 13h7M9 17h7" />,
  rh: <path d="M12 12a4 4 0 100-8 4 4 0 000 8zM4 21a8 8 0 0116 0" />,
  ipm: <path d="M12 21s-8-5-8-11a4.5 4.5 0 018-2.8A4.5 4.5 0 0120 10c0 6-8 11-8 11z" />,
  info: <path d="M3 5h18v12H3zM8 21h8M12 17v4" />,
  pin: <><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
};
function Icon({ name }: { name: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {icons[name]}
    </svg>
  );
}

const iconBySlug: Record<string, string> = {
  comptabilite: "compta", fiscalite: "fisc", "paie-rh": "rh", ipm: "ipm", informatique: "info",
};
const services = poles.map((p) => ({ icon: iconBySlug[p.slug], slug: p.slug, name: p.name, text: p.summary }));

export default async function Home({ searchParams }: { searchParams: Promise<{ ok?: string; erreur?: string }> }) {
  const { ok, erreur } = await searchParams;
  const [figures, references, settings] = await Promise.all([getKeyFigures(), getReferences(), getSettings()]);
  /* Lien d'appel seulement si le numéro est renseigné (pas un texte à remplir) */
  const telDigits = settings.telephone.replace(/[^\d+]/g, "");
  const telHref = /\d{6,}/.test(telDigits) ? `tel:${telDigits}` : null;
  const lienDevis = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(
    "Bonjour Groupe SAGFA, je souhaite obtenir un devis."
  )}`;
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="wrap hero__grid">
          <Stagger gap={0.1}>
            <Item><span className="eyebrow">Cabinet Informatique · Comptabilité · Fiscalité · IPM · Dakar</span></Item>
            <SplitTitle parts={[{ text: "Votre partenaire" }, { text: "global en gestion", em: true }, { text: ".", tight: true }]} />
            <Item as="div"><p className="lead">
              Applications et conceptions, comptabilité, fiscalité, GRH (paie, cotisations sociales, gestion du
              personnel) et IPM SAGFA. GROUPE SAGFA prend en charge la gestion de votre entreprise, sur une seule
              plateforme conçue par nos équipes.
            </p></Item>
            <Item className="hero__actions">
              <Link href="/rendez-vous" className="btn">Prendre rendez-vous</Link>
              <Link href="/#services" className="btn btn--ghost">Découvrir nos services</Link>
            </Item>
            <Item as="ul" className="checks">
              <li>Conforme DGID, IPRES, CSS</li>
              <li>Un interlocuteur unique</li>
              <li>Partout dans le monde</li>
            </Item>
          </Stagger>
          <HeroCard><div className="hero-card" aria-hidden="true">
            <div className="hero-card__globe"><Globe /></div>
            <div className="hero-card__label">
              <small>Propulsé par</small>
              <strong>SAGFA<span>360</span></strong>
              <p>Votre dossier, accessible à tout moment et de partout</p>
            </div>
          </div></HeroCard>
        </div>
      </section>

      {/* CHIFFRES CLÉS (modifiables dans /admin) */}
      {figures.length > 0 && (
        <section className="section section--green figures-band" aria-label="Chiffres clés">
          <div className="wrap">
            <Stagger as="ul" className="figures">
              {figures.map((f) => <Item as="li" key={f.id}><CountUp value={f.value} /><span>{f.label}</span></Item>)}
            </Stagger>
          </div>
        </section>
      )}

      {/* 01 — APPROCHE */}
      <section id="approche" className="section section--white">
        <div className="wrap split">
          <Reveal>
            <span className="eyebrow">01 — Notre approche</span>
            <h2>Des chiffres justes. <em>Des décisions claires.</em></h2>
            <p>
              GROUPE SAGFA SUARL est un cabinet de gestion implanté à Dakar. Nous prenons en charge les
              applications et conceptions, la comptabilité, la fiscalité, la GRH (paie, cotisations
              sociales et gestion du personnel) et l’IPM SAGFA des entreprises, partout dans le monde.
            </p>
            <p>
              Notre particularité : tout notre travail est réalisé sur SAGFA360, la plateforme que nous avons
              conçue. Vos données vivent au même endroit et votre dossier reste lisible à tout moment.
            </p>
          </Reveal>
          <Stagger as="ul" className="pillars" delay={0.1}>
            <Item as="li"><span className="chip chip--green"><Icon name="fisc" /></span><div><h3>Expertise</h3><p>Des spécialistes de la réglementation sociale et fiscale sénégalaise.</p></div></Item>
            <Item as="li"><span className="chip chip--sage"><Icon name="info" /></span><div><h3>Plateforme</h3><p>Un seul outil pour tout votre dossier, conçu et maintenu par nos soins.</p></div></Item>
            <Item as="li"><span className="chip chip--sand"><Icon name="rh" /></span><div><h3>Proximité</h3><p>Un interlocuteur dédié, dans vos locaux ou à distance.</p></div></Item>
          </Stagger>
        </div>
      </section>

      {/* 02 — SERVICES */}
      <section id="services" className="section">
        <div className="wrap">
          <Reveal className="section__head">
            <div>
              <span className="eyebrow">02 — Nos services</span>
              <h2 style={{ margin: 0 }}>Cinq métiers, un seul interlocuteur.</h2>
            </div>
            <p>Nos prestations s’adaptent à la taille de votre entreprise, à votre activité et à vos besoins.</p>
          </Reveal>
          <Stagger className="cards">
            {services.map((s) => (
              <Item wrap key={s.name}><article className="card card--link">
                <CardArrow />
                <span className="chip"><Icon name={s.icon} /></span>
                <h3><Link href={`/metiers/${s.slug}`}>{s.name}</Link></h3>
                <p>{s.text}</p>
              </article></Item>
            ))}
            <Item wrap><article className="card card--cta">
              <h3 style={{ marginTop: 0 }}>Un besoin spécifique ?</h3>
              <p>Parlons-en. Nous construisons une offre adaptée à votre organisation.</p>
              <a href={lienDevis} target="_blank" rel="noopener noreferrer" className="btn btn--light btn--sm">Demander un devis</a>
            </article></Item>
          </Stagger>
        </div>
      </section>

      {/* 03 — MÉTHODE */}
      <section id="methode" className="section section--white">
        <div className="wrap">
          <Reveal>
            <span className="eyebrow">03 — Notre méthode</span>
            <h2 style={{ marginBottom: "2rem" }}>Simple, dès le premier jour.</h2>
          </Reveal>
          <Stagger className="steps" gap={0.45}>
            <Item light className="step"><small>Étape 1</small><h3>Vous transmettez</h3><p>Vos pièces nous parviennent, ou vous les saisissez directement dans SAGFA360.</p></Item>
            <Item light className="step"><small>Étape 2</small><h3>Nous traitons</h3><p>Nos experts tiennent votre comptabilité, calculent la paie et préparent vos déclarations.</p></Item>
            <Item light className="step"><small>Étape 3</small><h3>Vous pilotez</h3><p>Bulletins, états et déclarations sont disponibles à tout moment pour décider sereinement.</p></Item>
          </Stagger>
          <Stagger className="benefits">
            <Item wrap><div className="benefit"><h3>Conformité</h3><p>Les barèmes en vigueur, appliqués automatiquement.</p></div></Item>
            <Item wrap><div className="benefit"><h3>Sérénité</h3><p>Moins d’erreurs, moins de pénalités.</p></div></Item>
            <Item wrap><div className="benefit"><h3>Visibilité</h3><p>Une vue claire sur la santé de votre entreprise.</p></div></Item>
            <Item wrap><div className="benefit"><h3>Simplicité</h3><p>Un seul interlocuteur, un seul outil.</p></div></Item>
          </Stagger>
        </div>
      </section>

      {/* 04 — SAGFA360 */}
      <section id="sagfa360" className="section section--dark">
        <div className="wrap platform">
          <Reveal>
            <span className="eyebrow">04 — Notre plateforme</span>
            <h2 className="platform__name">SAGFA<span>360</span></h2>
            <p className="platform__tag">Des modules distincts, une vision d’ensemble.</p>
            <p>
              Conçue par nos équipes, SAGFA360 réunit toutes les activités de gestion dans un même outil.
              C’est sur elle que nous traitons votre dossier, et vous y retrouvez vos documents à tout moment.
            </p>
            <ul className="module-tiles">
              {modules.map((m) => (
                <li key={m.slug} className="card card--link module-tile">
                  <CardArrow />
                  <h3><Link href={`/sagfa360/${m.slug}`}>{m.name}</Link></h3>
                  {m.soon && <span className="badge-soon">Bientôt disponible</span>}
                </li>
              ))}
            </ul>
            <Link href="/sagfa360" className="btn btn--light btn--sm">Découvrir SAGFA360</Link>
          </Reveal>
          <Parallax speed={40}><div className="dash" aria-hidden="true">
            <div className="dash__side"><LogoMark variant="dark" /></div>
            <div className="dash__main">
              <div className="dash__kpis"><i /><i /><i /></div>
              <DashBars bars={[
                { h: "35%" }, { h: "55%", tone: "sd" }, { h: "45%" }, { h: "70%", tone: "dk" },
                { h: "55%", tone: "dk" }, { h: "62%" }, { h: "90%", tone: "dk" },
              ]} />
            </div>
          </div></Parallax>
        </div>
      </section>

      {/* 05 — PARTENAIRES */}
      <section id="partenaires" className="section">
        <div className="wrap">
          <Reveal className="section__head">
            <div>
              <span className="eyebrow">05 — Nos partenaires</span>
              <h2 style={{ margin: 0 }}>Ils avancent avec nous.</h2>
            </div>
            <p>Des entreprises de tous les secteurs nous confient leur gestion au quotidien.</p>
          </Reveal>
          <Reveal from="bottom">
            <Carousel label="Nos partenaires par secteur">
              {secteurs.map((s) => (
                <div key={s.name} className="sector">
                  <h3>{s.name}</h3>
                  <ul>{s.partenaires.map((p, i) => <li key={i}>{p}</li>)}</ul>
                </div>
              ))}
            </Carousel>
          </Reveal>
          {references.length > 0 && (
            <div className="references">
              <h3>Ils nous font confiance</h3>
              <ul>
                {references.map((r) => (
                  <li key={r.id}>
                    {r.logoUrl ? <img src={r.logoUrl} alt={r.name} /> : r.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* 06 — CONTACT */}
      <section id="contact" className="section section--green">
        <CtaBeam />
        <div className="wrap contact">
          <Reveal>
            <span className="eyebrow">06 — Contact</span>
            <h2>Parlons de <em style={{ color: "var(--sage)" }}>votre gestion.</em></h2>
            <p className="muted">
              Diagnostic de votre organisation et démonstration de SAGFA360, offerts lors d’un premier rendez-vous.
            </p>
            <dl className="contact__info">
              <div><dt><span className="contact__icon"><Icon name="pin" /></span>Adresse</dt><dd>{settings.adresse}</dd></div>
              <div><dt><span className="contact__icon"><Icon name="phone" /></span>Téléphone</dt><dd>
                {telHref ? <a href={telHref}>{settings.telephone}</a> : settings.telephone}
              </dd></div>
              <div><dt><span className="contact__icon"><Icon name="mail" /></span>Email</dt><dd>
                {settings.email.includes("@") ? <a href={`mailto:${settings.email}`}>{settings.email}</a> : settings.email}
              </dd></div>
              <div><dt><span className="contact__icon"><Icon name="clock" /></span>Horaires</dt><dd>{settings.horaires}</dd></div>
            </dl>
          </Reveal>
          <Reveal from="bottom" className="contact__card" delay={0.1}>
            <h3>Nous écrire</h3>
            <p>Posez votre question ou décrivez votre besoin : nous vous répondons rapidement. Pour fixer un rendez-vous, <Link href="/rendez-vous" className="link-accent">choisissez un jour et une heure</Link>.</p>
            <Flash ok={ok ? "Message envoyé. Nous vous répondons très prochainement." : undefined} error={erreur} />
            <form action={sendContact} className="form">
              <AntiSpamFields />
              <label>Nom complet<input name="name" required autoComplete="name" /></label>
              <label>Téléphone<input name="phone" type="tel" required autoComplete="tel" /></label>
              <label>Email (facultatif)<input name="email" type="email" autoComplete="email" /></label>
              <label>Sujet
                <select name="pole">
                  {[...poles.map((x) => x.name), "SAGFA360", "Autre"].map((n) => <option key={n}>{n}</option>)}
                </select>
              </label>
              <label>Message (facultatif)<textarea name="message" rows={4} /></label>
              <button className="btn">Envoyer le message</button>
            </form>
          </Reveal>
        </div>
      </section>
    </>
  );
}
