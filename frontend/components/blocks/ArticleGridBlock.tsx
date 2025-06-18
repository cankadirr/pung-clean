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