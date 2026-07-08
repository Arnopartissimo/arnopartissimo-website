import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

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
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the contact email as a mailto link', () => {
    render(<ContactSection settings={mockSettings} />);
    const link = screen.getByRole('link', { name: mockSettings.contactEmail });
    expect(link).toHaveAttribute('href', `mailto:${mockSettings.contactEmail}`);
  });

  it('copies the email to clipboard when the copy button is clicked', async () => {
    render(<ContactSection settings={mockSettings} />);
    const button = screen.getByRole('button', { name: /copy email address/i });

    await act(async () => {
      fireEvent.click(button);
      await vi.advanceTimersByTimeAsync(0);
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockSettings.contactEmail);
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /copy email address/i })).toHaveTextContent(
        'Copied!'
      )
    );
  });

  it('resets the copy button label after 2 seconds', async () => {
    render(<ContactSection settings={mockSettings} />);
    const button = screen.getByRole('button', { name: /copy email address/i });

    await act(async () => {
      fireEvent.click(button);
      await vi.advanceTimersByTimeAsync(2000);
    });

    expect(screen.getByRole('button', { name: /copy email address/i })).toHaveTextContent('Copy');
  });
});
