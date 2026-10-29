# Site de la bijouterie

Site vitrine d'une bijouterie à Dakar : collections, fiches des bijoux, commande sur WhatsApp, prise de
rendez-vous, et une administration pour gérer le catalogue (avec photos), les rendez-vous, les messages et les
coordonnées de la boutique.

Next.js 15 + TypeScript + PostgreSQL (Prisma). Texte du site en français.

> **Nom provisoire : « Maison Wurus »** (wurus = l'or, en wolof). Le vrai nom se change dans `src/lib/site.ts`.

## Ce que contient le site
- **Accueil** : ouverture, services, pièces à la une, alliances & mariage, création sur mesure, savoir-faire, contact.
- **Collections** (`/collections`) : tous les bijoux, filtrables par catégorie (bagues, colliers, boucles d'oreilles,
  bracelets, parures). Chaque bijou a sa fiche avec « Commander sur WhatsApp » (message prérempli) et
  « L'essayer en boutique ».
- **La Maison** (`/la-maison`) : savoir-faire, valeurs, équipe (facultative).
- **Rendez-vous** (`/rendez-vous`) : le client propose un jour et une heure ; la boutique confirme depuis l'administration.
- **Administration** (`/connexion` puis `/admin`) : rendez-vous, messages, **catalogue des bijoux avec photos**,
  coordonnées, adresse des alertes, équipe.

Tant que le catalogue est vide, le site montre des **pièces d'exemple dessinées au trait**. Dès que vous ajoutez votre
premier bijou dans l'administration, ce sont vos vrais bijoux qui s'affichent.

## Mettre en ligne sur Vercel
1. Créez une base PostgreSQL (par exemple Neon, ou « Storage › Postgres » dans Vercel) et copiez son adresse de connexion.
2. Sur Vercel : **Add New › Project**, importez ce dépôt GitHub.
3. Dans **Settings › Environment Variables**, ajoutez :
   - `DATABASE_URL` : l'adresse de la base ;
   - `AUTH_SECRET` : une longue phrase secrète, propre à ce site ;
   - `ADMIN_EMAIL` et `ADMIN_PASSWORD` : votre compte d'administration (mot de passe fort, 10 caractères minimum,
     **différent de celui de vos autres sites**) ;
   - `NEXT_PUBLIC_SITE_URL` : l'adresse du site (ex. `https://maboutique.sn`) ;
   - pour les emails d'alerte : `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`.
4. Déployez. À chaque déploiement, les tables de la base sont créées ou mises à jour et le compte administrateur est
   créé (script `vercel-build`).
5. Connectez-vous sur `/connexion`, puis dans `/admin` remplissez les **coordonnées** (téléphone, numéro WhatsApp,
   adresse, horaires) et ajoutez vos **bijoux**.

## Lancer sur votre ordinateur
Installez Node.js 20+ et PostgreSQL, copiez `.env.example` en `.env` et remplissez-le, puis :
```bash
npm install
npx prisma migrate deploy
npm run db:seed     # crée le compte administrateur
npm run dev         # http://localhost:3000
```

## À personnaliser
- `src/lib/site.ts` : nom de la bijouterie, catégories, pièces d'exemple, mentions légales.
- `src/app/globals.css` : couleurs (noir velours, ivoire, or) et mise en page.
- `src/components/Jewel.tsx` : dessins au trait des bijoux et du médaillon.
- Ne commitez jamais le fichier `.env`.
