import type { Metadata } from "next";
// Una sola familia (Archivo) para todo el sitio, en linea con el trazo
// geometrico y compacto del isotipo de ÉLEVÉ — variantes por peso, no por fuente.
import { Archivo } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-heading",
  weight: "variable",
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://eleve-rho-snowy.vercel.app"),
  title: "ÉLEVÉ — Perfumería",
  description:
    "Catálogo de fragancias ÉLEVÉ. Envíos a domicilio y coordinación por WhatsApp.",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ÉLEVÉ",
  url: "https://eleve-rho-snowy.vercel.app",
  logo: "https://eleve-rho-snowy.vercel.app/images/logo-crop.png",
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
