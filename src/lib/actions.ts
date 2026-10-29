"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "./db";
import { notify, sendMail } from "./mail";
import { checkPassword, endSession, requireAdmin, startSession } from "./auth";
import { clientIp, looksLikeBot, rateLimit } from "./antispam";
import { getSettings } from "./content";
import { site } from "./site";
import { SUJETS } from "./sujets";

const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim().slice(0, 2000);
const fail = (to: string, msg: string): never => redirect(`${to}?erreur=${encodeURIComponent(msg)}`);
const emailOk = (e: string) => /^\S+@\S+\.\S+$/.test(e);
const sujetValide = (s: string) => (SUJETS.some((x) => x.label === s) ? s : "Autre");

/* ---------- Connexion (administrateur uniquement) ---------- */
export async function login(f: FormData) {
  if (!rateLimit(`login:${await clientIp()}`, 10, 15 * 60 * 1000)) fail("/connexion", "Trop de tentatives. Réessayez dans quelques minutes.");
  const u = await db.user.findUnique({ where: { email: str(f, "email").toLowerCase() } });
  if (!u || u.role !== "ADMIN" || !(await checkPassword(str(f, "password"), u.passwordHash))) fail("/connexion", "Email ou mot de passe incorrect.");
  await startSession(u!.id);
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/");
}

/* ---------- Formulaire de contact (accueil) ---------- */
export async function sendContact(f: FormData) {
  const back = (q: string): never => redirect(`/?${q}#contact`);
  if (looksLikeBot(f)) back("ok=1");
  if (!rateLimit(`contact:${await clientIp()}`, 5, 60 * 60 * 1000)) back(`erreur=${encodeURIComponent("Trop de messages envoyés. Réessayez plus tard ou écrivez-nous sur WhatsApp.")}`);

  const name = str(f, "name"), phone = str(f, "phone"), email = str(f, "email");
  if (!name || phone.replace(/\D/g, "").length < 6) back(`erreur=${encodeURIComponent("Indiquez votre nom et un numéro de téléphone valide.")}`);
  const subject = sujetValide(str(f, "subject"));
  const message = str(f, "message");
  await db.appointmentRequest.create({
    data: { kind: "CONTACT", name, phone, email: email || null, subject, message: message || null },
  });
  await notify(
    `Nouveau message — ${subject}`,
    `Nom : ${name}\nTéléphone : ${phone}\nEmail : ${email || "—"}\nSujet : ${subject}\nMessage : ${message || "—"}\n\nÀ consulter dans l'administration : ${site.url}/admin`,
    emailOk(email) ? email : undefined
  );
  if (emailOk(email)) {
    await sendMail(
      email,
      `${site.name} — nous avons bien reçu votre message`,
      `Bonjour ${name},\n\nNous avons bien reçu votre message (sujet : ${subject}) et nous vous répondons très prochainement.\n\nÀ bientôt,\n${site.name} — Dakar`
    );
  }
  back("ok=1");
}

/* ---------- Demande de rendez-vous : jour et heure proposés ---------- */
export async function requestAppointment(f: FormData) {
  const back = (q: string): never => redirect(`/rendez-vous?${q}`);
  const erreur = (m: string): never => back(`erreur=${encodeURIComponent(m)}`);
  if (looksLikeBot(f)) back("ok=1");
  if (!rateLimit(`rdv:${await clientIp()}`, 5, 60 * 60 * 1000)) erreur("Trop de demandes envoyées. Réessayez plus tard ou écrivez-nous sur WhatsApp.");

  const name = str(f, "name"), phone = str(f, "phone"), email = str(f, "email");
  const date = str(f, "date"), time = str(f, "time");
  if (!name || phone.replace(/\D/g, "").length < 6) erreur("Indiquez votre nom et un numéro de téléphone valide.");
  if (email && !emailOk(email)) erreur("L'adresse email n'est pas valide.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date < new Date().toISOString().slice(0, 10)) erreur("Choisissez un jour à partir d'aujourd'hui.");
  if (!/^\d{2}:\d{2}$/.test(time)) erreur("Choisissez une heure.");

  const subject = sujetValide(str(f, "subject"));
  const piece = str(f, "piece").slice(0, 200);
  const message = str(f, "message");
  await db.appointmentRequest.create({
    data: { kind: "RDV", name, phone, email: email || null, subject, piece: piece || null, message: message || null, wantedDate: date, wantedTime: time },
  });
  await notify(
    `Nouvelle demande de rendez-vous — ${subject}`,
    `Nom : ${name}\nTéléphone : ${phone}\nEmail : ${email || "—"}\nSujet : ${subject}${piece ? `\nPièce : ${piece}` : ""}\nJour et heure souhaités : ${date.split("-").reverse().join("/")} à ${time}${message ? `\nMessage : ${message}` : ""}\n\nPour confirmer : ${site.url}/admin`,
    emailOk(email) ? email : undefined
  );
  back("ok=1");
}

/* ---------- Administration : confirmer un rendez-vous ---------- */
const jourLong = (date: string) =>
  new Date(`${date}T12:00:00Z`).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

export async function confirmAppointment(f: FormData) {
  await requireAdmin();
  const id = str(f, "id"), date = str(f, "date"), time = str(f, "time");
  if (!id || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) fail("/admin", "Indiquez un jour et une heure valides.");
  const r = await db.appointmentRequest.update({
    where: { id },
    data: { confirmedDate: date, confirmedTime: time, status: "CONFIRMED" },
  });
  if (!r.email) fail("/admin", `Rendez-vous enregistré. Ce client n'a pas laissé d'email : prévenez-le au ${r.phone} (appel ou WhatsApp).`);
  const s = await getSettings();
  const envoye = await sendMail(
    r.email!,
    `${site.name} — votre rendez-vous est confirmé`,
    `Bonjour ${r.name},\n\nVotre rendez-vous est confirmé :\n\n  ${jourLong(date)} à ${time}\n  Adresse : ${s.adresse}\n\nEn cas d'empêchement, merci de nous prévenir au ${s.telephone}.\n\nÀ très bientôt,\n${site.name} — Dakar`
  );
  if (!envoye) fail("/admin", "Rendez-vous enregistré, mais l'email n'a pas pu partir. Vérifiez la configuration des emails (SMTP).");
  redirect("/admin?ok=1");
}

export async function setAppointmentStatus(f: FormData) {
  await requireAdmin();
  const id = str(f, "id"), status = str(f, "status");
  if (!id || !["NEW", "CONFIRMED", "DONE", "CANCELED"].includes(status)) fail("/admin", "Statut invalide.");
  await db.appointmentRequest.update({ where: { id }, data: { status: status as "NEW" | "CONFIRMED" | "DONE" | "CANCELED" } });
  redirect("/admin?ok=1");
}

/* ---------- Administration : coordonnées du site ---------- */
const SETTING_KEYS = ["telephone", "whatsapp", "email", "adresse", "horaires", "instagram", "facebook", "tiktok", "notifyEmail"] as const;

export async function saveSettings(f: FormData) {
  await requireAdmin();
  const values: Record<string, string> = {};
  // On ne modifie que les champs présents dans le formulaire envoyé (il y a deux formulaires dans /admin).
  const presents = SETTING_KEYS.filter((key) => f.has(key));
  for (const key of presents) values[key] = str(f, key);
  if (values.whatsapp !== undefined) values.whatsapp = values.whatsapp.replace(/\D/g, "");
  if (values.email && !emailOk(values.email)) fail("/admin", "L'adresse email n'est pas valide.");
  if (values.notifyEmail && !emailOk(values.notifyEmail)) fail("/admin", "L'adresse de réception des alertes n'est pas valide.");
  for (const key of ["instagram", "facebook", "tiktok"]) {
    if (values[key] && !/^https?:\/\//.test(values[key])) fail("/admin", "Les liens des réseaux sociaux doivent commencer par https://");
  }
  await db.$transaction(
    presents.map((key) =>
      db.siteSetting.upsert({ where: { key }, update: { value: values[key] }, create: { key, value: values[key] } })
    )
  );
  revalidatePath("/", "layout");
  redirect("/admin?ok=1#coordonnees");
}
