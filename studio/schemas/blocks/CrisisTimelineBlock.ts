import { defineField, defineType } from 'sanity';

export const crisisTimelineBlock = defineType({
  name: 'crisisTimelineBlock',
  title: 'Kriz Zaman Çizelgesi Bloğu',
  type: 'object',
  fields: [
    defineField({
      name: 'timelineTitle',
      title: 'Başlık',
      type: 'string',
      validation: Rule => Rule.required(),
      description: 'Zaman çizelgesinin ana başlığı (örn: 2023 Kahramanmaraş Depremleri Zaman Çizelgesi)'
    }),
    defineField({
      name: 'description',
      title: 'Açıklama',
      type: 'text',
      rows: 3,
      description: 'Zaman çizelgesinin kısa bir açıklaması.'
    }),
    defineField({
      name: 'events',
      title: 'Olaylar',
      type: 'array',
      of: [
        defineField({
          name: 'eventItem',
          title: 'Zaman Çizelgesi Olayı',
          type: 'object',
          fields: [
            defineField({
              name: 'date',
              title: 'Tarih',
              type: 'datetime',
              options: {
                dateFormat: 'YYYY-MM-DD',
                timeFormat: 'HH:mm',
                calendarTodayLabel: 'Bugün',
              },
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'eventTitle',
              title: 'Olay Başlığı',
              type: 'string',
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'eventDescription',
              title: 'Olay Açıklaması',
              type: 'array',
              of: [{ type: 'block' }],
            }),
            defineField({
              name: 'image',
              title: 'İlgili Görsel',
              type: 'image',
              options: {
                hotspot: true,
              },
              fields: [
                defineField({
                  name: 'alt',
                  title: 'Alternatif Metin',
                  type: 'string',
                })
              ]
            })
          ],
          preview: {
            select: {
              title: 'eventTitle',
              subtitle: 'date',
            },
            prepare(selection) {
              const { title, subtitle } = selection;
              const formattedDate = subtitle ? new Date(subtitle).toLocaleDateString() : 'Tarihsiz';
              return {
                title: title || 'Başlıksız Olay',
                subtitle: `🗓️ ${formattedDate}`,
              };
            },
          },
        }),
      ],
      validation: Rule => Rule.min(1).error('En az bir olay olmalıdır.'),
      description: 'Zaman çizelgesine olayları ekleyin.'
    })
  ],
  preview: {
    select: {
      title: 'timelineTitle',
      events: 'events',
    },
    prepare(selection) {
      const { title, events } = selection;
      const eventCount = events ? events.length : 0;
      return {
        title: `⏳ Zaman Çizelgesi: ${title || 'Başlıksız Zaman Çizelgesi'}`,
        subtitle: `${eventCount} olay içeriyor`,
      };
    },
  },
});