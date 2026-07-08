import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { HomeMediaGallery } from '@/components/pages/HomeMediaGallery';
import { PageSection } from '@/types';

vi.mock('@/lib/sanity/image', () => ({
  urlFor: () => ({
    auto: () => ({ fit: () => ({ url: () => 'https://cdn.sanity.io/test.jpg' }) }),
    width: () => ({
      quality: () => ({ auto: () => ({ url: () => 'https://cdn.sanity.io/blur.jpg' }) }),
    }),
  }),
}));

vi.mock('react-responsive-masonry', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="masonry">{children}</div>
  ),
  ResponsiveMasonry: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-masonry">{children}</div>
  ),
}));

const sections: PageSection[] = [
  {
    _type: 'media',
    _key: 'a',
    type: 'image',
    image: {
      _type: 'image',
      asset: { _ref: 'ref-a', _type: 'reference' },
      alt: 'Gallery image one',
    },
  },
  {
    _type: 'media',
    _key: 'b',
    type: 'image',
    image: {
      _type: 'image',
      asset: { _ref: 'ref-b', _type: 'reference' },
      alt: 'Gallery image two',
    },
  },
];

describe('HomeMediaGallery', () => {
  it('renders gallery items', () => {
    render(<HomeMediaGallery sections={sections} />);
    expect(screen.getAllByRole('img').length).toBe(2);
    expect(screen.getByTestId('responsive-masonry')).toBeInTheDocument();
    expect(screen.getByTestId('masonry')).toBeInTheDocument();
  });

  it('shows placeholder when empty', () => {
    render(<HomeMediaGallery sections={[]} />);
    expect(screen.getByText('Gallery coming soon.')).toBeInTheDocument();
  });
});
