import {defineType, defineField} from 'sanity'
import {aiInsightBlock} from './blocks/AIInsightBlock'
import {articleGridBlock} from './blocks/ArticleGridBlock'
import {crisisTimelineBlock} from './blocks/CrisisTimelineBlock'

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Başlık',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'İçerik',
      type: 'array',
      of: [
        {type: 'block'},
        aiInsightBlock,
        articleGridBlock,
        crisisTimelineBlock,
      ],
    }),
  ],
})