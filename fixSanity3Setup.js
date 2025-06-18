const { execSync } = require('child_process');
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

console.log('1. @sanity/desk-tool paketini 3.x sürüme güncelliyoruz...');
execSync('npm install @sanity/desk-tool@^3 --prefix studio', { stdio: 'inherit' });

console.log('2. node_modules ve .sanity klasörlerini siliyoruz...');
execSync('rm -rf node_modules .sanity studio/node_modules studio/.sanity', { stdio: 'inherit' });

console.log('3. Projeyi yeniden kuruyoruz...');
execSync('npm install', { stdio: 'inherit' });
execSync('npm install --prefix studio', { stdio: 'inherit' });

console.log('4. Sanity 3 uyumlu schema.ts ve blokları oluşturuyoruz...');

ensureDir(blocksDir);

const schemaTsContent = `import { createSchema } from 'sanity'
import page from './page'
import post from './post'
import customBlock from './blocks/CustomBlock'

export default createSchema({
  name: 'default',
  types: [page, post, customBlock],
})
`;

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

writeFile(path.join(schemaDir, 'schema.ts'), schemaTsContent);
writeFile(path.join(schemaDir, 'page.ts'), pageSchema);
writeFile(path.join(schemaDir, 'post.ts'), postSchema);
ensureDir(blocksDir);
writeFile(path.join(blocksDir, 'CustomBlock.ts'), customBlockContent);

console.log('5. Güncelleme tamamlandı! Şimdi Studio\'yu başlatabilirsin.');
