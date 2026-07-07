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
