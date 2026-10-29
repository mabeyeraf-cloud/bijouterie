import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

/* Crée (ou met à jour) le compte administrateur à partir de ADMIN_EMAIL et ADMIN_PASSWORD.
   Lancé à chaque déploiement Vercel : changer ADMIN_PASSWORD puis redéployer change le mot de passe. */
async function main() {
  const email = process.env.ADMIN_EMAIL, password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.warn("Compte administrateur non créé : renseignez ADMIN_EMAIL et ADMIN_PASSWORD.");
    return;
  }
  if (password.length < 10) {
    console.warn("Compte administrateur non créé : ADMIN_PASSWORD doit faire au moins 10 caractères.");
    return;
  }
  await db.user.upsert({
    where: { email: email.toLowerCase() },
    update: { passwordHash: await bcrypt.hash(password, 10), role: "ADMIN" },
    create: { email: email.toLowerCase(), name: "Administrateur", role: "ADMIN", passwordHash: await bcrypt.hash(password, 10) },
  });
  console.log("Compte administrateur prêt :", email.toLowerCase());
}
main().finally(() => db.$disconnect());
