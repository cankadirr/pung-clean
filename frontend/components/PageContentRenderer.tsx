import React from 'react';
import GlobalSurvey from './GlobalSurvey';
import ArticleGridBlock from './blocks/ArticleGridBlock';
import AIInsightBlock from './blocks/AIInsightBlock';
import CrisisTimelineBlock from './blocks/CrisisTimelineBlock';
import PortableTextComponent from './PortableTextComponent';
import Image from 'next/image';
import { PortableTextBlock } from '@portabletext/types';

interface SanityAsset {
  url: string;
}

interface SanityImageBlock {
  _key: string;
  _type: 'image';
  asset?: SanityAsset;
}

type SanityPortableTextBlockType = PortableTextBlock;

interface GlobalSurveyBlockData {
  _key: string;
  _type: 'globalSurveyBlock';
  surveyTitle?: string;
  surveyDescription?: string;
  options?: Array<{ _key: string; text: string; }>;
}

interface Article { // Article tipi burada tanımlandı
  _id: string;
  title: string;
  slug: string;
  summary?: string;
  image?: string;
}

interface ArticleGridBlockData {
  _key: string;
  _type: 'articleGridBlock';
  heading?: string;
  categoryFilter?: { _id: string; title: string; slug: string; };
  numberOfArticles?: number;
  showFeaturedOnly?: boolean;
}

interface AIInsightBlockData {
  _key: string;
  _type: 'aiInsightBlock';
  title?: string;
  summary?: string;
  details?: SanityPortableTextBlockType[];
}

interface CrisisTimelineBlockData {
  _key: string;
  _type: 'crisisTimelineBlock';
  timelineTitle?: string;
  description?: string;
  events?: Array<{
    _key: string;
    date: string;
    eventTitle: string;
    eventDescription?: SanityPortableTextBlockType[];
    image?: { asset: SanityAsset; alt?: string };
  }>;
}

type PageContentBlock =
  | SanityImageBlock
  | SanityPortableTextBlockType
  | GlobalSurveyBlockData
  | ArticleGridBlockData
  | AIInsightBlockData
  | CrisisTimelineBlockData;

interface PageContentRendererProps {
  content: PageContentBlock[];
  articlesForGrid?: Article[];
}

const PageContentRenderer: React.FC<PageContentRendererProps> = ({ content, articlesForGrid } ) => {
  if (!content || content.length === 0) {
    return null;
  }

  return (
    <React.Fragment>
      {content.map(block => {
        if (!block || !block._key) {
          console.warn("Geçersiz veya anahtarı olmayan içerik bloğu:", block);
          return null;
        }

        switch (block._type) {
          case 'block':
            return (
              <div key={block._key} className="my-4 text-left max-w-3xl mx-auto">
                <PortableTextComponent blocks={block as SanityPortableTextBlockType} />
              </div>
            );
          case 'image':
            const imageBlock = block as SanityImageBlock;
            return (
              <div key={imageBlock._key} className="my-4 flex justify-center">
                {imageBlock.asset?.url && (
                  <Image
                    src={imageBlock.asset.url}
                    alt={imageBlock.alt || "Sayfa İçeriği Resmi"}
                    width={800}
                    height={600}
                    layout="responsive"
                    className="w-full max-w-2xl h-auto rounded-lg shadow-lg"
                    onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://placehold.co/800x600/CCCCCC/000000?text=Resim+Yok" }}
                  />
                )}
              </div>
            );
          case 'globalSurveyBlock':
            const surveyBlock = block as GlobalSurveyBlockData;
            return (
              <div key={surveyBlock._key} className="my-8">
                <GlobalSurvey
                  surveyTitle={surveyBlock.surveyTitle}
                  surveyDescription={surveyBlock.surveyDescription}
                  options={surveyBlock.options}
                />
              </div>
            );
          case 'articleGridBlock':
            const articleGridBlock = block as ArticleGridBlockData;
            return (
              <div key={articleGridBlock._key} className="my-8">
                {articleGridBlock.heading && <h2 className="text-3xl font-bold text-gray-800 mb-6">{articleGridBlock.heading}</h2>}
                <ArticleGridBlock articles={articlesForGrid} heading={articleGridBlock.heading} />
              </div>
            );
          case 'aiInsightBlock':
            const aiInsightBlock = block as AIInsightBlockData;
            return (
                <div key={aiInsightBlock._key} className="my-8">
                    <AIInsightBlock title={aiInsightBlock.title} summary={aiInsightBlock.summary} details={aiInsightBlock.details} />
                </div>
            );
          case 'crisisTimelineBlock':
            const crisisTimelineBlock = block as CrisisTimelineBlockData;
            return (
                <div key={crisisTimelineBlock._key} className="my-8">
                    <CrisisTimelineBlock timelineTitle={crisisTimelineBlock.timelineTitle} description={crisisTimelineBlock.description} events={crisisTimelineBlock.events} />
                </div>
            );
          default:
            console.warn(`Bilinmeyen blok tipi: ${block._type}`, block);
            return null;
        }
      })}
    </React.Fragment>
  );
};

export default PageContentRenderer;