import { groq } from 'next-sanity';

export const siteSettingsQuery = groq`*[_type == "siteSettings"][0] {
  ...,
  instagramUrl,
  availableWorldwideText,
  bookingEmail,
  footerLeftLabel,
  footerRightLabel
}`;

export const pagesQuery = groq`*[_type == "page"] { slug, title, _updatedAt }`;

export const pageBySlugQuery = groq`
  *[_type == "page" && slug.current == $slug][0] {
    ...,
    sections[] {
      ...,
      _type == 'reference' => @-> {
        _type,
        _id,
        title,
        "slug": slug.current,
        coverImage
      }
    }
  }
`;

export const projectsQuery = groq`
  *[_type == "project" && status == "published"] | order(order asc, publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    category->{title, slug},
    year,
    client,
    role,
    coverImage,
    isFeatured,
    order,
    publishedAt,
    updatedAt
  }
`;

export const projectSlugsQuery = groq`*[_type == "project" && status == "published"] { "slug": slug.current }`;

export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug && status == "published"][0] {
    _id,
    title,
    "slug": slug.current,
    category->{title, "slug": slug.current},
    year,
    client,
    role,
    location,
    tags,
    coverImage,
    gallery,
    description,
    credits,
    externalLink,
    relatedProjects[]->{
      _id,
      title,
      "slug": slug.current,
      coverImage
    },
    publishedAt,
    updatedAt
  }
`;

export const featuredProjectsQuery = groq`
  *[_type == "project" && isFeatured == true && status == "published"] | order(order asc) {
    _id,
    title,
    "slug": slug.current,
    coverImage
  }
`;
