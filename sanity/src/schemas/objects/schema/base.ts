import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'schema.base',
  title: 'Base Schema',
  type: 'object',
  fields: [
    defineField({
      name: 'type',
      title: 'Content Type',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
      title: 'Published Date',
    }),
    defineField({
      name: 'modifiedAt',
      type: 'datetime',
      title: 'Last Modified Date',
    }),
    defineField({
      name: 'breadcrumb',
      type: 'array',
      title: 'Breadcrumb',
      description: 'Define the page hierarchy for breadcrumb navigation',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'name', type: 'string', title: 'Name'},
            {name: 'url', type: 'string', title: 'URL'},
          ],
        },
      ],
    }),
  ],
})
