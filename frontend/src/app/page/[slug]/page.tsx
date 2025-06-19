import { createClient } from '@sanity/client';
import type { PortableTextBlock } from '@portabletext/types';
import PageContentRenderer from '../../../../components/PageContentRenderer';

// Sanity Client konfigürasyonu
const client = createClient({
  projectId: '13f1s0mc', // Doğru Project ID'niz
  dataset: 'production',
  apiVersion: '2025-06-15', // Gelecekteki Sanity API versiyonunu kullanmak iyi bir pratik
  useCdn: true,
});

// Sanity'den çekilecek sayfa verileri için tip tanımı
interface SanityPageData {
  title?: string;
  description?: string;
  content: PortableTextBlock[]; // PortableTextBlock[] tipi için
}

// Sanity'den çekilecek makale verileri için tip tanımı
interface SanityArticle {
  _id: string;
  title: string;
  slug: string;
  summary?: string;
  image?: string;
}

interface DynamicPageProps {
  params: {
    slug: string;
  };
}

// Bu fonksiyon, dinamik olarak Sanity'den sayfa verilerini çeker
async function getDynamicPageData(slug: string) {
  console.log(`--------------------------------------------------`);
  console.log(`>>> DİNAMİK SAYFA (${slug}) - Veri çekme başlıyor <<<`);
  console.log(`--------------------------------------------------`);

  // Ana sayfa sorgusu
  const pageQuery = `*[_type == "page" && slug.current == $slug][0]{
    title,
    description,
    content[]{
      _key,
      _type,
      _type == "globalSurveyBlock" => {
        surveyTitle,
        surveyDescription,
        options[]{
          _key,
          text
        }
      },
      _type == "articleGridBlock" => {
        heading,
        categoryFilter->{_id, title, slug},
        numberOfArticles,
      },
      _type == "aiInsightBlock" => {
        title,
        summary,
        details[] {
          _key,
          _type,
          children[]{
            _key,
            text,
            marks
          },
          markDefs[]
        }
      },
      _type == "crisisTimelineBlock" => {
        timelineTitle,
        description,
        events[]{
          _key,
          date,
          eventTitle,
          eventDescription[] {
            _key,
            _type,
            children[]{
              _key,
              text,
              marks
            },
            markDefs[]
          },
          image {
            asset->{url},
            alt
          }
        }
      },
      _type == "block" => {
        children[]{
          _key,
          text,
          marks
        },
        markDefs[]
      },
      _type == "image" => {
          asset->{url},
          alt
      }
    }
  }`;

  let pageData: SanityPageData | null = null;
  let articlesForGrid: SanityArticle[] = [];
  let fetchError: string | undefined = undefined;

  try {
    pageData = await client.fetch<SanityPageData | null>(pageQuery, { slug }); // <SanityPageData | null> tipini ekledik
    console.log(`>>> DİNAMİK SAYFA (${slug}) - 1. Sanity'den çekilen sayfa verisi (pageData):`, JSON.stringify(pageData, null, 2));

    if (pageData && pageData.content) {
      // articleGridBlock varsa makaleleri çek
      // Block tipi için daha spesifik bir arayüz tanımlanabilir veya inline type assertion kullanılabilir.
      const articleGridBlock = pageData.content.find(
        (block: PortableTextBlock) => block._type === 'articleGridBlock'
      ) as { heading?: string; categoryFilter?: { _id: string; title: string; slug: string }; numberOfArticles?: number } | undefined; // 'as' ile tip belirttik
      console.log(`>>> DİNAMİK SAYFA (${slug}) - 2. Bulunan ArticleGridBlock:`, JSON.stringify(articleGridBlock, null, 2));

      if (articleGridBlock) {
        // articleFilters değişkeni sadece sorgu içinde kullanıldığı için kaldırıldı.
        // GROQ sorgusundaki `$categoryFilter` doğrudan kullanıldı.

        const articleQuery = `*[_type == "post" && ($categoryFilter == "" || references($categoryFilter))] {
          _id,
          title,
          "slug": slug.current,
          "summary": pt::text(body), // Portable Text'i düz metne dönüştürür
          "image": mainImage.asset->url
        } | order(publishedAt desc) [0...$numberOfArticles]`;
        console.log(`>>> DİNAMİK SAYFA (${slug}) - 4. Makaleler için oluşturulan GROQ sorgusu:`, articleQuery);

        articlesForGrid = await client.fetch<SanityArticle[]>(articleQuery, { // <SanityArticle[]> tipini ekledik
          categoryFilter: articleGridBlock.categoryFilter?._id || '',
          numberOfArticles: articleGridBlock.numberOfArticles || 3
        });
        console.log(`>>> DİNAMİK SAYFA (${slug}) - 5. Sanity'den çekilen makaleler (articlesForGrid):`, JSON.stringify(articlesForGrid, null, 2));
      }
    } else if (!pageData) {
        console.log(`>>> DİNAMİK SAYFA (${slug}) - Sanity'den '${slug}' slug'ına sahip sayfa bulunamadı. Lütfen Sanity Studio'da bu sayfayı oluşturup yayımlayın.`);
        fetchError = `Sanity'den '${slug}' içeriği bulunamadı.`;
    }
  } catch (error: unknown) { // 'any' yerine 'unknown' kullanıp hata tipini daha güvenli yönettik
    const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata';
    console.error(`>>> DİNAMİK SAYFA (${slug}) - HATA: Sanity verileri çekilirken hata oluştu:`, errorMessage, error);
    fetchError = errorMessage;
  }

  console.log(`--------------------------------------------------`);
  console.log(`>>> DİNAMİK SAYFA (${slug}) - Veri çekme tamamlandı <<<`);
  console.log(`--------------------------------------------------`);

  return { pageData, articlesForGrid, fetchError };
}

// Bu Next.js App Router sayfa bileşenidir
export default async function DynamicPage({ params }: DynamicPageProps) {
  const { slug } = params;
  const { pageData, articlesForGrid, fetchError } = await getDynamicPageData(slug);

  if (fetchError) {
    return (
      <div className="bg-red-800 text-red-100 min-h-screen p-6 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">Hata!</h1>
        <p className="text-lg text-red-200">Veri çekme hatası: {fetchError}</p>
        <p className="text-sm mt-2 text-red-300">
          Lütfen Sanity Studio&#39;da &#39;{slug}&#39; slug&#39;ına sahip bir &#39;Page&#39; belgesi oluşturduğunuzdan ve yayımladığınızdan emin olun.
        </p>
      </div>
    );
  }

  if (!pageData) {
    return (
      <div className="bg-gray-900 text-white min-h-screen p-6 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">Sayfa Bulunamadı</h1>
        <p className="text-lg text-gray-300">Belirtilen slug ile sayfa içeriği bulunamadı.</p>
        <p className="text-sm mt-2 text-gray-400">
          Lütfen Sanity Studio&#39;da &#39;{slug}&#39; slug&#39;ına sahip bir &#39;Page&#39; belgesi oluşturup yayımladığınızdan emin olun.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white text-gray-900 min-h-screen p-6">
      <header className="text-center py-8">
        <h1 className="text-4xl font-extrabold mb-4 text-gray-800">
          {pageData.title || `Sayfa: ${slug}`}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {pageData.description || 'Sayfa açıklaması bulunamadı.'}
        </p>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-12">
        {pageData.content && pageData.content.length > 0 ? (
          <PageContentRenderer content={pageData.content} articlesForGrid={articlesForGrid} />
        ) : (
          <div className="text-center py-12 text-gray-600">
            <p className="text-xl">Sanity Studio&#39;da bu sayfa için içerik bulunamadı.</p>
            <p className="text-sm mt-2">Lütfen Sanity Studio&#39;da &#39;{slug}&#39; sayfanıza içerik blokları ekleyin ve yayımlayın.</p>
          </div>
        )}
      </main>

      <footer className="mt-12 text-center text-gray-600">
        <p>PUNG Platformu - Dinamik İçerik Sayfası</p>
      </footer>
    </div>
  );
}
