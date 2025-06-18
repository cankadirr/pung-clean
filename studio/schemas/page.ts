import { defineField, defineType } from 'sanity';

// Blok şemalarını import ediyoruz
import { aiInsightBlock } from './blocks/AIInsightBlock';
import { articleGridBlock } from './blocks/ArticleGridBlock';
import { crisisTimelineBlock } from './blocks/CrisisTimelineBlock';
import globalSurveyBlock from './globalSurveyBlock';

export default defineType({
  name: 'page',
  title: 'Sayfa',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Sayfa Başlığı',
      type: 'string',
      description: 'Sayfanın ana başlığı (örn: Anasayfa, Anket, Yüzleşme)'
    }),
    defineField({
      name: 'slug',
      title: 'URL Yolu (Slug)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96
      },
      validation: Rule => Rule.required(),
      description: 'Sayfanın URL yolu (örn: anket, yuzlesme). Otomatik oluşur.'
    }),
    defineField({
      name: 'description',
      title: 'Sayfa Açıklaması (SEO)',
      type: 'text',
      rows: 3,
      description: 'Arama motorları için kısa sayfa açıklaması.'
    }),
    defineField({
      name: 'content',
      title: 'Sayfa İçeriği',
      type: 'array',
      of: [
        { type: 'block' },
        { type: 'image', options: { hotspot: true } },
        aiInsightBlock,
        articleGridBlock,
        crisisTimelineBlock,
        globalSurveyBlock,
      ],
      description: 'Sayfanın ana içeriğini oluşturan bloklar. Bir sayfa oluşturucu gibi kullanın.'
    })
  ]
});