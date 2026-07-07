import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Container } from '@/components/ui/Container';

describe('Container', () => {
  it('renders children', () => {
    render(<Container>Hello</Container>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('merges custom classes', () => {
    const { container } = render(<Container className="custom-class">Hello</Container>);
    expect(container.firstChild).toHaveClass('mx-auto', 'max-w-7xl', 'custom-class');
  });
});
