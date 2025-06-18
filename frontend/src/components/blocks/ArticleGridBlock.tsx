'use client'; // Bu bileşen artık istemci tarafında çalışacak

import React from 'react';
import Image from 'next/image';
import { Article, ArticleGridBlockData } from '@/types/sanity-blocks'; // Tipler buradan import edildi

interface ArticleGridBlockProps extends Omit<ArticleGridBlockData, '_key' | '_type' | 'categoryFilter' | 'numberOfArticles' | 'showFeaturedOnly'> {
  articles?: Article[];
  heading?: string;
}

export const ArticleGridBlock: React.FC<ArticleGridBlockProps> = ({ heading, articles } ) => {
  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{heading || 'Makaleler'}</h2>
        <p>Henüz makale bulunamadı veya yükleniyor.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      {heading && <h2 className="text-2xl font-bold text-gray-800 mb-6">{heading}</h2>}
      <div className="grid md:grid-cols-3 gap-6">
        {articles.map(article => (
          <div key={article._id} className="bg-gray-50 rounded-2xl shadow-md overflow-hidden">
            {article.image ? (
              <Image
                src={article.image}
                alt={article.title}
                width={600}
                height={400}
                // layout="responsive" // `layout` prop'u Next.js 13+ ile deprecated oldu. Bunun yerine `fill` veya `style` kullanın.
                className="w-full h-48 object-cover"
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://placehold.co/600x400/CCCCCC/000000?text=Resim+Yok" }}
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">Resim Yok</div>
            )}
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-800">{article.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{article.summary}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticleGridBlock;