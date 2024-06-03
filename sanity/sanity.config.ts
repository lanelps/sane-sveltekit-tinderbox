import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './src/schemas'
import deskStructure from './src/deskStructure'

export default defineConfig({
  name: 'default',
  title: 'template',

  projectId: '70depdtt',
  dataset: 'production',

  plugins: [structureTool({structure: deskStructure}), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
