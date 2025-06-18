const fs = require('fs');
const path = require('path');

const frontendDir = path.join(__dirname, 'frontend');
const studioDir = path.join(__dirname, 'studio');
const schemaDir = path.join(studioDir, 'schemas');
const blocksDir = path.join(schemaDir, 'blocks');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Created/Updated: ${filePath}`);
}

// 1. layout.tsx - Temel SEO fonksiyonlu layout
const layoutContent = `
import './globals.css'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PUNG - Çok Katmanlı Medya',
  description: 'PUNG projesi ana sayfası',
  openGraph: {
    title: 'PUNG - Çok Katmanlı Medya',
    description: 'PUNG projesi ana sayfası',
    url: 'https://pung.example.com',
    siteName: 'PUNG',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PUNG Open Graph Image',
      },
    ],
    locale: 'tr_TR',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  )
}
`;

// 2. Ana modül sayfaları (atlas ve zaman)
const pageAtlasContent = `
export const metadata = {
  title: 'Atlas - PUNG Modülü',
  description: 'Atlas modülüne ait sayfa',
}

export default function AtlasPage() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">Atlas Modülü</h1>
      <p>Atlas sayfası içeriği buraya gelecek.</p>
    </main>
  )
}
`;

const pageZamanContent = `
export const metadata = {
  title: 'Zaman - PUNG Modülü',
  description: 'Zaman modülüne ait sayfa',
}

export default function ZamanPage() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">Zaman Modülü</h1>
      <p>Zaman sayfası içeriği buraya gelecek.</p>
    </main>
  )
}
`;

// 3. Sanity özel blok örneği
const customBlockContent = `
export default {
  name: 'customBlock',
  title: 'Custom Block',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Başlık',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Açıklama',
      type: 'text',
    },
  ],
}
`;

// 4. schema.ts içine blok ekleme
const schemaIndexPath = path.join(schemaDir, 'schema.ts');
let schemaIndexContent = '';
if (fs.existsSync(schemaIndexPath)) {
  schemaIndexContent = fs.readFileSync(schemaIndexPath, 'utf8');
}
if (!schemaIndexContent.includes("import customBlock")) {
  schemaIndexContent =
    `import createSchema from 'part:@sanity/base/schema-creator'
import schemaTypes from 'all:part:@sanity/base/schema-type'

import customBlock from './blocks/CustomBlock'

export default createSchema({
  name: 'default',
  types: schemaTypes.concat([
    customBlock,
  ]),
})
`
}

// 5. Dinamik page.tsx dosyasına SEO metadata ve content

const dynamicPagePath = path.join(frontendDir, 'src', 'app', 'page', '[slug]', 'page.tsx');
const dynamicPageContent = `
import { sanityClient } from '../../../../lib/sanityClient'
import PortableTextComponent from '../../../../components/PortableTextComponent'
import AdvancedCommentSection from '../../../../components/comments/AdvancedCommentSection'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const pages = await sanityClient.fetch(\`*[_type == "page"]{ "slug": slug.current }\`)
  return pages.map((page: any) => ({ slug: page.slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const page = await sanityClient.fetch(
    \`*[_type == "page" && slug.current == $slug][0]\`,
    { slug: params.slug }
  )
  return {
    title: page?.title ?? 'PUNG Sayfası',
    description: page?.content ? page.content[0]?.children[0]?.text : 'PUNG İçeriği',
    openGraph: {
      title: page?.title ?? 'PUNG Sayfası',
      description: page?.content ? page.content[0]?.children[0]?.text : 'PUNG İçeriği',
    },
  }
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params
  const { slug } = resolvedParams

  const page = await sanityClient.fetch(
    \`*[_type == "page" && slug.current == $slug][0]\`,
    { slug }
  )

  if (!page) return <p>Sayfa bulunamadı.</p>

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-6">{page.title}</h1>
      <PortableTextComponent value={page.content} />
      <AdvancedCommentSection pageId={slug} />
    </main>
  )
}
`;

ensureDir(path.join(frontendDir, 'src', 'app', 'page', 'atlas'));
ensureDir(path.join(frontendDir, 'src', 'app', 'page', 'zaman'));
ensureDir(blocksDir);
ensureDir(path.join(frontendDir, 'src', 'app', 'page', '[slug]'));

writeFile(path.join(frontendDir, 'src', 'app', 'layout.tsx'), layoutContent.trim());
writeFile(path.join(frontendDir, 'src', 'app', 'page', 'atlas', 'page.tsx'), pageAtlasContent.trim());
writeFile(path.join(frontendDir, 'src', 'app', 'page', 'zaman', 'page.tsx'), pageZamanContent.trim());
writeFile(path.join(blocksDir, 'CustomBlock.ts'), customBlockContent.trim());
writeFile(schemaIndexPath, schemaIndexContent.trim());
writeFile(dynamicPagePath, dynamicPageContent.trim());

console.log('SEO, frontend sayfaları ve Sanity schema dosyaları oluşturuldu/güncellendi.');
