import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './src/schemas'
import deskStructure from './src/deskStructure'

export default defineConfig({
  name: 'default',
  title: 'template',

  projectId: '70depdtt',
  dataset: 'production',

  plugins: [deskTool({structure: deskStructure}), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
