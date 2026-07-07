import { sanityClient } from '@/lib/sanity/client';
import { pageBySlugQuery } from '@/lib/sanity/queries';
import { HomeMediaGallery } from '@/components/pages/HomeMediaGallery';
import { Page } from '@/types';

export const dynamic = 'force-static';

export default async function HomePage() {
  const page = await sanityClient.fetch<Page | null>(pageBySlugQuery, { slug: 'home' });

  if (!page) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl">Arno Partissimo</h1>
        <p className="mt-4 text-neutral-500">Home content coming soon.</p>
      </div>
    );
  }

  return <HomeMediaGallery sections={page.sections} />;
}
