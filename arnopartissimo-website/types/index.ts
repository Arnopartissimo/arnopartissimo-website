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

export interface TextBlock {
  _type: 'textBlock';
  _key?: string;
  text: PortableTextBlock[];
}

export interface PageProjectSection {
  _type: 'project';
  _key?: string;
  _id: string;
  title: string;
  slug: string;
  coverImage: Media;
}

export type PageSection = PageProjectSection | Media | TextBlock;

export interface Page {
  _id: string;
  slug: { current: string };
  title: string;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: SanityImageSource;
  noIndex?: boolean;
  sections?: (PageSection & { _key: string })[];
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
}

export interface NavItem {
  label: string;
  href: string;
}
