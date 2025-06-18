import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: '13f1s0mc',
    dataset: 'production'
  },
  /**
   * Enable auto-updates for studios.
   * Learn more at https://www.sanity.io/docs/cli#auto-updates
   */
  autoUpdates: true,
})
