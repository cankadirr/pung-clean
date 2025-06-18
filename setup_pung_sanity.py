import os

# --- Konfigürasyonlar ---
# Projenizin kök dizinini ayarlayın.
# Hata çıktınıza göre Sanity Studio'nun C:\Users\ASUS\Desktop\pung-clean\studio konumunda olduğunu varsayıyoruz.
# Bu nedenle PROJECT_ROOT'u C:\Users\ASUS\Desktop\pung-clean olarak ayarlıyoruz.
PROJECT_ROOT = 'C:\\Users\\ASUS\\Desktop\\pung-clean' # Dizin ağacının ana kökü
SANITY_STUDIO_PATH = os.path.join(PROJECT_ROOT, 'studio')
SANITY_SCHEMAS_PATH = os.path.join(SANITY_STUDIO_PATH, 'schemas')
SANITY_BLOCKS_PATH = os.path.join(SANITY_SCHEMAS_PATH, 'blocks')
NEXTJS_LIB_PATH = os.path.join(PROJECT_ROOT, 'frontend', 'src', 'lib') # Frontend'in yolu

# KULLANILACAK SANITY PROJECT ID
SANITY_PROJECT_ID = '13f1s0mc'
# --- Konfigürasyon Sonu ---

# --- Şema ve Konfigürasyon Dosyaları İçerikleri ---
FILES_TO_CREATE = {
    # Sanity Studio Schemas
    os.path.join(SANITY_BLOCKS_PATH, 'AIInsightBlock.ts'): """import { defineType } from 'sanity';

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
});""",

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
        defineField({ // 'of' dizisinin içine defineField ile obje tanımlıyoruz
          name: 'eventItem', // İçteki obje için bir isim
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
          ], // 'eventItem' içindeki alanların sonu
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
        }), // 'eventItem' defineField'ın sonu
      ], // 'events' array'inin 'of' dizisinin sonu
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
  apiVersion: '2023-05-03',
  useCdn: true,
}});

// Sanity'den resim URL'leri oluşturmak için bir yardımcı fonksiyon (ileride kullanacağız)
// import imageUrlBuilder from '@sanity/image-url';
// const builder = imageUrlBuilder(client);
// export function urlFor(source: any) {{
//   return builder.image(source);
// }}"""
}

# --- Betik Fonksiyonları ---
def create_directories():
    """Gerekli dizinleri oluşturur."""
    os.makedirs(SANITY_BLOCKS_PATH, exist_ok=True)
    os.makedirs(NEXTJS_LIB_PATH, exist_ok=True)
    print(f"Dizinler oluşturuldu: {SANITY_BLOCKS_PATH}, {NEXTJS_LIB_PATH}")

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
    print("--- PUNG Sanity Şema ve Konfigürasyon Kurulumu Başladı ---")
    create_directories()
    write_files()
    print("--- PUNG Sanity Şema ve Konfigürasyon Kurulumu Tamamlandı ---")
    print("\nLütfen şimdi Sanity Studio ve Next.js uygulamalarınızı yeniden başlatın:")
    print(f"1. PowerShell'de cd {SANITY_STUDIO_PATH} dizinine gidin ve 'npm run dev' çalıştırın.")
    print(f"2. PowerShell'de cd {PROJECT_ROOT}\\frontend dizinine gidin ve 'npm run dev' çalıştırın.") # frontend path'i de güncellendi
    print("\nArdından Sanity Studio'yu (http://localhost:3333) kontrol edin. Sol panelde tüm şemaları görmelisiniz.")

if __name__ == "__main__":
    main()
