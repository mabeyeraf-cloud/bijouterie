import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Catalogue from "@/components/Catalogue";
import PageHeader from "@/components/PageHeader";
import { categories } from "@/lib/products";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = categories.find((x) => x.slug === slug);
  return c ? { title: c.name, description: c.text } : {};
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const c = categories.find((x) => x.slug === slug);
  if (!c) notFound();
  return (
    <>
      <PageHeader eyebrow="Collection" title={c.name} ghost={c.name.toUpperCase()} text={c.text}>
        <Link href="/catalogue" className="breadcrumb">← Toutes les collections</Link>
      </PageHeader>
      <section className="container section list-section"><Catalogue only={c.slug} /></section>
    </>
  );
}
