import { redirect } from "next/navigation";

// Le formulaire de contact est désormais en bas de la page d'accueil.
export default function Contact() {
  redirect("/#contact");
}
