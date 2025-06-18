import os

# --- Konfigürasyonlar ---
# Projenizin kök dizinini ayarlayın.
PROJECT_ROOT = 'C:\\Users\\ASUS\\Desktop\\pung-clean' # Dizin ağacının ana kökü
SANITY_STUDIO_PATH = os.path.join(PROJECT_ROOT, 'studio')
SANITY_SCHEMAS_PATH = os.path.join(SANITY_STUDIO_PATH, 'schemas')
SANITY_BLOCKS_PATH = os.path.join(SANITY_SCHEMAS_PATH, 'blocks') # Sanity blok şemaları için yeni yol
NEXTJS_FRONTEND_PATH = os.path.join(PROJECT_ROOT, 'frontend')
NEXTJS_COMPONENTS_PATH = os.path.join(NEXTJS_FRONTEND_PATH, 'components')
NEXTJS_BLOCKS_COMPONENTS_PATH = os.path.join(NEXTJS_COMPONENTS_PATH, 'blocks')
NEXTJS_APP_PATH = os.path.join(NEXTJS_FRONTEND_PATH, 'src', 'app')
NEXTJS_LIB_PATH = os.path.join(NEXTJS_FRONTEND_PATH, 'src', 'lib')

# KULLANILACAK SANITY PROJECT ID
SANITY_PROJECT_ID = 'z4hxfpe8' # Burayı kendi Sanity Project ID'niz ile güncelleyin!
# --- Konfigürasyon Sonu ---

# --- Şema ve Konfigürasyon Dosyaları İçerikleri ---
FILES_TO_CREATE = {
    # --- SANITY STUDIO DOSYALARI ---

    # Sanity Studio: sanity.cli.ts
    os.path.join(SANITY_STUDIO_PATH, 'sanity.cli.ts'): f"""// sanity.cli.ts
import {{ defineCliConfig }} from 'sanity/cli';

export default defineCliConfig({{
  api: {{
    projectId: '{SANITY_PROJECT_ID}', // Doğru Project ID'niz
    dataset: 'production'
  }}
}});""",

    # Sanity Studio: sanity.config.ts
    os.path.join(SANITY_STUDIO_PATH, 'sanity.config.ts'): f"""// sanity.config.ts
import {{ defineConfig }} from 'sanity';
import {{ structureTool }} from 'sanity/structure';
import {{ visionTool }} from '@sanity/vision';

// Tüm şemalarınızı buradan import edin (default export oldukları için {{}} kullanılmaz)
import page from './schemas/page';
import globalSurveyBlock from './schemas/globalSurveyBlock';
import post from './schemas/post';
import author from './schemas/author';
import category from './schemas/category';
import video from './schemas/video';

// Blok şemalarını blocks klasöründen import edin (named export oldukları için {{}} kullanılır)
import {{ aiInsightBlock }} from './schemas/blocks/AIInsightBlock';
import {{ articleGridBlock }} from './schemas/blocks/ArticleGridBlock';
import {{ crisisTimelineBlock }} from './schemas/blocks/CrisisTimelineBlock';


export default defineConfig({{
  name: 'default',
  title: 'Pung Project CMS',
  projectId: '{SANITY_PROJECT_ID}', // Doğru Project ID'niz
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {{
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
      // Bunlar named export oldukları için burada doğrudan objeleri listeliyoruz.
      aiInsightBlock,
      articleGridBlock,
      crisisTimelineBlock,
    ],
  }},
  // PostCSS hatasını düzeltmek için Vite konfigürasyonu
  vite: {{
    css: {{
      postcss: {{
        plugins: [],
      }},
    }},
  }},
}});""",

    # Sanity Schema: AIInsightBlock.ts
    os.path.join(SANITY_BLOCKS_PATH, 'AIInsightBlock.ts'): """import { defineType, defineField } from 'sanity';

export const aiInsightBlock = defineType({
  name: 'aiInsightBlock',
  title: 'AI Insight Block',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Başlık',
      type: 'string',
      validation: Rule => Rule.required(),
      description: 'AI Destekli İçgörü Bloğunun başlığı.'
    }),
    defineField({
      name: 'summary',
      title: 'Özet',
      type: 'text',
      rows: 3,
      description: 'AI içgörüsünün kısa bir özeti.'
    }),
    defineField({
      name: 'details',
      title: 'Detaylar',
      type: 'array',
      of: [{ type: 'block' }], // Portable Text destekli
      description: 'İçgörünün detaylı açıklaması.'
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'summary',
    },
    prepare(selection) {
      const { title, subtitle } = selection;
      return {
        title: `🧠 AI İçgörü: ${title || 'Başlıksız İçgörü'}`,
        subtitle: subtitle ? `Özet: ${subtitle.substring(0, 50)}...` : 'Detaylı yapay zeka içgörüsü.',
      };
    },
  },
});""",

    # Sanity Schema: ArticleGridBlock.ts
    os.path.join(SANITY_BLOCKS_PATH, 'ArticleGridBlock.ts'): """import { defineField, defineType } from 'sanity';

export const articleGridBlock = defineType({
  name: 'articleGridBlock',
  title: 'Makale Izgarası Bloğu',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Başlık',
      type: 'string',
      description: 'Makale ızgarası bölümünün başlığı (örn: Son Haberler, Öne Çıkan Makaleler)'
    }),
    defineField({
      name: 'categoryFilter',
      title: 'Kategoriye Göre Filtrele',
      type: 'reference',
      to: [{ type: 'category' }], // Mevcut 'category' şemasına referans olacak (eğer tanımlıysa)
      description: 'Belirli bir kategoriye ait makaleleri göstermek için seçin. (Opsiyonel)'
    }),
    defineField({
      name: 'numberOfArticles',
      title: 'Gösterilecek Makale Sayısı',
      type: 'number',
      description: 'Izgarada kaç makale gösterileceği.',
      validation: Rule => Rule.min(1).max(10).warning('Lütfen 1 ile 10 arasında bir sayı girin.'),
      initialValue: 3
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      category: 'categoryFilter.title'
    },
    prepare(selection) {
      const { title, category } = selection;
      return {
        title: `📰 Makale Izgarası: ${title || 'Başlıksız Izgara'}`,
        subtitle: category ? `Kategori: ${category}` : 'Tüm Kategoriler',
      };
    },
  },
});""",

    # Sanity Schema: CrisisTimelineBlock.ts
    os.path.join(SANITY_BLOCKS_PATH, 'CrisisTimelineBlock.ts'): """import { defineField, defineType } from 'sanity';

export const crisisTimelineBlock = defineType({
  name: 'crisisTimelineBlock',
  title: 'Kriz Zaman Çizelgesi Bloğu',
  type: 'object',
  fields: [
    defineField({
      name: 'timelineTitle',
      title: 'Zaman Çizelgesi Başlığı',
      type: 'string',
      validation: Rule => Rule.required(),
      description: 'Zaman çizelgesinin ana başlığı (örn: 2023 Kahramanmaraş Depremleri Zaman Çizelgesi)'
    }),
    defineField({
      name: 'description',
      title: 'Açıklama',
      type: 'text',
      rows: 3,
      description: 'Zaman çizelgesinin kısa bir açıklaması.'
    }),
    defineField({
      name: 'events',
      title: 'Olaylar',
      type: 'array',
      of: [
        defineField({
          name: 'eventItem',
          title: 'Zaman Çizelgesi Olayı',
          type: 'object',
          fields: [
            defineField({
              name: 'date',
              title: 'Tarih',
              type: 'datetime',
              options: {
                dateFormat: 'YYYY-MM-DD',
                timeFormat: 'HH:mm',
                calendarTodayLabel: 'Bugün',
              },
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'eventTitle',
              title: 'Olay Başlığı',
              type: 'string',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'eventDescription',
              title: 'Olay Açıklaması',
              type: 'array',
              of: [{ type: 'block' }],
            }),
            defineField({
              name: 'image',
              title: 'İlgili Görsel',
              type: 'image',
              options: {
                hotspot: true,
              },
              fields: [
                defineField({
                  name: 'alt',
                  title: 'Alternatif Metin',
                  type: 'string',
                })
              ]
            })
          ],
          preview: {
            select: {
              title: 'eventTitle',
              subtitle: 'date',
            },
            prepare(selection) {
              const { title, subtitle } = selection;
              const formattedDate = subtitle ? new Date(subtitle).toLocaleDateString() : 'Tarihsiz';
              return {
                title: title || 'Başlıksız Olay',
                subtitle: `🗓️ ${formattedDate}`,
              };
            },
          },
        }),
      ],
      validation: Rule => Rule.min(1).error('En az bir olay olmalıdır.'),
      description: 'Zaman çizelgesine olayları ekleyin.'
    })
  ],
  preview: {
    select: {
      title: 'timelineTitle',
      events: 'events',
    },
    prepare(selection) {
      const { title, events } = selection;
      const eventCount = events ? events.length : 0;
      return {
        title: `⏳ Zaman Çizelgesi: ${title || 'Başlıksız Zaman Çizelgesi'}`,
        subtitle: `${eventCount} olay içeriyor`,
      };
    },
  },
});""",

    # Sanity Schema: page.ts
    os.path.join(SANITY_SCHEMAS_PATH, 'page.ts'): """import { defineField, defineType } from 'sanity';

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
});""",

    os.path.join(SANITY_SCHEMAS_PATH, 'globalSurveyBlock.ts'): """import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'globalSurveyBlock',
  title: 'Küresel Anket Bloğu',
  type: 'object',
  fields: [
    defineField({
      name: 'surveyTitle',
      title: 'Anket Başlığı',
      type: 'string',
      validation: Rule => Rule.required(),
      description: 'Anketin ana başlığı (örn: Küresel Anket)'
    }),
    defineField({
      name: 'surveyDescription',
      title: 'Anket Açıklaması',
      type: 'text',
      rows: 3,
      description: 'Anket hakkında kısa bir açıklama veya soru.'
    }),
    defineField({
      name: 'options',
      title: 'Anket Seçenekleri',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({
            name: 'text',
            title: 'Seçenek Metni',
            type: 'string',
            validation: Rule => Rule.required(),
          })
        ],
        preview: {
          select: {
            title: 'text'
          }
        }
      }],
      validation: Rule => Rule.min(2).error('En az iki seçenek olmalıdır.'),
      description: 'Anket için seçenekleri ekleyin.'
    })
  ],
  preview: {
    select: {
      title: 'surveyTitle',
    },
    prepare(selection) {
      const { title } = selection;
      return {
        title: `📊 Anket: ${title || 'Başlıksız Anket'}`,
        subtitle: 'Global Survey Bileşeni',
      };
    },
  },
});""",

    os.path.join(SANITY_SCHEMAS_PATH, 'post.ts'): """import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'post',
  title: 'Yazı',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Başlık',
      type: 'string',
      validation: Rule => Rule.required(),
      description: 'Yazının ana başlığı.'
    }),
    defineField({
      name: 'slug',
      title: 'URL Yolu (Slug)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required(),
      description: 'Yazının URL yolu. Otomatik oluşur.'
    }),
    defineField({
      name: 'author',
      title: 'Yazar',
      type: 'reference',
      to: { type: 'author' },
      description: 'Yazının yazarı.'
    }),
    defineField({
      name: 'mainImage',
      title: 'Ana Görsel',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternatif Metin (SEO)',
          type: 'string',
          description: 'Resim için kısa açıklayıcı metin.'
        })
      ],
      description: 'Yazının kapak görseli.'
    }),
    defineField({
      name: 'categories',
      title: 'Kategoriler',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'category' } }],
      description: 'Yazının ait olduğu kategoriler.'
    }),
    defineField({
      name: 'publishedAt',
      title: 'Yayınlanma Tarihi',
      type: 'datetime',
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm',
        calendarTodayLabel: 'Bugün',
      },
      description: 'Yazının yayınlanma tarihi ve saati.'
    }),
    defineField({
      name: 'body',
      title: 'İçerik',
      type: 'array',
      of: [
        { type: 'block' },
        { type: 'image', options: { hotspot: true } },
      ],
      description: 'Yazının ana içeriği.'
    }),
    defineField({
      name: 'excerpt',
      title: 'Kısa Özet',
      type: 'text',
      rows: 3,
      description: 'Yazının kısa bir özeti (liste görünümlerinde kullanılır).'
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
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
    },
    prepare(selection) {
      const { author } = selection;
      return { ...selection, subtitle: author && `by ${author}` };
    },
  },
});""",

    os.path.join(SANITY_SCHEMAS_PATH, 'author.ts'): """import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'author',
  title: 'Yazar',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Adı',
      type: 'string',
      validation: Rule => Rule.required(),
      description: 'Yazarın tam adı.'
    }),
    defineField({
      name: 'slug',
      title: 'URL Yolu (Slug)',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: Rule => Rule.required(),
      description: 'Yazar profilinin URL yolu.'
    }),
    defineField({
      name: 'image',
      title: 'Profil Resmi',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Yazarın profil resmi.'
    }),
    defineField({
      name: 'bio',
      title: 'Biyografi',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [{ title: 'Normal', value: 'normal' }],
          lists: [],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
            annotations: [],
          },
        },
      ],
      description: 'Yazar hakkında kısa bir biyografi.'
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
    },
  },
});""",

    os.path.join(SANITY_SCHEMAS_PATH, 'category.ts'): """import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'category',
  title: 'Kategori',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Başlık',
      type: 'string',
      validation: Rule => Rule.required(),
      description: 'Kategorinin adı (örn: Haber, Analiz, Kültür).'
    }),
    defineField({
      name: 'description',
      title: 'Açıklama',
      type: 'text',
      rows: 3,
      description: 'Kategorinin kısa açıklaması.'
    }),
    defineField({
      name: 'slug',
      title: 'URL Yolu (Slug)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required(),
      description: 'Kategori sayfasının URL yolu.'
    }),
  ],
});""",

    os.path.join(SANITY_SCHEMAS_PATH, 'video.ts'): """import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'video',
  title: 'Video',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Başlık',
      type: 'string',
      validation: Rule => Rule.required(),
      description: 'Videonun başlığı.'
    }),
    defineField({
      name: 'slug',
      title: 'URL Yolu (Slug)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required(),
      description: 'Videonun URL yolu.'
    }),
    defineField({
      name: 'url',
      title: 'Video URL (YouTube/Vimeo vb.)',
      type: 'url',
      validation: Rule => Rule.required().uri({
        allowRelative: false,
        scheme: ['http', 'https']
      }),
      description: "Videonun doğrudan URL'si (örn: YouTube, Vimeo linki)."
    }),
    defineField({
      name: 'thumbnail',
      title: 'Video Küçük Resmi',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternatif Metin',
          type: 'string',
          description: 'Video küçük resmi için açıklayıcı metin.'
        })
      ],
      description: 'Videonun önizleme görseli.'
    }),
    defineField({
      name: 'description',
      title: 'Açıklama',
      type: 'text',
      rows: 3,
      description: 'Videonun kısa açıklaması.'
    }),
    defineField({
      name: 'publishedAt',
      title: 'Yayınlanma Tarihi',
      type: 'datetime',
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm',
        calendarTodayLabel: 'Bugün',
      },
      description: 'Videonun yayınlanma tarihi.'
    }),
    defineField({
      name: 'categories',
      title: 'Kategoriler',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'category' } }],
      description: 'Videonun ait olduğu kategoriler.'
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'thumbnail',
    },
  },
});""",

    os.path.join(SANITY_STUDIO_PATH, 'sanity.config.ts'): f"""// sanity.config.ts
import {{defineConfig}} from 'sanity';
import {{structureTool}} from 'sanity/structure';
import {{visionTool}} from '@sanity/vision';

// Tüm şemalarınızı buradan import edin (default export oldukları için {{}} kullanılmaz)
import page from './schemas/page';
import globalSurveyBlock from './schemas/globalSurveyBlock';
import post from './schemas/post';
import author from './schemas/author';
import category from './schemas/category';
import video from './schemas/video';

// Blok şemalarını blocks klasöründen import edin (named export oldukları için {{}} kullanılır)
import {{aiInsightBlock}} from './schemas/blocks/AIInsightBlock';
import {{articleGridBlock}} from './schemas/blocks/ArticleGridBlock';
import {{crisisTimelineBlock}} from './schemas/blocks/CrisisTimelineBlock';


export default defineConfig({{
  name: 'default',
  title: 'Pung Project CMS',
  projectId: '{SANITY_PROJECT_ID}', // Doğru Project ID'niz
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {{
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
  }},
  // PostCSS hatasını düzeltmek için Vite konfigürasyonu
  vite: {{
    css: {{
      postcss: {{
        plugins: [],
      }},
    }},
  }},
}});""",

    os.path.join(SANITY_STUDIO_PATH, 'sanity.cli.ts'): f"""// sanity.cli.ts
import {{defineCliConfig}} from 'sanity/cli';

export default defineCliConfig({{
  api: {{
    projectId: '{SANITY_PROJECT_ID}', // Doğru Project ID'niz
    dataset: 'production'
  }}
}});""",

    # Next.js Frontend Config
    os.path.join(NEXTJS_LIB_PATH, 'sanity.ts'): f"""// src/lib/sanity.ts
import {{createClient}} from '@sanity/client';
import type {{SanityClient}} from '@sanity/client';

export const client: SanityClient = createClient({{
  projectId: '{SANITY_PROJECT_ID}', // Doğru Project ID'niz
  dataset: 'production',
  apiVersion: '2025-06-15', // API versiyonunuzu güncelledik
  useCdn: true,
}});

// Sanity'den resim URL'leri oluşturmak için bir yardımcı fonksiyon (ileride kullanacağız)
// import imageUrlBuilder from '@sanity/image-url';
// const builder = imageUrlBuilder(client);
// export function urlFor(source: any) {{
//   return builder.image(source);
// }}""",

    # Next.js Component: PortableTextComponent.tsx
    os.path.join(NEXTJS_COMPONENTS_PATH, 'PortableTextComponent.tsx'): """import React from 'react';
import {{ PortableText, PortableTextComponents }} from '@portabletext/react';
import {{ PortableTextBlock }} from '@portabletext/types'; // PortableTextBlock tipi için

// Sanity'deki Portable Text içeriğini render etmek için özel bileşenler
const components: PortableTextComponents = {{
  types: {{
    // Örneğin, özel bir resim bileşeni ekleyebilirsiniz:
    // image: ({{value}}) => <img src={{value.asset.url}} alt={{value.alt}} className="w-full h-auto rounded-lg my-4" />,
    // Diğer özel blok tipleri buraya gelebilir.
  }},
  block: {{
    h1: ({{children}}) => <h1 className="text-4xl font-bold my-4">{{children}}</h1>,
    h2: ({{children}}) => <h2 className="text-3xl font-bold my-3">{{children}}</h2>,
    h3: ({{children}}) => <h3 className="text-2xl font-bold my-2">{{children}}</h3>,
    h4: ({{children}}) => <h4 className="text-xl font-bold my-2">{{children}}</h4>,
    normal: ({{children}}) => <p className="text-gray-700 my-1 leading-relaxed">{{children}}</p>,
    blockquote: ({{children}}) => <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 italic text-gray-600">{{children}}</blockquote>,
  }},
  list: {{
    bullet: ({{children}}) => <ul className="list-disc pl-5 my-2">{{children}}</ul>,
    number: ({{children}}) => <ol className="list-decimal pl-5 my-2">{{children}}</ol>,
  }},
  listItem: {{
    bullet: ({{children}}) => <li className="mb-1">{{children}}</li>,
    number: ({{children}}) => <li className="mb-1">{{children}}</li>,
  }},
  marks: {{
    link: ({{children, value}}) => (
      <a href={{value?.href}} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
        {{children}}
      </a>
    ),
    strong: ({{children}}) => <strong className="font-semibold">{{children}}</strong>,
    em: ({{children}}) => <em className="italic">{{children}}</em>,
  }},
}};

interface PortableTextComponentProps {{
  blocks: PortableTextBlock[];
}}

const PortableTextComponent: React.FC<PortableTextComponentProps> = ({{ blocks }} ) => {{
  if (!blocks || blocks.length === 0) {{
    return null;
  }}
  return <PortableText value={{blocks}} components={{components}} />;
}};

export default PortableTextComponent;""",

    # Next.js Component: PageContentRenderer.tsx (Yeni Dosya)
    os.path.join(NEXTJS_COMPONENTS_PATH, 'PageContentRenderer.tsx'): """import React from 'react';
import GlobalSurvey from './GlobalSurvey'; // components klasöründe olmalı
import ArticleGridBlock from './blocks/ArticleGridBlock'; // blocks klasöründen
import AIInsightBlock from './blocks/AIInsightBlock'; // blocks klasöründen
import CrisisTimelineBlock from './blocks/CrisisTimelineBlock'; // blocks klasöründen
import PortableTextComponent from './PortableTextComponent'; // components klasöründen
import Image from 'next/image'; // Next.js Image component'i kullanıldı
import {{ PortableTextBlock }} from '@portabletext/types'; // PortableTextBlock tipi için

interface SanityAsset {{
  url: string;
}}

interface SanityImageBlock {{
  _key: string;
  _type: 'image';
  asset?: SanityAsset;
}}

// PortableTextBlock'ın kendisi de bir SanityPortableTextBlock'dır
type SanityPortableTextBlockType = PortableTextBlock;

interface GlobalSurveyBlockData {{
  _key: string;
  _type: 'globalSurveyBlock';
  surveyTitle?: string;
  surveyDescription?: string;
  options?: Array<{{ _key: string; text: string; }}>;
}}

interface ArticleGridBlockData {{
  _key: string;
  _type: 'articleGridBlock';
  heading?: string; // Sanity şemasındaki ad 'heading' olarak düzeltildi
  categoryFilter?: {{ _id: string; title: string; slug: string; }};
  numberOfArticles?: number;
  showFeaturedOnly?: boolean;
}}

interface AIInsightBlockData {{
  _key: string;
  _type: 'aiInsightBlock';
  title?: string;
  summary?: string;
  details?: SanityPortableTextBlockType[];
}}

interface CrisisTimelineBlockData {{
  _key: string;
  _type: 'crisisTimelineBlock';
  timelineTitle?: string;
  description?: string;
  events?: Array<{{
    _key: string;
    date: string;
    eventTitle: string;
    eventDescription?: SanityPortableTextBlockType[];
    image?: {{ asset: SanityAsset; alt?: string }};
  }}>;
}}

type PageContentBlock =
  | SanityImageBlock
  | SanityPortableTextBlockType
  | GlobalSurveyBlockData
  | ArticleGridBlockData
  | AIInsightBlockData
  | CrisisTimelineBlockData;

interface PageContentRendererProps {{
  content: PageContentBlock[];
  articlesForGrid?: any[]; // ArticleGrid'e özel makaleler (daha spesifik bir Article[] olabilir)
}}

const PageContentRenderer: React.FC<PageContentRendererProps> = ({{ content, articlesForGrid }} ) => {{
  if (!content || content.length === 0) {{
    return null;
  }}

  return (
    <React.Fragment>
      {{content.map(block => {{
        if (!block || !block._key) {{
          console.warn("Geçersiz veya anahtarı olmayan içerik bloğu:", block);
          return null;
        }}

        switch (block._type) {{
          case 'block':
            return (
              <div key={{block._key}} className="my-4 text-left max-w-3xl mx-auto">
                <PortableTextComponent blocks={{block as SanityPortableTextBlockType}} />
              </div>
            );
          case 'image':
            const imageBlock = block as SanityImageBlock;
            return (
              <div key={{imageBlock._key}} className="my-4 flex justify-center">
                {{imageBlock.asset?.url && (
                  <Image
                    src={{imageBlock.asset.url}}
                    alt={{imageBlock.alt || "Sayfa İçeriği Resmi"}}
                    width={{800}} // Varsayılan genişlik
                    height={{600}} // Varsayılan yükseklik
                    layout="responsive" // Responsive tasarım için
                    className="w-full max-w-2xl h-auto rounded-lg shadow-lg"
                    onError={{(e: React.SyntheticEvent<HTMLImageElement, Event>) => {{ e.currentTarget.onerror = null; e.currentTarget.src = "https://placehold.co/800x600/CCCCCC/000000?text=Resim+Yok" }}}}
                  />
                )}}
              </div>
            );
          case 'globalSurveyBlock':
            const surveyBlock = block as GlobalSurveyBlockData;
            return (
              <div key={{surveyBlock._key}} className="my-8">
                <GlobalSurvey
                  surveyTitle={{surveyBlock.surveyTitle}}
                  surveyDescription={{surveyBlock.surveyDescription}}
                  options={{surveyBlock.options}}
                />
              </div>
            );
          case 'articleGridBlock':
            const articleGridBlock = block as ArticleGridBlockData;
            return (
              <div key={{articleGridBlock._key}} className="my-8">
                {{articleGridBlock.heading && <h2 className="text-3xl font-bold text-gray-800 mb-6">{{articleGridBlock.heading}}</h2>}}
                <ArticleGridBlock articles={{articlesForGrid}} heading={{articleGridBlock.heading}} />
              </div>
            );
          case 'aiInsightBlock':
            const aiInsightBlock = block as AIInsightBlockData;
            return (
                <div key={{aiInsightBlock._key}} className="my-8">
                    <AIInsightBlock title={{aiInsightBlock.title}} summary={{aiInsightBlock.summary}} details={{aiInsightBlock.details}} />
                </div>
            );
          case 'crisisTimelineBlock':
            const crisisTimelineBlock = block as CrisisTimelineBlockData;
            return (
                <div key={{crisisTimelineBlock._key}} className="my-8">
                    <CrisisTimelineBlock timelineTitle={{crisisTimelineBlock.timelineTitle}} description={{crisisTimelineBlock.description}} events={{crisisTimelineBlock.events}} />
                </div>
            );
          default:
            console.warn(`Bilinmeyen blok tipi: ${block._type}`, block);
            return null;
        }}
      }})}
    </React.Fragment>
  );
}};

export default PageContentRenderer;""",

    # Next.js Component Block: AIInsightBlock.tsx
    os.path.join(NEXTJS_BLOCKS_COMPONENTS_PATH, 'AIInsightBlock.tsx'): """import React from 'react';
import PortableTextComponent from '../PortableTextComponent';
import {{ PortableTextBlock }} from '@portabletext/types';

interface AIInsightBlockProps {{
  title?: string;
  summary?: string;
  details?: PortableTextBlock[];
}}

export const AIInsightBlock: React.FC<AIInsightBlockProps> = ({{ title, summary, details }} ) => {{
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">🧠 {{title || 'AI Insight Block'}}</h2>
      {{summary && <p className="text-gray-600 mb-3">{{summary}}</p>}}
      {{details && details.length > 0 && (
        <div className="text-gray-700">
          <PortableTextComponent blocks={{details}} />
        </div>
      )}}
    </div>
  );
}};

export default AIInsightBlock;""",

    # Next.js Component Block: ArticleGridBlock.tsx
    os.path.join(NEXTJS_BLOCKS_COMPONENTS_PATH, 'ArticleGridBlock.tsx'): """import React from 'react';
import Image from 'next/image';

interface Article {{
  _id: string;
  title: string;
  summary?: string;
  image?: string;
  slug?: string;
}}

interface ArticleGridBlockProps {{
  heading?: string;
  categoryFilter?: {{ _id: string; title: string; slug: string; }};
  numberOfArticles?: number;
  showFeaturedOnly?: boolean;
  articles?: Article[];
}}

export const ArticleGridBlock: React.FC<ArticleGridBlockProps> = ({{ heading, articles }} ) => {{
  if (!articles || articles.length === 0) {{
    return (
      <div className="text-center py-8 text-gray-600">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{{heading || 'Makaleler'}}</h2>
        <p>Henüz makale bulunamadı veya yükleniyor.</p>
      </div>
    );
  }}

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      {{heading && <h2 className="text-2xl font-bold text-gray-800 mb-6">{{heading}}</h2>}}
      <div className="grid md:grid-cols-3 gap-6">
        {{articles.map(article => (
          <div key={article._id} className="bg-gray-50 rounded-2xl shadow-md overflow-hidden">
            {{article.image ? (
              <Image
                src={article.image}
                alt={article.title}
                width={600}
                height={400}
                layout="responsive"
                className="w-full h-48 object-cover"
                onError={{(e: React.SyntheticEvent<HTMLImageElement, Event>) => {{ e.currentTarget.onerror = null; e.currentTarget.src = "https://placehold.co/600x400/CCCCCC/000000?text=Resim+Yok" }}}}
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">Resim Yok</div>
            )}}
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-800">{{article.title}}</h3>
              <p className="text-sm text-gray-600 mt-1">{{article.summary}}</p>
            </div>
          </div>
        ))}}
      </div>
    </div>
  );
}};

export default ArticleGridBlock;""",

    # Next.js Component Block: CrisisTimelineBlock.tsx
    os.path.join(NEXTJS_BLOCKS_COMPONENTS_PATH, 'CrisisTimelineBlock.tsx'): """import React from 'react';
import Image from 'next/image';
import PortableTextComponent from '../PortableTextComponent';
import {{ PortableTextBlock }} from '@portabletext/types';

interface TimelineEvent {{
  _key: string;
  date: string;
  eventTitle: string;
  eventDescription?: PortableTextBlock[];
  image?: {{
    asset: {{
      url: string;
    }};
    alt?: string;
  }};
}}

interface CrisisTimelineBlockProps {{
  timelineTitle?: string;
  description?: string;
  events?: TimelineEvent[];
}}

export const CrisisTimelineBlock: React.FC<CrisisTimelineBlockProps> = ({{ timelineTitle, description, events }} ) => {{
  if (!events || events.length === 0) {{
    return (
      <div className="text-center py-8 text-gray-600">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{{timelineTitle || 'Kriz Zaman Çizelgesi'}}</h2>
        <p>Henüz olay bulunamadı veya yükleniyor.</p>
      </div>
    );
  }}

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">{{timelineTitle || 'Kriz Zaman Çizelgesi'}}</h2>
      {{description && <p className="text-gray-600 mb-6">{{description}}</p>}}

      <ul className="border-l-4 border-red-500 pl-6 space-y-8">
        {{events.map(event => (
          <li key={event._key} className="relative">
            <div className="absolute -left-6 top-0 w-4 h-4 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold"></div>
            <p className="text-sm text-gray-500 mb-1">{{new Date(event.date).toLocaleDateString()}}</p>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{{event.eventTitle}}</h3>
            {{event.eventDescription && event.eventDescription.length > 0 && (
              <div className="text-gray-700">
                <PortableTextComponent blocks={{event.eventDescription}} />
              </div>
            )}}
            {{event.image?.asset?.url && (
              <div className="mt-4">
                <Image
                  src={event.image.asset.url}
                  alt={event.image.alt || event.eventTitle}
                  width={600}
                  height={400}
                  layout="responsive"
                  className="w-full h-auto rounded-lg"
                  onError={{(e: React.SyntheticEvent<HTMLImageElement, Event>) => {{ e.currentTarget.onerror = null; e.currentTarget.src = "https://placehold.co/600x400/CCCCCC/000000?text=Resim+Yok" }}}}
                />
              </div>
            )}}
          </li>
        ))}}
      </ul>
    </div>
  );
}};

export default CrisisTimelineBlock;""",

    # Next.js App Router: src/app/page.tsx
    os.path.join(NEXTJS_APP_PATH, 'page.tsx'): f"""import {{ createClient }} from '@sanity/client';
import PageContentRenderer from '../../components/PageContentRenderer'; // Yeni oluşturduğumuz renderer

// Sanity Client konfigürasyonu
const client = createClient({{
  projectId: '{SANITY_PROJECT_ID}', // Sanity projenizin Project ID'si
  dataset: 'production', // Sanity projenizin Dataset adı
  apiVersion: '2025-06-15', // API versiyonunuz
  useCdn: true, // Verileri hızlı çekmek için CDN kullanın
}});

interface PageData {{
  title?: string;
  description?: string;
  content: any[]; // PageContentRenderer'ın beklediği PageContentBlock[]
}}

interface HomeProps {{
  pageData: PageData | null;
  articlesForGrid: any[]; // ArticleGrid'e gidecek makaleler
  fetchError?: string;
}}

// App Router'da veri çekme doğrudan server component'in içinde veya ayrı bir async fonksiyonda yapılır.
// getServerSideProps yerine doğrudan 'async' fonksiyon kullanıyoruz.
async function getHomePageData(): Promise<HomeProps> {{
  console.log("--------------------------------------------------");
  console.log(">>> ANA SAYFA - Veri çekme başlıyor <<<");
  console.log("--------------------------------------------------");

  const pageQuery = `*[_type == "page" && slug.current == "anasayfa"][0]{{
    title,
    description,
    content[]{{
      _key,
      _type,
      _type == "globalSurveyBlock" => {{
        surveyTitle,
        surveyDescription,
        options[]{{
          _key,
          text
        }}
      }},
      _type == "articleGridBlock" => {{
        heading, // Şemadaki 'heading' adı kullanıldı
        categoryFilter->{{_id, title, slug}},
        numberOfArticles,
        showFeaturedOnly
      }},
      _type == "aiInsightBlock" => {{
        title,
        summary,
        details[]{{
          _key,
          _type,
          children[]{{text}}
        }}
      }},
      _type == "crisisTimelineBlock" => {{
        timelineTitle,
        description,
        events[]{{
          _key,
          date,
          eventTitle,
          eventDescription[]{{children[]{{text}}}},
          image{{asset->{{url}}, alt}}
        }}
      }},
      _type == "block" => {{
        children[]{{
          _key,
          text
        }}
      }},
      _type == "image" => {{
          asset->{{url}}
      }}
    }}
  }}`;

  let pageData: PageData | null = null;
  let articlesForGrid: any[] = [];
  let fetchError: string | undefined = undefined;

  try {{
    pageData = await client.fetch(pageQuery);
    console.log(">>> ANA SAYFA - 1. Sanity'den çekilen sayfa verisi (pageData):", JSON.stringify(pageData, null, 2));

    if (pageData && pageData.content) {{
      const articleGridBlock = pageData.content.find(
        (block: any) => block._type === 'articleGridBlock'
      );
      console.log(">>> ANA SAYFA - 2. Bulunan ArticleGridBlock:", JSON.stringify(articleGridBlock, null, 2));

      if (articleGridBlock) {{
        let articleFilters = `_type == "post"`;
        if (articleGridBlock.categoryFilter && articleGridBlock.categoryFilter._id) {{
            articleFilters += ` && references("{{articleGridBlock.categoryFilter._id}}")`;
            console.log(">>> ANA SAYFA - 3. Kategori filtresi ID:", articleGridBlock.categoryFilter._id);
        }} else {{
            console.log(">>> ANA SAYFA - ArticleGridBlock için kategori filtresi bulunamadı veya eksik. Tüm postlar çekilecek.");
        }}

        const articleQuery = `*[{{articleFilters}}] | order(publishedAt desc){{
          articleGridBlock.numberOfArticles ? `[0...{{articleGridBlock.numberOfArticles}}]` : ''
        }}{{{{
          _id,
          title,
          "slug": slug.current,
          "summary": pt::text(body),
          "image": mainImage.asset->url
        }}}}`; // Düzeltme burada yapıldı: {{ ve }} ile çevreledik
        console.log(">>> ANA SAYFA - 4. Makaleler için oluşturulan GROQ sorgusu:", articleQuery);

        articlesForGrid = await client.fetch(articleQuery);
        console.log(">>> ANA SAYFA - 5. Sanity'den çekilen makaleler (articlesForGrid):", JSON.stringify(articlesForGrid, null, 2));
      }}
    }} else if (!pageData) {{
        console.log(">>> ANA SAYFA - Sanity'den 'anasayfa' slug'ına sahip sayfa bulunamadı. Lütfen Sanity Studio'da bu sayfayı oluşturup yayımlayın.");
        fetchError = "Sanity'den 'anasayfa' içeriği bulunamadı.";
    }}
  }} catch (error: any) {{ // Hata objesini any olarak yakalayıp mesajına erişmek için
    console.error(">>> ANA SAYFA - HATA: Sanity verileri çekilirken hata oluştu:", error);
    fetchError = error.message;
  }}

  console.log("--------------------------------------------------");
  console.log(">>> ANA SAYFA - Veri çekme tamamlandı <<<");
  console.log("--------------------------------------------------");

  return {{
    pageData,
    articlesForGrid,
    fetchError
  }};
}}

// Ana sayfa bileşeni (Server Component)
export default async function Home() {{
  const {{ pageData, articlesForGrid, fetchError }} = await getHomePageData();

  return (
    <div className="bg-white text-gray-900 min-h-screen p-6">
      <header className="text-center py-8">
        <h1 className="text-4xl font-extrabold mb-4 text-gray-800">
          {{pageData?.title || 'Ana Sayfa (Varsayılan)'}}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {{pageData?.description || 'Platformun ana içeriği.'}}
        </p>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-12">
        {{fetchError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Hata!</strong>
            <span className="block sm:inline"> {{fetchError}}</span>
            <p className="text-sm mt-2">Lütfen Sanity Studio'da 'anasayfa' slug'ına sahip bir 'Page' belgesi oluşturduğunuzdan ve yayımladığınızdan emin olun.</p>
          </div>
        )}}

        {{!fetchError && !pageData && (
          <div className="text-center py-12 text-gray-600">
            <p className="text-xl">Sayfa içeriği bulunamadı veya yükleniyor.</p>
            <p className="text-sm mt-2">Lütfen Sanity Studio'da 'anasayfa' slug'ına sahip bir sayfa oluşturun ve içerik ekleyin.</p>
          </div>
        )}}

        {{pageData?.content && pageData.content.length > 0 && (
          <PageContentRenderer content={{pageData.content}} articlesForGrid={{articlesForGrid}} />
        )}}
      </main>

      <footer className="mt-12 text-center text-gray-600">
        <p>PUNG Platformu - CMS ile yönetilen ana sayfa</p>
      </footer>
    </div>
  );
}};""",

    # Next.js App Router: src/app/page/[slug]/page.tsx
    os.path.join(NEXTJS_APP_PATH, 'page', '[slug]', 'page.tsx'): f"""import {{ createClient }} from '@sanity/client';
import {{ PortableTextBlock }} from '@portabletext/types';
import PageContentRenderer from '../../../../components/PageContentRenderer';

// Sanity Client konfigürasyonu
const client = createClient({{
  projectId: '{SANITY_PROJECT_ID}',
  dataset: 'production',
  apiVersion: '2025-06-15',
  useCdn: true,
}});

interface SanityPageData {{
  title?: string;
  description?: string;
  content: PortableTextBlock[];
}}

interface DynamicPageProps {{
  params: {{
    slug: string;
  }};
}}

// Dinamik route'lar için veri çekme fonksiyonu
async function getDynamicPageData(slug: string) {{
  console.log(`--------------------------------------------------`);
  console.log(`>>> DİNAMİK SAYFA ({{slug}}) - Veri çekme başlıyor <<<`);
  console.log(`--------------------------------------------------`);

  const pageQuery = `*[_type == "page" && slug.current == $slug][0]{{
    title,
    description,
    content[]{{
      _key,
      _type,
      _type == "globalSurveyBlock" => {{
        surveyTitle,
        surveyDescription,
        options[]{{
          _key,
          text
        }}
      }},
      _type == "articleGridBlock" => {{
        heading, // Şemadaki 'heading' adı kullanıldı
        categoryFilter->{{_id, title, slug}},
        numberOfArticles,
        showFeaturedOnly
      }},
      _type == "aiInsightBlock" => {{
        title,
        summary,
        details[]{{
          _key,
          _type,
          children[]{{text}}
        }}
      }},
      _type == "crisisTimelineBlock" => {{
        timelineTitle,
        description,
        events[]{{
          _key,
          date,
          eventTitle,
          eventDescription[]{{children[]{{text}}}},
          image{{asset->{{url}}, alt}}
        }}
      }},
      _type == "block" => {{
        children[]{{
          _key,
          text
        }}
      }},
      _type == "image" => {{
          asset->{{url}}
      }}
    }}
  }}`;

  let pageData: SanityPageData | null = null;
  let articlesForGrid: any[] = [];
  let fetchError: string | undefined = undefined;

  try {{
    pageData = await client.fetch(pageQuery, {{ slug }});
    console.log(`>>> DİNAMİK SAYFA ({{slug}}) - 1. Sanity'den çekilen sayfa verisi (pageData):`, JSON.stringify(pageData, null, 2));

    if (pageData && pageData.content) {{
      const articleGridBlock = pageData.content.find(
        (block: any) => block._type === 'articleGridBlock'
      );
      console.log(`>>> DİNAMİK SAYFA ({{slug}}) - 2. Bulunan ArticleGridBlock:`, JSON.stringify(articleGridBlock, null, 2));

      if (articleGridBlock) {{
        let articleFilters = `_type == "post"`;
        if (articleGridBlock.categoryFilter && articleGridBlock.categoryFilter._id) {{
            articleFilters += ` && references("{{articleGridBlock.categoryFilter._id}}")`;
            console.log(`>>> DİNAMİK SAYFA ({{slug}}) - 3. Kategori filtresi ID:`, articleGridBlock.categoryFilter._id);
        }} else {{
            console.log(`>>> DİNAMİK SAYFA ({{slug}}) - ArticleGridBlock için kategori filtresi bulunamadı veya eksik. Tüm postlar çekilecek.`);
        }}

        const articleQuery = `*[{{articleFilters}}] | order(publishedAt desc){{{{
          articleGridBlock.numberOfArticles ? `[0...{{articleGridBlock.numberOfArticles}}]` : ''
        }}}{{{{
          _id,
          title,
          "slug": slug.current,
          "summary": pt::text(body),
          "image": mainImage.asset->url
        }}}}`; // Düzeltme burada yapıldı: {{ ve }} ile çevreledik
        console.log(`>>> DİNAMİK SAYFA ({{slug}}) - 4. Makaleler için oluşturulan GROQ sorgusu:`, articleQuery);

        articlesForGrid = await client.fetch(articleQuery);
        console.log(`>>> DİNAMİK SAYFA ({{slug}}) - 5. Sanity'den çekilen makaleler (articlesForGrid):`, JSON.stringify(articlesForGrid, null, 2));
      }}
    }} else if (!pageData) {{
        console.log(`>>> DİNAMİK SAYFA ({{slug}}) - Sanity'den '{{slug}}' slug'ına sahip sayfa bulunamadı. Lütfen Sanity Studio'da bu sayfayı oluşturup yayımlayın.`);
        fetchError = `Sanity'den '{{slug}}' içeriği bulunamadı.`;
    }}
  }} catch (error: any) {{
    console.error(`>>> DİNAMİK SAYFA ({{slug}}) - HATA: Sanity verileri çekilirken hata oluştu:`, error);
    fetchError = error.message;
  }}

  console.log(`--------------------------------------------------`);
  console.log(`>>> DİNAMİK SAYFA ({{slug}}) - Veri çekme tamamlandı <<<`);
  console.log(`--------------------------------------------------`);

  return {{ pageData, articlesForGrid, fetchError }};
}}

// Dinamik rota sayfası bileşeni (Server Component)
export default async function DynamicPage({{ params }}: DynamicPageProps) {{
  const {{ slug }} = params;
  const {{ pageData, articlesForGrid, fetchError }} = await getDynamicPageData(slug);

  if (fetchError) {{
    return (
      <div className="bg-red-800 text-red-100 min-h-screen p-6 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">Hata</h1>
        <p className="text-lg text-red-200">Veri çekme hatası: {{fetchError}}</p>
        <p className="text-sm mt-2 text-red-300">
          Lütfen Sanity Studio'da '{{slug}}' slug'ına sahip bir 'Page' belgesi oluşturduğunuzdan ve yayımladığınızdan emin olun.
        </p>
      </div>
    );
  }}

  if (!pageData) {{
    return (
      <div className="bg-gray-900 text-white min-h-screen p-6 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">Sayfa Bulunamadı</h1>
        <p className="text-lg text-gray-300">Belirtilen slug ile sayfa içeriği bulunamadı.</p>
        <p className="text-sm mt-2 text-gray-400">
          Lütfen Sanity Studio'da '{{slug}}' slug'ına sahip bir 'Page' belgesi oluşturup yayımladığınızdan emin olun.
        </p>
      </div>
    );
  }}

  return (
    <div className="bg-white text-gray-900 min-h-screen p-6">
      <header className="text-center py-8">
        <h1 className="text-4xl font-extrabold mb-4 text-gray-800">
          {{pageData.title || `Sayfa: {{slug}}`}}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {{pageData.description || 'Sayfa açıklaması bulunamadı.'}}
        </p>
      </header>

          <main className="container mx-auto px-4 py-8 space-y-12">
            {{pageData.content && pageData.content.length > 0 ? (
              <PageContentRenderer content={{pageData.content}} articlesForGrid={{articlesForGrid}} />
            ) : (
              <div className="text-center py-12 text-gray-600">
                <p className="text-xl">Sanity Studio'da bu sayfa için içerik bulunamadı.</p>
                <p className="text-sm mt-2">Lütfen Sanity Studio'da '{{slug}}' sayfanıza içerik blokları ekleyin ve yayımlayın.</p>
              </div>
            )}}
          </main>

          <footer className="mt-12 text-center text-gray-600">
            <p>PUNG Platformu - Dinamik İçerik Sayfası</p>
          </footer>
        </div>
      );
    }};""",
}

# --- Betik Fonksiyonları ---
def create_directories():
    """Gerekli dizinleri oluşturur."""
    os.makedirs(SANITY_BLOCKS_PATH, exist_ok=True)
    os.makedirs(NEXTJS_LIB_PATH, exist_ok=True)
    os.makedirs(NEXTJS_COMPONENTS_PATH, exist_ok=True) # Yeni eklenen dizin
    os.makedirs(NEXTJS_BLOCKS_COMPONENTS_PATH, exist_ok=True) # Yeni eklenen dizin
    os.makedirs(os.path.join(NEXTJS_APP_PATH, 'page', '[slug]'), exist_ok=True) # Yeni eklenen dizin

    print(f"Dizinler oluşturuldu: {SANITY_BLOCKS_PATH}, {NEXTJS_LIB_PATH}, {NEXTJS_COMPONENTS_PATH}, {NEXTJS_BLOCKS_COMPONENTS_PATH}, {os.path.join(NEXTJS_APP_PATH, 'page', '[slug]')}")

def write_files():
    """Tanımlanan dosya içeriklerini diske yazar."""
    for file_path, content in FILES_TO_CREATE.items():
        try:
            # Klasör yolu mevcut değilse oluştur
            os.makedirs(os.path.dirname(file_path), exist_ok=True)
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Oluşturuldu/Güncellendi: {file_path}")
        except IOError as e:
            print(f"HATA: Dosya yazılırken sorun oluştu {file_path}: {e}")
        except Exception as e:
            print(f"Beklenmeyen bir hata oluştu: {e}")

def main():
    print("--- PUNG Sanity Şema ve Next.js Frontend Kurulumu Başladı ---")
    create_directories()
    write_files()
    print("--- PUNG Sanity Şema ve Next.js Frontend Kurulumu Tamamlandı ---")
    print("\nŞimdi yapmanız gerekenler:")
    print("1. Terminali açın ve projenizin ana kök dizinine gidin:")
    print(f"   cd {PROJECT_ROOT}")
    print("2. Sanity Studio için bağımlılıkları yükleyin ve Sanity Studio'yu başlatın:")
    print("   cd studio")
    print("   npm install # veya yarn install")
    print("   npm run dev # veya yarn dev (Sanity Studio'yu kontrol etmek için)")
    print("3. Frontend (Next.js) uygulamanız için bağımlılıkları yükleyin:")
    print("   cd ..") # Studio klasöründen çıkın
    print("   cd frontend")
    print("   npm install # veya yarn install")
    print("   npm run dev # veya yarn dev (Yerel frontend'i kontrol etmek için)")
    print("4. Vercel'e dağıtım için, projenizin ana dizininde (pung-clean) olduğunuzdan emin olun.")
    print("5. Vercel dashboard'unuza gidin ve hem frontend hem de studio için 'Root Directory' ayarlarını kontrol edin:")
    print("   - Frontend projeniz için 'Root Directory': 'frontend'")
    print("   - Sanity Studio projeniz için (ayrı bir Vercel projesi olmalı) 'Root Directory': 'studio'")
    print("6. Her iki Vercel projesi için de gerekli ortam değişkenlerini (SANITY_STUDIO_PROJECT_ID, NEXT_PUBLIC_SANITY_PROJECT_ID vb.) Vercel'de tanımladığınızdan emin olun.")
    print("7. Vercel'de projelerinizi yeniden dağıtın.")
    print("\nİyi çalışmalar!")

if __name__ == "__main__":
    main()
