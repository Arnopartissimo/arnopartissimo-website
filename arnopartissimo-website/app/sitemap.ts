import type { MetadataRoute } from 'next';
import { sanityClient } from '@/lib/sanity/client';
import { projectsQuery, pagesQuery } from '@/lib/sanity/queries';
import { Project } from '@/types';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://arnopartissimo.com';

  const projects = await sanityClient.fetch<Project[]>(projectsQuery);
  const pages =
    await sanityClient.fetch<{ slug: { current: string }; _updatedAt?: string }[]>(pagesQuery);

  const projectUrls = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: project.updatedAt || new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const pageUrls = pages
    .filter((page) => page.slug.current !== 'home')
    .map((page) => ({
      url: `${baseUrl}/${page.slug.current}`,
      lastModified: page._updatedAt || new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    ...pageUrls,
    ...projectUrls,
  ];
}
