const fs = require('fs')
const path = require('path')

const studioPath = path.resolve(__dirname, 'studio')
const schemasPath = path.join(studioPath, 'schemas')

// Şema dosya içerikleri (örnekleri Gemini'den)
const sanityConfig = `import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import schema from './schemas/schema'

export default defineConfig({
  name: 'default',
  title: 'pung-clean',

  projectId: '13f1s0mc',
  dataset: 'production',

  plugins: [deskTool()],

  schema: {
    types: schema.types,
  },
})
`

const schemaIndex = `import { createSchema } from 'sanity'
import page from './page'
import post from './post'
import author from './author'
import category from './category'
import video from './video'

export default createSchema({
  name: 'default',
  types: [page, post, author, category, video],
})
`

const pageSchema = `import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'page',
  title: 'Sayfa',
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
      options: { source: 'title' },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'İçerik',
      type: 'array',
      of: [{ type: 'block' }],
    }),
  ],
})
`

const postSchema = `import { defineType, defineField } from 'sanity'

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
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'İçerik',
      type: 'array',
      of: [{ type: 'block' }],
    }),
  ],
})
`

const authorSchema = `import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'author',
  title: 'Yazar',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'İsim',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'bio',
      title: 'Biyografi',
      type: 'text',
    }),
  ],
})
`

const categorySchema = `import { defineType, defineField } from 'sanity'

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
    }),
    defineField({
      name: 'description',
      title: 'Açıklama',
      type: 'text',
    }),
  ],
})
`

const videoSchema = `import { defineType, defineField } from 'sanity'

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
    }),
    defineField({
      name: 'url',
      title: 'Video URL',
      type: 'url',
    }),
  ],
})
`

function writeFile(filePath, content) {
  const dir = path.dirname(filePath)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(filePath, content, 'utf8')
  console.log('Created/Updated:', filePath)
}

writeFile(path.join(studioPath, 'sanity.config.ts'), sanityConfig)
writeFile(path.join(schemasPath, 'schema.ts'), schemaIndex)
writeFile(path.join(schemasPath, 'page.ts'), pageSchema)
writeFile(path.join(schemasPath, 'post.ts'), postSchema)
writeFile(path.join(schemasPath, 'author.ts'), authorSchema)
writeFile(path.join(schemasPath, 'category.ts'), categorySchema)
writeFile(path.join(schemasPath, 'video.ts'), videoSchema)

console.log('Şema dosyaları oluşturuldu/güncellendi. Studio\'yu yeniden başlat.')
