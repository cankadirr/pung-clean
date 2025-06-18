const fs = require('fs');
const path = require('path');

const frontendDir = path.join(__dirname, 'frontend');
const componentsDir = path.join(frontendDir, 'components');
const blocksDir = path.join(componentsDir, 'blocks');

// Klasör var mı kontrol et, yoksa oluştur
function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// Dosya yazma fonksiyonu
function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Created: ${filePath}`);
}

// AIInsightBlock.tsx
const aiInsightBlockContent = `
export default function AIInsightBlock({ value }: { value: any }) {
  return (
    <section className="bg-blue-100 p-4 rounded-md mb-4">
      <h2 className="text-xl font-semibold mb-2">{value.title}</h2>
      <p className="mb-2">{value.summary}</p>
      {value.details && (
        <div>
          {value.details.map((block: any, i: number) => (
            <p key={i}>{block.children?.[0]?.text || ''}</p>
          ))}
        </div>
      )}
    </section>
  );
}
`.trim();

// ArticleGridBlock.tsx
const articleGridBlockContent = `
export default function ArticleGridBlock({ value }: { value: any }) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
      {value.articles?.map((article: any) => (
        <article key={article._id} className="border p-3 rounded shadow-sm">
          <h3 className="font-semibold">{article.title}</h3>
        </article>
      ))}
    </section>
  );
}
`.trim();

// PortableTextComponent.tsx
const portableTextComponentContent = `
import { PortableText, PortableTextComponents } from '@portabletext/react';
import AIInsightBlock from './blocks/AIInsightBlock';
import ArticleGridBlock from './blocks/ArticleGridBlock';

const components: PortableTextComponents = {
  types: {
    aiInsightBlock: AIInsightBlock,
    articleGridBlock: ArticleGridBlock,
  },
};

export default function PortableTextComponent({ value }: { value: any }) {
  return <PortableText value={value} components={components} />;
}
`.trim();

// Klasörleri oluştur
ensureDir(blocksDir);

// Dosyaları yaz
writeFile(path.join(blocksDir, 'AIInsightBlock.tsx'), aiInsightBlockContent);
writeFile(path.join(blocksDir, 'ArticleGridBlock.tsx'), articleGridBlockContent);
writeFile(path.join(componentsDir, 'PortableTextComponent.tsx'), portableTextComponentContent);

console.log('Blok bileşenleri ve PortableTextComponent oluşturuldu.');
console.log('Projede test edip çalıştırabilirsin.');
