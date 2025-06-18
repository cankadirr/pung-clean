import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Dinamik metadata fonksiyonu (örnek basit hali)
export function generateMetadata({ title, description }: { title?: string; description?: string }): Metadata {
  return {
    title: title ?? "PUNG Projesi",
    description: description ?? "Yapay zeka destekli, interaktif medya platformu",
    openGraph: {
      title: title ?? "PUNG Projesi",
      description: description ?? "Yapay zeka destekli, interaktif medya platformu",
      siteName: "PUNG",
      locale: "tr_TR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title ?? "PUNG Projesi",
      description: description ?? "Yapay zeka destekli, interaktif medya platformu",
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
