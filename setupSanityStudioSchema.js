const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const studioDir = path.join(process.cwd(), 'studio');
const schemasDir = path.join(studioDir, 'schemas');

// Dosya yazma yardımcı fonksiyonu
function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Created/Updated: ${filePath}`);
}

// Şema dosyalarının içerikleri
const pageTs = `import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
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
      title: 'Content',
      type: 'array',
      of: [{ type: 'block' }],
    }),
  ],
});
`;

const postTs = `import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
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
});
`;

const schemaTs = `import { createSchema } from 'sanity'
import page from './page'
import post from './post'

export default createSchema({
  name: 'default',
  types: [page, post],
})
`;

const sanityConfigTs = `import { defineConfig } from 'sanity'
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
});
`;

function cleanNodeModulesAndLock(dir) {
  try {
    console.log(`Cleaning node_modules and package-lock.json in ${dir} ...`);
    execSync(`rd /s /q "${path.join(dir, 'node_modules')}"`, { shell: true });
    execSync(`del /f /q "${path.join(dir, 'package-lock.json')}"`, { shell: true });
  } catch {
    console.log('Files already cleaned or not found.');
  }
}

function installDependencies(dir) {
  console.log(`Running npm install in ${dir} ...`);
  execSync('npm install --legacy-peer-deps', { cwd: dir, stdio: 'inherit', shell: true });
}

function setup() {
  if (!fs.existsSync(studioDir)) {
    console.error(`Studio directory not found at: ${studioDir}`);
    process.exit(1);
  }
  if (!fs.existsSync(schemasDir)) {
    fs.mkdirSync(schemasDir);
    console.log(`Created schemas directory: ${schemasDir}`);
  }

  writeFile(path.join(schemasDir, 'page.ts'), pageTs);
  writeFile(path.join(schemasDir, 'post.ts'), postTs);
  writeFile(path.join(schemasDir, 'schema.ts'), schemaTs);
  writeFile(path.join(studioDir, 'sanity.config.ts'), sanityConfigTs);

  cleanNodeModulesAndLock(studioDir);
  installDependencies(studioDir);

  console.log('Sanity Studio schema setup completed!');
}

setup();
