import type { MetadataRoute } from 'next';
import { sanityClient } from '@/lib/sanity/client';
import { projectsQuery, pagesQuery } from '@/lib/sanity/queries';
import { Project } from '@/types';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
if (!baseUrl) {
  throw new Error('NEXT_PUBLIC_SITE_URL is required');
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const safeBaseUrl: string = baseUrl as string;
  const projects = await sanityClient.fetch<Project[]>(projectsQuery);
  const pages =
    await sanityClient.fetch<{ slug: { current: string }; _updatedAt?: string }[]>(pagesQuery);

  const projectUrls = projects.map((project) => ({
    url: `${safeBaseUrl}/projects/${project.slug}`,
    lastModified: project.updatedAt || new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const pageUrls = pages
    .filter((page) => page.slug.current !== 'home')
    .map((page) => ({
      url: `${safeBaseUrl}/${page.slug.current}`,
      lastModified: page._updatedAt || new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

  return [
    { url: safeBaseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    ...pageUrls,
    ...projectUrls,
  ];
}
