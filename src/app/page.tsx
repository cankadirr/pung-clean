import React from 'react';
// Bu, Next.js App Router için ana giriş sayfasıdır.
// Genellikle statik bir karşılama sayfası veya ana navigasyon noktası olur.
// Dinamik içerik için src/app/page/[slug]/page.tsx kullanılmalıdır.

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800 p-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">PUNG Projesi Ana Sayfası</h1>
      <p className="mt-4 text-lg text-gray-700 max-w-xl text-center">
        Hoş geldiniz! Bu platform, medya, kültür, tarih ve yapay zeka konularında derinlemesine analizler sunar.
      </p>
      <p className="mt-2 text-sm text-gray-600">
        Lütfen ana navigasyonu kullanarak diğer sayfaları (örn: /anket, /atlas, /zaman, /posts, /laleli) ziyaret edin.
      </p>
      <p className="mt-8 text-xs text-gray-500">
        İçerikler Sanity CMS tarafından dinamik olarak yönetilmektedir.
      </p>
    </div>
  );
}
