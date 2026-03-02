import type { Metadata } from "next";
import "./globals.css";
import { bebas, barlow, staatliches, fugaz } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Discipulado: Hero's Journey",
  description: "Gamified discipleship platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="pt-BR" 
      className={`${bebas.variable} ${barlow.variable} ${staatliches.variable} ${fugaz.variable}`}
      suppressHydrationWarning
    >
      <body className="font-fugaz antialiased bg-dark-surface text-white">
        {children}
      </body>
    </html>
  );
}