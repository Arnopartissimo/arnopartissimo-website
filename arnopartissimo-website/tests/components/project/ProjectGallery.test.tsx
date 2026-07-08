import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProjectGallery } from '@/components/project/ProjectGallery';
import { Media } from '@/types';

vi.mock('@/lib/sanity/image', () => ({
  urlFor: () => ({
    auto: () => ({ fit: () => ({ url: () => 'https://cdn.sanity.io/test.jpg' }) }),
    width: () => ({
      quality: () => ({ auto: () => ({ url: () => 'https://cdn.sanity.io/blur.jpg' }) }),
    }),
  }),
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

describe('ProjectGallery', () => {
  it('renders wide items at full width', () => {
    render(<ProjectGallery items={[makeImage('wide')]} />);
    const wrapper = screen.getByRole('img').parentElement?.parentElement;
    expect(wrapper).toHaveClass('w-full');
    expect(wrapper).toHaveClass('aspect-video');
  });

  it('renders square items at half width', () => {
    render(<ProjectGallery items={[makeImage('square')]} />);
    const wrapper = screen.getByRole('img').parentElement?.parentElement;
    expect(wrapper).toHaveClass('w-[calc(50%-8px)]');
    expect(wrapper).toHaveClass('aspect-square');
  });

  it('defaults to wide when layout is undefined', () => {
    render(<ProjectGallery items={[makeImage(undefined)]} />);
    const wrapper = screen.getByRole('img').parentElement?.parentElement;
    expect(wrapper).toHaveClass('w-full');
  });
});
