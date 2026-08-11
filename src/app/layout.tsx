import type { Metadata } from "next";
// Una sola familia (Archivo) para todo el sitio, en linea con el trazo
// geometrico y compacto del isotipo de ÉLEVÉ — variantes por peso, no por fuente.
import { Archivo } from "next/font/google";
import "./globals.css";
import { SITE_URL } from "@/lib/site";

const archivo = Archivo({
  variable: "--font-heading",
  weight: "variable",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ÉLEVÉ — Perfumería",
    template: "%s — ÉLEVÉ",
  },
  description:
    "Catálogo de fragancias ÉLEVÉ. Envíos a domicilio y coordinación por WhatsApp.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: SITE_URL,
    siteName: "ÉLEVÉ",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ÉLEVÉ",
  url: SITE_URL,
  logo: `${SITE_URL}/images/logo-crop.png`,
  description:
    "Perfumería de catálogo: fragancias árabes y de diseñador, body splash y tubitos de muestra.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${archivo.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-body">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
