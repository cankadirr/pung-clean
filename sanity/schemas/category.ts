import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'category',
  title: 'Kategori',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Başlık',
      type: 'string',
      validation: Rule => Rule.required(),
      description: 'Kategorinin adı (örn: Haber, Analiz, Kültür).'
    }),
    defineField({
      name: 'description',
      title: 'Açıklama',
      type: 'text',
      rows: 3,
      description: 'Kategorinin kısa açıklaması.'
    }),
    defineField({
      name: 'slug',
      title: 'URL Yolu (Slug)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required(),
      description: 'Kategori sayfasının URL yolu.'
    }),
  ],
});