import { render, screen } from '@testing-library/react';
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
});
