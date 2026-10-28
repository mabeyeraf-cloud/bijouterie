"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "./db";
import { notify, sendMail } from "./mail";
import { checkPassword, endSession, requireAdmin, startSession } from "./auth";
import { clientIp, looksLikeBot, rateLimit } from "./antispam";
import { getSettings } from "./content";
import { site } from "./site";

const str = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const fail = (to: string, msg: string): never => redirect(`${to}?erreur=${encodeURIComponent(msg)}`);
const num = (f: FormData, k: string) => parseInt(str(f, k), 10) || 0;

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

/* ---------- Formulaire de contact (accueil) : avec message ---------- */
export async function sendContact(f: FormData) {
  const back = (q: string): never => redirect(`/?${q}#contact`);
  if (looksLikeBot(f)) back("ok=1");
  if (!rateLimit(`contact:${await clientIp()}`, 5, 60 * 60 * 1000)) back(`erreur=${encodeURIComponent("Trop de messages envoyés. Réessayez plus tard ou contactez-nous sur WhatsApp.")}`);

  const name = str(f, "name"), phone = str(f, "phone"), email = str(f, "email");
  if (!name || phone.length < 6) back(`erreur=${encodeURIComponent("Indiquez votre nom et un numéro de téléphone valide.")}`);
  const pole = str(f, "pole") || "Autre";
  const message = str(f, "message");
  await db.appointmentRequest.create({
    data: { kind: "CONTACT", name, phone, email: email || null, pole, message: message || null },
  });
  await notify(
    `Nouveau message — ${pole}`,
    `Nom : ${name}\nTéléphone : ${phone}\nEmail : ${email || "—"}\nSujet : ${pole}\nMessage : ${message || "—"}\n\nÀ consulter dans l'administration : ${site.url}/admin`,
    /^\S+@\S+\.\S+$/.test(email) ? email : undefined
  );
  if (/^\S+@\S+\.\S+$/.test(email)) {
    await sendMail(
      email,
      "Groupe SAGFA — nous avons bien reçu votre message",
      `Bonjour ${name},\n\nNous avons bien reçu votre message (sujet : ${pole}). Notre équipe vous répond très prochainement.\n\nCordialement,\nGroupe SAGFA — Cabinet de gestion, Dakar`
    );
  }
  back("ok=1");
}

/* ---------- Demande de rendez-vous : sans message, jour et heure proposés ---------- */
export async function requestAppointment(f: FormData) {
  const back = (q: string): never => redirect(`/rendez-vous?${q}`);
  const erreur = (m: string): never => back(`erreur=${encodeURIComponent(m)}`);
  if (looksLikeBot(f)) back("ok=1");
  if (!rateLimit(`rdv:${await clientIp()}`, 5, 60 * 60 * 1000)) erreur("Trop de demandes envoyées. Réessayez plus tard ou contactez-nous sur WhatsApp.");

  const name = str(f, "name"), phone = str(f, "phone"), email = str(f, "email");
  const date = str(f, "date"), time = str(f, "time");
  if (!name || phone.length < 6) erreur("Indiquez votre nom et un numéro de téléphone valide.");
  if (!/^\S+@\S+\.\S+$/.test(email)) erreur("Indiquez une adresse email valide : nous vous y envoyons la confirmation.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date < new Date().toISOString().slice(0, 10)) erreur("Choisissez un jour à partir d'aujourd'hui.");
  if (!/^\d{2}:\d{2}$/.test(time)) erreur("Choisissez une heure.");

  const pole = str(f, "pole") || "Autre";
  await db.appointmentRequest.create({
    data: { kind: "RDV", name, phone, email, pole, wantedDate: date, wantedTime: time },
  });
  await notify(
    `Nouvelle demande de rendez-vous — ${pole}`,
    `Nom : ${name}\nTéléphone : ${phone}\nEmail : ${email}\nSujet : ${pole}\nJour et heure souhaités : ${date.split("-").reverse().join("/")} à ${time}\n\nPour confirmer le jour et l'heure (le visiteur reçoit alors un email) : ${site.url}/admin`,
    email
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
  if (!r.email) fail("/admin", `Rendez-vous enregistré, mais ce visiteur n'a pas d'email : appelle-le au ${r.phone}.`);
  const s = await getSettings();
  const envoye = await sendMail(
    r.email!,
    "Groupe SAGFA — votre rendez-vous est confirmé",
    `Bonjour ${r.name},\n\nVotre rendez-vous avec le Groupe SAGFA est confirmé :\n\n  ${jourLong(date)} à ${time}\n  Lieu : ${s.adresse}\n\nEn cas d'empêchement, merci de nous prévenir au ${s.telephone}.\n\nCordialement,\nGroupe SAGFA — Cabinet de gestion, Dakar`
  );
  if (!envoye) fail("/admin", "Rendez-vous enregistré, mais l'email n'a pas pu partir. Vérifie la configuration des emails (SMTP).");
  redirect("/admin?ok=1");
}

/* ---------- Administration : chiffres clés ---------- */
export async function initKeyFigures() {
  await requireAdmin();
  if ((await db.keyFigure.count()) === 0) {
    const labels = ["Années d'expérience", "Entreprises accompagnées", "Salariés dont nous traitons la paie", "Déclarations fiscales déposées par an"];
    await db.keyFigure.createMany({ data: labels.map((label, i) => ({ label, value: "", position: i + 1 })) });
  }
  revalidatePath("/"); revalidatePath("/a-propos");
  redirect("/admin?ok=1");
}

export async function saveKeyFigure(f: FormData) {
  await requireAdmin();
  const id = str(f, "id"), label = str(f, "label");
  if (!label) fail("/admin", "Le libellé est obligatoire.");
  const data = { label, value: str(f, "value"), position: num(f, "position") };
  if (id) await db.keyFigure.update({ where: { id }, data }); else await db.keyFigure.create({ data });
  revalidatePath("/"); revalidatePath("/a-propos");
  redirect("/admin?ok=1");
}

export async function deleteKeyFigure(f: FormData) {
  await requireAdmin();
  const id = str(f, "id");
  if (id) await db.keyFigure.delete({ where: { id } });
  revalidatePath("/"); revalidatePath("/a-propos");
  redirect("/admin?ok=1");
}

/* ---------- Administration : références ---------- */
export async function saveReference(f: FormData) {
  await requireAdmin();
  const id = str(f, "id"), name = str(f, "name");
  if (!name) fail("/admin", "Le nom est obligatoire.");
  const data = { name, logoUrl: str(f, "logoUrl") || null, position: num(f, "position") };
  if (id) await db.reference.update({ where: { id }, data }); else await db.reference.create({ data });
  revalidatePath("/");
  redirect("/admin?ok=1");
}

export async function deleteReference(f: FormData) {
  await requireAdmin();
  const id = str(f, "id");
  if (id) await db.reference.delete({ where: { id } });
  revalidatePath("/");
  redirect("/admin?ok=1");
}

/* ---------- Administration : coordonnées du site ---------- */
const SETTING_KEYS = ["telephone", "whatsapp", "email", "adresse", "horaires", "facebook", "linkedin", "instagram", "x", "notifyEmail"] as const;

export async function saveSettings(f: FormData) {
  await requireAdmin();
  const values: Record<string, string> = {};
  // On ne modifie que les champs présents dans le formulaire envoyé (il y a deux formulaires dans /admin).
  const presents = SETTING_KEYS.filter((key) => f.has(key));
  for (const key of presents) values[key] = str(f, key);
  if (values.whatsapp !== undefined) values.whatsapp = values.whatsapp.replace(/\D/g, "");
  if (values.email && !/^\S+@\S+\.\S+$/.test(values.email)) fail("/admin", "L'adresse email n'est pas valide.");
  if (values.notifyEmail && !/^\S+@\S+\.\S+$/.test(values.notifyEmail)) fail("/admin", "L'adresse de réception des alertes n'est pas valide.");
  for (const key of ["facebook", "linkedin", "instagram", "x"]) {
    if (values[key] && !/^https?:\/\//.test(values[key])) fail("/admin", "Les liens des réseaux sociaux doivent commencer par https://");
  }
  await db.$transaction(
    presents.map((key) =>
      db.siteSetting.upsert({ where: { key }, update: { value: values[key] }, create: { key, value: values[key] } })
    )
  );
  revalidatePath("/", "layout");
  redirect("/admin?ok=1");
}
