import { sanityClient } from '@/lib/sanity/client';
import { pageBySlugQuery } from '@/lib/sanity/queries';
import { CreativePage } from '@/components/pages/CreativePage';
import { Page } from '@/types';

export const dynamic = 'force-static';

export default async function CreativeRoute() {
  const page = await sanityClient.fetch<Page>(pageBySlugQuery, { slug: 'creative' });

  if (!page) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl">Creative Direction</h1>
        <p className="mt-4 text-muted">Content coming soon.</p>
      </div>
    );
  }

  return <CreativePage page={page} />;
}
