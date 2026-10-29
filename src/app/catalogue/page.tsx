import type { Metadata } from "next";
import Catalogue from "@/components/Catalogue";
import PageHeader from "@/components/PageHeader";

export const metadata: Metadata = { title: "Catalogue", description: "Bagues, colliers, bracelets, alliances et parures en or et en argent." };

export default function Page() {
  return (
    <>
      <PageHeader eyebrow="Nos bijoux" title="Catalogue" ghost="CATALOGUE" text="Choisissez un bijou et commandez directement par WhatsApp." />
      <section className="container section list-section"><Catalogue /></section>
    </>
  );
}
