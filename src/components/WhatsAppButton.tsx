import { whatsappLink } from "@/lib/site";

export default function WhatsAppButton() {
  return (
    <a
      className="wa-float"
      href={whatsappLink("Bonjour, je souhaite des informations sur vos bijoux.")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Discuter sur WhatsApp"
    >
      WhatsApp
    </a>
  );
}
