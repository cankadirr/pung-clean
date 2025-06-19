// frontend/src/types/sanity.d.ts

// Sanity Portable Text'in temel blok yapısını temsil eden tip.
// Bu, genellikle bir portable text editöründen gelen veri yapısıdır.
export type PortableTextBlock = {
  _key: string;
  _type: string; // 'block' veya özel bir blok tipi (örn: 'image', 'callToAction')
  children?: {
    _key: string;
    _type: string; // 'span' gibi
    marks?: string[];
    text?: string;
  }[];
  markDefs?: any[]; // Marks definition'lar (linkler, bold vs.)
  style?: string; // 'normal', 'h1', 'blockquote' gibi
  // Diğer olası Portable Text özellikleri buraya eklenebilir
};

// Sanity Image Asset tipi
export type SanityImage = {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
    url?: string; // ImageUrlBuilder ile çekildiğinde dolu olur
  };
  alt?: string;
};

// AIInsightBlock içindeki 'details' alanı için tip
export type AIInsightBlockDetails = PortableTextBlock[];

// CrisisTimelineEvent içindeki 'eventDescription' alanı için tip
export type CrisisTimelineEventDescription = PortableTextBlock[];

// Diğer Sanity tiplerini buraya ekleyebilirsiniz (örn: Post, Author, Category)
// Ancak bu aşamada sadece hataları gidermeye odaklanıyoruz.
