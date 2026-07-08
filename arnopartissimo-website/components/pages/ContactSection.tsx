import type { PortableTextBlock } from '@portabletext/types';
import { SiteSettings, Media } from '@/types';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SanityImage } from '@/components/media/SanityImage';
import { PortableText } from '@portabletext/react';

interface ContactSectionProps {
  settings: SiteSettings;
  description?: string | PortableTextBlock[];
  image?: Media;
}

export function ContactSection({ settings, description, image }: ContactSectionProps) {
  const email = settings.contactEmail;

  return (
    <Container>
      <Section className="flex min-h-[60vh] flex-col items-start pt-8">
        <div className="mb-8 lg:mb-12">
          <p className="text-[10px] uppercase tracking-[0.25em] text-foreground">
            Booking / General Inquiries
          </p>
          <a
            href={`mailto:${email}`}
            className="mt-1 block text-sm uppercase tracking-[0.15em] text-foreground hover:opacity-60"
          >
            {email}
          </a>
        </div>

        <div className="grid w-full grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-16">
          {description && (
            <div className="max-w-xl text-[13px] leading-[1.8] tracking-[0.04em] text-muted">
              {Array.isArray(description) ? (
                <PortableText value={description} />
              ) : (
                <p>{description}</p>
              )}
            </div>
          )}

          {image && image.type === 'image' && (
            <div className="relative aspect-[3/4] w-full max-w-lg lg:ml-auto">
              <SanityImage
                media={image}
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </div>
      </Section>
    </Container>
  );
}
