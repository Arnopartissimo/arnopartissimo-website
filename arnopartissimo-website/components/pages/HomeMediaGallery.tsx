import { PageSection, Media } from '@/types';
import { SanityImage } from '@/components/media/SanityImage';
import { VideoEmbed } from '@/components/media/VideoEmbed';
import { Container } from '@/components/ui/Container';

interface HomeMediaGalleryProps {
  sections?: PageSection[];
}

function isMediaSection(section: PageSection): section is Media {
  return section._type === 'media';
}

export function HomeMediaGallery({ sections }: HomeMediaGalleryProps) {
  const mediaSections = sections?.filter(isMediaSection) ?? [];

  if (mediaSections.length === 0) {
    return (
      <Container>
        <p className="py-20 text-center text-neutral-500">Gallery coming soon.</p>
      </Container>
    );
  }

  return (
    <Container>
      <div className="grid grid-cols-1 gap-4 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {mediaSections.map((section, index) => (
          <div
            key={section._key || `home-media-${index}`}
            className="relative aspect-[3/4] overflow-hidden"
          >
            {section.type === 'image' ? (
              <SanityImage
                media={section}
                fill
                priority={index < 6}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <VideoEmbed url={section.videoUrl || ''} className="h-full w-full" />
            )}
          </div>
        ))}
      </div>
    </Container>
  );
}
