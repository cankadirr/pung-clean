const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const frontendDir = path.join(__dirname, 'frontend');
const studioDir = path.join(__dirname, 'studio');

// Dosya oluşturma fonksiyonu
function writeFileIfNotExists(filePath, content) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Created: ${filePath}`);
  } else {
    console.log(`Already exists: ${filePath}`);
  }
}

// Örnek basit sanityClient.ts dosyası frontend/lib içine
const sanityClientContent = `import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: '13f1s0mc',    // Sanity proje ID'si
  dataset: 'production',
  useCdn: true,
  apiVersion: '2023-01-01',
});

export async function getAllPages() {
  const query = '*[_type == "page"]{title, slug, content}';
  return sanityClient.fetch(query);
}
`;

// Örnek portableTextComponent.tsx frontend/components içine
const portableTextContent = `import { PortableText } from '@portabletext/react';

export default function PortableTextComponent({ value }: { value: any }) {
  return <PortableText value={value} />;
}
`;

// Paket kurulumu
function runNpmInstall(dir) {
  console.log(`Running npm install in ${dir}...`);
  execSync('npm install', { cwd: dir, stdio: 'inherit' });
}

// Temel frontend dosyalarını oluştur
writeFileIfNotExists(path.join(frontendDir, 'lib', 'sanityClient.ts'), sanityClientContent);
writeFileIfNotExists(path.join(frontendDir, 'components', 'PortableTextComponent.tsx'), portableTextContent);

// Npm install çalıştır
runNpmInstall(frontendDir);
runNpmInstall(studioDir);

console.log('Setup complete! Artık npm run dev ile projeni çalıştırabilirsin.');
