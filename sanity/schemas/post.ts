import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'post',
  title: 'Yazı',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Başlık',
      type: 'string',
      validation: Rule => Rule.required(),
      description: 'Yazının ana başlığı.'
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
      description: 'Yazının URL yolu. Otomatik oluşur.'
    }),
    defineField({
      name: 'author',
      title: 'Yazar',
      type: 'reference',
      to: { type: 'author' },
      description: 'Yazının yazarı.'
    }),
    defineField({
      name: 'mainImage',
      title: 'Ana Görsel',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternatif Metin (SEO)',
          type: 'string',
          description: 'Resim için kısa açıklayıcı metin.'
        })
      ],
      description: 'Yazının kapak görseli.'
    }),
    defineField({
      name: 'categories',
      title: 'Kategoriler',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'category' } }],
      description: 'Yazının ait olduğu kategoriler.'
    }),
    defineField({
      name: 'publishedAt',
      title: 'Yayınlanma Tarihi',
      type: 'datetime',
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm',
        calendarTodayLabel: 'Bugün',
      },
      description: 'Yazının yayınlanma tarihi ve saati.'
    }),
    defineField({
      name: 'body',
      title: 'İçerik',
      type: 'array',
      of: [
        { type: 'block' },
        { type: 'image', options: { hotspot: true } },
      ],
      description: 'Yazının ana içeriği.'
    }),
    defineField({
      name: 'excerpt',
      title: 'Kısa Özet',
      type: 'text',
      rows: 3,
      description: 'Yazının kısa bir özeti (liste görünümlerinde kullanılır).'
    }),
    defineField({
      name: 'lang',
      title: 'Dil',
      type: 'string',
      options: {
        list: [
          {title: 'Türkçe', value: 'tr'},
          {title: 'Kürtçe (Kurmancî)', value: 'ku'},
          {title: 'İngilizce', value: 'en'}
        ],
        layout: 'dropdown'
      },
      initialValue: 'tr',
      description: 'Bu içeriğin dili.'
    })
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
    },
    prepare(selection) {
      const { author } = selection;
      return { ...selection, subtitle: author && `by ${author}` };
    },
  },
});