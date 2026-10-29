import Icon from "./Icon";
import { Item, Stagger } from "./Motion";

/* ⚠️ Promesses à valider avec la boutique avant la mise en ligne. */
const items = [
  { icon: "or", title: "Or 18 carats & argent 925", text: "Des métaux précieux sélectionnés." },
  { icon: "boutique", title: "Services en boutique", text: "Taille, gravure, réparation, sur mesure." },
  { icon: "conseil", title: "Conseil sur WhatsApp", text: "Une réponse personnalisée." },
  { icon: "paiement", title: "Paiement avant livraison", text: "Réglez votre commande en amont." },
];

export default function Reassurance() {
  return (
    <section className="reassure">
      <Stagger as="ul" className="container reassure-list" gap={0.1}>
        {items.map((it) => (
          <Item as="li" key={it.title}>
            <span className="reassure-icon"><Icon name={it.icon} size={26} /></span>
            <div><strong>{it.title}</strong><span>{it.text}</span></div>
          </Item>
        ))}
      </Stagger>
    </section>
  );
}
