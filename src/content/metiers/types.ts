export type Pole = {
  slug: string;
  name: string;
  /** Texte de la carte service (accueil) et description de la page. */
  summary: string;
  /** Titre principal (H1) de la page métier. */
  h1: string;
  /** Phrase d'accroche mise en évidence au-dessus de l'introduction (facultative). */
  introHighlight?: string;
  intro: string;
  /** Liste « Nos prestations ». */
  services: string[];
  /** Bloc « Pourquoi choisir SAGFA ? » : un titre en gras + une phrase. */
  why: { title: string; text: string }[];
  /** Appel à l'action en bas de page. */
  cta: string;
  /** Message WhatsApp prérempli par le bouton de l'appel à l'action. */
  whatsappMessage: string;
};
