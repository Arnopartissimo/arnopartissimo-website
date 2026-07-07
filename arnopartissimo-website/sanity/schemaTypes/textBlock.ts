import { defineField, defineType } from 'sanity';

export const textBlockType = defineType({
  name: 'textBlock',
  title: 'Text Block',
  type: 'object',
  fields: [
    defineField({
      name: 'text',
      title: 'Text',
      type: 'array',
      of: [{ type: 'block' }],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      text: 'text',
    },
    prepare({ text }) {
      const firstBlock = text?.[0];
      const firstChild = firstBlock?.children?.[0];
      const previewText = firstChild?.text || 'Text block';
      return {
        title: previewText.slice(0, 80) + (previewText.length > 80 ? '…' : ''),
      };
    },
  },
});
