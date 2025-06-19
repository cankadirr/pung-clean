// frontend/src/types/sanity-blocks.ts

export type MarkDef = {
  _key: string;
  _type: string;
  href?: string;
  [key: string]: unknown; // any yerine unknown kullanıldı
};

export type PortableTextBlock = {
  _key: string;
  _type: string;
  children?: {
    _key: string;
    _type: string;
    marks?: string[];
    text?: string;
  }[];
  markDefs?: MarkDef[];
  style?: string;
};

export type SanityImage = {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
    url?: string;
  };
  alt?: string;
};

export type AIInsightBlockDetails = PortableTextBlock[];

export type CrisisTimelineEventDescription = PortableTextBlock[];

// İleride ihtiyaca göre Post, Author, Category gibi tipler eklenebilir
