import Link from 'next/link';

import { Project } from '@/types';
import { SanityImage } from '@/components/media/SanityImage';

interface ProjectCardProps {
  project: Project;
  priority?: boolean;
}

export function ProjectCard({ project, priority }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
        <SanityImage
          media={project.coverImage}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="mt-3 flex items-center justify-between">
        <h3 className="text-sm font-medium">{project.title}</h3>
        {project.category && (
          <span className="text-xs text-neutral-500">{project.category.title}</span>
        )}
      </div>
    </Link>
  );
}
