import {defineCliConfig} from 'sanity/cli'

const projectId = process.env.SANITY_STUDIO_PROJECT_ID!;
const dataset = process.env.SANITY_STUDIO_STUDIO_DATASET!;

export default defineCliConfig({
  api: {
    projectId,
    dataset
  },
  autoUpdates: false,
  studioHost: "boilerplate",
})
