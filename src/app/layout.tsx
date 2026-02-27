import type { Metadata } from "next";
import { bebas, barlow, staatliches, fugaz } from "@/lib/fonts";
import "./globals.css";

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
    <html lang="en">
      <body className={`${bebas.variable} ${barlow.variable} ${staatliches.variable} ${fugaz.variable} font-barlow antialiased bg-[#1a1c19] text-white`}>
        {children}
      </body>
    </html>
  );
}