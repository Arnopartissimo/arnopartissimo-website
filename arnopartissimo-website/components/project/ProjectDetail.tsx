import { Project } from '@/types';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { ProjectGallery } from './ProjectGallery';
import { PortableText } from '@portabletext/react';

interface ProjectDetailProps {
  project: Project;
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  return (
    <article>
      <Container>
        <Section>
          <header className="mb-12">
            <h1 className="text-3xl font-light uppercase tracking-wide">{project.title}</h1>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-neutral-500">
              {project.category && <span>{project.category.title}</span>}
              {project.year && <span>{project.year}</span>}
              {project.client && <span>Client: {project.client}</span>}
              {project.role && <span>Role: {project.role}</span>}
              {project.location && <span>{project.location}</span>}
            </div>
          </header>

          {project.gallery && project.gallery.length > 0 && (
            <ProjectGallery items={project.gallery} />
          )}

          {project.description && (
            <div className="prose prose-neutral mx-auto mt-16 max-w-2xl">
              <PortableText value={project.description} />
            </div>
          )}

          {project.credits && (
            <div className="mx-auto mt-12 max-w-2xl text-sm text-neutral-500">
              <h2 className="mb-2 font-medium">Credits</h2>
              <p>{project.credits}</p>
            </div>
          )}

          {project.externalLink && (
            <div className="mx-auto mt-8 max-w-2xl">
              <a
                href={project.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm underline underline-offset-4"
              >
                View external link
              </a>
            </div>
          )}
        </Section>
      </Container>
    </article>
  );
}
