import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'globalSurveyBlock',
  title: 'Küresel Anket Bloğu',
  type: 'object',
  fields: [
    defineField({
      name: 'surveyTitle',
      title: 'Anket Başlığı',
      type: 'string',
      validation: Rule => Rule.required(),
      description: 'Anketin ana başlığı (örn: Küresel Anket)'
    }),
    defineField({
      name: 'surveyDescription',
      title: 'Anket Açıklaması',
      type: 'text',
      rows: 3,
      description: 'Anket hakkında kısa bir açıklama veya soru.'
    }),
    defineField({
      name: 'options',
      title: 'Anket Seçenekleri',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({
            name: 'text',
            title: 'Seçenek Metni',
            type: 'string',
            validation: Rule => Rule.required(),
          })
        ],
        preview: {
          select: {
            title: 'text'
          }
        }
      }],
      validation: Rule => Rule.min(2).error('En az iki seçenek olmalıdır.'),
      description: 'Anket için seçenekleri ekleyin.'
    })
  ],
  preview: {
    select: {
      title: 'surveyTitle',
    },
    prepare(selection) {
      const { title } = selection;
      return {
        title: `📊 Anket: ${title || 'Başlıksız Anket'}`,
        subtitle: 'Global Survey Bileşeni',
      };
    },
  },
});