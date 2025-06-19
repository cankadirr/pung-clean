import React from 'react';
import Image from 'next/image';
import PortableTextComponent from '../PortableTextComponent';
import { PortableTextBlock } from '@portabletext/types';
import { CrisisTimelineEventData } from '../../src/types/sanity'; // Yeni tipimizi import ettik

interface CrisisTimelineBlockProps {
  timelineTitle?: string;
  description?: string;
  events?: CrisisTimelineEventData[]; // Yeni tipimizi kullanıyoruz
}

export const CrisisTimelineBlock: React.FC<CrisisTimelineBlockProps> = ({ timelineTitle, description, events }) => {
  if (!events || events.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-lg text-center text-gray-600">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{timelineTitle || 'Kriz Zaman Çizelgesi'}</h2>
        <p>Henüz olay bulunamadı veya yükleniyor.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">{timelineTitle || 'Kriz Zaman Çizelgesi'}</h2>
      {description && <p className="text-gray-600 mb-6">{description}</p>}

      <ul className="border-l-4 border-red-500 pl-6 space-y-8">
        {events.map(event => (
          <li key={event._key} className="relative">
            <div className="absolute -left-6 top-0 w-4 h-4 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold"></div>
            <p className="text-sm text-gray-500 mb-1">{new Date(event.date).toLocaleDateString()}</p>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{event.eventTitle}</h3>
            {event.eventDescription && event.eventDescription.length > 0 && (
              <div className="text-gray-700">
                <PortableTextComponent blocks={event.eventDescription} />
              </div>
            )}
            {event.image?.asset?.url && (
              <div className="mt-4">
                <Image
                  src={event.image.asset.url}
                  alt={event.image.alt || event.eventTitle}
                  width={600}
                  height={400}
                  layout="responsive"
                  className="w-full h-auto rounded-lg"
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://placehold.co/600x400/CCCCCC/000000?text=Resim+Yok" }}
                />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CrisisTimelineBlock;
