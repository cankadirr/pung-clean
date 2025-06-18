export default function CrisisTimelineBlock({ value }: { value: any }) {
  return (
    <section className="bg-red-100 p-4 rounded-md mb-4">
      <h2 className="text-xl font-semibold mb-2">Kriz Zaman Çizelgesi</h2>
      <div>
        {value.events?.map((event: any, i: number) => (
          <p key={event._key || i}>{event.children?.[0]?.text || ''}</p>
        ))}
      </div>
    </section>
  );
}