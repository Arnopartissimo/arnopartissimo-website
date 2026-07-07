'use client';

import { SiteSettings } from '@/types';
import { FooterColumn } from '@/components/design-system/FooterColumn';
import { copyToClipboard } from '@/lib/utils/copy-to-clipboard';

interface FooterProps {
  settings?: SiteSettings;
}

export function Footer({ settings }: FooterProps) {
  const instagramUrl = settings?.instagramUrl || 'https://instagram.com/arnopartissimo';
  const leftLabel = settings?.footerLeftLabel || 'ARNO PARTISSIMO';
  const availableText = settings?.availableWorldwideText || 'AVAILABLE WORLDWIDE';
  const rightLabel = settings?.footerRightLabel || 'BOOKING / GENERAL INQUIRIES';
  const bookingEmail = settings?.bookingEmail || 'arno@arnopartissimo.com';

  return (
    <footer className="py-8">
      <div className="mx-auto flex max-w-7xl flex-row flex-wrap justify-between gap-4 px-4 sm:gap-6 sm:px-6 lg:px-8">
        <FooterColumn title={leftLabel}>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] uppercase tracking-[0.3em] text-white hover:opacity-70 transition-opacity"
          >
            INSTAGRAM.
          </a>
        </FooterColumn>

        <FooterColumn title={availableText}>
          <span className="text-[10px] uppercase tracking-[0.3em] text-white">{rightLabel}</span>
          <a
            href={`mailto:${bookingEmail}`}
            className="text-[10px] uppercase tracking-[0.3em] text-white hover:opacity-70 transition-opacity"
            onClick={async (e) => {
              if (navigator.clipboard) {
                e.preventDefault();
                await copyToClipboard(bookingEmail);
                window.location.href = `mailto:${bookingEmail}`;
              }
            }}
          >
            {bookingEmail}
          </a>
        </FooterColumn>
      </div>
    </footer>
  );
}
