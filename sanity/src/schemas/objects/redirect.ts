import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'redirect',
  title: 'Redirect',
  type: 'object',
  icon: () => '🔀',
  fields: [
    defineField({
      name: 'from',
      title: 'From',
      type: 'string',
    }),
    defineField({
      name: 'to',
      title: 'To',
      type: 'string',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      validation: (Rule) => Rule.required(),
      initialValue: '301',
      options: {
        list: [
          {title: '301 Permenant', value: '301'},
          {title: '302 Temporary', value: '302'},
        ],
      },
    }),
  ],
  preview: {
    select: {
      from: 'from',
      to: 'to',
      status: 'status',
    },
    prepare: ({from, to, status}) => ({
      title: `${status} Redirect`,
      subtitle: `${from} → ${to}`,
    }),
  },
})
