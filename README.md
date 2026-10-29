# Bijouterie Darou Karim

Site vitrine + catalogue (Next.js 15, TypeScript). Les commandes passent par WhatsApp.

```bash
cp .env.example .env.local   # puis renseigne le numéro WhatsApp
npm install
npm run dev                  # http://localhost:3000
```

## À personnaliser
- `src/lib/site.ts` : nom, adresse, horaires, téléphone, réseaux.
- `src/lib/products.ts` : catégories et bijoux du catalogue (ajoute `image: "/bijoux/xxx.jpg"` en mettant la photo dans `public/bijoux/`).
