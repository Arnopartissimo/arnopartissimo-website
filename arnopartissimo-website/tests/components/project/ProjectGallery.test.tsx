import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProjectGallery } from '@/components/project/ProjectGallery';
import { Media } from '@/types';

vi.mock('@/components/media/SanityImage', () => ({
  SanityImage: ({ className }: { className?: string }) => (
    <img data-testid="sanity-image" className={className} alt="mock" />
  ),
}));

const makeImage = (layout?: 'wide' | 'square'): Media => ({
  _type: 'media',
  _key: Math.random().toString(),
  type: 'image',
  layout,
  image: {
    asset: { _ref: 'image-ref', _type: 'reference' },
    alt: 'Test image',
  },
});

const makeVideo = (layout?: 'wide' | 'square'): Media => ({
  _type: 'media',
  _key: Math.random().toString(),
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
});
