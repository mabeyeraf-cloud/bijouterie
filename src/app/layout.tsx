import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { MotionProvider } from "@/components/Motion";
import Magnetic from "@/components/Magnetic";
import ScrollProgress from "@/components/ScrollProgress";
import { site } from "@/lib/site";

const serif = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600"], style: ["normal", "italic"], variable: "--font-serif", display: "swap" });
const sans = Manrope({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.tagline, template: `%s | ${site.name}` },
  description: site.description,
  keywords: ["bijouterie", "bijoux or", "bijoux argent", "alliances", "Sénégal", "Darou Karim"],
  openGraph: { siteName: site.name, locale: "fr_SN", type: "website", title: site.tagline, description: site.description },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({ "@context": "https://schema.org", "@type": "JewelryStore", name: site.name, url: site.url, description: site.description }),
          }}
        />
        <MotionProvider>
          <ScrollProgress />
          <Magnetic />
          <Header />
          <main>{children}</main>
          <Footer />
          <WhatsAppButton />
        </MotionProvider>
      </body>
    </html>
  );
}
