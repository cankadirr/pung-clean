const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, 'frontend', 'src', 'app');
const seoFile = path.join(appDir, 'head.tsx');

if (!fs.existsSync(appDir)) {
  console.error('Hata: frontend/src/app dizini bulunamadı.');
  process.exit(1);
}

const seoContent = `
import { Metadata } from 'next'

export function generateMetadata({ params }): Metadata {
  const title = params?.title || 'PUNG Projesi'
  const description = 'PUNG, yapay zeka destekli, interaktif çok katmanlı medya platformu.'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: 'https://pung.example.com',
      siteName: 'PUNG',
      locale: 'tr_TR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}
`

fs.writeFileSync(seoFile, seoContent.trim(), 'utf8');
console.log('SEO için head.tsx dosyası oluşturuldu: ', seoFile);
console.log('Artık bu dosyayı Next.js app dizininde kullanabilirsin.');
