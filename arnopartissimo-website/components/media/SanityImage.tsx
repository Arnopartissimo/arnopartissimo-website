import Image from 'next/image';

import { urlFor } from '@/lib/sanity/image';
import { cn } from '@/lib/utils/cn';
import { Media, MediaImage } from '@/types';

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

function normalizeImageAsset(image: NonNullable<Media['image']>): MediaImage | null {
  if (typeof image === 'string') {
    return { asset: { _ref: image, _type: 'reference' as const } } as MediaImage;
  }

  const asset = image.asset;
  if (!asset) {
    return null;
  }

  const ref =
    typeof asset === 'string'
      ? asset
      : '_ref' in asset && asset._ref
        ? asset._ref
        : '_id' in asset && asset._id
          ? asset._id
          : null;

  if (!ref) {
    return null;
  }

  return { ...(image as object), asset: { _ref: ref, _type: 'reference' as const } } as MediaImage;
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

  const image = normalizeImageAsset(media.image);
  if (!image) {
    return null;
  }

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
