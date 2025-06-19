// frontend/src/pages/page.tsx
import React from 'react';
import { createClient } from '@sanity/client'; // Sanity Client'ı import ediyoruz
import { PortableText } from '@portabletext/react'; // PortableText kütüphanesini import ettik
import { PortableTextBlock, SanityImage } from '../types/sanity'; // Yeni tiplerimizi import ettik

// PortableText bileşeni için özel bileşenler (AIInsightBlock ile aynı, ayrı tanımlayabiliriz veya ortak bir dosyaya alabiliriz)
// Bu bileşenler Portable Text içeriğinin nasıl render edileceğini kontrol eder.
const components = {
  block: {
    h1: ({ children }: { children: React.ReactNode }) => <h1 className="text-3xl font-bold mb-4">{children}</h1>,
    h2: ({ children }: { children: React.ReactNode }) => <h2 className="text-2xl font-bold mb-3">{children}</h2>,
    normal: ({ children }: { children: React.ReactNode }) => <p className="text-gray-700 leading-relaxed mb-2">{children}</p>,
  },
  list: {
    bullet: ({ children }: { children: React.ReactNode }) => <ul className="list-disc list-inside pl-5 mb-2">{children}</ul>,
    number: ({ children }: { children: React.ReactNode }) => <ol className="list-decimal list-inside pl-5 mb-2">{children}</ol>,
  },
  listItem: ({ children }: { children: React.ReactNode }) => <li className="mb-1">{children}</li>,
  marks: {
    link: ({ children, value }: { children: React.ReactNode; value: { href: string } }) => (
      <a href={value.href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
        {children}
      </a>
    ),
    strong: ({ children }: { children: React.ReactNode }) => <strong>{children}</strong>,
    em: ({ children }: { children: React.ReactNode }) => <em>{children}</em>,
  },
  // Sanity'deki 'image' tipi için özel bileşen (eğer content dizisinde image varsa)
  types: {
    image: ({ value }: { value: SanityImage }) => (
      value.asset && value.asset.url ? (
        <img src={value.asset.url} alt={value.alt || ''} className="w-full h-auto rounded-lg my-4" />
      ) : null
    ),
    // Buraya gelecekte GlobalSurveyBlock, AIInsightBlock, ArticleGridBlock vb. custom bloklar için bileşenler eklenebilir
    // Örneğin:
    // globalSurveyBlock: ({ value }) => <GlobalSurvey surveyTitle={value.surveyTitle} surveyDescription={value.surveyDescription} options={value.options} />,
    // aiInsightBlock: ({ value }) => <AIInsightBlock title={value.title} summary={value.summary} details={value.details} />,
  },
};

// Sanity Client konfigürasyonu
// Bu bilgileri Sanity projenizin sanity.cli.ts veya sanity.json dosyasından alabilirsiniz.
const client = createClient({
  projectId: '13f1s0mc', // Sanity Project ID'nizi buraya yazın
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: true,
});

// Next.js'in sunucu tarafında veri çekme metodu (Pages Router için)
export async function getServerSideProps() {
  const query = `*[_type == "page" && slug.current == "anasayfa"][0]{
    title,
    description,
    content[]{
      _key,
      _type,
      // Eğer blok tipi 'block' ise, Portable Text alanlarını çekiyoruz
      _type == "block" => {
        children[]{
          _key,
          text,
          marks
        },
        markDefs[]
      },
      // Eğer blok tipi 'image' ise, resim URL'sini çekiyoruz
      _type == "image" => {
        asset->{url},
        alt
      },
      // Eğer custom bloklar (GlobalSurveyBlock, ArticleGridBlock vb.) ekleyecekseniz
      // buraya onların alanlarını da eklemeniz gerekir.
      _type == "globalSurveyBlock" => {
        _key,
        surveyTitle,
        surveyDescription,
        options[]{
          _key,
          text
        }
      },
      _type == "articleGridBlock" => {
        _key,
        heading,
        categoryFilter->{_id, title, slug},
        numberOfArticles,
        showFeaturedOnly
      },
      _type == "aiInsightBlock" => {
        _key,
        title,
        summary,
        details[]{
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
        _key,
        timelineTitle,
        description,
        events[]{
          _key,
          date,
          eventTitle,
          eventDescription[]{
            _key,
            _type,
            children[]{
              _key,
              text,
              marks
            },
            markDefs[]
          },
          image{asset->{url}, alt}
        }
      }
    }
  }`;

  let pageData = null;
  let fetchError = null;

  try {
    pageData = await client.fetch(query);
  } catch (error: any) { // TypeScript için hata tipini belirtmek iyi bir pratik
    console.error("Sanity verileri çekilirken hata oluştu:", error);
    fetchError = error.message;
  }

  return {
    props: {
      pageTitle: pageData?.title || 'Ana Sayfa',
      pageDescription: pageData?.description || 'Hoş geldiniz!',
      pageContent: pageData?.content || [],
      fetchError,
    },
  };
}

interface HomePageProps {
  pageTitle: string;
  pageDescription: string;
  pageContent: PortableTextBlock[]; // Artık PortableTextBlock[] tipinde
  fetchError: string | null;
}

const HomePage: React.FC<HomePageProps> = ({ pageTitle, pageDescription, pageContent, fetchError }) => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-6">
      <header className="text-center py-8">
        <h1 className="text-4xl font-bold text-gray-900">{pageTitle}</h1>
        <p className="mt-4 text-lg text-gray-700">{pageDescription}</p>
      </header>

      <main className="container mx-auto px-4 py-8">
        {fetchError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Hata!</strong>
            <span className="block sm:inline"> {fetchError}</span>
            <p className="text-sm mt-2">Lütfen Sanity Studio'da 'anasayfa' slug'ına sahip bir 'Page' belgesi oluşturduğunuzdan ve yayımladığınızdan emin olun.</p>
          </div>
        )}

        {!fetchError && pageContent.length === 0 && (
          <div className="text-center py-12 text-gray-600">
            <p className="text-xl">Sanity Studio'da 'anasayfa' sayfası içeriği bulunamadı veya yükleniyor.</p>
            <p className="text-sm mt-2">Lütfen Sanity Studio'da Ana sayfanıza içerik blokları ekleyin ve yayımlayın.</p>
          </div>
        )}

        <div className="max-w-3xl mx-auto space-y-6">
          {pageContent.map(block => (
            // `PortableText` bileşeni, gelen Sanity bloklarını otomatik olarak render eder.
            // `components` prop'u, farklı blok tiplerini veya stil/mark'ları nasıl render edeceğinizi özelleştirmenizi sağlar.
            <PortableText key={block._key} value={block} components={components} />
          ))}
        </div>
      </main>

      <footer className="mt-12 text-center text-gray-600">
        <p>Bu sayfa içeriği Sanity CMS ile dinamik olarak yönetiliyor.</p>
      </footer>
    </div>
  );
};

export default HomePage;
