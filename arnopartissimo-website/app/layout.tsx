import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { sanityClient } from '@/lib/sanity/client';
import { siteSettingsQuery } from '@/lib/sanity/queries';
import { SiteSettings } from '@/types';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    return await sanityClient.fetch<SiteSettings | null>(siteSettingsQuery);
  } catch {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: settings?.title || 'Arno Partissimo',
    description: settings?.description,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="min-h-screen pt-16">{children}</main>
        <Footer settings={settings ?? undefined} />
      </body>
    </html>
  );
}
