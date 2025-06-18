// src/types/sanity-blocks.ts
import { PortableTextBlock } from '@portabletext/types';

interface SanityAsset {
  url: string;
}

export interface SanityImageBlock {
  _key: string;
  _type: 'image';
  asset?: SanityAsset;
  alt?: string; // Image şemasında eklediğimiz alt metin
}

export type SanityPortableTextBlockType = PortableTextBlock;

export interface GlobalSurveyBlockData {
  _key: string;
  _type: 'globalSurveyBlock';
  surveyTitle?: string;
  surveyDescription?: string;
  options?: Array<{ _key: string; text: string; }>;
}

export interface Article {
  _id: string; // _id eklendi
  title: string;
  slug: string;
  summary?: string;
  image?: string; // mainImage.asset->url'den gelen string
}

export interface CategoryFilterData { // Kategori filtresi için interface
  _id: string;
  title: string;
  slug: string;
}

export interface ArticleGridBlockData {
  _key: string;
  _type: 'articleGridBlock';
  heading?: string;
  categoryFilter?: CategoryFilterData;
  numberOfArticles?: number;
  showFeaturedOnly?: boolean;
}

export interface AIInsightBlockData {
  _key: string;
  _type: 'aiInsightBlock';
  title?: string;
  summary?: string;
  details?: SanityPortableTextBlockType[];
}

export interface CrisisTimelineEvent { // Kriz Zaman Çizelgesi olayı için interface
  _key: string;
  date: string;
  eventTitle: string;
  eventDescription?: SanityPortableTextBlockType[];
  image?: { asset: SanityAsset; alt?: string };
}

export interface CrisisTimelineBlockData {
  _key: string;
  _type: 'crisisTimelineBlock';
  timelineTitle?: string;
  description?: string;
  events?: CrisisTimelineEvent[];
}

export type PageContentBlock =
  | SanityImageBlock
  | SanityPortableTextBlockType
  | GlobalSurveyBlockData
  | ArticleGridBlockData
  | AIInsightBlockData
  | CrisisTimelineBlockData;
