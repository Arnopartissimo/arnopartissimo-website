import { defineField, defineType } from 'sanity';

export const mediaType = defineType({
  name: 'media',
  title: 'Media',
  type: 'object',
  fields: [
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Image', value: 'image' },
          { title: 'Video', value: 'video' },
        ],
        layout: 'radio',
      },
      initialValue: 'image',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          { title: 'Wide', value: 'wide' },
          { title: 'Square', value: 'square' },
        ],
        layout: 'radio',
      },
      initialValue: 'wide',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', type: 'string', title: 'Alt text' }),
        defineField({ name: 'caption', type: 'string', title: 'Caption' }),
        defineField({ name: 'credits', type: 'string', title: 'Credits' }),
      ],
      hidden: ({ parent }) => parent?.type !== 'image',
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      description: 'YouTube, Vimeo, or direct video file URL',
      hidden: ({ parent }) => parent?.type !== 'video',
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      hidden: ({ parent }) => parent?.type !== 'video',
    }),
    defineField({
      name: 'credits',
      title: 'Credits',
      type: 'string',
      hidden: ({ parent }) => parent?.type !== 'video',
    }),
  ],
  preview: {
    select: {
      type: 'type',
      alt: 'image.alt',
      caption: 'caption',
      media: 'image',
    },
    prepare({ type, alt, caption, media }) {
      return {
        title: type === 'image' ? alt || 'Image' : 'Video',
        subtitle: caption,
        media,
      };
    },
  },
});
