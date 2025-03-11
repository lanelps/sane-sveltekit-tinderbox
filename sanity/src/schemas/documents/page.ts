import {defineField, defineType} from 'sanity'

import sections from '../../utils/sections'

export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
      },
    }),
    sections,
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo.page',
    }),
  ],
})
