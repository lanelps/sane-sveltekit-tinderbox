import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'schema.home',
  title: 'Home Page Schema',
  type: 'object',
  fields: [
    defineField({
      name: 'type',
      title: 'Content Type',
      type: 'string',
      initialValue: 'WebPage',
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
  ],
})
