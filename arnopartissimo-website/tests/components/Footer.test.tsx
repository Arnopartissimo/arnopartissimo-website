import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Footer } from '@/components/layout/Footer';

describe('Footer', () => {
  it('renders left and right columns', () => {
    render(<Footer />);
    expect(screen.getByText('ARNO PARTISSIMO')).toBeInTheDocument();
    expect(screen.getByText('AVAILABLE WORLDWIDE')).toBeInTheDocument();
    expect(screen.getByText('BOOKING / GENERAL INQUIRIES')).toBeInTheDocument();
    expect(screen.getByText('arno@arnopartissimo.com')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'INSTAGRAM.' })).toHaveAttribute(
      'href',
      'https://instagram.com/arnopartissimo'
    );
    expect(screen.getByRole('link', { name: 'arno@arnopartissimo.com' })).toHaveAttribute(
      'href',
      'mailto:arno@arnopartissimo.com'
    );
  });

  it('uses settings when provided', () => {
    render(
      <Footer
        settings={{
          _id: 'settings',
          title: 'Arno Partissimo',
          contactEmail: 'hello@arnopartissimo.com',
          instagramUrl: 'https://instagram.com/test',
          footerLeftLabel: 'TEST LEFT',
          availableWorldwideText: 'TEST WORLD',
          footerRightLabel: 'TEST RIGHT',
          bookingEmail: 'booking@test.com',
        }}
      />
    );
    expect(screen.getByText('TEST LEFT')).toBeInTheDocument();
    expect(screen.getByText('TEST WORLD')).toBeInTheDocument();
    expect(screen.getByText('TEST RIGHT')).toBeInTheDocument();
    expect(screen.getByText('booking@test.com')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'INSTAGRAM.' })).toHaveAttribute(
      'href',
      'https://instagram.com/test'
    );
    expect(screen.getByRole('link', { name: 'booking@test.com' })).toHaveAttribute(
      'href',
      'mailto:booking@test.com'
    );
  });
});
