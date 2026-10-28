import nodemailer from "nodemailer";
import { getSettings } from "./content";

/** Envoie un email. Retourne true si l'envoi a réussi. Ne bloque jamais le visiteur : en cas d'échec, l'erreur est journalisée. */
export async function sendMail(to: string, subject: string, text: string, replyTo?: string) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, NOTIFY_EMAIL } = process.env;
  if (!SMTP_HOST) {
    console.error("Email non envoyé : SMTP_HOST n'est pas configuré.");
    return false;
  }
  try {
    const port = Number(SMTP_PORT ?? 587);
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: port === 465,
      auth: SMTP_USER ? { user: SMTP_USER, pass: SMTP_PASS } : undefined,
    });
    await transporter.sendMail({ from: SMTP_USER ?? NOTIFY_EMAIL ?? to, to, subject, text, replyTo });
    return true;
  } catch (e) {
    console.error("Envoi d'email échoué :", e);
    return false;
  }
}

/** Alerte envoyée à l'équipe, à l'adresse saisie dans /admin (sinon NOTIFY_EMAIL du .env). Répondre à l'email répond directement au visiteur. */
export async function notify(subject: string, text: string, replyTo?: string) {
  const { notifyEmail } = await getSettings();
  if (!notifyEmail) {
    console.error("Alerte non envoyée : aucune adresse de réception n'est configurée (champ dans /admin).");
    return false;
  }
  return sendMail(notifyEmail, subject, text, replyTo);
}
