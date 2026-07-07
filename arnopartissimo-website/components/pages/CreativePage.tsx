import { Page } from '@/types';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SanityImage } from '@/components/media/SanityImage';
import { VideoEmbed } from '@/components/media/VideoEmbed';
import { ProjectCard } from '@/components/project/ProjectCard';
import { PortableText } from '@portabletext/react';

interface CreativePageProps {
  page: Page;
}

export function CreativePage({ page }: CreativePageProps) {
  return (
    <Container>
      <Section>
        <h1 className="mb-8 text-3xl font-light uppercase tracking-wide">{page.title}</h1>
        {page.sections && page.sections.length > 0 ? (
          <div className="space-y-12">
            {page.sections.map((section, index) => {
              if (section._type === 'media') {
                return section.type === 'image' ? (
                  <SanityImage key={index} media={section} className="w-full" aspectRatio="16/9" />
                ) : (
                  <VideoEmbed key={index} url={section.videoUrl || ''} className="w-full" />
                );
              }

              if (section._type === 'textBlock') {
                return (
                  <div key={index} className="prose prose-neutral mx-auto max-w-2xl">
                    <PortableText value={section.text} />
                  </div>
                );
              }

              return (
                <ProjectCard
                  key={index}
                  project={{
                    _id: section._id,
                    title: section.title,
                    slug: section.slug,
                    coverImage: section.coverImage,
                  }}
                />
              );
            })}
          </div>
        ) : (
          <p className="text-neutral-500">Content coming soon.</p>
        )}
      </Section>
    </Container>
  );
}
