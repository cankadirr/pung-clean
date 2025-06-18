'use client'; // Bu bileşen artık istemci tarafında çalışacak

import React from 'react';
import PortableTextComponent from '../PortableTextComponent';
import { AIInsightBlockData, SanityPortableTextBlockType } from '@/types/sanity-blocks'; // Tipler buradan import edildi

interface AIInsightBlockProps extends Omit<AIInsightBlockData, '_key' | '_type'> {}

export const AIInsightBlock: React.FC<AIInsightBlockProps> = ({ title, summary, details } ) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">🧠 {title || 'AI Insight Block'}</h2>
      {summary && <p className="text-gray-600 mb-3">{summary}</p>}
      {details && details.length > 0 && (
        <div className="text-gray-700">
          <PortableTextComponent blocks={details} />
        </div>
      )}
    </div>
  );
};

export default AIInsightBlock;