import { defineConfig } from 'sanity'
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
