/* ⚠️ NOM PROVISOIRE : « Maison Wurus » (wurus = l'or, en wolof). Remplacez-le ici par le vrai nom de la bijouterie. */
export const site = {
  name: "Maison Wurus",
  short: "Wurus",
  baseline: "Joaillerie · Dakar",
  tagline: "Maison Wurus — Bijouterie et joaillerie à Dakar : bagues, colliers, alliances et créations sur mesure",
  description:
    "Bijoux en or façonnés à Dakar : bagues, colliers, boucles d'oreilles, bracelets, alliances et parures de mariage, créations sur mesure.",
  phone: process.env.NEXT_PUBLIC_PHONE ?? "",
  // Le vrai numéro se règle dans /admin › Coordonnées du site (ou NEXT_PUBLIC_WHATSAPP)
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
};

/* ⚠️ À REMPLIR : valeurs par défaut, remplacées par celles saisies dans /admin › Coordonnées du site. */
export const contact = {
  adresse: "[ADRESSE DE LA BOUTIQUE], Dakar",
  telephone: site.phone || "[TÉLÉPHONE]",
  email: "[EMAIL]",
  horaires: "[JOURS ET HEURES D'OUVERTURE]",
};

/* Catégories du catalogue (l'identifiant sert dans les adresses : /collections?categorie=bagues). */
export const categories = [
  { id: "bagues", label: "Bagues", singular: "Bague" },
  { id: "colliers", label: "Colliers", singular: "Collier" },
  { id: "boucles", label: "Boucles d'oreilles", singular: "Boucles d'oreilles" },
  { id: "bracelets", label: "Bracelets", singular: "Bracelet" },
  { id: "parures", label: "Parures", singular: "Parure" },
] as const;

export type CategoryId = (typeof categories)[number]["id"];
export const categoryLabel = (id: string) => categories.find((c) => c.id === id)?.singular ?? "Bijou";

/* Dessins au trait utilisés quand un bijou n'a pas de photo. */
export type Drawing =
  | "solitaire" | "alliance" | "pendentif" | "collier" | "creoles" | "pendants" | "jonc" | "gourmette";

export const drawingFor = (category: string, index = 0): Drawing => {
  const map: Record<string, Drawing[]> = {
    bagues: ["solitaire", "alliance"],
    colliers: ["pendentif", "collier"],
    boucles: ["creoles", "pendants"],
    bracelets: ["jonc", "gourmette"],
    parures: ["collier", "pendants"],
  };
  const list = map[category] ?? ["solitaire"];
  return list[index % list.length];
};

/* Pièces d'exemple, dessinées au trait : affichées tant que le catalogue est vide.
   Dès qu'un bijou est ajouté dans /admin › Catalogue, ce sont vos vrais bijoux qui s'affichent. */
export type Exemple = { slug: string; name: string; category: CategoryId; material: string; description: string; drawing: Drawing };

export const exemples: Exemple[] = [
  { slug: "solitaire", name: "Solitaire", category: "bagues", material: "Or jaune, pierre centrale", drawing: "solitaire",
    description: "Une pierre unique, tenue par quatre griffes fines au-dessus d'un anneau délicat." },
  { slug: "pendentif-goutte", name: "Pendentif Goutte", category: "colliers", material: "Or jaune, chaîne fine", drawing: "pendentif",
    description: "Une goutte d'or poli sur une chaîne légère, à porter tous les jours." },
  { slug: "creoles-ciselees", name: "Créoles ciselées", category: "boucles", material: "Or jaune ciselé", drawing: "creoles",
    description: "Des créoles au trait fin, ciselées à la main pour accrocher la lumière." },
  { slug: "jonc-filigrane", name: "Jonc filigrane", category: "bracelets", material: "Or jaune, motif filigrane", drawing: "jonc",
    description: "Un jonc souple orné d'un motif de fils d'or torsadés." },
  { slug: "alliance-perlee", name: "Alliance perlée", category: "bagues", material: "Or jaune, finition perlée", drawing: "alliance",
    description: "Un anneau bordé de minuscules perles d'or, gravable à l'intérieur." },
  { slug: "ras-de-cou-pampilles", name: "Ras-de-cou à pampilles", category: "parures", material: "Or jaune, sept pampilles", drawing: "collier",
    description: "Un collier court ponctué de pampilles en goutte, pièce maîtresse d'une parure." },
  { slug: "pendants-goutte", name: "Pendants Goutte", category: "boucles", material: "Or jaune, pierres", drawing: "pendants",
    description: "Des boucles qui bougent avec vous : une goutte suspendue sous un clou." },
  { slug: "gourmette-gravable", name: "Gourmette gravable", category: "bracelets", material: "Or jaune, maille fine", drawing: "gourmette",
    description: "Une maille fine et une plaque à graver d'un prénom ou d'une date." },
];

/* ⚠️ À REMPLIR : informations des mentions légales. À faire relire par un juriste avant la mise en ligne. */
export const legal = {
  raisonSociale: "[RAISON SOCIALE DE LA BIJOUTERIE]",
  formeJuridique: "[FORME JURIDIQUE]",
  capital: "[CAPITAL] FCFA",
  ninea: "[NINEA]",
  rccm: "[RCCM]",
  responsablePublication: "[NOM DU RESPONSABLE DE PUBLICATION]",
  hebergeur: "[NOM ET ADRESSE DE L'HÉBERGEUR]",
  conservation: "[DURÉE DE CONSERVATION, par exemple 3 ans après le dernier contact]",
};

/* Montant en FCFA, avec espaces : 250000 → « 250 000 FCFA ». */
export const prix = (xof: number | null | undefined) =>
  xof && xof > 0 ? `${xof.toLocaleString("fr-FR").replace(/ | /g, " ")} FCFA` : "Prix sur demande";

/* Lien WhatsApp avec message prérempli ; sans numéro configuré, renvoie vers le formulaire de contact. */
export const lienWhatsApp = (numero: string, texte: string) => {
  const n = numero.replace(/\D/g, "");
  return n ? `https://wa.me/${n}?text=${encodeURIComponent(texte)}` : "/#contact";
};

/* Transforme un nom en adresse web : « Bague Awa » → « bague-awa ». */
export const slugify = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "bijou";
