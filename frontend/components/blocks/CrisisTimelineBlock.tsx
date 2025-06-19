import React from 'react';
import { PortableText } from '@portabletext/react'; // PortableText kütüphanesini import ettik
import { CrisisTimelineEventDescription } from '../../src/types/sanity'; // Yeni tipimizi import ettik

// PortableText bileşeni için özel bileşenler (AIInsightBlock ile aynı, ayrı tanımlayabiliriz veya ortak bir dosyaya alabiliriz)
const components = {
  block: {
    h1: ({ children }: { children: React.ReactNode }) => <h1 className="text-3xl font-bold mb-4">{children}</h1>,
    h2: ({ children }: { children: React.ReactNode }) => <h2 className="text-2xl font-bold mb-3">{children}</h2>,
    normal: ({ children }: { children: React.ReactNode }) => <p className="text-gray-700 leading-relaxed mb-2">{children}</p>,
  },
  list: {
    bullet: ({ children }: { children: React.ReactNode }) => <ul className="list-disc list-inside pl-5 mb-2">{children}</ul>,
    number: ({ children }: { children: React.ReactNode }) => <ol className="list-decimal list-inside pl-5 mb-2">{children}</ol>,
  },
  listItem: ({ children }: { children: React.ReactNode }) => <li className="mb-1">{children}</li>,
  marks: {
    link: ({ children, value }: { children: React.ReactNode; value: { href: string } }) => (
      <a href={value.href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
        {children}
      </a>
    ),
    strong: ({ children }: { children: React.ReactNode }) => <strong>{children}</strong>,
    em: ({ children }: { children: React.ReactNode }) => <em>{children}</em>,
  },
};

interface CrisisTimelineEvent {
  _key: string;
  date: string;
  eventTitle: string;
  eventDescription?: CrisisTimelineEventDescription; // Portable Text tipimizi kullandık
  image?: {
    asset: {
      url: string;
    };
    alt?: string;
  };
}

interface CrisisTimelineBlockProps {
  timelineTitle?: string;
  description?: string;
  events?: CrisisTimelineEvent[];
}

const CrisisTimelineBlock: React.FC<CrisisTimelineBlockProps> = ({ timelineTitle, description, events }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">{timelineTitle || 'Kriz Zaman Çizelgesi'}</h2>
      <p className="text-gray-600">{description || 'Kriz zaman çizelgesi açıklaması.'}</p>

      {events && events.length > 0 ? (
        <ul className="border-l-4 border-red-500 pl-6 space-y-6">
          {events.map((event) => (
            <li key={event._key} className="relative">
              <div className="absolute -left-6 top-1 w-3 h-3 bg-red-600 rounded-full"></div>
              <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
              <h3 className="text-lg font-semibold text-gray-800">{event.eventTitle}</h3>
              {event.eventDescription && event.eventDescription.length > 0 && (
                <div className="prose prose-sm max-w-none text-gray-700">
                  {/* PortableText bileşeni ile Portable Text içeriğini render ediyoruz */}
                  <PortableText value={event.eventDescription} components={components} />
                </div>
              )}
              {event.image && event.image.asset && event.image.asset.url && (
                <img
                  src={event.image.asset.url}
                  alt={event.image.alt || event.eventTitle}
                  className="mt-4 rounded-lg w-full h-48 object-cover"
                />
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-600 text-center">Henüz olay bulunamadı.</p>
      )}
    </div>
  );
};

export default CrisisTimelineBlock;
