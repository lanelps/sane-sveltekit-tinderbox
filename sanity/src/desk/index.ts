import {generateDeskStructure} from '../utils/desk'
import type {StructureBuilder} from 'sanity/structure'

interface DocumentItem {
  title: string
  type: string
  icon?: () => string
  singleton?: boolean
  divider?: boolean
}

interface GroupDocument {
  title: string
  type: 'group'
  icon?: () => string
  items: DocumentItem[]
  divider?: boolean
}

type Document = DocumentItem | GroupDocument

const documents: Document[] = [
  {
    title: 'Pages',
    type: 'group',
    icon: () => '📚',
    divider: true,
    items: [
      {
        title: 'Home',
        type: 'homePage',
        icon: () => '🏠',
        singleton: true,
      },
      {
        title: 'Page',
        type: 'page',
        icon: () => '📄',
      },
    ],
  },
  {
    title: 'Projects',
    type: 'project',
    icon: () => '📁',
    divider: true,
  },
  {
    title: 'Site',
    type: 'site',
    icon: () => '🌐',
    singleton: true,
  },
  {
    title: 'Settings',
    type: 'settings',
    icon: () => '⚙️',
    singleton: true,
  },
]

const DOCUMENT_TYPES_IN_STRUCTURE = [
  'media.tag',
  ...documents.flatMap((document) => {
    if (document.type === 'group') {
      return (document as GroupDocument).items.map((item) => item.type)
    }

    return document.type
  }),
] as string[]

export const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title('Content')
    .items([
      ...generateDeskStructure(S, documents),
      ...S.documentTypeListItems().filter(
        (listItem) => !DOCUMENT_TYPES_IN_STRUCTURE.includes(listItem.getId() || ''),
      ),
    ])
