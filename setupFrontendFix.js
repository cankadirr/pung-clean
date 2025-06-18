const fs = require('fs');
const path = require('path');

const frontendDir = path.join(__dirname, 'frontend');
const componentsDir = path.join(frontendDir, 'components');
const appDir = path.join(frontendDir, 'src', 'app');

// Helper fonksiyon: klasör varsa geç, yoksa oluştur
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Dosya yazma fonksiyonu
function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Created/Updated: ${filePath}`);
}

// PortableTextComponent.tsx oluştur
ensureDir(componentsDir);
writeFile(path.join(componentsDir, 'PortableTextComponent.tsx'), `
import { PortableText } from '@portabletext/react'

export default function PortableTextComponent({ value }: { value: any }) {
  return <PortableText value={value} />
}
`.trim());

// page.tsx oluştur (güncel import yollarıyla)
ensureDir(appDir);
writeFile(path.join(appDir, 'page.tsx'), `
import Link from 'next/link'
import { getAllPages } from '../../lib/sanityClient'
import PortableTextComponent from '../../components/PortableTextComponent'

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
`.trim());

// package.json'da @portabletext/react var mı kontrol et
const packageJsonPath = path.join(frontendDir, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

if (!packageJson.dependencies || !packageJson.dependencies['@portabletext/react']) {
  console.log('\n[@portabletext/react] paketi package.json içinde bulunamadı.');
  console.log('Lütfen frontend klasöründe aşağıdaki komutu çalıştır:\n');
  console.log('npm install @portabletext/react\n');
} else {
  console.log('\n[@portabletext/react] paketi zaten package.json içinde mevcut.\n');
}

console.log('Script tamamlandı. Lütfen frontend klasöründe "npm run dev" ile projeyi çalıştır.');
