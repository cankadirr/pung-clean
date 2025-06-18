import {defineType} from 'sanity'

export const aiInsightBlock = defineType({
  name: 'aiInsightBlock',
  title: 'AI Insight Block',
  type: 'object',
  fields: [
    {
      name: 'title',
      title: 'Başlık',
      type: 'string',
      validation: Rule => Rule.required(),
    },
    {
      name: 'summary',
      title: 'Özet',
      type: 'text',
    },
    {
      name: 'details',
      title: 'Detaylar',
      type: 'array',
      of: [{type: 'block'}],
    },
  ],
})