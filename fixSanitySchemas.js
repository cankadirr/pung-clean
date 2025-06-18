const fs = require('fs');
const path = require('path');

const studioDir = path.join(__dirname, 'studio');
const schemasDir = path.join(studioDir, 'schemas');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
}

function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Created/Updated file: ${filePath}`);
}

ensureDir(schemasDir);

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

const schemaTs = `import { createSchema } from 'sanity'
import page from './page'
import post from './post'
import customBlock from './blocks/CustomBlock'

export default createSchema({
  name: 'default',
  types: [page, post, customBlock],
})
`;

writeFile(path.join(schemasDir, 'page.ts'), pageSchema);
writeFile(path.join(schemasDir, 'post.ts'), postSchema);
writeFile(path.join(schemasDir, 'schema.ts'), schemaTs);

console.log('Sanity temel schema dosyaları oluşturuldu ve güncellendi.');
