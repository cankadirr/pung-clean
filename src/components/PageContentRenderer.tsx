import React from 'react';
import GlobalSurvey from './GlobalSurvey';
import ArticleGridBlock from './blocks/ArticleGridBlock';
import AIInsightBlock from './blocks/AIInsightBlock';
import CrisisTimelineBlock from './blocks/CrisisTimelineBlock';
import PortableTextComponent from './PortableTextComponent';

// Tipleri '../../src/types/sanity' dosyasından import ediyoruz
import {
  PageContentBlock,
  SanityImage,
  SanityPortableTextBlock,
  GlobalSurveyBlockData,
  ArticleGridBlockData,
  AIInsightBlockData,
  CrisisTimelineBlockData,
} from '../src/types/sanity';

interface PageContentRendererProps {
  content: PageContentBlock[];
  articlesForGrid?: any[]; // ArticleGrid'e özel makaleler
}

const PageContentRenderer: React.FC<PageContentRendererProps> = ({ content, articlesForGrid }) => {
  if (!content || content.length === 0) {
    return null;
  }

  return (
    <>
      {content.map(block => {
        if (!block || !block._key) {
          console.warn("Geçersiz veya anahtarı olmayan içerik bloğu:", block);
          return null;
        }

        switch (block._type) {
          case 'block':
            return (
              <div key={block._key} className="my-4 text-left max-w-3xl mx-auto">
                <PortableTextComponent blocks={[block as SanityPortableTextBlock]} />
              </div>
            );
          case 'image':
            const imageBlock = block as SanityImage;
            return (
              <div key={imageBlock._key} className="my-4 flex justify-center">
                {imageBlock.asset?.url && (
                  <img src={imageBlock.asset.url} alt={imageBlock.alt || 'Sayfa İçeriği Resmi'} className="w-full max-w-2xl h-auto rounded-lg shadow-lg" />
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
    </>
  );
};

export default PageContentRenderer;
