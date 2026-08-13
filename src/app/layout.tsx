import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import AnalyticsGate from "@/components/analytics/AnalyticsGate";
import "./globals.css";

const kanit = Kanit({
  variable: "--font-kanit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "nmtech solutions -- Biblioteca de Ebooks",
  description:
    "Ebooks propios sobre desarrollo de software, automatizaciones e IA aplicada a negocios, creados por nmtech solutions.",
  other: {
    // Verificación de dominio en Meta Business Manager (Seguridad e idoneidad > Dominios).
    "facebook-domain-verification": "6532vsde7573412alovixkej1z30es",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${kanit.variable} h-full antialiased`}>
      <body
        className="min-h-full flex flex-col bg-background text-foreground"
        style={{ overflowX: "clip" }}
      >
        {children}
        <AnalyticsGate />
      </body>
    </html>
  );
}
