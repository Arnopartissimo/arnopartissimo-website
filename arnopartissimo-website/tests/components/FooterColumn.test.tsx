import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FooterColumn } from '@/components/design-system/FooterColumn';

describe('FooterColumn', () => {
  it('renders title and children', () => {
    render(
      <FooterColumn title="LEFT">
        <span>Child</span>
      </FooterColumn>
    );
    expect(screen.getByText('LEFT')).toBeInTheDocument();
    expect(screen.getByText('Child')).toBeInTheDocument();
  });
});
