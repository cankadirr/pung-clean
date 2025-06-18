import { defineField, defineType } from 'sanity';

// Blok şemalarını import ediyoruz
import { aiInsightBlock } from './blocks/AIInsightBlock';
import { articleGridBlock } from './blocks/ArticleGridBlock';
import { crisisTimelineBlock } from './blocks/CrisisTimelineBlock';
import globalSurveyBlock from './globalSurveyBlock'; // globalSurveyBlock'u import ediyoruz

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
        { type: 'block' }, // Sanity Portable Text
        { type: 'image', options: { hotspot: true } }, // Resim
        // PUNG'a özel blokları buraya ekliyoruz
        aiInsightBlock,
        articleGridBlock,
        crisisTimelineBlock,
        globalSurveyBlock, // Page şemasına ekliyoruz
        // Diğer özel bloklar buraya eklenecek
      ],
      description: 'Sayfanın ana içeriğini oluşturan bloklar. Bir sayfa oluşturucu gibi kullanın.'
    }),
    defineField({
      name: 'lang',
      title: 'Dil',
      type: 'string',
      options: {
        list: [
          {title: 'Türkçe', value: 'tr'},
          {title: 'Kürtçe (Kurmancî)', value: 'ku'},
          {title: 'İngilizce', value: 'en'}
        ],
        layout: 'dropdown'
      },
      initialValue: 'tr',
      description: 'Bu içeriğin dili.'
    })
  ]
});