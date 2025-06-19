// frontend/src/types/sanity.d.ts

import { PortableTextBlock as PortableTextBlockType } from '@portabletext/types';

// Sanity Portable Text'in temel blok yapısını temsil eden tip.
export type PortableTextBlock = PortableTextBlockType;

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

// Eğer Sanity'de 'category' şemanız varsa, referans olarak kullanırken bu tip işe yarar
export interface SanityCategory {
  _id: string;
  title: string;
  slug: string;
  description?: string;
}

// ArticleGridBlock'tan çekilen makaleler için tip
export interface SanityArticle {
  _id: string;
  title: string;
  slug: string;
  summary?: string;
  image?: string; // image.asset->url'den gelen URL
}

// GlobalSurveyBlock'un options'ı için tip
export interface GlobalSurveyOption {
    _key?: string; // Sanity array item'ları için _key
    id?: number;   // Mock veriler için id
    text: string;
}

// GlobalSurveyBlock verisi için tip
export interface GlobalSurveyBlockData {
    _key: string;
    _type: 'globalSurveyBlock';
    surveyTitle?: string;
    surveyDescription?: string;
    options?: GlobalSurveyOption[];
}

// ArticleGridBlock verisi için tip
export interface ArticleGridBlockData {
    _key: string;
    _type: 'articleGridBlock';
    heading?: string;
    categoryFilter?: SanityCategory; // Artık SanityCategory tipini kullanıyoruz
    numberOfArticles?: number;
    showFeaturedOnly?: boolean;
}

// AIInsightBlock verisi için tip
export interface AIInsightBlockData {
    _key: string;
    _type: 'aiInsightBlock';
    title?: string;
    summary?: string;
    details?: PortableTextBlock[];
}

// CrisisTimelineEvent verisi için tip
export interface CrisisTimelineEventData {
    _key: string;
    date: string;
    eventTitle: string;
    eventDescription?: PortableTextBlock[];
    image?: { asset: SanityAsset; alt?: string };
}

// CrisisTimelineBlock verisi için tip
export interface CrisisTimelineBlockData {
    _key: string;
    _type: 'crisisTimelineBlock';
    timelineTitle?: string;
    description?: string;
    events?: CrisisTimelineEventData[];
}

// Sayfa içeriği için birleşim tipi
export type PageContentBlock =
  | PortableTextBlock
  | SanityImage
  | GlobalSurveyBlockData
  | ArticleGridBlockData
  | AIInsightBlockData
  | CrisisTimelineBlockData;
