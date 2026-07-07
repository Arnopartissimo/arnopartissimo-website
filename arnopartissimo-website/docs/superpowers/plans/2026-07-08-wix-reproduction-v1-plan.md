# Reproduction du site Wix — V1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformer le site Next.js actuel en une reproduction fidèle de l’identité visuelle du site Wix (`arnopartissimo.com`) : thème sombre, header centré, grille 4 colonnes, footer à deux colonnes, tout en gardant un code propre et évolutif.

**Architecture:** On crée un mini Design System (tokens, Logo, NavLink, FooterColumn) puis on refonte les composants layout (Header, Navigation, Footer) et les pages (HomeMediaGallery, CreativePage, ContactSection). Les couleurs et la typographie sont centralisées dans des tokens Tailwind. Les champs Sanity `siteSettings` sont enrichis pour rendre le footer éditable.

**Tech Stack:** Next.js 16.2.10, React 19.2.4, Tailwind CSS 4, Sanity 6.3.0, TypeScript, Vitest.

## Global Constraints

- Police principale : Inter via `next/font/google`.
- Couleurs : background `#1F1F1F`, foreground `#FCFCFC`, muted `#747279`.
- Navigation : `PHOTO.`, `CREATIVE DIRECTION.`, `CONTACT` (pas de `STORE.`).
- Footer : deux colonnes, texte blanc, séparateur horizontal, même version desktop/mobile.
- Galerie home : 4 colonnes desktop, ratios d’origine, gap `15px`, images statiques.
- Ordre des images de la galerie défini dans Sanity et respecté.
- Pas de lightbox sur la galerie d’accueil.
- Build, lint, typecheck et tests doivent passer avant chaque commit.

---

## File Structure

New files:

- `app/globals.css` — update tokens
- `app/layout.tsx` — load Inter font
- `components/design-system/tokens.ts` — semantic design tokens
- `components/design-system/Logo.tsx` — centered text logo
- `components/design-system/NavLink.tsx` — navigation link with active state
- `components/design-system/FooterColumn.tsx` — footer link column
- `components/layout/Header.tsx` — transparent centered header
- `components/layout/Navigation.tsx` — nav + mobile full-screen menu
- `components/layout/Footer.tsx` — Wix-style footer
- `components/pages/HomeMediaGallery.tsx` — 4-column masonry-like gallery
- `components/pages/CreativePage.tsx` — project card grid
- `components/pages/ContactSection.tsx` — contact page (theme update)
- `sanity/schemaTypes/siteSettings.ts` — add footer/instagram fields
- `lib/sanity/queries.ts` — add new fields to siteSettings query
- `types/index.ts` — extend SiteSettings type
- tests — add/update component tests

---

## Task 1: Update global theme and font

**Files:**

- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Test: `tests/smoke.test.ts` (update if it asserts colors/font)

**Interfaces:**

- Produces: CSS variables `--background`, `--foreground`, `--muted`, `--accent`, `--border`; font variable `--font-inter`.

- [ ] **Step 1: Replace Geist with Inter in layout**

```tsx
// app/layout.tsx
import type { Metadata } from 'next';
import { cache } from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { JsonLd } from '@/components/seo/JsonLd';
import { sanityClient } from '@/lib/sanity/client';
import { siteSettingsQuery } from '@/lib/sanity/queries';
import { websiteSchema, personSchema } from '@/lib/seo/schema';
import { urlFor } from '@/lib/sanity/image';
import { SiteSettings } from '@/types';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const getSiteSettings = cache(async (): Promise<SiteSettings | null> => {
  try {
    return await sanityClient.fetch<SiteSettings | null>(siteSettingsQuery);
  } catch {
    return null;
  }
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title = settings?.title || 'Arno Partissimo';
  const description =
    settings?.description ||
    'Portfolio of Arno Partissimo — creative direction, photography and visual storytelling.';
  const images = settings?.defaultSeoImage
    ? [{ url: urlFor(settings.defaultSeoImage).url() }]
    : undefined;

  return {
    title,
    description,
    openGraph: { title, description, images, type: 'website' },
    twitter: { card: 'summary_large_image', title, description, images },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();
  const siteSettings = settings ?? { _id: '', title: 'Arno Partissimo', contactEmail: '' };

  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <head>
        <JsonLd data={[websiteSchema(siteSettings), personSchema(siteSettings)]} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <Header />
        <main className="flex-1 pt-32">{children}</main>
        <Footer settings={settings ?? undefined} />
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Update global CSS tokens**

```css
/* app/globals.css */
@import 'tailwindcss';

:root {
  --background: #1f1f1f;
  --foreground: #fcfcfc;
  --muted: #747279;
  --accent: #fcfcfc;
  --border: rgba(252, 252, 252, 0.1);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-muted: var(--muted);
  --color-accent: var(--accent);
  --color-border: var(--border);
  --font-sans: var(--font-inter), Arial, Helvetica, sans-serif;
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: var(--font-sans);
}
```

- [ ] **Step 3: Run typecheck and tests**

```bash
npm run typecheck
npm run test:run
```

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx app/globals.css
git commit -m "feat(theme): switch to dark theme with Inter font"
```

---

## Task 2: Create design-system tokens and Logo component

**Files:**

- Create: `components/design-system/tokens.ts`
- Create: `components/design-system/Logo.tsx`
- Test: `tests/components/Logo.test.tsx`

**Interfaces:**

- Produces: `Logo` component with `className?: string` prop.
- Produces: `tokens` object for colors, spacing, typography.

- [ ] **Step 1: Write tokens file**

```ts
// components/design-system/tokens.ts
export const tokens = {
  colors: {
    background: '#1f1f1f',
    foreground: '#fcfcfc',
    muted: '#747279',
    accent: '#fcfcfc',
    border: 'rgba(252, 252, 252, 0.1)',
  },
  typography: {
    logo: {
      size: '20px',
      tracking: '0.15em',
    },
    nav: {
      size: '11px',
      tracking: '0.2em',
    },
    footer: {
      size: '10px',
      tracking: '0.3em',
    },
  },
  spacing: {
    headerHeight: '80px',
    galleryGap: '15px',
    footerPadding: '32px',
  },
} as const;
```

- [ ] **Step 2: Write Logo component**

```tsx
// components/design-system/Logo.tsx
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        'text-[20px] uppercase tracking-[0.15em] text-foreground transition-opacity hover:opacity-80',
        className
      )}
    >
      ARNO PARTISSIMO.
    </Link>
  );
}
```

- [ ] **Step 3: Write test for Logo**

```tsx
// tests/components/Logo.test.tsx
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
```

- [ ] **Step 4: Run tests**

```bash
npm run test:run tests/components/Logo.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/design-system/tokens.ts components/design-system/Logo.tsx tests/components/Logo.test.tsx
git commit -m "feat(design-system): add tokens and Logo component"
```

---

## Task 3: Create NavLink and FooterColumn components

**Files:**

- Create: `components/design-system/NavLink.tsx`
- Create: `components/design-system/FooterColumn.tsx`
- Test: `tests/components/NavLink.test.tsx`
- Test: `tests/components/FooterColumn.test.tsx`

**Interfaces:**

- Produces: `NavLink` component with props `{ href: string; children: React.ReactNode; isActive?: boolean }`.
- Produces: `FooterColumn` component with props `{ title?: string; children: React.ReactNode }`.

- [ ] **Step 1: Write NavLink component**

```tsx
// components/design-system/NavLink.tsx
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
  className?: string;
}

export function NavLink({ href, children, isActive, className }: NavLinkProps) {
  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'text-[11px] uppercase tracking-[0.2em] transition-colors duration-100',
        isActive ? 'text-foreground' : 'text-muted hover:text-foreground',
        className
      )}
    >
      {children}
    </Link>
  );
}
```

- [ ] **Step 2: Write FooterColumn component**

```tsx
// components/design-system/FooterColumn.tsx
import { cn } from '@/lib/utils/cn';

interface FooterColumnProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function FooterColumn({ title, children, className }: FooterColumnProps) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {title && <h3 className="text-[10px] uppercase tracking-[0.3em] text-foreground">{title}</h3>}
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
}
```

- [ ] **Step 3: Write tests**

```tsx
// tests/components/NavLink.test.tsx
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
```

```tsx
// tests/components/FooterColumn.test.tsx
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
```

- [ ] **Step 4: Run tests**

```bash
npm run test:run tests/components/NavLink.test.tsx tests/components/FooterColumn.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/design-system/NavLink.tsx components/design-system/FooterColumn.tsx tests/components/NavLink.test.tsx tests/components/FooterColumn.test.tsx
git commit -m "feat(design-system): add NavLink and FooterColumn components"
```

---

## Task 4: Refactor Header and Navigation

**Files:**

- Modify: `components/layout/Header.tsx`
- Modify: `components/layout/Navigation.tsx`
- Test: `tests/components/Header.test.tsx`
- Test: `tests/components/Navigation.test.tsx`

**Interfaces:**

- Consumes: `Logo`, `NavLink`.
- Produces: `Header` and `Navigation` components matching the Wix style.

- [ ] **Step 1: Write Navigation component**

```tsx
// components/layout/Navigation.tsx
'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { NavLink } from '@/components/design-system/NavLink';
import { cn } from '@/lib/utils/cn';

const navItems = [
  { label: 'PHOTO.', href: '/' },
  { label: 'CREATIVE DIRECTION.', href: '/creative' },
  { label: 'CONTACT', href: '/contact' },
];

export function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav aria-label="Main navigation" className="hidden md:block">
        <ul className="flex items-center gap-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <NavLink href={item.href} isActive={isActive}>
                  {item.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <button
        type="button"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
        className="md:hidden text-foreground p-2"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="block h-0.5 w-6 bg-current mb-1" />
        <span className="block h-0.5 w-6 bg-current mb-1" />
        <span className="block h-0.5 w-6 bg-current" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-background md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute top-4 right-4 text-foreground p-2"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>
          <nav aria-label="Mobile navigation">
            <ul className="flex flex-col items-center gap-8">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <NavLink
                      href={item.href}
                      isActive={isActive}
                      className="text-lg"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}
```

Wait: `NavLink` does not accept `onClick`. We need to add it.

Update `NavLink` to forward an optional `onClick`:

```tsx
// components/design-system/NavLink.tsx
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
  className?: string;
  onClick?: () => void;
}

export function NavLink({ href, children, isActive, className, onClick }: NavLinkProps) {
  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      onClick={onClick}
      className={cn(
        'text-[11px] uppercase tracking-[0.2em] transition-colors duration-100',
        isActive ? 'text-foreground' : 'text-muted hover:text-foreground',
        className
      )}
    >
      {children}
    </Link>
  );
}
```

- [ ] **Step 2: Update Header component**

```tsx
// components/layout/Header.tsx
import { Logo } from '@/components/design-system/Logo';
import { Navigation } from './Navigation';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-4 sm:px-6 lg:px-8">
        <Logo className="mb-2" />
        <Navigation />
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Update tests**

```tsx
// tests/components/Header.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Header } from '@/components/layout/Header';

describe('Header', () => {
  it('renders logo and navigation', () => {
    render(<Header />);
    expect(screen.getByText('ARNO PARTISSIMO.')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();
  });
});
```

```tsx
// tests/components/Navigation.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Navigation } from '@/components/layout/Navigation';

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
```

- [ ] **Step 4: Run tests and typecheck**

```bash
npm run typecheck
npm run test:run tests/components/Header.test.tsx tests/components/Navigation.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/design-system/NavLink.tsx components/layout/Header.tsx components/layout/Navigation.tsx tests/components/Header.test.tsx tests/components/Navigation.test.tsx
git commit -m "feat(layout): refactor Header and Navigation to match Wix style"
```

---

## Task 5: Refactor Footer

**Files:**

- Modify: `components/layout/Footer.tsx`
- Modify: `sanity/schemaTypes/siteSettings.ts`
- Modify: `lib/sanity/queries.ts`
- Modify: `types/index.ts`
- Test: `tests/components/Footer.test.tsx`

**Interfaces:**

- Consumes: `FooterColumn`.
- Consumes: `SiteSettings` extended with `instagramUrl`, `availableWorldwideText`, `bookingEmail`, `footerLeftLabel`, `footerRightLabel`.

- [ ] **Step 1: Extend SiteSettings type**

```ts
// types/index.ts
export interface SiteSettings {
  _id: string;
  title: string;
  description?: string;
  logo?: SanityImageSource;
  favicon?: SanityImageSource;
  socialLinks?: { platform: string; url: string }[];
  contactEmail: string;
  footerText?: string;
  defaultSeoImage?: SanityImageSource;
  analyticsId?: string;
  instagramUrl?: string;
  availableWorldwideText?: string;
  bookingEmail?: string;
  footerLeftLabel?: string;
  footerRightLabel?: string;
}
```

- [ ] **Step 2: Extend Sanity schema**

```ts
// sanity/schemaTypes/siteSettings.ts
import { defineField, defineType } from 'sanity';

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Site Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'description', title: 'Site Description', type: 'text' }),
    defineField({ name: 'logo', title: 'Logo', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'favicon', title: 'Favicon', type: 'image' }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'platform', type: 'string', title: 'Platform' }),
            defineField({ name: 'url', type: 'url', title: 'URL' }),
          ],
        },
      ],
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({ name: 'footerText', title: 'Footer Text', type: 'string' }),
    defineField({
      name: 'defaultSeoImage',
      title: 'Default SEO Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({ name: 'analyticsId', title: 'Analytics ID', type: 'string' }),
    defineField({ name: 'instagramUrl', title: 'Instagram URL', type: 'url' }),
    defineField({
      name: 'availableWorldwideText',
      title: 'Available Worldwide Text',
      type: 'string',
      initialValue: 'AVAILABLE WORLDWIDE',
    }),
    defineField({
      name: 'bookingEmail',
      title: 'Booking Email',
      type: 'string',
      initialValue: 'arno@arnopartissimo.com',
    }),
    defineField({
      name: 'footerLeftLabel',
      title: 'Footer Left Label',
      type: 'string',
      initialValue: 'ARNO PARTISSIMO',
    }),
    defineField({
      name: 'footerRightLabel',
      title: 'Footer Right Label',
      type: 'string',
      initialValue: 'BOOKING / GENERAL INQUIRIES',
    }),
  ],
});
```

- [ ] **Step 3: Update site settings query**

```ts
// lib/sanity/queries.ts
export const siteSettingsQuery = groq`*[_type == "siteSettings"][0] {
  ...,
  instagramUrl,
  availableWorldwideText,
  bookingEmail,
  footerLeftLabel,
  footerRightLabel
}`;
```

- [ ] **Step 4: Write Footer component**

```tsx
// components/layout/Footer.tsx
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
    <footer className="border-t border-border py-8">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-4 sm:flex-row sm:px-6 lg:px-8">
        <FooterColumn title={leftLabel}>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] uppercase tracking-[0.3em] text-foreground hover:opacity-70 transition-opacity"
          >
            INSTAGRAM.
          </a>
        </FooterColumn>

        <FooterColumn title={availableText}>
          <span className="text-[10px] uppercase tracking-[0.3em] text-foreground">
            {rightLabel}
          </span>
          <a
            href={`mailto:${bookingEmail}`}
            className="text-[10px] uppercase tracking-[0.3em] text-foreground hover:opacity-70 transition-opacity"
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
```

- [ ] **Step 5: Write Footer test**

```tsx
// tests/components/Footer.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Footer } from '@/components/layout/Footer';

describe('Footer', () => {
  it('renders left and right columns', () => {
    render(<Footer />);
    expect(screen.getByText('ARNO PARTISSIMO')).toBeInTheDocument();
    expect(screen.getByText('AVAILABLE WORLDWIDE')).toBeInTheDocument();
    expect(screen.getByText('BOOKING / GENERAL INQUIRIES')).toBeInTheDocument();
    expect(screen.getByText('arno@arnopartissimo.com')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'INSTAGRAM.' })).toHaveAttribute(
      'href',
      'https://instagram.com/arnopartissimo'
    );
  });

  it('uses settings when provided', () => {
    render(
      <Footer
        settings={{
          _id: 'settings',
          title: 'Arno Partissimo',
          contactEmail: 'hello@arnopartissimo.com',
          instagramUrl: 'https://instagram.com/test',
          footerLeftLabel: 'TEST LEFT',
          availableWorldwideText: 'TEST WORLD',
          footerRightLabel: 'TEST RIGHT',
          bookingEmail: 'booking@test.com',
        }}
      />
    );
    expect(screen.getByText('TEST LEFT')).toBeInTheDocument();
    expect(screen.getByText('TEST WORLD')).toBeInTheDocument();
    expect(screen.getByText('TEST RIGHT')).toBeInTheDocument();
    expect(screen.getByText('booking@test.com')).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Run typecheck and tests**

```bash
npm run typecheck
npm run test:run tests/components/Footer.test.tsx
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add components/layout/Footer.tsx sanity/schemaTypes/siteSettings.ts lib/sanity/queries.ts types/index.ts tests/components/Footer.test.tsx
git commit -m "feat(layout): refactor Footer with Sanity-editable Wix-style columns"
```

---

## Task 6: Refactor HomeMediaGallery

**Files:**

- Modify: `components/pages/HomeMediaGallery.tsx`
- Modify: `components/media/SanityImage.tsx` (if needed for placeholder)
- Test: `tests/components/HomeMediaGallery.test.tsx`

**Interfaces:**

- Consumes: `PageSection`, `Media`, `SanityImage`.
- Produces: 4-column masonry-like gallery.

- [ ] **Step 1: Update HomeMediaGallery**

```tsx
// components/pages/HomeMediaGallery.tsx
import { PageSection, Media } from '@/types';
import { SanityImage } from '@/components/media/SanityImage';
import { VideoEmbed } from '@/components/media/VideoEmbed';
import { Container } from '@/components/ui/Container';

interface HomeMediaGalleryProps {
  sections?: PageSection[];
}

function isMediaSection(section: PageSection): section is Media {
  return section._type === 'media';
}

export function HomeMediaGallery({ sections }: HomeMediaGalleryProps) {
  const mediaSections = sections?.filter(isMediaSection) ?? [];

  if (mediaSections.length === 0) {
    return (
      <Container>
        <p className="py-20 text-center text-muted">Gallery coming soon.</p>
      </Container>
    );
  }

  return (
    <Container>
      <div
        className="py-12"
        style={{
          columnCount: 4,
          columnGap: '15px',
        }}
      >
        {mediaSections.map((section, index) => (
          <div
            key={section._key || `home-media-${index}`}
            className="mb-[15px] break-inside-avoid transition-transform duration-200 hover:scale-[0.985] hover:opacity-90"
          >
            {section.type === 'image' ? (
              <SanityImage
                media={section}
                width={600}
                priority={index < 6}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="h-auto w-full"
              />
            ) : (
              <VideoEmbed url={section.videoUrl || ''} className="h-auto w-full" />
            )}
          </div>
        ))}
      </div>
    </Container>
  );
}
```

Wait: Tailwind CSS v4 may not support arbitrary `columnCount` style utilities out of the box. Using inline style is safer and explicit.

- [ ] **Step 2: Add responsive styles**

Use CSS media queries inside the component via inline style or a style block. For simplicity, use a wrapper class and a small CSS addition in `globals.css`:

```css
/* app/globals.css */
.home-gallery {
  column-count: 1;
  column-gap: 15px;
}

@media (min-width: 640px) {
  .home-gallery {
    column-count: 2;
  }
}

@media (min-width: 1024px) {
  .home-gallery {
    column-count: 4;
  }
}
```

Then use `className="home-gallery py-12"`.

- [ ] **Step 3: Write test**

```tsx
// tests/components/HomeMediaGallery.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HomeMediaGallery } from '@/components/pages/HomeMediaGallery';
import { PageSection } from '@/types';

const sections: PageSection[] = [
  {
    _type: 'media',
    _key: 'a',
    type: 'image',
    image: { _type: 'image', asset: { _ref: 'ref-a', _type: 'reference' } },
  },
  {
    _type: 'media',
    _key: 'b',
    type: 'image',
    image: { _type: 'image', asset: { _ref: 'ref-b', _type: 'reference' } },
  },
];

describe('HomeMediaGallery', () => {
  it('renders gallery items', () => {
    render(<HomeMediaGallery sections={sections} />);
    expect(screen.getAllByRole('img').length).toBe(2);
  });

  it('shows placeholder when empty', () => {
    render(<HomeMediaGallery sections={[]} />);
    expect(screen.getByText('Gallery coming soon.')).toBeInTheDocument();
  });
});
```

- [ ] **Step 4: Run tests**

```bash
npm run test:run tests/components/HomeMediaGallery.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/globals.css components/pages/HomeMediaGallery.tsx tests/components/HomeMediaGallery.test.tsx
git commit -m "feat(home): refactor gallery to 4-column masonry with Wix spacing"
```

---

## Task 7: Adapt CreativePage to dark theme

**Files:**

- Modify: `components/pages/CreativePage.tsx`
- Modify: `components/project/ProjectCard.tsx`
- Test: `tests/components/ProjectCard.test.tsx` (update)

**Interfaces:**

- Consumes: `Project` list from `page-creative`.
- Produces: project card grid with cover image + title.

- [ ] **Step 1: Update ProjectCard for dark theme**

```tsx
// components/project/ProjectCard.tsx
import Link from 'next/link';
import { Project } from '@/types';
import { SanityImage } from '@/components/media/SanityImage';
import { cn } from '@/lib/utils/cn';

interface ProjectCardProps {
  project: Project;
  className?: string;
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  return (
    <Link href={`/creative/${project.slug}`} className={cn('group block', className)}>
      <div className="relative aspect-[3/4] overflow-hidden">
        {project.coverImage ? (
          <SanityImage
            media={{ _type: 'media', type: 'image', image: project.coverImage }}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-200 group-hover:scale-[0.985]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted/10 text-muted">
            No image
          </div>
        )}
      </div>
      <h3 className="mt-3 text-[11px] uppercase tracking-[0.2em] text-foreground">
        {project.title}
      </h3>
    </Link>
  );
}
```

- [ ] **Step 2: Update CreativePage layout**

```tsx
// components/pages/CreativePage.tsx
import { Project } from '@/types';
import { ProjectCard } from '@/components/project/ProjectCard';
import { Container } from '@/components/ui/Container';

interface CreativePageProps {
  projects: Project[];
}

export function CreativePage({ projects }: CreativePageProps) {
  if (projects.length === 0) {
    return (
      <Container>
        <p className="py-20 text-center text-muted">Projects coming soon.</p>
      </Container>
    );
  }

  return (
    <Container>
      <div className="grid grid-cols-1 gap-4 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </div>
    </Container>
  );
}
```

- [ ] **Step 3: Update test**

```tsx
// tests/components/ProjectCard.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProjectCard } from '@/components/project/ProjectCard';
import { Project } from '@/types';

const project: Project = {
  _id: 'p1',
  title: 'Test Project',
  slug: 'test-project',
  coverImage: { _type: 'image', asset: { _ref: 'ref', _type: 'reference' } },
};

describe('ProjectCard', () => {
  it('renders title and link', () => {
    render(<ProjectCard project={project} />);
    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', '/creative/test-project');
  });
});
```

- [ ] **Step 4: Run tests**

```bash
npm run test:run tests/components/ProjectCard.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/project/ProjectCard.tsx components/pages/CreativePage.tsx tests/components/ProjectCard.test.tsx
git commit -m "feat(creative): adapt project cards and creative page to dark theme"
```

---

## Task 8: Adapt ContactSection to dark theme

**Files:**

- Modify: `components/pages/ContactSection.tsx`
- Test: `tests/components/ContactSection.test.tsx` (update if needed)

**Interfaces:**

- Consumes: `Page` with textBlock and media sections.
- Produces: contact page styled for dark theme.

- [ ] **Step 1: Update ContactSection**

Read current file first, then update colors to use `text-foreground`, `text-muted`, `border-border`. Keep existing structure.

Example minimal change: replace `text-neutral-500` with `text-muted`, `text-neutral-900` with `text-foreground`, `border-neutral-200` with `border-border`.

- [ ] **Step 2: Run tests**

```bash
npm run test:run tests/components/ContactSection.test.tsx
```

Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add components/pages/ContactSection.tsx tests/components/ContactSection.test.tsx
git commit -m "feat(contact): adapt contact page to dark theme"
```

---

## Task 9: Update page padding and not-found page

**Files:**

- Modify: `app/page.tsx`
- Modify: `app/not-found.tsx`
- Modify: `app/contact/page.tsx`
- Modify: `app/creative/page.tsx`

**Interfaces:**

- Consumes: dark theme classes.

- [ ] **Step 1: Update page.tsx placeholder text color**

```tsx
// app/page.tsx (fallback only)
if (!page) {
  return (
    <div className="py-20 text-center">
      <h1 className="text-2xl text-foreground">Arno Partissimo</h1>
      <p className="mt-4 text-muted">Home content coming soon.</p>
    </div>
  );
}
```

- [ ] **Step 2: Update not-found.tsx**

Replace neutral colors with theme colors.

- [ ] **Step 3: Run build**

```bash
npm run build
```

Expected: SUCCESS.

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx app/not-found.tsx
git commit -m "feat(pages): adapt fallback and not-found pages to dark theme"
```

---

## Task 10: Final validation and deploy

**Files:**

- All modified files.

- [ ] **Step 1: Run full test suite**

```bash
npm run typecheck
npm run lint
npm run test:run
npm run build
```

Expected: all PASS/SUCCESS.

- [ ] **Step 2: Push to trigger Vercel deploy**

```bash
git push origin master
```

- [ ] **Step 3: Verify deploy**

Wait for Vercel deploy and open `https://arnopartissimo-website.vercel.app`.
Check:

- Header centered with correct nav.
- Dark background.
- Gallery 4 columns on desktop.
- Footer two columns.
- Mobile menu works.

- [ ] **Step 4: Update Sanity studio if schema changed**

If `siteSettings` schema changed, run:

```bash
npm run sanity:deploy
```

Then open `https://arnopartissimo-website.sanity.studio` and fill in the new footer fields.

- [ ] **Step 5: Final commit if any fixes**

```bash
git commit -m "chore: final fixes after validation" || true
```

---

## Self-Review

**Spec coverage:**

- [x] Dark theme and Inter font → Task 1
- [x] Header centered transparent → Task 4
- [x] Navigation PHOTO./CREATIVE DIRECTION./CONTACT → Task 4
- [x] Footer Wix two columns editable → Task 5
- [x] Home gallery 4 columns, original ratios, 15px gap, static → Task 6
- [x] Creative page project card grid → Task 7
- [x] Contact page dark theme → Task 8
- [x] Tests and validation → Task 10

**Placeholder scan:**

- No TBD/TODO.
- No vague "handle edge cases" steps.
- Code blocks contain actual code.

**Type consistency:**

- `NavLink` props include `onClick` used in Navigation mobile menu.
- `SiteSettings` type matches Sanity schema and query.
- `Footer` consumes new fields with defaults.

**Gaps:** none identified.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-07-08-wix-reproduction-v1-plan.md`.

**Two execution options:**

1. **Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.
2. **Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints.

Which approach do you want?
