import { Media } from '@/types';
import { SanityImage } from '@/components/media/SanityImage';
import { VideoEmbed } from '@/components/media/VideoEmbed';
import { cn } from '@/lib/utils/cn';

interface ProjectGalleryProps {
  items: Media[];
}

export function ProjectGallery({ items }: ProjectGalleryProps) {
  return (
    <div className="flex flex-wrap gap-4">
      {items.map((item, index) => {
        const isSquare = item.layout === 'square';

        if (item.type === 'image') {
          return (
            <div
              key={item._key || index}
              data-testid="gallery-item"
              className={cn(
                'relative overflow-hidden',
                isSquare ? 'aspect-square w-[calc(50%-8px)]' : 'aspect-video w-full'
              )}
            >
              <SanityImage
                media={item}
                fill
                sizes={isSquare ? '50vw' : '100vw'}
                className="h-full w-full object-cover"
              />
            </div>
          );
        }

        return (
          <div
            key={item._key || index}
            data-testid="gallery-item"
            className={cn(isSquare ? 'w-[calc(50%-8px)]' : 'w-full')}
          >
            <VideoEmbed url={item.videoUrl || ''} className="h-auto w-full" />
          </div>
        );
      })}
    </div>
  );
}
