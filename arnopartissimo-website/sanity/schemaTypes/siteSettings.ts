import { defineField, defineType } from 'sanity';

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Site Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'description', title: 'Site Description', type: 'text' }),
    defineField({ name: 'logo', title: 'Logo', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'favicon', title: 'Favicon', type: 'image' }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'platform', type: 'string', title: 'Platform' }),
            defineField({ name: 'url', type: 'url', title: 'URL' }),
          ],
        },
      ],
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({ name: 'footerText', title: 'Footer Text', type: 'string' }),
    defineField({
      name: 'defaultSeoImage',
      title: 'Default SEO Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({ name: 'analyticsId', title: 'Analytics ID', type: 'string' }),
    defineField({ name: 'instagramUrl', title: 'Instagram URL', type: 'url' }),
    defineField({
      name: 'availableWorldwideText',
      title: 'Available Worldwide Text',
      type: 'string',
      initialValue: 'AVAILABLE WORLDWIDE',
    }),
    defineField({
      name: 'bookingEmail',
      title: 'Booking Email',
      type: 'string',
      initialValue: 'arno@arnopartissimo.com',
    }),
    defineField({
      name: 'footerLeftLabel',
      title: 'Footer Left Label',
      type: 'string',
      initialValue: 'ARNO PARTISSIMO',
    }),
    defineField({
      name: 'footerRightLabel',
      title: 'Footer Right Label',
      type: 'string',
      initialValue: 'BOOKING / GENERAL INQUIRIES',
    }),
  ],
});
