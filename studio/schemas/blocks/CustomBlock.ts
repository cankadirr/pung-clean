import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'customBlock',
  title: 'Custom Block',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Başlık',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Açıklama',
      type: 'text',
    }),
  ],
})
