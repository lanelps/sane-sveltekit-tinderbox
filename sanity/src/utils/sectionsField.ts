import {defineArrayMember, defineField} from 'sanity'

export default defineField({
  name: 'sections',
  title: 'Sections',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'exampleSection',
    }),
  ],
})
