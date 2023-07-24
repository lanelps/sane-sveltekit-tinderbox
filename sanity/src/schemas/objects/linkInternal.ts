import {defineField, defineType} from 'sanity'

export default defineType({
  title: 'Internal Link',
  name: 'linkInternal',
  type: 'object',
  icon: () => '📄',
  fields: [
    // Title
    defineField({
      title: 'Title',
      name: 'title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    // Reference
    defineField({
      name: 'reference',
      type: 'reference',
      weak: true,
      to: [{type: 'page'}],
    }),
  ],
  preview: {
    select: {
      reference: 'reference',
      referenceTitle: 'reference.title',
      title: 'title',
    },
    prepare: ({reference, referenceTitle, title}) => {
      let subtitle = []
      if (reference) {
        subtitle.push([`→ ${referenceTitle || reference?._id}`])
      } else {
        subtitle.push('(Nonexistent document reference)')
      }

      return {
        subtitle: subtitle.join(' '),
        title: title,
      }
    },
  },
})
