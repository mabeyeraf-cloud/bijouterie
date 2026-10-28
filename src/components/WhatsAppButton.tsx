import { getSettings } from "@/lib/content";

export default async function WhatsAppButton() {
  const { whatsapp } = await getSettings();
  const numero = whatsapp.replace(/\D/g, "");
  if (!numero) return null;
  return (
    <a className="whatsapp" href={`https://wa.me/${numero}`} target="_blank" rel="noopener noreferrer" aria-label="Discuter sur WhatsApp">
      WhatsApp
    </a>
  );
}
