import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'site',
  title: 'Site',
  type: 'document',
  icon: () => '🌐',
  groups: [
    {
      name: 'navigation',
      title: 'Navigation',
    },
    {
      name: 'branding',
      title: 'Branding',
    },
    {
      name: 'seo',
      title: 'SEO',
    },
  ],
  fields: [
    // Navigation
    defineField({
      name: 'navigation',
      title: 'Navigation',
      type: 'array',
      of: [{type: 'link'}],
      group: 'navigation',
    }),
    // Branding
    defineField({
      name: 'organization',
      title: 'Organization',
      type: 'object',
      group: 'branding',
      fields: [
        {
          name: 'name',
          title: 'Name',
          type: 'string',
        },
        {
          name: 'logo',
          title: 'Logo',
          type: 'image',
        },
      ],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      group: 'branding',
      of: [{type: 'link'}],
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'object',
      group: 'branding',
      fields: [
        {name: 'street', type: 'string', title: 'Street'},
        {name: 'city', type: 'string', title: 'City'},
        {name: 'state', type: 'string', title: 'State'},
        {name: 'zipCode', type: 'string', title: 'Zip Code'},
        {name: 'country', type: 'string', title: 'Country'},
      ],
      options: {
        collapsible: true,
      },
    }),
    // SEO
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo.site',
      group: 'seo',
    }),
  ],
})
