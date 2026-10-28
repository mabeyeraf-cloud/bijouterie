import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL, password = process.env.ADMIN_PASSWORD;
  if (!email || !password) throw new Error("Renseigne ADMIN_EMAIL et ADMIN_PASSWORD dans .env");
  await db.user.upsert({
    where: { email: email.toLowerCase() }, update: {},
    create: { email: email.toLowerCase(), name: "Administrateur", role: "ADMIN", passwordHash: await bcrypt.hash(password, 10) },
  });
  if ((await db.product.count()) === 0) {
    await db.product.create({
      data: {
        slug: "logiciel-exemple", name: "Logiciel de gestion (exemple)",
        description: "Produit d'exemple à remplacer par vos vrais logiciels depuis l'administration.",
        plans: { create: [
          { label: "Mensuel", interval: "MONTH", priceXof: 25000 },
          { label: "Annuel", interval: "YEAR", priceXof: 250000 },
        ] },
      },
    });
  }
  console.log("Seed terminé.");
}
main().finally(() => db.$disconnect());
