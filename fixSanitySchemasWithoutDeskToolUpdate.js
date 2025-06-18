const fs = require('fs');
const path = require('path');

const studioDir = path.join(__dirname, 'studio');
const schemaDir = path.join(studioDir, 'schemas');
const blocksDir = path.join(schemaDir, 'blocks');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Created/Updated: ${filePath}`);
}

// Sanity 3 uyumlu schema.ts
const schemaTsContent = `import { createSchema } from 'sanity'
import page from './page'
import post from './post'
import customBlock from './blocks/CustomBlock'

export default createSchema({
  name: 'default',
  types: [page, post, customBlock],
})
`;

// Sanity 3 uyumlu page.ts
const pageSchema = `import { defineType, defineField } from 'sanity'

export default defineType({
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
`;

// Sanity 3 uyumlu post.ts
const postSchema = `import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'post',
  title: 'Post',
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
      title: 'Body',
      type: 'array',
      of: [{ type: 'block' }],
    }),
  ],
})
`;

// Sanity 3 uyumlu CustomBlock.ts
const customBlockContent = `import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'customBlock',
  title: 'Custom Block',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Başlık',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Açıklama',
      type: 'text',
    }),
  ],
})
`;

ensureDir(blocksDir);

writeFile(path.join(schemaDir, 'schema.ts'), schemaTsContent);
writeFile(path.join(schemaDir, 'page.ts'), pageSchema);
writeFile(path.join(schemaDir, 'post.ts'), postSchema);
writeFile(path.join(blocksDir, 'CustomBlock.ts'), customBlockContent);

console.log('Sanity 3 uyumlu şema dosyaları oluşturuldu/güncellendi (desk-tool sürümü değiştirilmedi).');
