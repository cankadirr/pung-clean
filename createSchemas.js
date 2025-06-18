const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'studio', 'schemas');
const blocksDir = path.join(baseDir, 'blocks');

const files = {
  [path.join(blocksDir, 'AIInsightBlock.ts')]: `import {defineType} from 'sanity'

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
})`,

  [path.join(blocksDir, 'ArticleGridBlock.ts')]: `import {defineType} from 'sanity'

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
})`,

  [path.join(blocksDir, 'CrisisTimelineBlock.ts')]: `import {defineType} from 'sanity'

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
})`,

  [path.join(baseDir, 'page.ts')]: `import {defineType, defineField} from 'sanity'
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
})`,

  [path.join(baseDir, 'schema.ts')]: `import {page} from './page'
import {aiInsightBlock} from './blocks/AIInsightBlock'
import {articleGridBlock} from './blocks/ArticleGridBlock'
import {crisisTimelineBlock} from './blocks/CrisisTimelineBlock'

export const schemaTypes = [
  page,
  aiInsightBlock,
  articleGridBlock,
  crisisTimelineBlock,
]`
};

function createDirs() {
  if (!fs.existsSync(baseDir)) fs.mkdirSync(baseDir, {recursive: true});
  if (!fs.existsSync(blocksDir)) fs.mkdirSync(blocksDir, {recursive: true});
}

function writeFiles() {
  Object.entries(files).forEach(([filePath, content]) => {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Created: ${filePath}`);
  });
}

createDirs();
writeFiles();
