import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'schema.project',
  title: 'Project Schema',
  type: 'object',
  fields: [
    defineField({
      name: 'type',
      title: 'Content Type',
      type: 'string',
      options: {
        list: [
          {title: 'Product', value: 'Product'},
          {title: 'Service', value: 'Service'},
          {title: 'Event', value: 'Event'},
        ],
      },
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
    defineField({
      name: 'author',
      type: 'object',
      title: 'Author',
      fields: [
        {name: 'name', type: 'string', title: 'Name'},
        {name: 'url', type: 'url', title: 'URL', description: 'Link to author profile'},
        {name: 'image', type: 'image', title: 'Image'},
      ],
    }),
  ],
})
