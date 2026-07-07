import { SiteSettings, Project } from '@/types';

export function websiteSchema(settings: SiteSettings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: settings.title,
    url: process.env.NEXT_PUBLIC_SITE_URL,
    description: settings.description,
  };
}

export function personSchema(settings: SiteSettings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Arno Partissimo',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    sameAs: settings.socialLinks?.map((link) => link.url) || [],
    jobTitle: 'Photographer & Creative Director',
  };
}

export function creativeWorkSchema(project: Project) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/projects/${project.slug}`,
    description: project.credits || undefined,
    datePublished: project.publishedAt,
    dateModified: project.updatedAt,
    creator: {
      '@type': 'Person',
      name: 'Arno Partissimo',
    },
    keywords: project.tags?.join(', '),
    locationCreated: project.location,
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
