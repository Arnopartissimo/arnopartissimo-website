import { sanityClient } from '@/lib/sanity/client';
import { projectsQuery } from '@/lib/sanity/queries';
import { HomeGallery } from '@/components/pages/HomeGallery';
import { Project } from '@/types';

export const dynamic = 'force-static';

export default async function HomePage() {
  const projects = await sanityClient.fetch<Project[]>(projectsQuery);

  return (
    <div>
      <HomeGallery projects={projects} />
    </div>
  );
}
