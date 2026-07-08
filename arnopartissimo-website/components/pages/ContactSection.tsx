'use client';

import { useState } from 'react';
import type { PortableTextBlock } from '@portabletext/types';
import { SiteSettings, Media } from '@/types';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SanityImage } from '@/components/media/SanityImage';
import { copyToClipboard } from '@/lib/utils/copy-to-clipboard';
import { PortableText } from '@portabletext/react';

interface ContactSectionProps {
  settings: SiteSettings;
  description?: string | PortableTextBlock[];
  image?: Media;
}

export function ContactSection({ settings, description, image }: ContactSectionProps) {
  const [copied, setCopied] = useState(false);
  const email = settings.contactEmail;

  const handleCopy = async () => {
    const success = await copyToClipboard(email);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Container>
      <Section className="flex min-h-[60vh] flex-col items-start">
        <div className="mb-10">
          <p className="text-[11px] uppercase tracking-[0.2em] text-foreground">
            Booking / General Inquiries
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-4">
            <a
              href={`mailto:${email}`}
              className="text-lg text-foreground underline underline-offset-4 hover:opacity-60"
            >
              {email}
            </a>
            <button
              onClick={handleCopy}
              className="rounded border border-border px-3 py-1 text-sm text-foreground hover:bg-white/10"
              aria-label="Copy email address"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        <div className="grid w-full grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          {description && (
            <div className="text-[15px] leading-relaxed tracking-wide text-muted">
              {Array.isArray(description) ? (
                <PortableText value={description} />
              ) : (
                <p>{description}</p>
              )}
            </div>
          )}

          {image && image.type === 'image' && (
            <div className="relative aspect-[3/4] w-full max-w-md lg:ml-auto">
              <SanityImage
                media={image}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          )}
        </div>
      </Section>
    </Container>
  );
}
