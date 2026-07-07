import createImageUrlBuilder from '@sanity/image-url';
import { sanityClient, projectId, dataset } from './client';

const builder = createImageUrlBuilder({ projectId, dataset });

export const urlFor = (source: Parameters<typeof builder.image>[0]) => builder.image(source);
