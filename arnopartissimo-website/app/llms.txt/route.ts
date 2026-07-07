import { sanityClient } from '@/lib/sanity/client';
import { projectsQuery, siteSettingsQuery } from '@/lib/sanity/queries';
import { Project } from '@/types';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://arnopartissimo.com';
  const settings = await sanityClient.fetch(siteSettingsQuery);
  const projects = await sanityClient.fetch<Project[]>(projectsQuery);

  const content = `# ${settings?.title || 'Arno Partissimo'}

## Description
${settings?.description || 'Portfolio of Arno Partissimo, photographer and creative director.'}

## Website
- Home: ${baseUrl}
- Creative Direction: ${baseUrl}/creative
- Contact: ${baseUrl}/contact

## Projects
${projects.map((p) => `- ${p.title}: ${baseUrl}/projects/${p.slug}`).join('\n')}

## Contact
Email: ${settings?.contactEmail || ''}
`;

  return new Response(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
