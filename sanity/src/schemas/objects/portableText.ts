import {defineArrayMember, defineType} from 'sanity'

export default defineType({
  name: 'portableText',
  title: 'Portable Text',
  type: 'array',
  of: [
    defineArrayMember({
      name: 'block',
      title: 'Block',
      type: 'block',

      styles: [
        {title: `Normal`, value: `normal`},
        {title: 'Heading 1', value: 'h1'},
        {title: 'Heading 2', value: 'h2'},
        {title: 'Heading 3', value: 'h3'},
        {title: 'Heading 4', value: 'h4'},
        {title: 'Heading 5', value: 'h5'},
        {title: 'Heading 6', value: 'h6'},
        {title: 'Quote', value: 'blockquote'},
      ],

      lists: [{title: `Bullet`, value: `bullet`}],

      // Marks let you mark up inline text in the block editor.
      marks: {
        // Decorators usually describe a single property – e.g. a typographic
        // preference or highlighting by editors.
        decorators: [
          {title: `Strong`, value: `strong`},
          {title: `Emphasis`, value: `em`},
          {title: `Underline`, value: `underline`},
        ],
        // Annotations can be any object structure – e.g. a link or a footnote.
        annotations: [
          {
            title: `URL`,
            name: `link`,
            type: `object`,
            fields: [
              {
                name: `href`,
                title: `URL`,
                type: `string`,
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      title: `Alt Image`,
      type: `altImage`,
    }),
  ],
})
