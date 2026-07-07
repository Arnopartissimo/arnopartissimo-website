import { sanityClient } from '@/lib/sanity/client';
import { siteSettingsQuery } from '@/lib/sanity/queries';
import { ContactSection } from '@/components/pages/ContactSection';
import { SiteSettings } from '@/types';

export const dynamic = 'force-static';

export default async function ContactRoute() {
  const settings = await sanityClient.fetch<SiteSettings>(siteSettingsQuery);

  if (!settings || !settings.contactEmail) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl">Contact</h1>
        <p className="mt-4 text-neutral-500">Contact information coming soon.</p>
      </div>
    );
  }

  return <ContactSection settings={settings} />;
}
