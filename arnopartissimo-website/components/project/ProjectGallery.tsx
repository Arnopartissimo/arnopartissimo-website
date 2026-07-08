import { Media } from '@/types';
import { SanityImage } from '@/components/media/SanityImage';
import { VideoEmbed } from '@/components/media/VideoEmbed';
import { cn } from '@/lib/utils/cn';
import { StaggerContainer, StaggerItem } from '@/components/ui/FadeIn';

interface ProjectGalleryProps {
  items: Media[];
}

export function ProjectGallery({ items }: ProjectGalleryProps) {
  return (
    <StaggerContainer className="flex flex-wrap gap-4" staggerDelay={0.1}>
      {items.map((item, index) => {
        const isSquare = item.layout === 'square';

        if (item.type === 'image') {
          return (
            <StaggerItem
              key={item._key || index}
              data-testid="gallery-item"
              className={cn(
                'relative overflow-hidden',
                isSquare ? 'aspect-square w-[calc(50%-8px)]' : 'aspect-video w-full'
              )}
            >
              <div className="h-full w-full">
                <SanityImage
                  media={item}
                  fill
                  sizes={isSquare ? '50vw' : '100vw'}
                  className="h-full w-full object-cover"
                />
              </div>
            </StaggerItem>
          );
        }

        return (
          <StaggerItem
            key={item._key || index}
            data-testid="gallery-item"
            className={cn(isSquare ? 'w-[calc(50%-8px)]' : 'w-full')}
          >
            <div>
              <VideoEmbed url={item.videoUrl || ''} className="h-auto w-full" />
            </div>
          </StaggerItem>
        );
      })}
    </StaggerContainer>
  );
}
