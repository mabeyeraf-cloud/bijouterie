export const site = {
  name: "Bijouterie Darou Karim",
  tagline: "Bijouterie Darou Karim — Or, argent et bijoux de qualité",
  description:
    "Bijoux en or et en argent, alliances, parures et créations sur mesure. Découvrez notre catalogue et commandez via WhatsApp.",
  phone: process.env.NEXT_PUBLIC_PHONE ?? "+221 00 000 00 00",
  // Numéro WhatsApp international sans "+" (à renseigner dans .env.local)
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "221000000000",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
};

/* ⚠️ Photo du hero : mets une image dans public/ et écris son chemin, ex. "/bijoux/hero.jpg" */
export const heroImage: string | undefined = undefined;

/* ⚠️ À REMPLIR */
export const contact = {
  adresse: "[ADRESSE DE LA BOUTIQUE]",
  telephone: site.phone,
  horaires: "Lundi – Samedi : [HORAIRES]",
};

export function whatsappLink(message: string) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
