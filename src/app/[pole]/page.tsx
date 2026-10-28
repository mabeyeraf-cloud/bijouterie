import { notFound, permanentRedirect } from "next/navigation";
import { poles } from "@/lib/site";

// Ancienne adresse /<métier> : les pages vivent désormais sous /metiers/<métier>.
export const dynamicParams = false;
export function generateStaticParams() {
  return poles.map((p) => ({ pole: p.slug }));
}

type Props = { params: Promise<{ pole: string }> };

export default async function PolePage({ params }: Props) {
  const { pole } = await params;
  if (!poles.some((x) => x.slug === pole)) notFound();
  permanentRedirect(`/metiers/${pole}`);
}
