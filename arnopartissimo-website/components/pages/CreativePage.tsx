import { Page } from '@/types';
import { Container } from '@/components/ui/Container';
import { ProjectCard } from '@/components/project/ProjectCard';
import { StaggerContainer, StaggerItem } from '@/components/ui/FadeIn';

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
      <StaggerContainer
        className="grid grid-cols-1 gap-4 py-12 sm:grid-cols-2 lg:grid-cols-3"
        staggerDelay={0.08}
      >
        {projectSections.map((section, index) => (
          <StaggerItem key={section._key}>
            <ProjectCard
              project={{
                _id: section._id,
                title: section.title,
                slug: section.slug,
                coverImage: section.coverImage,
              }}
              priority={index < 6}
            />
          </StaggerItem>
        ))}
      </StaggerContainer>
    </Container>
  );
}
