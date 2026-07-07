import { sanityClient } from '@/lib/sanity/client';
import { siteSettingsQuery, pageBySlugQuery } from '@/lib/sanity/queries';
import { ContactSection } from '@/components/pages/ContactSection';
import { SiteSettings, Page } from '@/types';

export const dynamic = 'force-static';

export default async function ContactRoute() {
  const [settings, page] = await Promise.all([
    sanityClient.fetch<SiteSettings>(siteSettingsQuery),
    sanityClient.fetch<Page>(pageBySlugQuery, { slug: 'contact' }),
  ]);

  if (!settings || !settings.contactEmail) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl">Contact</h1>
        <p className="mt-4 text-neutral-500">Contact information coming soon.</p>
      </div>
    );
  }

  const textBlockSection = page?.sections?.find((section) => section._type === 'textBlock');
  const description = textBlockSection?.text ?? page?.metaDescription;

  return <ContactSection settings={settings} description={description} />;
}
