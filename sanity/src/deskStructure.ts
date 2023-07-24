import {generateDocumentStructure, generateSingletonStructure} from './utils/desk'

const documents = [
  {
    title: `Page`,
    type: `page`,
    icon: () => `📄`,
  },
] as any[]

const DOCUMENT_TYPES_IN_STRUCTURE = [
  // `globals`,
  `media.tag`,
  `settings`,
  ...documents.map((document) => document.type),
] as string[]

export default (S) =>
  S.list()
    .title(`Content`)
    .items([
      ...documents.map((document) => generateDocumentStructure(S, document)),
      S.divider(),
      // generateSingletonStructure(S, {
      //   title: `Globals`,
      //   type: `globals`,
      //   icon: () => '🌏',
      // }),
      generateSingletonStructure(S, {
        title: `Settings`,
        type: `settings`,
        icon: () => `⚙️`,
      }),
      ...S.documentTypeListItems().filter(
        (listItem) => !DOCUMENT_TYPES_IN_STRUCTURE.includes(listItem.getId())
      ),
    ])
