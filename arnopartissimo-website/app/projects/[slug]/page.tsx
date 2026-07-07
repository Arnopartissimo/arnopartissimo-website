import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { sanityClient } from '@/lib/sanity/client';
import { projectSlugsQuery, projectBySlugQuery } from '@/lib/sanity/queries';
import { ProjectDetail } from '@/components/project/ProjectDetail';
import { Project } from '@/types';

export const dynamic = 'force-static';

export async function generateStaticParams() {
  const slugs = await sanityClient.fetch<{ slug: string }[]>(projectSlugsQuery);
  return slugs.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await sanityClient.fetch<Project>(projectBySlugQuery, { slug });

  if (!project) {
    return { title: 'Project Not Found' };
  }

  return {
    title: `${project.title} | Arno Partissimo`,
    description: project.credits || `Project by Arno Partissimo`,
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await sanityClient.fetch<Project>(projectBySlugQuery, { slug });

  if (!project) {
    notFound();
  }

  return <ProjectDetail project={project} />;
}
