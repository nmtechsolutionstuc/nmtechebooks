import type { Metadata } from "next";
import { Kanit } from "next/font/google";
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
      </body>
    </html>
  );
}
