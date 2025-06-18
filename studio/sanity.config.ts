// sanity.config.ts
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';

// Tüm temel şemalarınızı buradan import edin
import page from './schemas/page';
import globalSurveyBlock from './schemas/globalSurveyBlock';
import post from './schemas/post';
import author from './schemas/author';
import category from './schemas/category';
import video from './schemas/video'; // Yeni eklenen video şeması

// Blok şemalarını blocks klasöründen import edin
import { aiInsightBlock } from './schemas/blocks/AIInsightBlock';
import { articleGridBlock } from './schemas/blocks/ArticleGridBlock';
import { crisisTimelineBlock } from './schemas/blocks/CrisisTimelineBlock';


export default defineConfig({
  name: 'default',
  title: 'Pung Project CMS',
  projectId: '13f1s0mc', // Doğru Project ID'niz
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: [
      // Ana doküman tipleri (Sanity Studio sol panelinde görünür)
      page,
      post, // 'post' şeması eklendi
      author, // 'author' şeması eklendi
      category, // 'category' şeması eklendi
      video, // 'video' şeması eklendi
      globalSurveyBlock, // 'globalSurveyBlock' da buraya eklendi çünkü o da bir doküman gibi davranacak

      // Alt bloklar (Portable Text'in içinde kullanılan nesne tipleri)
      // Bunlar doğrudan sol panelde görünmez, Page veya Post içeriğinde seçilebilirler
      aiInsightBlock,
      articleGridBlock,
      crisisTimelineBlock,
    ],
  },
  // PostCSS hatasını düzeltmek için Vite konfigürasyonu
  vite: {
    css: {
      postcss: {
        plugins: [],
      },
    },
  },
});
