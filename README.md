# Site du Groupe SAGFA — socle du projet

Next.js 15 (App Router) + TypeScript + PostgreSQL (Prisma). Texte du site en français.

## Lancer dans GitHub Codespaces
1. Pousse ce dossier dans un dépôt GitHub **privé**.
2. Sur le dépôt : **Code → Codespaces → Create codespace**. L'environnement (Node 20 + PostgreSQL) se prépare tout seul.
3. Dans le terminal du Codespace :
   ```bash
   npx prisma migrate dev --name init
   npm run dev
   ```
4. Ouvre l'aperçu du port 3000 proposé par GitHub.

## Lancer sur ton ordinateur
Installe Node.js 20+ et PostgreSQL, copie `.env.example` en `.env` (adapte `DATABASE_URL`), puis :
```bash
npm install
npx prisma migrate dev --name init
npm run dev        # http://localhost:3000
```

## Ce qui est dans ce socle
- Structure, design (tokens dans `src/app/globals.css`), en-tête, pied de page, bouton WhatsApp
- Pages : accueil, Comptabilité, Fiscalité, Informatique, IPM, Logiciels, À propos, Contact (textes provisoires)
- Schéma de base de données complet (clients, produits, formules, commandes, paiements, abonnements, rendez-vous, références, adhérents)

## À venir dans la version complète
Boutique et paiements (Wave, Orange Money, Stripe), comptes clients, espace adhérent IPM, back-office, formulaire de rendez-vous, notifications WhatsApp et email, références et chiffres clés, SEO local.

## À personnaliser
- `src/lib/site.ts` : nom, textes des pôles, téléphone, WhatsApp
- `src/app/globals.css` : couleurs et polices (à aligner sur la charte du groupe)
- Ne commit jamais le fichier `.env`.
