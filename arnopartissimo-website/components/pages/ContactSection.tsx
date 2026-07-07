'use client';

import { useState } from 'react';
import { SiteSettings } from '@/types';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { copyToClipboard } from '@/lib/utils/copy-to-clipboard';

interface ContactSectionProps {
  settings: SiteSettings;
}

export function ContactSection({ settings }: ContactSectionProps) {
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
      <Section className="flex min-h-[60vh] flex-col items-start justify-center">
        <h1 className="mb-8 text-3xl font-light uppercase tracking-wide">Contact</h1>
        <p className="mb-6 text-neutral-600">
          For inquiries, collaborations, or any questions, please reach out at:
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <a
            href={`mailto:${email}`}
            className="text-lg underline underline-offset-4 hover:opacity-60"
          >
            {email}
          </a>
          <button
            onClick={handleCopy}
            className="rounded border border-neutral-300 px-3 py-1 text-sm hover:bg-neutral-100"
            aria-label="Copy email address"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </Section>
    </Container>
  );
}
