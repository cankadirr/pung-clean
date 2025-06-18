import { PortableTextBlock } from '@portabletext/types'; // Hala PortableTextBlock lazım
import PageContentRenderer from '../../../../components/PageContentRenderer';
import { client } from '@/lib/sanity';
import { Article, PageContentBlock, ArticleGridBlockData } from '@/types/sanity-blocks'; // Yeni tiplerden import edildi

interface SanityPageData {
  title?: string;
  description?: string;
  content: PageContentBlock[]; // PageContentBlock[] kullanıldı
}

interface DynamicPageProps {
  params: {
    slug: string;
  };
}

async function getDynamicPageData(slug: string) {
  console.log(`--------------------------------------------------`);
  console.log(`>>> DİNAMİK SAYFA (${slug}) - Veri çekme başlıyor <<<`);
  console.log(`--------------------------------------------------`);

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
        showFeaturedOnly
      },
      _type == "aiInsightBlock" => {
        title,
        summary,
        details[]{
          _key,
          _type,
          children[]{text}
        }
      },
      _type == "crisisTimelineBlock" => {
        timelineTitle,
        description,
        events[]{
          _key,
          date,
          eventTitle,
          eventDescription[]{children[]{text}},
          image{asset->{url}, alt}
        }
      },
      _type == "block" => {
        children[]{
          _key,
          text
        }
      },
      _type == "image" => {
          asset->{url}
      }
    }
  }`;

  let pageData: SanityPageData | null = null;
  let articlesForGrid: Article[] = [];
  let fetchError: string | undefined = undefined;

  try {
    pageData = await client.fetch(pageQuery, { slug });
    console.log(`>>> DİNAMİK SAYFA (${slug}) - 1. Sanity'den çekilen sayfa verisi (pageData):`, JSON.stringify(pageData, null, 2));

    if (pageData && pageData.content) {
      const articleGridBlock = pageData.content.find(
        (block: PageContentBlock): block is ArticleGridBlockData => block._type === 'articleGridBlock'
      );
      console.log(`>>> DİNAMİK SAYFA (${slug}) - 2. Bulunan ArticleGridBlock:`, JSON.stringify(articleGridBlock, null, 2));

      if (articleGridBlock) {
        let articleFilters = `_type == "post"`;
        if (articleGridBlock.categoryFilter && articleGridBlock.categoryFilter._id) {
            articleFilters += ` && references("${articleGridBlock.categoryFilter._id}")`;
            console.log(`>>> DİNAMİK SAYFA (${slug}) - 3. Kategori filtresi ID:`, articleGridBlock.categoryFilter._id);
        } else {
            console.log(`>>> DİNAMİK SAYFA (${slug}) - ArticleGridBlock için kategori filtresi bulunamadı veya eksik. Tüm postlar çekilecek.`);
        }

        const articleQuery = `*[${articleFilters}] | order(publishedAt desc)${
          articleGridBlock.numberOfArticles ? `[0...${articleGridBlock.numberOfArticles}]` : ''
        }{
          _id,
          title,
          "slug": slug.current,
          "summary": pt::text(body),
          "image": mainImage.asset->url
        }`;
        console.log(`>>> DİNAMİK SAYFA (${slug}) - 4. Makaleler için oluşturulan GROQ sorgusu:`, articleQuery);

        articlesForGrid = await client.fetch<Article[]>(articleQuery); // Tipi belirtildi
        console.log(`>>> DİNAMİK SAYFA (${slug}) - 5. Sanity'den çekilen makaleler (articlesForGrid):`, JSON.stringify(articlesForGrid, null, 2));
      }
    } else if (!pageData) {
        console.log(`>>> DİNAMİK SAYFA (${slug}) - Sanity'den '${slug}' slug'ına sahip sayfa bulunamadı. Lütfen Sanity Studio'da bu sayfayı oluşturup yayımlayın.`);
        fetchError = `Sanity'den '${slug}' içeriği bulunamadı.`;
    }
  } catch (error: any) { // eslint-disable-next-line @typescript-eslint/no-explicit-any
    console.error(`>>> DİNAMİK SAYFA (${slug}) - HATA: Sanity verileri çekilirken hata oluştu:`, error);
    fetchError = error instanceof Error ? error.message : String(error);
  }

  console.log(`--------------------------------------------------`);
  console.log(`>>> DİNAMİK SAYFA (${slug}) - Veri çekme tamamlandı <<<`);
  console.log(`--------------------------------------------------`);

  return { pageData, articlesForGrid, fetchError };
}

// Dinamik rota sayfası bileşeni (Server Component)
export default async function DynamicPage({ params }: DynamicPageProps) {
  const { slug } = params;
  const { pageData, articlesForGrid, fetchError } = await getDynamicPageData(slug);

  if (fetchError) {
    return (
      <div className="bg-red-800 text-red-100 min-h-screen p-6 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">Hata</h1>
        <p className="text-lg text-red-200">Veri çekme hatası: {fetchError}</p>
        <p className="text-sm mt-2 text-red-300">
          Lütfen Sanity Studio&apos;da &apos;{slug}&apos; slug&apos;ına sahip bir &apos;Page&apos; belgesi oluşturduğunuzdan ve yayımladığınızdan emin olun.
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
          Lütfen Sanity Studio&apos;da &apos;{slug}&apos; slug&apos;ına sahip bir &apos;Page&apos; belgesi oluşturup yayımladığınızdan emin olun.
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
                <p className="text-xl">Sanity Studio&apos;da bu sayfa için içerik bulunamadı.</p>
                <p className="text-sm mt-2">Lütfen Sanity Studio&apos;da &apos;{slug}&apos; sayfanıza içerik blokları ekleyin ve yayımlayın.</p>
              </div>
            )}
          </main>

          <footer className="mt-12 text-center text-gray-600">
            <p>PUNG Platformu - Dinamik İçerik Sayfası</p>
          </footer>
        </div>
      );
    }