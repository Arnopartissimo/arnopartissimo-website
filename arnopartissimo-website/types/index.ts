import type { PortableTextBlock } from '@portabletext/types';
import type { SanityImageSource } from '@sanity/image-url';

export interface SanityAsset {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
}

export interface Media {
  _type: 'media';
  _key?: string;
  type: 'image' | 'video';
  image?: SanityImageSource & {
    alt?: string;
    caption?: string;
    credits?: string;
  };
  videoUrl?: string;
  caption?: string;
  credits?: string;
}

export interface Category {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  coverImage?: SanityImageSource;
}

export interface Project {
  _id: string;
  title: string;
  slug: string;
  category?: Category;
  year?: string;
  client?: string;
  role?: string;
  location?: string;
  tags?: string[];
  coverImage: Media;
  gallery?: Media[];
  description?: PortableTextBlock[];
  credits?: string;
  externalLink?: string;
  relatedProjects?: Pick<Project, '_id' | 'title' | 'slug' | 'coverImage'>[];
  order?: number;
  isFeatured?: boolean;
  status: 'draft' | 'published';
  publishedAt?: string;
  updatedAt?: string;
}

export interface Page {
  _id: string;
  slug: { current: string };
  title: string;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: SanityImageSource;
  noIndex?: boolean;
  sections?: (Project | Media)[];
}

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
  customScripts?: string;
}

export interface NavItem {
  label: string;
  href: string;
}
