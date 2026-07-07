import { Media } from '@/types';
import { SanityImage } from '@/components/media/SanityImage';
import { VideoEmbed } from '@/components/media/VideoEmbed';

interface ProjectGalleryProps {
  items: Media[];
}

export function ProjectGallery({ items }: ProjectGalleryProps) {
  return (
    <div className="space-y-8">
      {items.map((item, index) =>
        item.type === 'image' ? (
          <SanityImage
            key={item._key || index}
            media={item}
            className="w-full"
            aspectRatio="16/9"
            sizes="100vw"
            fill
          />
        ) : (
          <VideoEmbed key={item._key || index} url={item.videoUrl || ''} className="w-full" />
        )
      )}
    </div>
  );
}
