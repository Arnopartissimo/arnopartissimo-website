import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ContactSection } from '@/components/pages/ContactSection';
import { SiteSettings } from '@/types';

vi.mock('@/components/media/SanityImage', () => ({
  SanityImage: () => <div data-testid="sanity-image" />,
}));

const mockSettings: SiteSettings = {
  _id: 'settings',
  title: 'Arno Partissimo',
  contactEmail: 'hello@example.com',
};

describe('ContactSection', () => {
  it('renders the contact email as a mailto link', () => {
    render(<ContactSection settings={mockSettings} />);
    const link = screen.getByRole('link', { name: mockSettings.contactEmail });
    expect(link).toHaveAttribute('href', `mailto:${mockSettings.contactEmail}`);
  });

  it('renders the booking label', () => {
    render(<ContactSection settings={mockSettings} />);
    expect(screen.getByText('Booking / General Inquiries')).toBeInTheDocument();
  });

  it('renders the contact image when provided', () => {
    render(
      <ContactSection
        settings={mockSettings}
        image={{
          _type: 'media',
          type: 'image',
          image: { asset: { _ref: 'image-ref', _type: 'reference' } },
        }}
      />
    );
    expect(screen.getByTestId('sanity-image')).toBeInTheDocument();
  });
});
