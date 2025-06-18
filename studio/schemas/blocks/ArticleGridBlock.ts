import { defineField, defineType } from 'sanity';

export const articleGridBlock = defineType({
  name: 'articleGridBlock',
  title: 'Makale Izgarası Bloğu',
  type: 'object',
  fields: [
    defineField({
      name: 'heading',
      title: 'Başlık',
      type: 'string',
      description: 'Makale ızgarası bölümünün başlığı (örn: Son Haberler, Öne Çıkan Makaleler)'
    }),
    defineField({
      name: 'categoryFilter',
      title: 'Kategoriye Göre Filtrele',
      type: 'reference',
      to: [{ type: 'category' }], // Mevcut 'category' şemasına referans olacak (eğer tanımlıysa)
      description: 'Belirli bir kategoriye ait makaleleri göstermek için seçin. (Opsiyonel)'
    }),
    defineField({
      name: 'numberOfArticles',
      title: 'Gösterilecek Makale Sayısı',
      type: 'number',
      description: 'Izgarada kaç makale gösterileceği.',
      validation: Rule => Rule.min(1).max(10).warning('Lütfen 1 ile 10 arasında bir sayı girin.'),
      initialValue: 3
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      category: 'categoryFilter.title'
    },
    prepare(selection) {
      const { title, category } = selection;
      return {
        title: `📰 Makale Izgarası: ${{title || 'Başlıksız Izgara'}}`,
        subtitle: category ? `Kategori: ${{category}}` : 'Tüm Kategoriler',
      };
    },
  },
});