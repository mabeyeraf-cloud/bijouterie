import { getSettings } from "@/lib/content";
import { lienWhatsApp, site } from "@/lib/site";

/** Bouton flottant, affiché seulement quand un numéro WhatsApp est configuré. */
export default async function WhatsAppButton() {
  const { whatsapp } = await getSettings();
  if (!whatsapp.replace(/\D/g, "")) return null;
  return (
    <a
      className="whatsapp"
      href={lienWhatsApp(whatsapp, `Bonjour ${site.name}, j'ai une question sur vos bijoux.`)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Écrire sur WhatsApp"
    >
      <ChatIcon />
      <span>WhatsApp</span>
    </a>
  );
}

export function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.5 11.5a8.5 8.5 0 0 1-12.6 7.4L3.5 20l1.2-4.2a8.5 8.5 0 1 1 15.8-4.3z" />
    </svg>
  );
}
