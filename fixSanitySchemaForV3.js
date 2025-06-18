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
import customBlock from './blocks/CustomBlock'

export default createSchema({
  name: 'default',
  types: [
    customBlock,
    // Diğer şema tipleri buraya eklenebilir
  ],
})
`

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
`

ensureDir(blocksDir)

writeFile(path.join(schemaDir, 'schema.ts'), schemaTsContent)
writeFile(path.join(blocksDir, 'CustomBlock.ts'), customBlockContent)

console.log('Sanity 3 uyumlu schema.ts ve CustomBlock.ts dosyaları oluşturuldu/güncellendi.')
