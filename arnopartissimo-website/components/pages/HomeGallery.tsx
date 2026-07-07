import { Project } from '@/types';
import { ProjectCard } from '@/components/project/ProjectCard';
import { Container } from '@/components/ui/Container';

interface HomeGalleryProps {
  projects: Project[];
}

export function HomeGallery({ projects }: HomeGalleryProps) {
  return (
    <Container>
      <div className="grid grid-cols-1 gap-8 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <ProjectCard key={project._id} project={project} priority={index < 3} />
        ))}
      </div>
    </Container>
  );
}
