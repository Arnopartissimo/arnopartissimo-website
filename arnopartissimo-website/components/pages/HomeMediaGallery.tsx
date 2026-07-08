'use client';

import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';

import { PageSection, Media } from '@/types';
import { SanityImage } from '@/components/media/SanityImage';
import { VideoEmbed } from '@/components/media/VideoEmbed';
import { Container } from '@/components/ui/Container';
import { StaggerContainer, StaggerItem } from '@/components/ui/FadeIn';

interface HomeMediaGalleryProps {
  sections?: PageSection[];
}

const TARGET_IMAGE_WIDTH = 600;

function isMediaSection(section: PageSection): section is Media {
  return section._type === 'media';
}

function getImageDimensions(media: Media) {
  const dimensions = media.image?.asset?.metadata?.dimensions;
  if (dimensions?.width && dimensions?.height) {
    const ratio = dimensions.height / dimensions.width;
    return {
      width: TARGET_IMAGE_WIDTH,
      height: Math.round(TARGET_IMAGE_WIDTH * ratio),
    };
  }
  return { width: TARGET_IMAGE_WIDTH, height: Math.round(TARGET_IMAGE_WIDTH * 0.75) };
}

export function HomeMediaGallery({ sections }: HomeMediaGalleryProps) {
  const mediaSections = sections?.filter(isMediaSection) ?? [];

  if (mediaSections.length === 0) {
    return (
      <Container>
        <p className="py-20 text-center text-muted">Gallery coming soon.</p>
      </Container>
    );
  }

  return (
    <Container className="max-w-none px-2 sm:px-3 lg:px-5">
      <div className="py-12">
        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 640: 2, 1024: 4 }}>
          <Masonry gutter="15px">
            <StaggerContainer className="contents" staggerDelay={0.06}>
              {mediaSections.map((section, index) => (
                <StaggerItem
                  key={section._key || `home-media-${index}`}
                  className="transition-transform duration-200 hover:scale-[0.985]"
                >
                  {section.type === 'image' ? (
                    <SanityImage
                      media={section}
                      width={getImageDimensions(section).width}
                      height={getImageDimensions(section).height}
                      priority={index < 6}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="h-auto w-full"
                    />
                  ) : (
                    <VideoEmbed url={section.videoUrl || ''} className="h-auto w-full" />
                  )}
                </StaggerItem>
              ))}
            </StaggerContainer>
          </Masonry>
        </ResponsiveMasonry>
      </div>
    </Container>
  );
}
