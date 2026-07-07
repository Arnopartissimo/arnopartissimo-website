import { Page } from '@/types';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SanityImage } from '@/components/media/SanityImage';
import { VideoEmbed } from '@/components/media/VideoEmbed';

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
              if ('_type' in section && section._type === 'media') {
                const media = section;
                return media.type === 'image' ? (
                  <SanityImage key={index} media={media} className="w-full" aspectRatio="16/9" />
                ) : (
                  <VideoEmbed key={index} url={media.videoUrl || ''} className="w-full" />
                );
              }
              return null;
            })}
          </div>
        ) : (
          <p className="text-neutral-500">Content coming soon.</p>
        )}
      </Section>
    </Container>
  );
}
