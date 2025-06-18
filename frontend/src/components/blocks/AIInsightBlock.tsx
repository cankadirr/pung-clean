'use client';

import React from 'react';
import PortableTextComponent from '../PortableTextComponent';
import { AIInsightBlockData } from '@/types/sanity-blocks'; // SanityPortableTextBlockType kaldırıldı, çünkü 'details' prop'unun tip tanımı yeterli

interface AIInsightBlockProps {
  title?: AIInsightBlockData['title'];
  summary?: AIInsightBlockData['summary'];
  details?: AIInsightBlockData['details'];
}

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