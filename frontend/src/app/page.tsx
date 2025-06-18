import { createClient } from '@sanity/client';
import PageContentRenderer from '../../components/PageContentRenderer'; // Yeni oluşturduğumuz renderer

// Sanity Client konfigürasyonu
const client = createClient({
  projectId: '13f1s0mc',
  dataset: 'production',
  apiVersion: '2025-06-15',
  useCdn: true,
});

interface PageData {
  title?: string;
  description?: string;
  content: any[]; // PageContentRenderer'ın beklediği PageContentBlock[]
}

interface HomeProps {
  pageData: PageData | null;
  articlesForGrid: any[]; // ArticleGrid'e gidecek makaleler
  fetchError?: string;
}

// App Router'da veri çekme doğrudan server component'in içinde veya ayrı bir async fonksiyonda yapılır.
// getServerSideProps yerine doğrudan 'async' fonksiyon kullanıyoruz.
async function getHomePageData(): Promise<HomeProps> {
  console.log("--------------------------------------------------");
  console.log(">>> ANA SAYFA - Veri çekme başlıyor <<<");
  console.log("--------------------------------------------------");

  const pageQuery = `*[_type == "page" && slug.current == "anasayfa"][0]{
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
        heading, // Şemadaki 'heading' adı kullanıldı
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

  let pageData: PageData | null = null;
  let articlesForGrid: any[] = [];
  let fetchError: string | undefined = undefined;

  try {
    pageData = await client.fetch(pageQuery);
    console.log(">>> ANA SAYFA - 1. Sanity'den çekilen sayfa verisi (pageData):", JSON.stringify(pageData, null, 2));

    if (pageData && pageData.content) {
      const articleGridBlock = pageData.content.find(
        (block: any) => block._type === 'articleGridBlock'
      );
      console.log(">>> ANA SAYFA - 2. Bulunan ArticleGridBlock:", JSON.stringify(articleGridBlock, null, 2));

      if (articleGridBlock) {
        let articleFilters = `_type == "post"`;
        if (articleGridBlock.categoryFilter && articleGridBlock.categoryFilter._id) {
            articleFilters += ` && references("${articleGridBlock.categoryFilter._id}")`;
            console.log(">>> ANA SAYFA - 3. Kategori filtresi ID:", articleGridBlock.categoryFilter._id);
        } else {
            console.log(">>> ANA SAYFA - ArticleGridBlock için kategori filtresi bulunamadı veya eksik. Tüm postlar çekilecek.");
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
        console.log(">>> ANA SAYFA - 4. Makaleler için oluşturulan GROQ sorgusu:", articleQuery);

        articlesForGrid = await client.fetch(articleQuery);
        console.log(">>> ANA SAYFA - 5. Sanity'den çekilen makaleler (articlesForGrid):", JSON.stringify(articlesForGrid, null, 2));
      }
    } else if (!pageData) {
        console.log(">>> ANA SAYFA - Sanity'den 'anasayfa' slug'ına sahip sayfa bulunamadı. Lütfen Sanity Studio'da bu sayfayı oluşturup yayımlayın.");
        fetchError = "Sanity'den 'anasayfa' içeriği bulunamadı.";
    }
  } catch (error: any) { // Hata objesini any olarak yakalayıp mesajına erişmek için
    console.error(">>> ANA SAYFA - HATA: Sanity verileri çekilirken hata oluştu:", error);
    fetchError = error.message;
  }

  console.log("--------------------------------------------------");
  console.log(">>> ANA SAYFA - Veri çekme tamamlandı <<<");
  console.log("--------------------------------------------------");

  return {
    pageData,
    articlesForGrid,
    fetchError
  };
}

// Ana sayfa bileşeni (Server Component)
export default async function Home() {
  const { pageData, articlesForGrid, fetchError } = await getHomePageData();

  return (
    <div className="bg-white text-gray-900 min-h-screen p-6">
      <header className="text-center py-8">
        <h1 className="text-4xl font-extrabold mb-4 text-gray-800">
          {pageData?.title || 'Ana Sayfa (Varsayılan)'}
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {pageData?.description || 'Platformun ana içeriği.'}
        </p>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-12">
        {fetchError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Hata!</strong>
            <span className="block sm:inline"> {fetchError}</span>
            <p className="text-sm mt-2">Lütfen Sanity Studio'da 'anasayfa' slug'ına sahip bir 'Page' belgesi oluşturduğunuzdan ve yayımladığınızdan emin olun.</p>
          </div>
        )}

        {!fetchError && !pageData && (
          <div className="text-center py-12 text-gray-600">
            <p className="text-xl">Sayfa içeriği bulunamadı veya yükleniyor.</p>
            <p className="text-sm mt-2">Lütfen Sanity Studio'da 'anasayfa' slug'ına sahip bir sayfa oluşturun ve içerik ekleyin.</p>
          </div>
        )}

        {pageData?.content && pageData.content.length > 0 && (
          <PageContentRenderer content={pageData.content} articlesForGrid={articlesForGrid} />
        )}
      </main>

      <footer className="mt-12 text-center text-gray-600">
        <p>PUNG Platformu - CMS ile yönetilen ana sayfa</p>
      </footer>
    </div>
  );
};