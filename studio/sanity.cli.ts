// sanity.cli.ts
import {defineCliConfig} from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: '13f1s0mc', // Doğru Project ID'niz
    dataset: 'production'
  }
});
