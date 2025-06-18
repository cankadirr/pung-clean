const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, 'frontend', 'src', 'app', 'page', '[slug]', 'page.tsx');

const content = `import { sanityClient } from '../../../../lib/sanityClient'
import PortableTextComponent from '../../../../components/PortableTextComponent'
import AdvancedCommentSection from '../../../../components/comments/AdvancedCommentSection'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const pages = await sanityClient.fetch(\`*[_type == "page"]{ "slug": slug.current }\`)
  return pages.map((page: any) => ({ slug: page.slug }))
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

fs.writeFileSync(pagePath, content, 'utf8');
console.log(`page.tsx dosyası güncellendi: ${pagePath}`);
