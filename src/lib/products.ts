export type Category = { slug: string; name: string; text: string; /** Photo de la collection dans public/bijoux/ (facultatif). */ image?: string };
export type Product = {
  id: string;
  name: string;
  category: string;
  material: string;
  description: string;
  /** Prix en FCFA ; laisse vide pour afficher « Prix sur demande ». */
  price?: number;
  /** Chemin d'une photo dans public/bijoux/ (ex. "/bijoux/bague-or.jpg"). */
  image?: string;
};

export const categories: Category[] = [
  { slug: "bagues", name: "Bagues", text: "Solitaires, bagues fines et pièces de caractère, en or comme en argent." },
  { slug: "colliers", name: "Colliers", text: "Chaînes, pendentifs et colliers pour sublimer chaque tenue." },
  { slug: "bracelets", name: "Bracelets", text: "Joncs et bracelets chaîne, au poignet pour tous les jours ou les grands jours." },
  { slug: "boucles", name: "Boucles d'oreilles", text: "Créoles, puces et pendantes : l'éclat au plus près du visage." },
  { slug: "alliances", name: "Alliances", text: "Des alliances intemporelles, avec gravure possible." },
  { slug: "parures", name: "Parures", text: "Des ensembles assortis pour les mariages et les grandes occasions." },
];

/* ⚠️ Exemples provisoires : remplace par les vrais bijoux de la boutique. */
export const products: Product[] = [
  { id: "bague-solitaire", name: "Bague solitaire", category: "bagues", material: "Or 18 carats", description: "Bague élégante ornée d'une pierre centrale." },
  { id: "bague-fine", name: "Bague fine", category: "bagues", material: "Argent 925", description: "Bague fine et légère, pour tous les jours." },
  { id: "collier-pendentif", name: "Collier pendentif", category: "colliers", material: "Or 18 carats", description: "Chaîne fine avec pendentif." },
  { id: "chaine-maille", name: "Chaîne maille", category: "colliers", material: "Or 18 carats", description: "Chaîne classique à maille travaillée." },
  { id: "bracelet-jonc", name: "Bracelet jonc", category: "bracelets", material: "Or 18 carats", description: "Jonc rigide au poli éclatant." },
  { id: "bracelet-chaine", name: "Bracelet chaîne", category: "bracelets", material: "Argent 925", description: "Bracelet chaîne ajustable." },
  { id: "creoles", name: "Créoles", category: "boucles", material: "Or 18 carats", description: "Créoles intemporelles." },
  { id: "puces-perle", name: "Puces perle", category: "boucles", material: "Argent 925", description: "Petites boucles discrètes ornées d'une perle." },
  { id: "alliance-classique", name: "Alliance classique", category: "alliances", material: "Or 18 carats", description: "Alliance au design épuré, gravure possible." },
  { id: "alliance-duo", name: "Alliance duo", category: "alliances", material: "Or jaune et blanc", description: "Deux ors associés pour un style moderne." },
  { id: "parure-mariage", name: "Parure de mariage", category: "parures", material: "Or 18 carats", description: "Collier, bracelet, boucles et bague assortis." },
  { id: "parure-fete", name: "Parure de fête", category: "parures", material: "Plaqué or", description: "Ensemble assorti pour les grandes occasions." },
];

export function formatPrice(p?: number) {
  return p ? `${p.toLocaleString("fr-FR")} FCFA` : "Prix sur demande";
}

/** Choix de taille proposés selon la collection (aucun pour boucles et parures). */
export const sizeChoices: Record<string, { label: string; values: string[] }> = {
  bagues: { label: "Taille de doigt", values: ["50", "52", "54"] },
  alliances: { label: "Taille de doigt", values: ["50", "52", "54"] },
  bracelets: { label: "Tour de poignet", values: ["17 cm", "18 cm", "19 cm"] },
  colliers: { label: "Longueur", values: ["40 cm", "45 cm", "50 cm"] },
};
