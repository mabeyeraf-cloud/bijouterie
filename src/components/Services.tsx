import Icon from "./Icon";
import Tilt from "./Tilt";
import ScrollWords from "./ScrollWords";
import { Item, Reveal, Stagger } from "./Motion";
import { whatsappLink } from "@/lib/site";

const services = [
  { icon: "taille", name: "Mise à la taille", text: "Votre bague, bracelet ou collier est devenu trop grand ou trop petit ? Nous l'ajustons." },
  { icon: "gravure", name: "Gravure personnalisée", text: "Un prénom, une date, un mot : chaque bijou devient une pièce unique." },
  { icon: "surmesure", name: "Création sur mesure", text: "Vous avez un modèle en tête ? Nous le dessinons et le réalisons avec vous." },
  { icon: "reparation", name: "Réparation", text: "Fermoir cassé, maille ouverte, pierre à resertir : nous remettons votre bijou en état." },
  { icon: "entretien", name: "Entretien & nettoyage", text: "Nous redonnons tout son éclat à vos bijoux en or et en argent." },
];

export default function Services() {
  return (
    <section className="container section services">
      <Reveal from="left"><p className="eyebrow dark">Nos services</p></Reveal>
      <ScrollWords text="Chaque bijou est choisi pour sa qualité et sa finition. De l'alliance d'un grand jour à la pièce que l'on s'offre, nous vous conseillons avec soin et créons sur mesure ce qui vous ressemble." />
      <Stagger className="svc-grid" gap={0.1} delay={0.1}>
        {services.map((s) => (
          <Item key={s.name}>
            <Tilt className="card svc">
              <span className="svc-icon"><Icon name={s.icon} size={28} /></span>
              <h3>{s.name}</h3>
              <p>{s.text}</p>
              <a className="link" target="_blank" rel="noopener noreferrer" href={whatsappLink(`Bonjour, je souhaite le service : ${s.name}.`)}>
                Demander ce service <span aria-hidden="true">→</span>
              </a>
            </Tilt>
          </Item>
        ))}
      </Stagger>
    </section>
  );
}
