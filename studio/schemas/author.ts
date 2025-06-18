import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'author',
  title: 'Yazar',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Adı',
      type: 'string',
      validation: Rule => Rule.required(),
      description: 'Yazarın tam adı.'
    }),
    defineField({
      name: 'slug',
      title: 'URL Yolu (Slug)',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: Rule => Rule.required(),
      description: 'Yazar profilinin URL yolu.'
    }),
    defineField({
      name: 'image',
      title: 'Profil Resmi',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Yazarın profil resmi.'
    }),
    defineField({
      name: 'bio',
      title: 'Biyografi',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [{ title: 'Normal', value: 'normal' }],
          lists: [],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
            annotations: [],
          },
        },
      ],
      description: 'Yazar hakkında kısa bir biyografi.'
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
    },
  },
});