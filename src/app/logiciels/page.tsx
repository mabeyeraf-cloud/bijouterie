import { redirect } from "next/navigation";

// La boutique est retirée : SAGFA360 est seulement présenté.
export default function Logiciels() {
  redirect("/sagfa360");
}
