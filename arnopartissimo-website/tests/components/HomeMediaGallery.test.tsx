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
    const { container } = render(<HomeMediaGallery sections={sections} />);
    expect(screen.getAllByRole('img').length).toBe(2);
    expect(container.querySelector('.home-gallery')).toBeInTheDocument();
    expect(container.querySelectorAll('.home-gallery-item').length).toBe(2);
  });

  it('shows placeholder when empty', () => {
    render(<HomeMediaGallery sections={[]} />);
    expect(screen.getByText('Gallery coming soon.')).toBeInTheDocument();
  });
});
