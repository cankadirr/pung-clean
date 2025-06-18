const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, 'frontend', 'src', 'app', 'page', 'page.tsx');

const pageContent = `
import Link from 'next/link'
import { getAllPages } from '../../../lib/sanityClient'
import PortableTextComponent from '../../components/PortableTextComponent'

export default async function Home() {
  const pages = await getAllPages()

  return (
    <div className="p-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Sayfalar</h1>
      <ul className="list-disc list-inside">
        {pages.map((page) => (
          <li key={page._id} className="mb-2">
            <Link href={\`/page/\${page.slug.current}\`}>
              {page.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
`;

fs.writeFileSync(pagePath, pageContent.trim(), 'utf8');
console.log(`Dosya güncellendi: ${pagePath}`);
