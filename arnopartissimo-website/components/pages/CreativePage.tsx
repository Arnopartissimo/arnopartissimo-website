import { Page } from '@/types';
import { Container } from '@/components/ui/Container';
import { ProjectCard } from '@/components/project/ProjectCard';

interface CreativePageProps {
  page: Page;
}

export function CreativePage({ page }: CreativePageProps) {
  const projectSections = page.sections?.filter((section) => section._type === 'project') ?? [];

  if (projectSections.length === 0) {
    return (
      <Container>
        <p className="py-20 text-center text-muted">Projects coming soon.</p>
      </Container>
    );
  }

  return (
    <Container>
      <div className="grid grid-cols-1 gap-4 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {projectSections.map((section, index) => (
          <ProjectCard
            key={section._key}
            project={{
              _id: section._id,
              title: section.title,
              slug: section.slug,
              coverImage: section.coverImage,
            }}
            priority={index < 6}
          />
        ))}
      </div>
    </Container>
  );
}
