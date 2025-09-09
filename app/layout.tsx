
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "Үй-бүлөгө көмөк - Система управления семейными пособиями",
  description: "Государственная программа помощи семьям Кыргызской Республики",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
