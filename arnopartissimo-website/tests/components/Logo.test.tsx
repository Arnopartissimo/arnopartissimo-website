import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Logo } from '@/components/design-system/Logo';

describe('Logo', () => {
  it('renders the site name with a period', () => {
    render(<Logo />);
    expect(screen.getByText('ARNO PARTISSIMO.')).toBeInTheDocument();
  });

  it('links to home', () => {
    render(<Logo />);
    expect(screen.getByRole('link', { name: 'ARNO PARTISSIMO.' })).toHaveAttribute('href', '/');
  });
});
