import os
import textwrap

# --- Kofigürasyonlar ---
# Betiği çalıştırdığınız dizine göre proje kök dizinini ayarlayın.
# Varsayımımız: pung-clean projesi C:\frontend içinde ve bu betik C:\frontend'de çalıştırılıyor.
# Eğer farklı bir dizinde çalıştırıyorsanız, PROJECT_ROOT'u buna göre güncelleyin.
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__)) # Betiğin çalıştığı dizin

SANITY_STUDIO_PATH = os.path.join(PROJECT_ROOT, 'sanity')
SANITY_SCHEMAS_PATH = os.path.join(SANITY_STUDIO_PATH, 'schemas')
SANITY_BLOCKS_PATH = os.path.join(SANITY_SCHEMAS_PATH, 'blocks')
NEXTJS_SRC_PATH = os.path.join(PROJECT_ROOT, 'src')
NEXTJS_LIB_PATH = os.path.join(NEXTJS_SRC_PATH, 'lib')
NEXTJS_TYPES_PATH = os.path.join(NEXTJS_SRC_PATH, 'types')
NEXTJS_COMPONENTS_PATH = os.path.join(NEXTJS_SRC_PATH, 'components')
NEXTJS_BLOCK_COMPONENTS_PATH = os.path.join(NEXTJS_COMPONENTS_PATH, 'blocks')
NEXTJS_APP_DIR_PATH = os.path.join(NEXTJS_SRC_PATH, 'app', 'page') # App Router için dinamik sayfa yolu
# Eğer Pages Router kullanılıyorsa:
# NEXTJS_PAGES_PATH = os.path.join(NEXTJS_SRC_PATH, 'pages')


# KULLANILACAK SANITY PROJECT ID
SANITY_PROJECT_ID = '13f1s0mc'
# --- Konfigürasyon Sonu ---

# --- Şema ve Konfigürasyon Dosyaları İçerikleri ---
# Tüm şema dosyalarını ve ana konfigürasyon dosyalarını burada tanımlıyoruz.

FILES_TO_CREATE = {
    # --- Sanity Studio Schemas (TypeScript) ---
    os.path.join(SANITY_BLOCKS_PATH, 'AIInsightBlock.ts'): textwrap.dedent("""\
        import { defineType } from 'sanity';

        export const aiInsightBlock = defineType({
          name: 'aiInsightBlock',
          title: 'AI Insight Block',
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Başlık',
              type: 'string',
              validation: Rule => Rule.required(),
              description: 'AI Destekli İçgörü Bloğunun başlığı.'
            },
            {
              name: 'summary',
              title: 'Özet',
              type: 'text',
              rows: 3,
              description: 'AI içgörüsünün kısa bir özeti.'
            },
            {
              name: 'details',
              title: 'Detaylar',
              type: 'array',
              of: [{ type: 'block' }], // Portable Text destekli
              description: 'İçgörünün detaylı açıklaması.'
            },
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
        });"""),

    os.path.join(SANITY_BLOCKS_PATH, 'ArticleGridBlock.ts'): textwrap.dedent("""\
        import { defineField, defineType } from 'sanity';

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
        });"""),

    os.path.join(SANITY_BLOCKS_PATH, 'CrisisTimelineBlock.ts'): textwrap.dedent("""\
        import { defineField, defineType } from 'sanity';

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
                {
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
                      of: [{ type: 'block' }], // Portable Text destekli
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
                title: `⏳ Zaman Çizelgesi: ${title || 'Başlıksel Zaman Çizelgesi'}`,
                subtitle: `${eventCount} olay içeriyor`,
              };
            },
          },
        });"""),

    os.path.join(SANITY_SCHEMAS_PATH, 'page.ts'): textwrap.dedent("""\
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
        });"""),

    os.path.join(SANITY_SCHEMAS_PATH, 'globalSurveyBlock.ts'): textwrap.dedent("""\
        import { defineField, defineType } from 'sanity';

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
        });"""),

    os.path.join(SANITY_SCHEMAS_PATH, 'post.ts'): textwrap.dedent("""\
        import { defineField, defineType } from 'sanity';

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
        });"""),

    os.path.join(SANITY_SCHEMAS_PATH, 'author.ts'): textwrap.dedent("""\
        import { defineField, defineType } from 'sanity';

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
        });"""),

    os.path.join(SANITY_SCHEMAS_PATH, 'category.ts'): textwrap.dedent("""\
        import { defineField, defineType } from 'sanity';

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
        });"""),

    os.path.join(SANITY_SCHEMAS_PATH, 'video.ts'): textwrap.dedent("""\
        import { defineField, defineType } from 'sanity';

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
              description: 'Videonun doğrudan URL\'si (örn: YouTube, Vimeo linki).'
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
        });"""),

    os.path.join(SANITY_STUDIO_PATH, 'sanity.config.ts'): textwrap.dedent(f"""\
        // sanity.config.ts
        import {{ defineConfig }} from 'sanity';
        import {{ structureTool }} from 'sanity/structure';
        import {{ visionTool }} from '@sanity/vision';

        // Tüm temel şemalarınızı buradan import edin
        import page from './schemas/page';
        import globalSurveyBlock from './schemas/globalSurveyBlock';
        import post from './schemas/post';
        import author from './schemas/author';
        import category from './schemas/category';
        import video from './schemas/video';

        // Blok şemalarını blocks klasöründen import edin
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
        }});"""),

    os.path.join(SANITY_STUDIO_PATH, 'sanity.cli.ts'): textwrap.dedent(f"""\
        // sanity.cli.ts
        import {{ defineCliConfig }} from 'sanity/cli';

        export default defineCliConfig({{
          api: {{
            projectId: '{SANITY_PROJECT_ID}', // Doğru Project ID'niz
            dataset: 'production'
          }}
        }});"""),

    # --- Next.js Frontend TypeScript Dosyaları ---
    os.path.join(NEXTJS_LIB_PATH, 'sanity.ts'): textwrap.dedent(f"""\
        // src/lib/sanity.ts
        import {{ createClient }} from '@sanity/client';
        import type {{ SanityClient }} from '@sanity/client';

        export const client: SanityClient = createClient({{
          projectId: '{SANITY_PROJECT_ID}', // Doğru Project ID'niz
          dataset: 'production',
          apiVersion: '2023-05-03',
          useCdn: true,
        }});

        // Sanity'den resim URL'leri oluşturmak için bir yardımcı fonksiyon (ileride kullanacağız)
        // import imageUrlBuilder from '@sanity/image-url';
        // const builder = imageUrlBuilder(client);
        // export function urlFor(source: any) {{
        //   return builder.image(source);
        // }}"""),

    os.path.join(NEXTJS_TYPES_PATH, 'sanity.d.ts'): textwrap.dedent("""\
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
        """),

    os.path.join(NEXTJS_COMPONENTS_PATH, 'PortableTextComponent.tsx'): textwrap.dedent("""\
        import React from 'react';
        import { PortableText, PortableTextComponents } from '@portabletext/react';
        import { PortableTextBlock } from '@portabletext/types'; // PortableTextBlock tipi için
        import Image from 'next/image'; // Next.js Image bileşeni için

        // Sanity'deki Portable Text içeriğini render etmek için özel bileşenler
        const components: PortableTextComponents = {
          types: {
            image: ({ value }) => (
              value.asset && value.asset.url ? (
                <Image
                  src={value.asset.url}
                  alt={value.alt || 'Resim'}
                  width={700} // Optimizasyon için genişlik
                  height={400} // Optimizasyon için yükseklik
                  layout="responsive" // Responsive tasarım için
                  className="w-full h-auto rounded-lg my-4"
                />
              ) : null
            ),
            // Diğer özel blok tipleri buraya gelebilir.
          },
          block: {
            h1: ({children}) => <h1 className="text-4xl font-bold my-4 text-gray-900">{children}</h1>,
            h2: ({children}) => <h2 className="text-3xl font-bold my-3 text-gray-800">{children}</h2>,
            h3: ({children}) => <h3 className="text-2xl font-bold my-2 text-gray-700">{children}</h3>,
            h4: ({children}) => <h4 className="text-xl font-bold my-2 text-gray-600">{children}</h4>,
            normal: ({children}) => <p className="text-gray-700 my-1 leading-relaxed">{children}</p>,
            blockquote: ({children}) => <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 italic text-gray-600">{children}</blockquote>,
          },
          list: {
            bullet: ({children}) => <ul className="list-disc pl-5 my-2">{children}</ul>,
            number: ({children}) => <ol className="list-decimal pl-5 my-2">{children}</ol>,
          },
          listItem: {
            bullet: ({children}) => <li className="mb-1">{children}</li>,
            number: ({children}) => <li className="mb-1">{children}</li>,
          },
          marks: {
            link: ({children, value}) => (
              <a href={value?.href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {children}
              </a>
            ),
            strong: ({children}) => <strong className="font-semibold">{children}</strong>,
            em: ({children}) => <em className="italic">{children}</em>,
          },
        };

        interface PortableTextComponentProps {
          blocks: PortableTextBlock[];
        }

        const PortableTextComponent: React.FC<PortableTextComponentProps> = ({ blocks }) => {
          if (!blocks || blocks.length === 0) {
            return null;
          }
          return <PortableText value={blocks} components={components} />;
        };

        export default PortableTextComponent;
        """),

    os.path.join(NEXTJS_BLOCK_COMPONENTS_PATH, 'AIInsightBlock.tsx'): textwrap.dedent("""\
        import React from 'react';
        import PortableTextComponent from '../PortableTextComponent';
        import { PortableTextBlock } from '@portabletext/types';

        interface AIInsightBlockProps {
          title?: string;
          summary?: string;
          details?: PortableTextBlock[];
        }

        export const AIInsightBlock: React.FC<AIInsightBlockProps> = ({ title, summary, details }) => {
          return (
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">🧠 {title || 'AI Insight Block'}</h2>
              {summary && <p className="text-gray-600 mb-3">{summary}</p>}
              {details && details.length > 0 && (
                <div className="text-gray-700">
                  <PortableTextComponent blocks={details} />
                </div>
              )}
            </div>
          );
        };

        export default AIInsightBlock;
        """),

    os.path.join(NEXTJS_BLOCK_COMPONENTS_PATH, 'ArticleGridBlock.tsx'): textwrap.dedent("""\
        import React from 'react';
        import Image from 'next/image';
        import { SanityArticle } from '../../src/types/sanity'; // SanityArticle tipini import ettik

        interface ArticleGridBlockProps {
          heading?: string;
          articles?: SanityArticle[]; // SanityArticle[] tipini kullanıyoruz
        }

        export const ArticleGridBlock: React.FC<ArticleGridBlockProps> = ({ heading, articles }) => {
          if (!articles || articles.length === 0) {
            return (
              <div className="bg-white p-6 rounded-2xl shadow-lg text-center text-gray-600">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{heading || 'Makaleler'}</h2>
                <p>Henüz makale bulunamadı veya yükleniyor.</p>
              </div>
            );
          }

          return (
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              {heading && <h2 className="text-2xl font-bold text-gray-800 mb-6">{heading}</h2>}
              <div className="grid md:grid-cols-3 gap-6">
                {articles.map(article => (
                  <div key={article._id} className="bg-gray-50 rounded-2xl shadow-md overflow-hidden">
                    {article.image ? (
                      <Image
                        src={article.image}
                        alt={article.title || 'Makale Resmi'}
                        width={600}
                        height={400}
                        layout="responsive"
                        className="w-full h-48 object-cover"
                        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://placehold.co/600x400/CCCCCC/000000?text=Resim+Yok" }}
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">Resim Yok</div>
                    )}
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-gray-800">{article.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{article.summary}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        };

        export default ArticleGridBlock;
        """),

    os.path.join(NEXTJS_BLOCK_COMPONENTS_PATH, 'CrisisTimelineBlock.tsx'): textwrap.dedent("""\
        import React from 'react';
        import Image from 'next/image';
        import PortableTextComponent from '../PortableTextComponent';
        import { PortableTextBlock } from '@portabletext/types';
        import { CrisisTimelineEventData } from '../../src/types/sanity'; // Yeni tipimizi import ettik

        interface CrisisTimelineBlockProps {
          timelineTitle?: string;
          description?: string;
          events?: CrisisTimelineEventData[]; // Yeni tipimizi kullanıyoruz
        }

        export const CrisisTimelineBlock: React.FC<CrisisTimelineBlockProps> = ({ timelineTitle, description, events }) => {
          if (!events || events.length === 0) {
            return (
              <div className="bg-white p-6 rounded-2xl shadow-lg text-center text-gray-600">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{timelineTitle || 'Kriz Zaman Çizelgesi'}</h2>
                <p>Henüz olay bulunamadı veya yükleniyor.</p>
              </div>
            );
          }

          return (
            <div className="bg-white p-6 rounded-2xl shadow-lg space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">{timelineTitle || 'Kriz Zaman Çizelgesi'}</h2>
              {description && <p className="text-gray-600 mb-6">{description}</p>}

              <ul className="border-l-4 border-red-500 pl-6 space-y-8">
                {events.map(event => (
                  <li key={event._key} className="relative">
                    <div className="absolute -left-6 top-0 w-4 h-4 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold"></div>
                    <p className="text-sm text-gray-500 mb-1">{new Date(event.date).toLocaleDateString()}</p>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{event.eventTitle}</h3>
                    {event.eventDescription && event.eventDescription.length > 0 && (
                      <div className="text-gray-700">
                        <PortableTextComponent blocks={event.eventDescription} />
                      </div>
                    )}
                    {event.image?.asset?.url && (
                      <div className="mt-4">
                        <Image
                          src={event.image.asset.url}
                          alt={event.image.alt || event.eventTitle}
                          width={600}
                          height={400}
                          layout="responsive"
                          className="w-full h-auto rounded-lg"
                          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://placehold.co/600x400/CCCCCC/000000?text=Resim+Yok" }}
                        />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          );
        };

        export default CrisisTimelineBlock;
        """),

    os.path.join(NEXTJS_COMPONENTS_PATH, 'GlobalSurvey.tsx'): textwrap.dedent("""\
        import React, { useState } from 'react';
        import { GlobalSurveyOption } from '../src/types/sanity'; // Yeni tipimizi import ettik

        interface GlobalSurveyProps {
          surveyTitle?: string;
          surveyDescription?: string;
          options?: GlobalSurveyOption[]; // Yeni tipimizi kullanıyoruz
        }

        const GlobalSurvey: React.FC<GlobalSurveyProps> = ({ surveyTitle, surveyDescription, options }) => {
          const [selectedOption, setSelectedOption] = useState<string | null>(null);

          if (!options || !Array.isArray(options) || options.length === 0) {
            return (
              <div className="bg-white p-6 rounded-2xl shadow text-center text-gray-600">
                <p>Anket seçenekleri yüklenemedi veya mevcut değil.</p>
              </div>
            );
          }

          const handleOptionSelect = (optionKey: string) => {
            setSelectedOption(optionKey);
            console.log(`Seçilen opsiyon KEY: ${optionKey}`);
          };

          return (
            <div className="bg-white p-6 rounded-2xl shadow space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">📊 {surveyTitle || 'Küresel Anket'}</h2>
              <p className="text-lg text-gray-700">{surveyDescription || 'Anket hakkında kısa bir açıklama veya soru.'}</p>
              <div className="space-y-3">
                {options.map(option => (
                  <button
                    key={option._key}
                    onClick={() => handleOptionSelect(option._key || '')} // _key kullanılmalı
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200
                      ${selectedOption === option._key ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-blue-50 hover:border-blue-300'}`}
                  >
                    {option.text}
                  </button>
                ))}
              </div>
              {selectedOption !== null && (
                <p className="text-sm text-gray-600 mt-4">Seçiminiz kaydedildi. Teşekkür ederiz!</p>
              )}
            </div>
          );
        };

        export default GlobalSurvey;
        """),

    os.path.join(NEXTJS_COMPONENTS_PATH, 'PageContentRenderer.tsx'): textwrap.dedent("""\
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
        """),

    os.path.join(NEXTJS_APP_DIR_PATH, '[slug]', 'page.tsx'): textwrap.dedent(f"""\
        import {{ createClient }} from '@sanity/client';
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

        async function getDynamicPageData(slug: string) {{
          console.log(`--------------------------------------------------`);
          console.log(`>>> DİNAMİK SAYFA (${{slug}}) - Veri çekme başlıyor <<<`);
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
                heading, // Başlık artık 'title' değil 'heading'
                categoryFilter->{{_id, title, slug}},
                numberOfArticles,
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
                  text,
                  marks
                }},
                markDefs[]
              }},
              _type == "image" => {{
                  asset->{{url}},
                  alt
              }}
            }}
          }}`;

          let pageData: SanityPageData | null = null;
          let articlesForGrid: any[] = []; // SanityArticle[] olarak daha spesifik olabilir
          let fetchError: string | undefined = undefined;

          try {{
            pageData = await client.fetch(pageQuery, {{ slug }});
            console.log(`>>> DİNAMİK SAYFA (${{slug}}) - 1. Sanity'den çekilen sayfa verisi (pageData):`, JSON.stringify(pageData, null, 2));

            if (pageData && pageData.content) {{
              const articleGridBlock = pageData.content.find(
                (block: any) => block._type === 'articleGridBlock'
              );
              console.log(`>>> DİNAMİK SAYFA (${{slug}}) - 2. Bulunan ArticleGridBlock:`, JSON.stringify(articleGridBlock, null, 2));

              if (articleGridBlock) {{
                let articleFilters = `_type == "post"`;
                if (articleGridBlock.categoryFilter && articleGridBlock.categoryFilter._id) {{
                    articleFilters += ` && references("${{articleGridBlock.categoryFilter._id}}")`;
                    console.log(`>>> DİNAMİK SAYFA (${{slug}}) - 3. Kategori filtresi ID:`, articleGridBlock.categoryFilter._id);
                }} else {{
                    console.log(`>>> DİNAMİK SAYFA (${{slug}}) - ArticleGridBlock için kategori filtresi bulunamadı veya eksik. Tüm postlar çekilecek.`);
                }}

                const articleQuery = `*[$1]{{
                  _id,
                  title,
                  "slug": slug.current,
                  "summary": pt::text(body),
                  "image": mainImage.asset->url // 'mainImage' kullanıldı
                }} | order(publishedAt desc)${{
                  articleGridBlock.numberOfArticles ? `[0...${{articleGridBlock.numberOfArticles}}]` : ''
                }}`;
                console.log(`>>> DİNAMİK SAYFA (${{slug}}) - 4. Makaleler için oluşturulan GROQ sorgusu:`, articleQuery);

                articlesForGrid = await client.fetch(articleQuery, [articleFilters]); // Filters array olarak geçiliyor
                console.log(`>>> DİNAMİK SAYFA (${{slug}}) - 5. Sanity'den çekilen makaleler (articlesForGrid):`, JSON.stringify(articlesForGrid, null, 2));
              }}
            }} else if (!pageData) {{
                console.log(`>>> DİNAMİK SAYFA (${{slug}}) - Sanity'den '{{slug}}' slug'ına sahip sayfa bulunamadı. Lütfen Sanity Studio'da bu sayfayı oluşturup yayımlayın.`);
                fetchError = `Sanity'den '{{slug}}' içeriği bulunamadı.`;
            }}
          }} catch (error: any) {{
            console.error(`>>> DİNAMİK SAYFA (${{slug}}) - HATA: Sanity verileri çekilirken hata oluştu:`, error);
            fetchError = error.message;
          }}

          console.log(`--------------------------------------------------`);
          console.log(`>>> DİNAMİK SAYFA (${{slug}}) - Veri çekme tamamlandı <<<`);
          console.log(`--------------------------------------------------`);

          return {{ pageData, articlesForGrid, fetchError }};
        }}

        export default async function DynamicPage({{ params }}: DynamicPageProps) {{
          const {{ slug }} = params;
          const {{ pageData, articlesForGrid, fetchError }} = await getDynamicPageData(slug);

          if (fetchError) {{
            return (
              <div className="bg-red-800 text-red-100 min-h-screen p-6 flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold mb-4">Hata</h1>
                <p className="text-lg text-red-200">Veri çekme hatası: {{fetchError}}</p>
                <p className="text-sm mt-2 text-red-300">
                  Lütfen Sanity Studio&#39;da &#39;{{slug}}&#39; slug&#39;ına sahip bir &#39;Page&#39; belgesi oluşturduğunuzdan ve yayımladığınızdan emin olun.
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
                  Lütfen Sanity Studio&#39;da &#39;{{slug}}&#39; slug&#39;ına sahip bir &#39;Page&#39; belgesi oluşturup yayımladığınızdan emin olun.
                </p>
              </div>
            );
          }}

          return (
            <div className="bg-white text-gray-900 min-h-screen p-6">
              <header className="text-center py-8">
                <h1 className="text-4xl font-extrabold mb-4 text-gray-800">
                  {{pageData.title || `Sayfa: ${{slug}}`}}
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
                    <p className="text-xl">Sanity Studio&#39;da bu sayfa için içerik bulunamadı.</p>
                    <p className="text-sm mt-2">Lütfen Sanity Studio&#39;da &#39;{{slug}}&#39; sayfanıza içerik blokları ekleyin ve yayımlayın.</p>
                  </div>
                )}}
              </main>

              <footer className="mt-12 text-center text-gray-600">
                <p>PUNG Platformu - Dinamik İçerik Sayfası</p>
              </footer>
            </div>
          );
        }}"""),

    os.path.join(NEXTJS_SRC_PATH, 'app', 'page.tsx'): textwrap.dedent("""\
        import React from 'react';
        // Bu, Next.js App Router için ana giriş sayfasıdır.
        // Genellikle statik bir karşılama sayfası veya ana navigasyon noktası olur.
        // Dinamik içerik için src/app/page/[slug]/page.tsx kullanılmalıdır.

        export default function HomePage() {
          return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800 p-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">PUNG Projesi Ana Sayfası</h1>
              <p className="mt-4 text-lg text-gray-700 max-w-xl text-center">
                Hoş geldiniz! Bu platform, medya, kültür, tarih ve yapay zeka konularında derinlemesine analizler sunar.
              </p>
              <p className="mt-2 text-sm text-gray-600">
                Lütfen ana navigasyonu kullanarak diğer sayfaları (örn: /anket, /atlas, /zaman, /posts, /laleli) ziyaret edin.
              </p>
              <p className="mt-8 text-xs text-gray-500">
                İçerikler Sanity CMS tarafından dinamik olarak yönetilmektedir.
              </p>
            </div>
          );
        }
        """),
}

# --- Betik Fonksiyonları ---
def create_directories():
    """Gerekli dizinleri oluşturur."""
    os.makedirs(SANITY_BLOCKS_PATH, exist_ok=True)
    os.makedirs(NEXTJS_LIB_PATH, exist_ok=True)
    os.makedirs(NEXTJS_TYPES_PATH, exist_ok=True)
    os.makedirs(NEXTJS_BLOCK_COMPONENTS_PATH, exist_ok=True)
    os.makedirs(os.path.join(NEXTJS_APP_DIR_PATH, '[slug]'), exist_ok=True) # Dinamik App Router yolu
    # Eğer Pages Router kullanılıyorsa:
    # os.makedirs(NEXTJS_PAGES_PATH, exist_ok=True)
    print(f"Dizinler oluşturuldu.")

def write_files():
    """Tanımlanan dosya içeriklerini diske yazar."""
    for file_path, content in FILES_TO_CREATE.items():
        try:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Oluşturuldu/Güncellendi: {file_path}")
        except IOError as e:
            print(f"HATA: Dosya yazılırken sorun oluştu {file_path}: {e}")

def main():
    print("--- PUNG Projesi Sanity Şema ve Frontend Konfigürasyonu Başladı ---")
    create_directories()
    write_files()
    print("--- PUNG Projesi Sanity Şema ve Frontend Konfigürasyonu Tamamlandı ---")
    print("\nLütfen şimdi aşağıdaki adımları uygulayın:")
    print("1. Frontend projenizin kök dizininde (örn: C:\\frontend) şu komutu çalıştırın:")
    print("   npm install @portabletext/react")
    print("2. Sanity Studio'nuzun dizininde (örn: C:\\frontend\\sanity) şu komutu çalıştırın:")
    print("   npm run dev")
    print("3. Frontend projenizin kök dizininde (örn: C:\\frontend) şu komutu çalıştırın:")
    print("   npm run dev")
    print("\nArdından Sanity Studio'yu (http://localhost:3333) ve frontend uygulamanızı (genellikle http://localhost:3000) kontrol edin. Tüm şemaları ve sayfaların doğru çalıştığını görmelisiniz.")
    print("\nEğer Vercel'e deploy ederken hala sorun yaşıyorsanız, GitHub'a push ettikten sonra Vercel Dashboard'unuzdan 'Clear Build Cache and Redeploy' yapmayı unutmayın.")

if __name__ == "__main__":
    main()
