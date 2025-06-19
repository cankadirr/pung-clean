const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  {
    filePath: path.join(__dirname, 'frontend/src/app/page/page.tsx'),
    content: `import React from 'react';
import { createClient } from '@sanity/client';
import { PortableText } from '@portabletext/react';
// 'PortableTextBlock' kaldırıldı çünkü kullanılmıyor
import { SanityImage } from '../../types/sanity';
import Image from 'next/image';

const components = {
  block: {
    h1: ({ children }: { children: React.ReactNode }) => (
      <h1 className="text-3xl font-bold mb-4">{children}</h1>
    ),
    h2: ({ children }: { children: React.ReactNode }) => (
      <h2 className="text-2xl font-bold mb-3">{children}</h2>
    ),
    normal: ({ children }: { children: React.ReactNode }) => (
      <p className="text-gray-700 leading-relaxed mb-2">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }: { children: React.ReactNode }) => (
      <ul className="list-disc list-inside pl-5 mb-2">{children}</ul>
    ),
    number: ({ children }: { children: React.ReactNode }) => (
      <ol className="list-decimal list-inside pl-5 mb-2">{children}</ol>
    ),
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
  types: {
    image: ({ value }: { value: SanityImage }) =>
      value.asset && value.asset.url ? (
        <Image src={value.asset.url} alt={value.alt || ''} width={800} height={600} className="rounded-lg my-4" />
      ) : null,
  },
};

const client = createClient({
  projectId: '13f1s0mc',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: true,
});

export async function getServerSideProps() {
  const query = \`*[_type == "page" && slug.current == "anasayfa"][0]{
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
  }\`;

  let pageData = null;
  let fetchError = null;

  try {
    pageData = await client.fetch(query);
  } catch (error) {
    fetchError = error instanceof Error ? error.message : 'Bilinmeyen hata';
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
  pageContent: any[]; // 'any' kullanımı burada yapıldı, isterseniz tip netleştirebiliriz
  fetchError: string | null;
}

const HomePage: React.FC<HomePageProps> = ({
  pageTitle,
  pageDescription,
  pageContent,
  fetchError,
}) => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-6">
      <header className="text-center py-8">
        <h1 className="text-4xl font-bold text-gray-900">{pageTitle}</h1>
        <p className="mt-4 text-lg text-gray-700">{pageDescription}</p>
      </header>

      <main className="container mx-auto px-4 py-8">
        {fetchError && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <strong className="font-bold">Hata!</strong>
            <span className="block sm:inline"> {fetchError}</span>
          </div>
        )}

        {!fetchError && pageContent.length === 0 && (
          <div className="text-center py-12 text-gray-600">
            Sayfa içeriği bulunamadı veya yükleniyor.
          </div>
        )}

        <div className="max-w-3xl mx-auto space-y-6">
          {pageContent.map((block) => (
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
`
  }
];

filesToUpdate.forEach(({ filePath, content }) => {
  try {
    const backupPath = filePath + '.bak';
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(filePath, backupPath);
      console.log(`Backup created: ${backupPath}`);
    } else {
      console.log(`Backup already exists: ${backupPath}`);
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`File updated: ${filePath}`);
  } catch (error) {
    console.error(`Error updating file: ${filePath}`, error);
  }
});
