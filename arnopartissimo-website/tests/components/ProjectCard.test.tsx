import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ProjectCard } from '@/components/project/ProjectCard';

vi.mock('@/lib/sanity/image', () => ({
  urlFor: () => ({
    auto: () => ({ fit: () => ({ url: () => 'https://cdn.sanity.io/test.jpg' }) }),
    width: () => ({
      quality: () => ({ auto: () => ({ url: () => 'https://cdn.sanity.io/blur.jpg' }) }),
    }),
  }),
}));

const mockProject = {
  _id: 'project-1',
  title: 'Test Project',
  slug: 'test-project',
  coverImage: {
    _type: 'media' as const,
    type: 'image' as const,
    image: {
      _type: 'image' as const,
      asset: { _ref: 'image-ref', _type: 'reference' as const },
      alt: 'Test cover image',
    },
  },
};

describe('ProjectCard', () => {
  it('renders the title and links to the creative project page', () => {
    render(<ProjectCard project={mockProject} />);

    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/creative/test-project');
  });
});
