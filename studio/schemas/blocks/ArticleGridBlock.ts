import {defineType} from 'sanity'

export const articleGridBlock = defineType({
  name: 'articleGridBlock',
  title: 'Article Grid Block',
  type: 'object',
  fields: [
    {
      name: 'articles',
      title: 'Makaleler',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'post'}]}],
    },
  ],
})