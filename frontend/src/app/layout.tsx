import './globals.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PUNG - Çok Katmanlı Medya',
  description: 'PUNG projesi ana sayfası',
  openGraph: {
    title: 'PUNG - Çok Katmanlı Medya',
    description: 'PUNG projesi ana sayfası',
    url: 'https://pung.example.com',
    siteName: 'PUNG',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PUNG Open Graph Image',
      },
    ],
    locale: 'tr_TR',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  )
}