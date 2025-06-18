import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'video',
  title: 'Video',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Başlık',
      type: 'string',
      validation: Rule => Rule.required(),
      description: 'Videonun başlığı.'
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
      description: 'Videonun URL yolu.'
    }),
    defineField({
      name: 'url',
      title: 'Video URL (YouTube/Vimeo vb.)',
      type: 'url',
      validation: Rule => Rule.required().uri({
        allowRelative: false,
        scheme: ['http', 'https']
      }),
      description: "Videonun doğrudan URL'si (örn: YouTube, Vimeo linki)."
    }),
    defineField({
      name: 'thumbnail',
      title: 'Video Küçük Resmi',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternatif Metin',
          type: 'string',
          description: 'Video küçük resmi için açıklayıcı metin.'
        })
      ],
      description: 'Videonun önizleme görseli.'
    }),
    defineField({
      name: 'description',
      title: 'Açıklama',
      type: 'text',
      rows: 3,
      description: 'Videonun kısa açıklaması.'
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
      description: 'Videonun yayınlanma tarihi.'
    }),
    defineField({
      name: 'categories',
      title: 'Kategoriler',
      type: 'array',
      of: [{ type: 'reference', to: { type: 'category' } }],
      description: 'Videonun ait olduğu kategoriler.'
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'thumbnail',
    },
  },
});