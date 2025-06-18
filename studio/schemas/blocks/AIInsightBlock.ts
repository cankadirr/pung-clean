import { defineType, defineField } from 'sanity';

export const aiInsightBlock = defineType({
  name: 'aiInsightBlock',
  title: 'AI Insight Block',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Başlık',
      type: 'string',
      validation: Rule => Rule.required(),
      description: 'AI Destekli İçgörü Bloğunun başlığı.'
    }),
    defineField({
      name: 'summary',
      title: 'Özet',
      type: 'text',
      rows: 3,
      description: 'AI içgörüsünün kısa bir özeti.'
    }),
    defineField({
      name: 'details',
      title: 'Detaylar',
      type: 'array',
      of: [{ type: 'block' }], // Portable Text destekli
      description: 'İçgörünün detaylı açıklaması.'
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'summary',
    },
    prepare(selection) {
      const { title, subtitle } = selection;
      return {
        title: `🧠 AI İçgörü: ${{title || 'Başlıksız İçgörü'}}`,
        subtitle: subtitle ? `Özet: ${{subtitle.substring(0, 50)}}...` : 'Detaylı yapay zeka içgörüsü.',
      };
    },
  },
});