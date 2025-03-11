import {defineField, defineType} from 'sanity'

import sections from '../../utils/sections'

export default defineType({
  name: 'info',
  title: 'Info Page',
  type: 'document',
  icon: () => `ℹ️`,
  groups: [
    {
      name: 'content',
      title: 'Content',
    },
    {
      name: 'seo',
      title: 'SEO',
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
      },
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    sections,
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo.info',
      group: 'seo',
    }),
  ],
})
