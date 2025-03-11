import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'schema.page',
  title: 'Page',
  type: 'object',
  fields: [
    defineField({
      name: 'type',
      title: 'Content Type',
      type: 'string',
      options: {
        list: [
          {title: 'WebPage', value: 'WebPage'},
          {title: 'AboutPage', value: 'AboutPage'},
          {title: 'Product', value: 'Product'},
          {title: 'Service', value: 'Service'},
          {title: 'Event', value: 'Event'},
          {title: 'Article', value: 'Article'},
          {title: 'Document', value: 'Document'},
          {title: 'Other', value: 'Other'},
        ],
      },
      initialValue: 'WebPage',
    }),
    defineField({
      name: 'breadcrumb',
      title: 'Breadcrumb',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {type: 'string', name: 'name'},
            {type: 'string', name: 'url'},
          ],
        },
      ],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
    }),
    defineField({
      name: 'modifiedAt',
      title: 'Last Modified Date',
      type: 'datetime',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'object',
      fields: [
        {type: 'string', name: 'name'},
        {type: 'string', name: 'url'},
      ],
    }),
  ],
})
