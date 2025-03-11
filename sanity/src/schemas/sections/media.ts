import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'media.section',
  title: 'Media Section',
  type: 'object',
  fields: [
    defineField({
      name: 'media',
      title: 'Media',
      type: 'media',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      image: 'media.image',
      video: 'media.video.poster',
    },
    prepare: ({image, video}) => ({
      title: 'Media Section',
      media: image || video,
    }),
  },
})
