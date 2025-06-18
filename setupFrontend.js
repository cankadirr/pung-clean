const fs = require('fs');
const path = require('path');
const exec = require('child_process').exec;

const frontendDir = path.join(__dirname, 'frontend');
const componentsDir = path.join(frontendDir, 'components');
const appPageDir = path.join(frontendDir, 'src', 'app', 'page');
const dynamicPageDir = path.join(frontendDir, 'src', 'app', 'page', '[slug]');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Created: ${filePath}`);
}

// 1. PortableTextComponent.tsx
ensureDir(componentsDir);
writeFile(path.join(componentsDir, 'PortableTextComponent.tsx'), `import { PortableText } from '@portabletext/react'

export default function PortableTextComponent({ value }: { value: any }) {
  return <PortableText value={value} />
}
`);

// 2. Dynamic [slug]/page.tsx
ensureDir(dynamicPageDir);
writeFile(path.join(dynamicPageDir, 'page.tsx'), `import { sanityClient } from '../../../lib/sanityClient'
import PortableTextComponent from '../../../components/PortableTextComponent'

interface PageProps {
  params: { slug: string }
}

export async function generateStaticParams() {
  const pages = await sanityClient.fetch(\`*[_type == "page"]{ "slug": slug.current }\`)
  return pages.map((page: any) => ({ slug: page.slug }))
}

export default async function Page({ params }: PageProps) {
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
`);

// 3. Update app/page.tsx
ensureDir(appPageDir);
writeFile(path.join(appPageDir, 'page.tsx'), `import Link from 'next/link'
import { getAllPages } from '../../lib/sanityClient'

export default async function Home() {
  const pages = await getAllPages()

  return (
    <div className="p-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Sayfalar</h1>
      <ul className="list-disc list-inside">
        {pages.map((page) => (
          <li key={page.slug.current} className="mb-2">
            <Link href={\`/page/\${page.slug.current}\`}>
              {page.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
`);

// 4. Add @portabletext/react to package.json dependencies if not present
const packageJsonPath = path.join(frontendDir, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

if (!packageJson.dependencies['@portabletext/react']) {
  packageJson.dependencies['@portabletext/react'] = '^2.0.0';
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
  console.log('Added @portabletext/react to package.json dependencies.');
  console.log('Please run "npm install" inside the frontend folder to install new dependencies.');
} else {
  console.log('@portabletext/react already present in dependencies.');
}

console.log('Setup script completed.');
