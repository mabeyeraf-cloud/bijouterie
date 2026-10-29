import Hero from "@/components/Hero";
import Spotlight from "@/components/Spotlight";
import Reassurance from "@/components/Reassurance";
import GiftFinder from "@/components/GiftFinder";
import Services from "@/components/Services";
import VelocityMarquee from "@/components/VelocityMarquee";
import Collections from "@/components/Collections";
import { CtaBeam, Item, Reveal, SplitTitle, Stagger } from "@/components/Motion";
import { whatsappLink } from "@/lib/site";

const words = ["Or 18 carats", "Argent 925", "Alliances", "Parures", "Gravure", "Sur mesure"];

export default function Home() {
  return (
    <>
      <Hero />

      <VelocityMarquee words={words} />

      <Reassurance />

      <Collections />

      <Spotlight />

      <GiftFinder />

      <Services />

      <VelocityMarquee words={["Bijouterie", "Darou Karim"]} reverse big />

      <section className="cta">
        <CtaBeam />
        <Stagger className="container cta-in" gap={0.15} delay={0.5}>
          <Item><p className="eyebrow">Votre prochain bijou</p></Item>
          <Item><h2>Une pièce unique vous attend</h2></Item>
          <Item>
            <a className="btn gold" target="_blank" rel="noopener noreferrer" href={whatsappLink("Bonjour, je souhaite des informations sur vos bijoux.")}>Nous écrire sur WhatsApp</a>
          </Item>
        </Stagger>
      </section>
    </>
  );
}
