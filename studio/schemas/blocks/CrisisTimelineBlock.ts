import {defineType} from 'sanity'

export const crisisTimelineBlock = defineType({
  name: 'crisisTimelineBlock',
  title: 'Crisis Timeline Block',
  type: 'object',
  fields: [
    {
      name: 'events',
      title: 'Olaylar',
      type: 'array',
      of: [{type: 'block'}],
    },
  ],
})