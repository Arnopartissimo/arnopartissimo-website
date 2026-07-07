import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { NavLink } from '@/components/design-system/NavLink';

describe('NavLink', () => {
  it('renders children and href', () => {
    render(<NavLink href="/creative">CREATIVE DIRECTION.</NavLink>);
    const link = screen.getByRole('link', { name: 'CREATIVE DIRECTION.' });
    expect(link).toHaveAttribute('href', '/creative');
  });

  it('marks active link', () => {
    render(
      <NavLink href="/" isActive>
        PHOTO.
      </NavLink>
    );
    expect(screen.getByRole('link', { name: 'PHOTO.' })).toHaveAttribute('aria-current', 'page');
  });
});
