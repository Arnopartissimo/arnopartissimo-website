import Link from 'next/link';

import { Media } from '@/types';
import { SanityImage } from '@/components/media/SanityImage';
import { FadeIn } from '@/components/ui/FadeIn';

interface ProjectCardProps {
  project: {
    _id: string;
    title: string;
    slug: string;
    coverImage: Media;
  };
  priority?: boolean;
}

function isValidImageMedia(
  media?: Media | null
): media is Media & { type: 'image'; image: NonNullable<Media['image']> } {
  return !!media && media.type === 'image' && !!media.image;
}

export function ProjectCard({ project, priority }: ProjectCardProps) {
  const hasCoverImage = isValidImageMedia(project.coverImage);

  return (
    <FadeIn>
      <Link href={`/projects/${project.slug}`} className="group block">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-800">
          {hasCoverImage ? (
            <SanityImage
              media={project.coverImage}
              fill
              priority={priority}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[0.985]"
            />
          ) : null}
        </div>
        <h3 className="mt-3 text-[11px] uppercase tracking-[0.2em] text-foreground">
          {project.title}
        </h3>
      </Link>
    </FadeIn>
  );
}
