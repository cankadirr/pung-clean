const fs = require('fs');
const path = require('path');

const frontendDir = path.join(__dirname, 'frontend');
const componentsDir = path.join(frontendDir, 'components');
const blocksDir = path.join(componentsDir, 'blocks');
const dynamicPageDir = path.join(frontendDir, 'src', 'app', 'page', '[slug]');
const appPageDir = path.join(frontendDir, 'src', 'app', 'page');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Created/Updated: ${filePath}`);
}

// 1. Dynamic Detail Page [slug]/page.tsx
ensureDir(dynamicPageDir);
writeFile(path.join(dynamicPageDir, 'page.tsx'), `
import { sanityClient } from '../../../../lib/sanityClient'
import PortableTextComponent from '../../../../components/PortableTextComponent'

export async function generateStaticParams() {
  const pages = await sanityClient.fetch(\`*[_type == "page"]{ "slug": slug.current }\`)
  return pages.map((page) => ({ slug: page.slug }))
}

export default async function Page({ params }) {
  const { slug } = params
  const page = await sanityClient.fetch(
    \`*[_type == "page" && slug.current == $slug][0]\`,
    { slug }
  )

  if (!page) return <p>Sayfa bulunamadı.</p>

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">{page.title}</h1>
      <PortableTextComponent value={page.content} />
    </main>
  )
}
`.trim());

// 2. PortableTextComponent.tsx with custom block renderers
ensureDir(componentsDir);
writeFile(path.join(componentsDir, 'PortableTextComponent.tsx'), `
import { PortableText, PortableTextComponents } from '@portabletext/react'
import AIInsightBlock from './blocks/AIInsightBlock'
import ArticleGridBlock from './blocks/ArticleGridBlock'

const components: PortableTextComponents = {
  types: {
    aiInsightBlock: AIInsightBlock,
    articleGridBlock: ArticleGridBlock,
    // Diğer özel bloklar buraya eklenir
  },
}

export default function PortableTextComponent({ value }) {
  return <PortableText value={value} components={components} />
}
`.trim());

// 3. blocks klasörü ve örnek blok bileşenleri
ensureDir(blocksDir);
writeFile(path.join(blocksDir, 'AIInsightBlock.tsx'), `
export default function AIInsightBlock({ value }) {
  return (
    <section className="bg-blue-100 p-4 rounded-md mb-4">
      <h2 className="text-xl font-semibold">{value.title}</h2>
      <p>{value.summary}</p>
      {value.details && value.details.map((block, i) => (
        <div key={i} dangerouslySetInnerHTML={{ __html: block }} />
      ))}
    </section>
  )
}
`.trim());

writeFile(path.join(blocksDir, 'ArticleGridBlock.tsx'), `
export default function ArticleGridBlock({ value }) {
  return (
    <section className="grid grid-cols-2 gap-4 mb-4">
      {value.articles?.map((article) => (
        <article key={article._id} className="border p-3 rounded">
          <h3>{article.title}</h3>
        </article>
      ))}
    </section>
  )
}
`.trim());

// 4. Basit SEO metadata örneği (opsiyonel)
// Burada `metadata.ts` dosyasını oluşturabilir veya `Head` bileşeni kullanabilirsin.

console.log('Next.js bloklu dinamik sayfa, PortableTextComponent ve örnek blok bileşenleri oluşturuldu.');
console.log('Lütfen "npm install" ile paketleri yüklediğinden emin ol ve "npm run dev" ile projeyi başlat.');

