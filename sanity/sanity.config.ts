import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {presentationTool} from 'sanity/presentation'
import {visionTool} from '@sanity/vision'

import type {PluginOptions} from 'sanity'

import {schemaTypes} from './src/schemas'
import {deskStructure} from './src/desk'
import {resolveLocations} from './src/presentation'

const isDev = process.env.NODE_ENV === 'development'
const PROJECT_ID = process.env.SANITY_STUDIO_PROJECT_ID
const DATASET = process.env.SANITY_STUDIO_DATASET
const PREVIEW_URL = process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:5173/'

if (!PROJECT_ID || !DATASET) {
  throw new Error(
    `Missing environment variable(s). Check if named correctly in .env file.\n\nShould be:\nSANITY_STUDIO_PROJECT_ID=${PROJECT_ID}\nSANITY_STUDIO_DATASET=${DATASET}\n\nAvailable environment variables:\n${JSON.stringify(
      process.env,
      null,
      2,
    )}`,
  )
}

export default defineConfig({
  name: 'default',
  title: 'boilerplate',

  projectId: PROJECT_ID,
  dataset: DATASET,

  plugins: [
    structureTool({structure: deskStructure}),
    presentationTool({
      resolve: resolveLocations,
      previewUrl: {
        origin: PREVIEW_URL,
        previewMode: {
          enable: '/preview/enable',
          disable: '/preview/disable',
        },
      },
    }),
    isDev ? visionTool() : null,
  ].filter((plugin): plugin is PluginOptions => plugin !== null),

  schema: {
    types: schemaTypes,
  },
})
