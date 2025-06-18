const fs = require('fs');
const path = require('path');

const blocksDir = path.join(__dirname, 'frontend', 'components', 'blocks');

if (!fs.existsSync(blocksDir)) {
  fs.mkdirSync(blocksDir, { recursive: true });
}

const articleGridBlockContent = `
export default function ArticleGridBlock({ value }: { value: any }) {
  // Konsola articles verisini yazdır
  console.log('ArticleGridBlock articles:', value.articles);

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
      {value.articles?.map((article: any, i: number) => (
        <article key={article._id || i} className="border p-3 rounded shadow-sm">
          <h3 className="font-semibold">{article.title}</h3>
        </article>
      ))}
    </section>
  );
}
`.trim();

fs.writeFileSync(path.join(blocksDir, 'ArticleGridBlock.tsx'), articleGridBlockContent, 'utf8');
console.log('ArticleGridBlock.tsx dosyası oluşturuldu ve güncellendi.');
