import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { SanityImage } from '@/components/media/SanityImage';

const mockMedia = {
  _type: 'media' as const,
  type: 'image' as const,
  image: {
    _type: 'image' as const,
    asset: { _ref: 'image-ref', _type: 'reference' as const },
    alt: 'Test image',
  },
};

vi.mock('@/lib/sanity/image', () => ({
  urlFor: () => ({
    auto: () => ({ fit: () => ({ url: () => 'https://cdn.sanity.io/test.jpg' }) }),
    width: () => ({
      quality: () => ({ auto: () => ({ url: () => 'https://cdn.sanity.io/blur.jpg' }) }),
    }),
  }),
}));

describe('SanityImage', () => {
  it('renders an image with alt text', () => {
    render(<SanityImage media={mockMedia} fill />);
    const img = screen.getByAltText('Test image');
    expect(img).toBeInTheDocument();
  });
});
