import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ProjectDetail } from '@/components/project/ProjectDetail';
import { Project } from '@/types';

vi.mock('@/lib/sanity/image', () => ({
  urlFor: () => ({
    auto: () => ({ fit: () => ({ url: () => 'https://cdn.sanity.io/test.jpg' }) }),
    width: () => ({
      quality: () => ({ auto: () => ({ url: () => 'https://cdn.sanity.io/blur.jpg' }) }),
    }),
  }),
}));

const mockProject: Project = {
  _id: 'project-1',
  title: 'Sample Project',
  slug: 'sample-project',
  status: 'published',
  category: {
    _id: 'category-1',
    title: 'Commercial',
    slug: { current: 'commercial' },
  },
  year: '2025',
  client: 'Test Client',
  role: 'Director',
  location: 'Paris',
  credits: 'Shot by Arno Partissimo',
  externalLink: 'https://example.com',
  coverImage: {
    _type: 'media',
    type: 'image',
    image: {
      _type: 'image',
      asset: {
        _ref: 'image-asset',
        _type: 'reference',
      },
    },
  },
  gallery: [
    {
      _type: 'media',
      _key: 'gallery-1',
      type: 'image',
      image: {
        _type: 'image',
        asset: {
          _ref: 'image-asset',
          _type: 'reference',
        },
      },
    },
    {
      _type: 'media',
      _key: 'gallery-2',
      type: 'video',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    },
  ],
  description: [
    {
      _type: 'block',
      _key: 'desc-1',
      children: [{ _type: 'span', _key: 'span-1', text: 'Project description text.' }],
      markDefs: [],
      style: 'normal',
    },
  ],
};

describe('ProjectDetail', () => {
  it('renders the project title and metadata', () => {
    render(<ProjectDetail project={mockProject} />);

    expect(screen.getByRole('heading', { name: mockProject.title })).toBeInTheDocument();
    expect(screen.getByText('Commercial')).toBeInTheDocument();
    expect(screen.getByText('2025')).toBeInTheDocument();
    expect(screen.getByText('Client: Test Client')).toBeInTheDocument();
    expect(screen.getByText('Role: Director')).toBeInTheDocument();
    expect(screen.getByText('Paris')).toBeInTheDocument();
  });

  it('renders the gallery items', () => {
    const { container } = render(<ProjectDetail project={mockProject} />);

    expect(container.querySelectorAll('img').length).toBeGreaterThan(0);
    expect(screen.getByTitle('Video from youtube.com')).toBeInTheDocument();
  });

  it('renders credits and external link', () => {
    render(<ProjectDetail project={mockProject} />);

    expect(screen.getByText('Credits')).toBeInTheDocument();
    expect(screen.getByText('Shot by Arno Partissimo')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'View external link' })).toHaveAttribute(
      'href',
      'https://example.com'
    );
  });
});
