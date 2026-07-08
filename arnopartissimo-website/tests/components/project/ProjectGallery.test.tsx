import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProjectGallery } from '@/components/project/ProjectGallery';
import { Media, MediaLayout } from '@/types';

vi.mock('@/components/media/SanityImage', () => ({
  SanityImage: ({ className }: { className?: string }) => (
    <img data-testid="sanity-image" className={className} alt="mock" />
  ),
}));

vi.mock('@/components/media/VideoEmbed', () => ({
  VideoEmbed: ({ url, className }: { url?: string; className?: string }) => (
    <div data-testid="video-embed" data-url={url} className={className} />
  ),
}));

const makeImage = (layout?: MediaLayout, key = 'image-key'): Media => ({
  _type: 'media',
  _key: key,
  type: 'image',
  layout,
  image: {
    asset: { _ref: 'image-ref', _type: 'reference' },
    alt: 'Test image',
  },
});

const makeVideo = (layout?: MediaLayout, key = 'video-key'): Media => ({
  _type: 'media',
  _key: key,
  type: 'video',
  layout,
  videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
});

describe('ProjectGallery', () => {
  it('renders wide items at full width', () => {
    render(<ProjectGallery items={[makeImage('wide')]} />);
    const item = screen.getByTestId('gallery-item');
    expect(item).toHaveClass('w-full');
    expect(item).toHaveClass('aspect-video');
  });

  it('renders square items at half width', () => {
    render(<ProjectGallery items={[makeImage('square')]} />);
    const item = screen.getByTestId('gallery-item');
    expect(item).toHaveClass('w-[calc(50%-8px)]');
    expect(item).toHaveClass('aspect-square');
  });

  it('defaults to wide when layout is undefined', () => {
    render(<ProjectGallery items={[makeImage(undefined)]} />);
    const item = screen.getByTestId('gallery-item');
    expect(item).toHaveClass('w-full');
    expect(item).toHaveClass('aspect-video');
  });

  it('renders video items with square layout at half width', () => {
    render(<ProjectGallery items={[makeVideo('square')]} />);
    const item = screen.getByTestId('gallery-item');
    expect(item).toHaveClass('w-[calc(50%-8px)]');
  });

  it('renders video items with wide layout at full width', () => {
    render(<ProjectGallery items={[makeVideo('wide')]} />);
    const item = screen.getByTestId('gallery-item');
    expect(item).toHaveClass('w-full');
  });

  it('mixes wide and square items with correct wrapper classes', () => {
    render(
      <ProjectGallery
        items={[
          makeImage('wide', 'image-wide'),
          makeImage('square', 'image-square'),
          makeVideo('wide', 'video-wide'),
        ]}
      />
    );
    const items = screen.getAllByTestId('gallery-item');
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveClass('w-full');
    expect(items[0]).toHaveClass('aspect-video');
    expect(items[1]).toHaveClass('w-[calc(50%-8px)]');
    expect(items[1]).toHaveClass('aspect-square');
    expect(items[2]).toHaveClass('w-full');
  });
});
