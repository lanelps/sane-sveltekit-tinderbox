import {defineArrayMember, defineField, defineType} from 'sanity'

export default defineType({
  name: 'settings',
  title: 'Settings',
  type: 'document',
  groups: [
    {
      name: 'seo',
      title: 'SEO',
    },
    {
      name: 'scripts',
      title: 'External Scripts',
    },
    {
      name: 'redirects',
      title: 'Redirects',
    },
  ],
  fields: [
    // SEO
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo.settings',
      group: 'seo',
      options: {
        collapsed: false,
        collapsible: true,
      },
    }),
    // Scripts
    defineField({
      name: 'scripts',
      title: 'External Scripts',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'scriptSrc',
        }),
        defineArrayMember({
          type: 'scriptInline',
        }),
      ],
      group: 'scripts',
      description:
        'Add external scripts to the <head> of the document. For example, Google Analytics. These fields are not sanitized, so be careful what you put in here.',
    }),

    // Redirects
    defineField({
      name: 'redirects',
      title: 'Redirects',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'redirect',
        }),
      ],
      group: 'redirects',
    }),
  ],
})
