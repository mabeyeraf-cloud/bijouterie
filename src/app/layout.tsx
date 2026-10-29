import type { Metadata } from "next";
import "@fontsource-variable/jost/wght.css";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { MotionProvider } from "@/components/Motion";
import { getSettings, lienTel } from "@/lib/content";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.tagline, template: `%s | ${site.name}` },
  description: site.description,
  keywords: ["bijouterie Dakar", "bijoux en or Dakar", "joaillerie Sénégal", "alliances Dakar", "bague de fiançailles Dakar", "bijoux sur mesure Dakar", "filigrane"],
  openGraph: { siteName: site.name, locale: "fr_SN", type: "website", title: site.tagline, description: site.description },
  twitter: { card: "summary_large_image" },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const s = await getSettings();
  const tel = lienTel(s.telephone);
  return (
    <html lang="fr">
      <head>
        <link rel="preload" href="/fonts/BodoniModa.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/BodoniModa-Italic.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "JewelryStore",
              name: site.name,
              url: site.url,
              description: site.description,
              areaServed: "Dakar, Sénégal",
              address: { "@type": "PostalAddress", streetAddress: s.adresse.startsWith("[") ? undefined : s.adresse, addressLocality: "Dakar", addressCountry: "SN" },
              telephone: tel ? s.telephone : undefined,
            }),
          }}
        />
        <a href="#contenu" className="skip">Aller au contenu</a>
        <MotionProvider>
          <Header phone={tel ? { label: s.telephone, href: tel } : null} />
          <main id="contenu">{children}</main>
          <Footer />
          <WhatsAppButton />
        </MotionProvider>
      </body>
    </html>
  );
}
