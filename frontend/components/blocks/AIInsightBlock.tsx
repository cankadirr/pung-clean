export default function AIInsightBlock({ value }: { value: any }) {
  return (
    <section className="bg-blue-100 p-4 rounded-md mb-4">
      <h2 className="text-xl font-semibold mb-2">{value.title}</h2>
      <p className="mb-2">{value.summary}</p>
      {value.details && (
        <div>
          {value.details.map((block: any, i: number) => (
            <p key={block._key || i}>{block.children?.[0]?.text || ''}</p>
          ))}
        </div>
      )}
    </section>
  );
}