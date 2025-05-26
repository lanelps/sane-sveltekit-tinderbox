import {defineConfig, isDev} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {presentationTool} from 'sanity/presentation'
import {muxInput} from 'sanity-plugin-mux-input'
import {media} from 'sanity-plugin-media'

import {schema} from './src/schemas'
import {deskStructure} from './src/lib/desk'
import {resolve} from './src/lib/resolve'
import {customDocumentActions} from './src/plugins/customDocumentActions'
import Navbar from './src/components/studio/Navbar'

import type {PluginOptions} from 'sanity'

const devOnlyPlugins = [visionTool()]

const projectId = process.env.SANITY_STUDIO_PROJECT_ID!
const dataset = process.env.SANITY_STUDIO_DATASET!

const visualEditingEnabled = process.env.SANITY_STUDIO_VISUAL_EDITING_ENABLED
const previewUrl = process.env.SANITY_STUDIO_PREVIEW_URL

export default defineConfig({
  name: 'default',
  title: 'boilerplate',

  projectId,
  dataset,

  plugins: [
    structureTool({structure: deskStructure}),
    visualEditingEnabled && previewUrl
      ? presentationTool({
          resolve,
          previewUrl: {origin: previewUrl},
        })
      : null,
    media(),
    muxInput(),
    customDocumentActions(),
    ...(isDev ? devOnlyPlugins : []),
  ].filter((plugin): plugin is PluginOptions => plugin !== null),

  form: {
    image: {
      assetSources: (previousAssetSources: any[]) => {
        return previousAssetSources.filter((assetSource: any) => assetSource.name === 'media')
      },
    },
  },

  schema,

  studio: {
    components: {
      navbar: Navbar,
    },
  },
})
