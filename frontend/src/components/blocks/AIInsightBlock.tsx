import React from 'react';
import { PortableText } from '@portabletext/react';
import { AIInsightBlockDetails } from '../../src/types/sanity';

interface AIInsightBlockProps {
  title?: string;
  summary?: string;
  details?: AIInsightBlockDetails;
}

const components = {
  block: {
    h1: ({ children }: { children: React.ReactNode }) => (
      <h1 className="text-3xl font-bold mb-4">{children}</h1>
    ),
    h2: ({ children }: { children: React.ReactNode }) => (
      <h2 className="text-2xl font-bold mb-3">{children}</h2>
    ),
    normal: ({ children }: { children: React.ReactNode }) => (
      <p className="text-gray-700 leading-relaxed mb-2">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }: { children: React.ReactNode }) => (
      <ul className="list-disc list-inside pl-5 mb-2">{children}</ul>
    ),
    number: ({ children }: { children: React.ReactNode }) => (
      <ol className="list-decimal list-inside pl-5 mb-2">{children}</ol>
    ),
  },
  listItem: ({ children }: { children: React.ReactNode }) => (
    <li className="mb-1">{children}</li>
  ),
  marks: {
    link: ({ children, value }: { children: React.ReactNode; value: { href: string } }) => (
      <a
        href={value.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      >
        {children}
      </a>
    ),
    strong: ({ children }: { children: React.ReactNode }) => <strong>{children}</strong>,
    em: ({ children }: { children: React.ReactNode }) => <em>{children}</em>,
  },
};

const AIInsightBlock: React.FC<AIInsightBlockProps> = ({ title, summary, details }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow space-y-4">
      <h2 className="text-2xl font-bold text-gray-800">{title || 'AI İçgörü Başlığı'}</h2>
      <p className="text-gray-600">{summary || 'AI içgörüsü özeti.'}</p>
      {details && details.length > 0 && (
        <div className="prose prose-sm max-w-none text-gray-700">
          <PortableText value={details} components={components} />
        </div>
      )}
    </div>
  );
};

export default AIInsightBlock;
