import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Navigation } from '@/components/layout/Navigation';

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('Navigation', () => {
  it('renders the three nav items', () => {
    render(<Navigation />);
    expect(screen.getByRole('link', { name: 'PHOTO.' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'CREATIVE DIRECTION.' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'CONTACT' })).toBeInTheDocument();
  });

  it('does not render STORE.', () => {
    render(<Navigation />);
    expect(screen.queryByRole('link', { name: 'STORE.' })).not.toBeInTheDocument();
  });

  it('opens the mobile menu when the toggle button is clicked', () => {
    render(<Navigation />);
    const toggleButton = screen.getByLabelText('Toggle menu');

    expect(screen.queryByRole('navigation', { name: 'Mobile navigation' })).not.toBeInTheDocument();

    fireEvent.click(toggleButton);

    expect(screen.getByRole('navigation', { name: 'Mobile navigation' })).toBeInTheDocument();
    expect(screen.getByLabelText('Close menu')).toBeInTheDocument();
    expect(toggleButton).toHaveAttribute('aria-expanded', 'true');
  });

  it('closes the mobile menu when the close button is clicked', () => {
    render(<Navigation />);
    fireEvent.click(screen.getByLabelText('Toggle menu'));

    fireEvent.click(screen.getByLabelText('Close menu'));

    expect(screen.queryByRole('navigation', { name: 'Mobile navigation' })).not.toBeInTheDocument();
    expect(screen.getByLabelText('Toggle menu')).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes the mobile menu when a mobile nav link is clicked', () => {
    render(<Navigation />);
    fireEvent.click(screen.getByLabelText('Toggle menu'));

    const mobileNav = screen.getByRole('navigation', { name: 'Mobile navigation' });
    const photoLink = screen
      .getAllByRole('link', { name: 'PHOTO.' })
      .find((link) => mobileNav.contains(link));

    expect(photoLink).toBeDefined();
    fireEvent.click(photoLink!);

    expect(screen.queryByRole('navigation', { name: 'Mobile navigation' })).not.toBeInTheDocument();
  });
});
