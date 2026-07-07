import Image from 'next/image';

import { urlFor } from '@/lib/sanity/image';
import { cn } from '@/lib/utils/cn';
import { Media } from '@/types';

interface SanityImageProps {
  media: Media;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  aspectRatio?: string;
  width?: number;
  height?: number;
}

export function SanityImage({
  media,
  className,
  priority,
  fill = false,
  sizes,
  aspectRatio,
  width,
  height,
}: SanityImageProps) {
  if (media.type !== 'image' || !media.image) {
    return null;
  }

  const image = media.image;
  const url = urlFor(image).auto('format').fit('max').url();
  const blurUrl = urlFor(image).width(20).quality(20).auto('format').url();

  return (
    <div className={cn('relative overflow-hidden', className)} style={{ aspectRatio }}>
      <Image
        src={url}
        alt={image.alt || ''}
        fill={fill}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        priority={priority}
        sizes={sizes}
        placeholder="blur"
        blurDataURL={blurUrl}
        className={fill ? 'object-cover' : 'h-auto w-full'}
      />
      {(image.caption || image.credits) && (
        <figcaption className="sr-only">
          {image.caption} {image.credits}
        </figcaption>
      )}
    </div>
  );
}
