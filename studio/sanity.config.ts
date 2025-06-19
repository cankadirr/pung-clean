// sanity.config.ts
import {defineConfig} from 'sanity';
import {structureTool} from 'sanity/structure';
import {visionTool} from '@sanity/vision';

// Tüm şemalarınızı buradan import edin (default export oldukları için {} kullanılmaz)
import page from './schemas/page';
import globalSurveyBlock from './schemas/globalSurveyBlock';
import post from './schemas/post';
import author from './schemas/author';
import category from './schemas/category';
import video from './schemas/video';

// Blok şemalarını blocks klasöründen import edin (named export oldukları için {} kullanılır)
import {aiInsightBlock} from './schemas/blocks/AIInsightBlock';
import {articleGridBlock} from './schemas/blocks/ArticleGridBlock';
import {crisisTimelineBlock} from './schemas/blocks/CrisisTimelineBlock';


export default defineConfig({
  name: 'default',
  title: 'Pung Project CMS',
  projectId: '13f1s0mc', // Doğru Project ID'niz
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: [
      // Ana doküman tipleri (Sanity Studio sol panelinde görünür)
      // Bu şemalar zaten defineType ile sarmalandığı için burada doğrudan objeleri listeliyoruz.
      page,
      post,
      author,
      category,
      video,
      globalSurveyBlock,

      // Alt bloklar (Portable Text'in içinde kullanılan nesne tipleri)
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