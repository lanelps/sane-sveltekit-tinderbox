import {defineField, defineType} from 'sanity'

export default defineType({
  title: 'External Link',
  name: 'linkExternal',
  type: 'object',
  icon: () => '🌐',
  fields: [
    // Title
    defineField({
      title: 'Title',
      name: 'title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    // URL
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (Rule) => Rule.required().uri({scheme: ['http', 'https', 'tel', 'mailto']}),
    }),
    // Open in a new window
    defineField({
      title: 'Open in a new window?',
      name: 'newWindow',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      url: 'url',
    },
    prepare: ({title, url}) => {
      let subtitle = []
      if (url) {
        subtitle.push(`→ ${url}`)
      }

      return {
        subtitle: subtitle.join(' '),
        title,
      }
    },
  },
})
