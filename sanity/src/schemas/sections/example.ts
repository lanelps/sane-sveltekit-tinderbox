import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'exampleSection',
  title: 'Example',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'portableText',
    }),
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'body',
    },
  },
})
