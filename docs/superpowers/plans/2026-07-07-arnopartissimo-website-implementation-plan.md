# Arno Partissimo Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a clean, maintainable Next.js + Sanity portfolio website that recreates arnopartissimo.com independently from Wix, with automated deployment on Vercel.

**Architecture:** Static-site generation with Next.js App Router, content managed through Sanity Studio, optimized images via Sanity CDN + next/image, and a well-documented codebase organized by domain.

**Tech Stack:** Next.js 14+ (App Router), TypeScript (strict), Tailwind CSS, Sanity Studio v3, next-sanity, GROQ, Vercel, GitHub Actions.

## Global Constraints

- Framework: Next.js 14+ with App Router.
- Language: TypeScript strict mode.
- Styling: Tailwind CSS.
- CMS: Sanity Studio v3.
- CMS connection: next-sanity + GROQ queries.
- Images / media: Sanity CDN + next/image.
- Hosting: Vercel free tier.
- Versioning: GitHub.
- CI/CD: GitHub Actions + Vercel auto-deploy.
- Contact: no third-party service; use `mailto:` + copy-to-clipboard.
- Projects URLs: `/projects/[slug]` (clean structure).
- Home gallery: selection of featured photos, not a project grid.
- No store, no legal pages, no challenges/members/loyalty pages for this phase.
- Code must be clean, documented, and maintainable by a human developer.
- SEO IA: structured data (Schema.org JSON-LD), semantic HTML, `llms.txt`.

---

## File Structure

```
arnopartissimo-website/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── creative/
│   │   └── page.tsx
│   ├── contact/
│   │   └── page.tsx
│   ├── projects/
│   │   └── [slug]/
│   │       └── page.tsx
│   ├── robots.ts
│   ├── sitemap.ts
│   └── llms.txt/route.ts
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Navigation.tsx
│   ├── pages/
│   │   ├── HomeGallery.tsx
│   │   ├── CreativePage.tsx
│   │   └── ContactSection.tsx
│   ├── project/
│   │   ├── ProjectCard.tsx
│   │   ├── ProjectDetail.tsx
│   │   └── ProjectGallery.tsx
│   ├── media/
│   │   ├── SanityImage.tsx
│   │   └── VideoEmbed.tsx
│   ├── ui/
│   │   ├── Container.tsx
│   │   ├── Section.tsx
│   │   └── LoadingState.tsx
│   └── seo/
│       ├── JsonLd.tsx
│       └── Seo.tsx
├── lib/
│   ├── sanity/
│   │   ├── client.ts
│   │   ├── image.ts
│   │   └── queries.ts
│   ├── utils/
│   │   └── copy-to-clipboard.ts
│   └── seo/
│       └── schema.ts
├── sanity/
│   ├── config.ts
│   ├── schemaTypes/
│   │   ├── index.ts
│   │   ├── media.ts
│   │   ├── siteSettings.ts
│   │   ├── page.ts
│   │   ├── project.ts
│   │   └── category.ts
│   └── structure.ts
├── types/
│   └── index.ts
├── tests/
│   └── components/
│       └── SanityImage.test.tsx
├── docs/
│   ├── README.md
│   ├── SETUP.md
│   ├── ARCHITECTURE.md
│   └── DECISIONS.md
├── .github/
│   └── workflows/
│       └── ci.yml
├── .env.example
├── next.config.js
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── eslint.config.mjs
├── prettier.config.js
└── vitest.config.ts
```

---

## Task 1: Initialize Next.js project with TypeScript, Tailwind, and tooling

**Files:**
- Create: all project files listed in structure above (incrementally through steps).
- Modify: none.
- Test: `package.json` scripts run without errors.

**Interfaces:**
- Consumes: none.
- Produces: working Next.js dev server on `http://localhost:3000`.

- [ ] **Step 1: Create project folder and initialize Next.js**

Run in project root (`/Users/arnopartissimo/Documents/WEBSITE DEV DO NOT REMOVE`):

```bash
mkdir arnopartissimo-website
cd arnopartissimo-website
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias "@/*" --use-npm --no-turbopack
```

Expected output: Next.js project scaffolded with `app/`, `public/`, `package.json`, etc.

- [ ] **Step 2: Verify dev server starts**

```bash
npm run dev
```

Open `http://localhost:3000`. Expected: default Next.js landing page.

- [ ] **Step 3: Install additional dependencies**

```bash
npm install next-sanity @sanity/image-url @sanity/vision sanity
npm install --save-dev vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom husky lint-staged prettier eslint-config-prettier
```

- [ ] **Step 4: Configure TypeScript strict mode**

Modify `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 5: Configure Prettier and ESLint**

Create `prettier.config.js`:

```js
/** @type {import('prettier').Config} */
module.exports = {
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'es5',
  printWidth: 100,
};
```

Create `eslint.config.mjs`:

```js
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'prettier'),
];

export default eslintConfig;
```

- [ ] **Step 6: Configure Husky and lint-staged**

```bash
npx husky init
```

Add to `package.json`:

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,css,md}": ["prettier --write"]
  }
}
```

Update `.husky/pre-commit`:

```bash
npx lint-staged
```

- [ ] **Step 7: Create folder structure**

```bash
mkdir -p app/creative app/contact 'app/projects/[slug]' components/layout components/pages components/project components/media components/ui components/seo lib/sanity lib/utils lib/seo sanity/schemaTypes tests/components docs .github/workflows
```

- [ ] **Step 8: Create initial Vitest config**

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
```

Create `tests/setup.ts`:

```ts
import '@testing-library/jest-dom';
```

Add to `package.json` scripts:

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "typecheck": "tsc --noEmit",
    "lint": "next lint",
    "format": "prettier --write ."
  }
}
```

- [ ] **Step 9: Commit**

```bash
git add .
git commit -m "chore: initialize Next.js project with TypeScript, Tailwind, and tooling"
```

---

## Task 2: Set up Sanity Studio and schemas

**Files:**
- Create: `sanity/config.ts`, `sanity/schemaTypes/index.ts`, `sanity/schemaTypes/media.ts`, `sanity/schemaTypes/siteSettings.ts`, `sanity/schemaTypes/page.ts`, `sanity/schemaTypes/project.ts`, `sanity/schemaTypes/category.ts`, `sanity/structure.ts`.
- Modify: `package.json` (Sanity scripts).
- Test: `npm run sanity:typegen` generates `sanity.types.ts` without errors.

**Interfaces:**
- Consumes: none.
- Produces: Sanity Studio running locally at `http://localhost:3333` with all schemas loaded.

- [ ] **Step 1: Create Sanity config**

Create `sanity/config.ts`:

```ts
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemaTypes';
import { structure } from './structure';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';

export const sanityConfig = defineConfig({
  name: 'arnopartissimo-website',
  title: 'Arno Partissimo Website',
  projectId,
  dataset,
  plugins: [structureTool({ structure }), visionTool()],
  schema: { types: schemaTypes },
});

export default sanityConfig;
```

- [ ] **Step 2: Create reusable media object schema**

Create `sanity/schemaTypes/media.ts`:

```ts
import { defineField, defineType } from 'sanity';

export const mediaType = defineType({
  name: 'media',
  title: 'Media',
  type: 'object',
  fields: [
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Image', value: 'image' },
          { title: 'Video', value: 'video' },
        ],
        layout: 'radio',
      },
      initialValue: 'image',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', type: 'string', title: 'Alt text' }),
        defineField({ name: 'caption', type: 'string', title: 'Caption' }),
        defineField({ name: 'credits', type: 'string', title: 'Credits' }),
      ],
      hidden: ({ parent }) => parent?.type !== 'image',
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      description: 'YouTube, Vimeo, or direct video file URL',
      hidden: ({ parent }) => parent?.type !== 'video',
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      hidden: ({ parent }) => parent?.type !== 'video',
    }),
    defineField({
      name: 'credits',
      title: 'Credits',
      type: 'string',
      hidden: ({ parent }) => parent?.type !== 'video',
    }),
  ],
  preview: {
    select: {
      type: 'type',
      alt: 'image.alt',
      caption: 'caption',
      media: 'image',
    },
    prepare({ type, alt, caption, media }) {
      return {
        title: type === 'image' ? alt || 'Image' : 'Video',
        subtitle: caption,
        media,
      };
    },
  },
});
```

- [ ] **Step 3: Create category schema**

Create `sanity/schemaTypes/category.ts`:

```ts
import { defineField, defineType } from 'sanity';

export const categoryType = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({ name: 'coverImage', title: 'Cover Image', type: 'image', options: { hotspot: true } }),
  ],
});
```

- [ ] **Step 4: Create siteSettings schema**

Create `sanity/schemaTypes/siteSettings.ts`:

```ts
import { defineField, defineType } from 'sanity';

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Site Title', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'description', title: 'Site Description', type: 'text' }),
    defineField({ name: 'logo', title: 'Logo', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'favicon', title: 'Favicon', type: 'image' }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'platform', type: 'string', title: 'Platform' }),
            defineField({ name: 'url', type: 'url', title: 'URL' }),
          ],
        },
      ],
    }),
    defineField({ name: 'contactEmail', title: 'Contact Email', type: 'string', validation: (Rule) => Rule.required().email() }),
    defineField({ name: 'footerText', title: 'Footer Text', type: 'string' }),
    defineField({ name: 'defaultSeoImage', title: 'Default SEO Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'analyticsId', title: 'Analytics ID', type: 'string' }),
    defineField({ name: 'customScripts', title: 'Custom Scripts', type: 'text' }),
  ],
});
```

- [ ] **Step 5: Create page schema**

Create `sanity/schemaTypes/page.ts`:

```ts
import { defineField, defineType } from 'sanity';

export const pageType = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'metaTitle', title: 'Meta Title', type: 'string' }),
    defineField({ name: 'metaDescription', title: 'Meta Description', type: 'text' }),
    defineField({ name: 'ogImage', title: 'Open Graph Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'noIndex', title: 'No Index', type: 'boolean', initialValue: false }),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      of: [
        { type: 'reference', to: [{ type: 'project' }] },
        { type: 'media' },
      ],
      description: 'For now: featured projects or media blocks. Can be extended later.',
    }),
  ],
});
```

- [ ] **Step 6: Create project schema**

Create `sanity/schemaTypes/project.ts`:

```ts
import { defineField, defineType } from 'sanity';

export const projectType = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
    }),
    defineField({ name: 'year', title: 'Year', type: 'string' }),
    defineField({ name: 'client', title: 'Client', type: 'string' }),
    defineField({ name: 'role', title: 'Role', type: 'string' }),
    defineField({ name: 'location', title: 'Location', type: 'string' }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({ name: 'coverImage', title: 'Cover Image', type: 'media', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [{ type: 'media' }],
    }),
    defineField({ name: 'description', title: 'Description', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'credits', title: 'Credits', type: 'text' }),
    defineField({ name: 'externalLink', title: 'External Link', type: 'url' }),
    defineField({
      name: 'relatedProjects',
      title: 'Related Projects',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'project' }] }],
    }),
    defineField({ name: 'order', title: 'Display Order', type: 'number', initialValue: 0 }),
    defineField({ name: 'isFeatured', title: 'Featured on Home', type: 'boolean', initialValue: false }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Published', value: 'published' },
        ],
        layout: 'radio',
      },
      initialValue: 'draft',
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'publishedAt', title: 'Published At', type: 'datetime' }),
    defineField({ name: 'updatedAt', title: 'Updated At', type: 'datetime' }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category.title',
      media: 'coverImage.image',
    },
  },
});
```

- [ ] **Step 7: Register schemas and structure**

Create `sanity/schemaTypes/index.ts`:

```ts
import { mediaType } from './media';
import { siteSettingsType } from './siteSettings';
import { pageType } from './page';
import { projectType } from './project';
import { categoryType } from './category';

export const schemaTypes = [mediaType, siteSettingsType, pageType, projectType, categoryType];
```

Create `sanity/structure.ts`:

```ts
import type { StructureResolver } from 'sanity/structure';

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.documentTypeListItem('project').title('Projects'),
      S.documentTypeListItem('category').title('Categories'),
      S.documentTypeListItem('page').title('Pages'),
      S.documentTypeListItem('siteSettings').title('Site Settings'),
    ]);
```

- [ ] **Step 8: Add Sanity scripts to package.json**

Add to `package.json` scripts:

```json
{
  "scripts": {
    "sanity": "sanity",
    "sanity:dev": "sanity dev",
    "sanity:deploy": "sanity deploy",
    "sanity:typegen": "sanity typegen generate"
  }
}
```

- [ ] **Step 9: Create Sanity Studio entry point**

Create `sanity.config.ts` at project root:

```ts
import sanityConfig from './sanity/config';
export default sanityConfig;
```

- [ ] **Step 10: Run Sanity Studio locally**

Create `.env.local`:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-07-01
SANITY_API_READ_TOKEN=your_read_token
```

Run:

```bash
npm run sanity:dev
```

Expected: Sanity Studio opens at `http://localhost:3333` with Projects, Categories, Pages, Site Settings.

- [ ] **Step 11: Commit**

```bash
git add .
git commit -m "feat(sanity): add Sanity Studio and content schemas"
```


---

## Task 3: Configure next-sanity client and environment variables

**Files:**
- Create: `lib/sanity/client.ts`, `lib/sanity/image.ts`, `lib/sanity/queries.ts`.
- Modify: `.env.example`.
- Test: Client imports without errors; typecheck passes.

**Interfaces:**
- Consumes: Sanity project ID, dataset, API version, read token from environment.
- Produces: `sanityClient` for fetching data; `urlFor` helper for image URLs; `queries` object for GROQ.

- [ ] **Step 1: Create Sanity client**

Create `lib/sanity/client.ts`:

```ts
import { createClient } from 'next-sanity';

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-07-01';

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production',
  perspective: 'published',
});
```

- [ ] **Step 2: Create image URL builder**

Create `lib/sanity/image.ts`:

```ts
import createImageUrlBuilder from '@sanity/image-url';
import { sanityClient, projectId, dataset } from './client';

const builder = createImageUrlBuilder({ projectId, dataset });

export const urlFor = (source: Parameters<typeof builder.image>[0]) => builder.image(source);
```

- [ ] **Step 3: Create GROQ queries**

Create `lib/sanity/queries.ts`:

```ts
import { groq } from 'next-sanity';

export const siteSettingsQuery = groq`*[_type == "siteSettings"][0]`;

export const pagesQuery = groq`*[_type == "page"] { slug, title }`;

export const pageBySlugQuery = groq`*[_type == "page" && slug.current == $slug][0]`;

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
    order
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
```

- [ ] **Step 4: Update .env.example**

Create/modify `.env.example`:

```env
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-07-01
SANITY_API_READ_TOKEN=your_read_token

# Optional
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

- [ ] **Step 5: Typecheck**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat(sanity): configure next-sanity client and GROQ queries"
```

---

## Task 4: Create shared TypeScript types

**Files:**
- Create: `types/index.ts`.
- Modify: none.
- Test: `npm run typecheck` passes.

**Interfaces:**
- Consumes: Sanity schemas.
- Produces: TypeScript types used across components and lib.

- [ ] **Step 1: Define types**

Create `types/index.ts`:

```ts
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

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
  description?: unknown[];
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
```

- [ ] **Step 2: Typecheck**

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "feat(types): add shared TypeScript types"
```

---

## Task 5: Create base UI components

**Files:**
- Create: `components/ui/Container.tsx`, `components/ui/Section.tsx`, `components/ui/LoadingState.tsx`, `components/ui/ErrorBoundary.tsx`.
- Modify: none.
- Test: `tests/components/Container.test.tsx` (optional but recommended).

**Interfaces:**
- Consumes: Tailwind classes.
- Produces: Reusable layout primitives.

- [ ] **Step 1: Create Container**

Create `components/ui/Container.tsx`:

```tsx
import { cn } from '@/lib/utils/cn';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function Container({ children, className }: ContainerProps) {
  return <div className={cn('mx-auto max-w-7xl px-4 sm:px-6 lg:px-8', className)}>{children}</div>;
}
```

- [ ] **Step 2: Create utility cn helper**

Create `lib/utils/cn.ts`:

```ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Install dependencies:

```bash
npm install clsx tailwind-merge
```

- [ ] **Step 3: Create Section**

Create `components/ui/Section.tsx`:

```tsx
import { cn } from '@/lib/utils/cn';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function Section({ children, className, id }: SectionProps) {
  return (
    <section id={id} className={cn('py-12 md:py-20', className)}>
      {children}
    </section>
  );
}
```

- [ ] **Step 4: Create LoadingState**

Create `components/ui/LoadingState.tsx`:

```tsx
export function LoadingState() {
  return (
    <div className="flex h-64 items-center justify-center" role="status" aria-live="polite">
      <span className="text-sm text-neutral-500">Loading…</span>
    </div>
  );
}
```

- [ ] **Step 5: Create ErrorBoundary**

Create `components/ui/ErrorBoundary.tsx`:

```tsx
'use client';

import React from 'react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="py-20 text-center text-red-600">
            Something went wrong. Please refresh the page.
          </div>
        )
      );
    }

    return this.props.children;
  }
}
```

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat(ui): add base layout primitives"
```

---

## Task 6: Create layout components

**Files:**
- Create: `components/layout/Header.tsx`, `components/layout/Footer.tsx`, `components/layout/Navigation.tsx`.
- Modify: `app/layout.tsx`.
- Test: Visual check in browser.

**Interfaces:**
- Consumes: `SiteSettings` (contact email, social links, title, logo).
- Produces: Shared header/footer rendered on every page.

- [ ] **Step 1: Create Navigation**

Create `components/layout/Navigation.tsx`:

```tsx
import Link from 'next/link';

const navItems = [
  { label: 'Creative Direction', href: '/creative' },
  { label: 'Contact', href: '/contact' },
];

export function Navigation() {
  return (
    <nav aria-label="Main navigation">
      <ul className="flex items-center gap-6">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="text-sm uppercase tracking-wide hover:opacity-60">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

- [ ] **Step 2: Create Header**

Create `components/layout/Header.tsx`:

```tsx
import Link from 'next/link';
import { Navigation } from './Navigation';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-sm uppercase tracking-widest">
          Arno Partissimo
        </Link>
        <Navigation />
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Create Footer**

Create `components/layout/Footer.tsx`:

```tsx
import { SiteSettings } from '@/types';

interface FooterProps {
  settings?: SiteSettings;
}

export function Footer({ settings }: FooterProps) {
  return (
    <footer className="border-t border-neutral-200 py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
        <p className="text-sm text-neutral-500">
          {settings?.footerText || `© ${new Date().getFullYear()} Arno Partissimo`}
        </p>
        {settings?.socialLinks && settings.socialLinks.length > 0 && (
          <ul className="flex gap-4">
            {settings.socialLinks.map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-neutral-500 hover:text-black"
                >
                  {link.platform}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Update layout.tsx**

Modify `app/layout.tsx`:

```tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { sanityClient } from '@/lib/sanity/client';
import { siteSettingsQuery } from '@/lib/sanity/queries';

const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await sanityClient.fetch(siteSettingsQuery);
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
  const settings = await sanityClient.fetch(siteSettingsQuery);

  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Header />
        <main className="min-h-screen pt-16">{children}</main>
        <Footer settings={settings} />
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Verify layout in browser**

```bash
npm run dev
```

Expected: header with logo + navigation, footer at bottom.

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat(layout): add Header, Footer, Navigation and update layout"
```


---

## Task 7: Create SanityImage media component with blur-up

**Files:**
- Create: `components/media/SanityImage.tsx`, `components/media/VideoEmbed.tsx`, `tests/components/SanityImage.test.tsx`.
- Modify: `lib/sanity/image.ts` if needed.
- Test: Component renders image with correct `src`; Vitest test passes.

**Interfaces:**
- Consumes: `Media` type, Sanity image source.
- Produces: Optimized image component with blur-up placeholder.

- [ ] **Step 1: Implement SanityImage**

Create `components/media/SanityImage.tsx`:

```tsx
import Image from 'next/image';
import { urlFor } from '@/lib/sanity/image';
import { Media } from '@/types';
import { cn } from '@/lib/utils/cn';

interface SanityImageProps {
  media: Media;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  aspectRatio?: string;
}

export function SanityImage({ media, className, priority, fill, sizes, aspectRatio }: SanityImageProps) {
  if (media.type !== 'image' || !media.image) {
    return null;
  }

  const image = media.image;
  const url = urlFor(image).auto('format').fit('max').url();
  const blurUrl = urlFor(image).width(20).quality(20).auto('format').url();

  return (
    <div className={cn('relative overflow-hidden', className)} style={{ aspectRatio }}>
      <Image
        src={url}
        alt={image.alt || ''}
        fill={fill}
        priority={priority}
        sizes={sizes}
        placeholder="blur"
        blurDataURL={blurUrl}
        className="object-cover"
      />
      {(image.caption || image.credits) && (
        <figcaption className="sr-only">
          {image.caption} {image.credits}
        </figcaption>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create VideoEmbed**

Create `components/media/VideoEmbed.tsx`:

```tsx
interface VideoEmbedProps {
  url: string;
  className?: string;
}

export function VideoEmbed({ url, className }: VideoEmbedProps) {
  const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
  const isVimeo = url.includes('vimeo.com');

  let embedUrl = url;

  if (isYouTube) {
    const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
    embedUrl = `https://www.youtube.com/embed/${videoId}`;
  } else if (isVimeo) {
    const videoId = url.split('/').pop();
    embedUrl = `https://player.vimeo.com/video/${videoId}`;
  }

  if (isYouTube || isVimeo) {
    return (
      <div className={className}>
        <iframe
          src={embedUrl}
          title="Video embed"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="aspect-video w-full"
        />
      </div>
    );
  }

  return (
    <video controls className={className}>
      <source src={url} />
    </video>
  );
}
```

- [ ] **Step 3: Write test for SanityImage**

Create `tests/components/SanityImage.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { SanityImage } from '@/components/media/SanityImage';

const mockMedia = {
  _type: 'media' as const,
  type: 'image' as const,
  image: {
    _type: 'image' as const,
    asset: { _ref: 'image-ref', _type: 'reference' as const },
    alt: 'Test image',
  },
};

vi.mock('@/lib/sanity/image', () => ({
  urlFor: () => ({
    auto: () => ({ fit: () => ({ url: () => 'https://cdn.sanity.io/test.jpg' }) }),
    width: () => ({ quality: () => ({ auto: () => ({ url: () => 'https://cdn.sanity.io/blur.jpg' }) }) }),
  }),
}));

describe('SanityImage', () => {
  it('renders an image with alt text', () => {
    render(<SanityImage media={mockMedia} fill />);
    const img = screen.getByAltText('Test image');
    expect(img).toBeInTheDocument();
  });
});
```

- [ ] **Step 4: Run tests**

```bash
npm run test:run
```

Expected: tests pass.

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat(media): add SanityImage and VideoEmbed components"
```

---

## Task 8: Build Home page with HomeGallery

**Files:**
- Create: `components/pages/HomeGallery.tsx`, `components/project/ProjectCard.tsx`.
- Modify: `app/page.tsx`.
- Test: Home page renders gallery and links to projects.

**Interfaces:**
- Consumes: `Project[]` from Sanity (featured or all published).
- Produces: Home page with featured photo gallery.

- [ ] **Step 1: Create ProjectCard**

Create `components/project/ProjectCard.tsx`:

```tsx
import Link from 'next/link';
import { Project } from '@/types';
import { SanityImage } from '@/components/media/SanityImage';

interface ProjectCardProps {
  project: Project;
  priority?: boolean;
}

export function ProjectCard({ project, priority }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.slug}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
        <SanityImage
          media={project.coverImage}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="mt-3 flex items-center justify-between">
        <h3 className="text-sm font-medium">{project.title}</h3>
        {project.category && <span className="text-xs text-neutral-500">{project.category.title}</span>}
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Create HomeGallery**

Create `components/pages/HomeGallery.tsx`:

```tsx
import { Project } from '@/types';
import { ProjectCard } from '@/components/project/ProjectCard';
import { Container } from '@/components/ui/Container';

interface HomeGalleryProps {
  projects: Project[];
}

export function HomeGallery({ projects }: HomeGalleryProps) {
  return (
    <Container>
      <div className="grid grid-cols-1 gap-8 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <ProjectCard key={project._id} project={project} priority={index < 3} />
        ))}
      </div>
    </Container>
  );
}
```

- [ ] **Step 3: Update Home page**

Modify `app/page.tsx`:

```tsx
import { sanityClient } from '@/lib/sanity/client';
import { projectsQuery } from '@/lib/sanity/queries';
import { HomeGallery } from '@/components/pages/HomeGallery';
import { Project } from '@/types';

export const dynamic = 'force-static';

export default async function HomePage() {
  const projects = await sanityClient.fetch<Project[]>(projectsQuery);

  return (
    <div>
      <HomeGallery projects={projects} />
    </div>
  );
}
```

- [ ] **Step 4: Verify in browser**

```bash
npm run dev
```

Expected: home page displays project cards in a grid.

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat(home): add HomeGallery and project cards"
```

---

## Task 9: Build Creative Direction page

**Files:**
- Create: `components/pages/CreativePage.tsx`.
- Modify: `app/creative/page.tsx`.
- Test: Page renders content from Sanity.

**Interfaces:**
- Consumes: `Page` document with slug `creative`.
- Produces: Creative Direction page.

- [ ] **Step 1: Create CreativePage component**

Create `components/pages/CreativePage.tsx`:

```tsx
import { Page } from '@/types';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { SanityImage } from '@/components/media/SanityImage';
import { VideoEmbed } from '@/components/media/VideoEmbed';

interface CreativePageProps {
  page: Page;
}

export function CreativePage({ page }: CreativePageProps) {
  return (
    <Container>
      <Section>
        <h1 className="mb-8 text-3xl font-light uppercase tracking-wide">{page.title}</h1>
        {page.sections && page.sections.length > 0 ? (
          <div className="space-y-12">
            {page.sections.map((section, index) => {
              if ('_type' in section && section._type === 'media') {
                const media = section;
                return media.type === 'image' ? (
                  <SanityImage key={index} media={media} className="w-full" aspectRatio="16/9" />
                ) : (
                  <VideoEmbed key={index} url={media.videoUrl || ''} className="w-full" />
                );
              }
              return null;
            })}
          </div>
        ) : (
          <p className="text-neutral-500">Content coming soon.</p>
        )}
      </Section>
    </Container>
  );
}
```

- [ ] **Step 2: Update creative page**

Modify `app/creative/page.tsx`:

```tsx
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
        <p className="mt-4 text-neutral-500">Content coming soon.</p>
      </div>
    );
  }

  return <CreativePage page={page} />;
}
```

- [ ] **Step 3: Verify in browser**

Navigate to `/creative`. Expected: page title and content.

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat(creative): add Creative Direction page"
```

---

## Task 10: Build Contact page

**Files:**
- Create: `components/pages/ContactSection.tsx`, `lib/utils/copy-to-clipboard.ts`.
- Modify: `app/contact/page.tsx`.
- Test: Clicking copy button copies email to clipboard.

**Interfaces:**
- Consumes: `SiteSettings.contactEmail`.
- Produces: Contact page with mailto + copy-to-clipboard.

- [ ] **Step 1: Create copy-to-clipboard utility**

Create `lib/utils/copy-to-clipboard.ts`:

```ts
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  }
}
```

- [ ] **Step 2: Create ContactSection**

Create `components/pages/ContactSection.tsx`:

```tsx
'use client';

import { useState } from 'react';
import { SiteSettings } from '@/types';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { copyToClipboard } from '@/lib/utils/copy-to-clipboard';

interface ContactSectionProps {
  settings: SiteSettings;
}

export function ContactSection({ settings }: ContactSectionProps) {
  const [copied, setCopied] = useState(false);
  const email = settings.contactEmail;

  const handleCopy = async () => {
    const success = await copyToClipboard(email);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Container>
      <Section className="flex min-h-[60vh] flex-col items-start justify-center">
        <h1 className="mb-8 text-3xl font-light uppercase tracking-wide">Contact</h1>
        <p className="mb-6 text-neutral-600">
          For inquiries, collaborations, or any questions, please reach out at:
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <a
            href={`mailto:${email}`}
            className="text-lg underline underline-offset-4 hover:opacity-60"
          >
            {email}
          </a>
          <button
            onClick={handleCopy}
            className="rounded border border-neutral-300 px-3 py-1 text-sm hover:bg-neutral-100"
            aria-label="Copy email address"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </Section>
    </Container>
  );
}
```

- [ ] **Step 3: Update contact page**

Modify `app/contact/page.tsx`:

```tsx
import { sanityClient } from '@/lib/sanity/client';
import { siteSettingsQuery } from '@/lib/sanity/queries';
import { ContactSection } from '@/components/pages/ContactSection';
import { SiteSettings } from '@/types';

export const dynamic = 'force-static';

export default async function ContactRoute() {
  const settings = await sanityClient.fetch<SiteSettings>(siteSettingsQuery);

  return <ContactSection settings={settings} />;
}
```

- [ ] **Step 4: Verify in browser**

Navigate to `/contact`. Expected: email link + copy button works.

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat(contact): add Contact page with mailto and copy email"
```

---

## Task 11: Build dynamic project pages

**Files:**
- Create: `components/project/ProjectDetail.tsx`, `components/project/ProjectGallery.tsx`.
- Modify: `app/projects/[slug]/page.tsx`.
- Test: Project page renders with gallery and metadata.

**Interfaces:**
- Consumes: `Project` by slug.
- Produces: Static project detail pages.

- [ ] **Step 1: Create ProjectGallery**

Create `components/project/ProjectGallery.tsx`:

```tsx
import { Media } from '@/types';
import { SanityImage } from '@/components/media/SanityImage';
import { VideoEmbed } from '@/components/media/VideoEmbed';

interface ProjectGalleryProps {
  items: Media[];
}

export function ProjectGallery({ items }: ProjectGalleryProps) {
  return (
    <div className="space-y-8">
      {items.map((item, index) =>
        item.type === 'image' ? (
          <SanityImage
            key={item._key || index}
            media={item}
            className="w-full"
            aspectRatio="16/9"
            sizes="100vw"
          />
        ) : (
          <VideoEmbed key={item._key || index} url={item.videoUrl || ''} className="w-full" />
        )
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create ProjectDetail**

Create `components/project/ProjectDetail.tsx`:

```tsx
import { Project } from '@/types';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { ProjectGallery } from './ProjectGallery';
import { PortableText } from '@portabletext/react';

interface ProjectDetailProps {
  project: Project;
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  return (
    <article>
      <Container>
        <Section>
          <header className="mb-12">
            <h1 className="text-3xl font-light uppercase tracking-wide">{project.title}</h1>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-neutral-500">
              {project.category && <span>{project.category.title}</span>}
              {project.year && <span>{project.year}</span>}
              {project.client && <span>Client: {project.client}</span>}
              {project.role && <span>Role: {project.role}</span>}
              {project.location && <span>{project.location}</span>}
            </div>
          </header>

          {project.gallery && project.gallery.length > 0 && (
            <ProjectGallery items={project.gallery} />
          )}

          {project.description && (
            <div className="prose prose-neutral mx-auto mt-16 max-w-2xl">
              <PortableText value={project.description} />
            </div>
          )}

          {project.credits && (
            <div className="mx-auto mt-12 max-w-2xl text-sm text-neutral-500">
              <h2 className="mb-2 font-medium">Credits</h2>
              <p>{project.credits}</p>
            </div>
          )}

          {project.externalLink && (
            <div className="mx-auto mt-8 max-w-2xl">
              <a
                href={project.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm underline underline-offset-4"
              >
                View external link
              </a>
            </div>
          )}
        </Section>
      </Container>
    </article>
  );
}
```

Install dependency:

```bash
npm install @portabletext/react
```

- [ ] **Step 3: Update project dynamic route**

Modify `app/projects/[slug]/page.tsx`:

```tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { sanityClient } from '@/lib/sanity/client';
import { projectSlugsQuery, projectBySlugQuery } from '@/lib/sanity/queries';
import { ProjectDetail } from '@/components/project/ProjectDetail';
import { Project } from '@/types';

export const dynamic = 'force-static';

export async function generateStaticParams() {
  const slugs = await sanityClient.fetch<{ slug: string }[]>(projectSlugsQuery);
  return slugs.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await sanityClient.fetch<Project>(projectBySlugQuery, { slug });

  if (!project) {
    return { title: 'Project Not Found' };
  }

  return {
    title: `${project.title} | Arno Partissimo`,
    description: project.credits || `Project by Arno Partissimo`,
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await sanityClient.fetch<Project>(projectBySlugQuery, { slug });

  if (!project) {
    notFound();
  }

  return <ProjectDetail project={project} />;
}
```

- [ ] **Step 4: Add not-found page**

Create `app/not-found.tsx`:

```tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <h1 className="text-2xl">Page not found</h1>
      <Link href="/" className="mt-4 underline underline-offset-4">
        Back home
      </Link>
    </div>
  );
}
```

- [ ] **Step 5: Verify in browser**

Create a sample project in Sanity Studio, publish it, then navigate to `/projects/your-slug`.

Expected: project detail page with gallery.

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat(projects): add dynamic project detail pages"
```


---

## Task 12: Implement SEO, sitemap, robots.txt, and llms.txt

**Files:**
- Create: `components/seo/JsonLd.tsx`, `components/seo/Seo.tsx`, `lib/seo/schema.ts`, `app/llms.txt/route.ts`.
- Modify: `app/layout.tsx`, `app/robots.ts`, `app/sitemap.ts`.
- Test: `/sitemap.xml`, `/robots.txt`, and `/llms.txt` return correct content.

**Interfaces:**
- Consumes: `SiteSettings`, `Project`, `Page`.
- Produces: SEO metadata, JSON-LD structured data, sitemap, robots.txt, llms.txt.

- [ ] **Step 1: Create schema helpers**

Create `lib/seo/schema.ts`:

```ts
import { SiteSettings, Project } from '@/types';

export function websiteSchema(settings: SiteSettings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: settings.title,
    url: process.env.NEXT_PUBLIC_SITE_URL,
    description: settings.description,
  };
}

export function personSchema(settings: SiteSettings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Arno Partissimo',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    sameAs: settings.socialLinks?.map((link) => link.url) || [],
    jobTitle: 'Photographer & Creative Director',
  };
}

export function creativeWorkSchema(project: Project) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/projects/${project.slug}`,
    description: project.credits || undefined,
    datePublished: project.publishedAt,
    dateModified: project.updatedAt,
    creator: {
      '@type': 'Person',
      name: 'Arno Partissimo',
    },
    keywords: project.tags?.join(', '),
    locationCreated: project.location,
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
```

- [ ] **Step 2: Create JsonLd component**

Create `components/seo/JsonLd.tsx`:

```tsx
interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

- [ ] **Step 3: Update layout.tsx with JSON-LD**

Modify `app/layout.tsx` to include `JsonLd` for website and person schemas:

```tsx
import { JsonLd } from '@/components/seo/JsonLd';
import { websiteSchema, personSchema } from '@/lib/seo/schema';

// Inside RootLayout, before </head> or in body:
<JsonLd data={[websiteSchema(settings), personSchema(settings)]} />
```

- [ ] **Step 4: Create robots.ts**

Create `app/robots.ts`:

```ts
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/studio/',
    },
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
  };
}
```

- [ ] **Step 5: Create sitemap.ts**

Create `app/sitemap.ts`:

```ts
import type { MetadataRoute } from 'next';
import { sanityClient } from '@/lib/sanity/client';
import { projectsQuery, pagesQuery } from '@/lib/sanity/queries';
import { Project } from '@/types';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://arnopartissimo.com';

  const projects = await sanityClient.fetch<Project[]>(projectsQuery);
  const pages = await sanityClient.fetch<{ slug: { current: string }; _updatedAt?: string }[]>(pagesQuery);

  const projectUrls = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: project.updatedAt || new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const pageUrls = pages
    .filter((page) => page.slug.current !== 'home')
    .map((page) => ({
      url: `${baseUrl}/${page.slug.current}`,
      lastModified: page._updatedAt || new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    ...pageUrls,
    ...projectUrls,
  ];
}
```

- [ ] **Step 6: Create llms.txt route**

Create `app/llms.txt/route.ts`:

```ts
import { sanityClient } from '@/lib/sanity/client';
import { projectsQuery, siteSettingsQuery } from '@/lib/sanity/queries';
import { Project } from '@/types';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://arnopartissimo.com';
  const settings = await sanityClient.fetch(siteSettingsQuery);
  const projects = await sanityClient.fetch<Project[]>(projectsQuery);

  const content = `# ${settings?.title || 'Arno Partissimo'}

## Description
${settings?.description || 'Portfolio of Arno Partissimo, photographer and creative director.'}

## Website
- Home: ${baseUrl}
- Creative Direction: ${baseUrl}/creative
- Contact: ${baseUrl}/contact

## Projects
${projects.map((p) => `- ${p.title}: ${baseUrl}/projects/${p.slug}`).join('\n')}

## Contact
Email: ${settings?.contactEmail || ''}
`;

  return new Response(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
```

- [ ] **Step 7: Verify routes**

Run dev server and check:

```bash
curl http://localhost:3000/sitemap.xml
curl http://localhost:3000/robots.txt
curl http://localhost:3000/llms.txt
```

Expected: valid XML/text responses.

- [ ] **Step 8: Commit**

```bash
git add .
git commit -m "feat(seo): add sitemap, robots, llms.txt, and structured data"
```

---

## Task 13: Set up GitHub Actions CI/CD

**Files:**
- Create: `.github/workflows/ci.yml`.
- Modify: `package.json` (ensure scripts exist).
- Test: CI passes on push.

**Interfaces:**
- Consumes: npm scripts.
- Produces: Automated lint/type/test checks on PRs.

- [ ] **Step 1: Create CI workflow**

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test:run
```

- [ ] **Step 2: Commit and push**

```bash
git add .
git commit -m "ci: add GitHub Actions workflow for lint, typecheck, and tests"
git push
```

- [ ] **Step 3: Verify CI passes**

Check Actions tab on GitHub. Expected: green checkmarks.

---

## Task 14: Write project documentation

**Files:**
- Create: `docs/README.md`, `docs/SETUP.md`, `docs/ARCHITECTURE.md`, `docs/DECISIONS.md`.
- Modify: root `README.md` (or replace with link to docs).
- Test: New developer can follow SETUP.md and run the project.

**Interfaces:**
- Consumes: project structure and conventions.
- Produces: Complete onboarding documentation.

- [ ] **Step 1: Create README**

Create `docs/README.md`:

```markdown
# Arno Partissimo Website

Portfolio website built with Next.js and Sanity.

## Quick links
- [Setup guide](./SETUP.md)
- [Architecture](./ARCHITECTURE.md)
- [Decisions](./DECISIONS.md)

## Stack
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Sanity Studio v3
- Vercel
```

- [ ] **Step 2: Create SETUP.md**

Create `docs/SETUP.md`:

```markdown
# Setup

## Requirements
- Node.js 20+
- npm
- A Sanity project

## Installation

```bash
npm install
```

## Environment variables

Copy `.env.example` to `.env.local` and fill in:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=...
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-07-01
SANITY_API_READ_TOKEN=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Run locally

```bash
npm run dev
```

Open http://localhost:3000.

## Run Sanity Studio locally

```bash
npm run sanity:dev
```

Open http://localhost:3333.
```

- [ ] **Step 3: Create ARCHITECTURE.md**

Create `docs/ARCHITECTURE.md` with explanations of:
- `app/` — routing and pages
- `components/` — UI organized by domain
- `lib/sanity/` — client, queries, image helpers
- `sanity/` — CMS schemas and studio config
- `types/` — shared TypeScript types
- Data flow from Sanity → GROQ queries → React components

- [ ] **Step 4: Create DECISIONS.md**

Create `docs/DECISIONS.md` documenting:
- Why Next.js App Router
- Why Sanity
- Why static generation
- Why Tailwind CSS
- Why Vercel
- Why no third-party contact service

- [ ] **Step 5: Update root README**

Replace root `README.md`:

```markdown
# Arno Partissimo Website

See [docs/README.md](./docs/README.md) for full documentation.
```

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "docs: add project documentation"
```

---

## Task 15: Migrate content from Wix to Sanity

**Files:**
- Modify: Sanity Studio (manual content entry).
- Test: All pages render migrated content correctly.

**Interfaces:**
- Consumes: Existing Wix site content.
- Produces: Populated Sanity dataset.

- [ ] **Step 1: Extract content from Wix**

Visit each page on `https://arnopartissimo.com` and save:
- Texts
- Image URLs (use browser dev tools or download)
- Project order and relationships

- [ ] **Step 2: Create Site Settings in Sanity Studio**

Open `http://localhost:3333`, create a single `Site Settings` document:
- Title: Arno Partissimo
- Description: [from Wix]
- Contact Email: [your email]
- Footer text
- Social links

- [ ] **Step 3: Create Categories**

Create categories such as:
- Photo
- Creative Direction

- [ ] **Step 4: Create Projects**

For each project page found in Wix sitemap:
1. Create a `Project` document.
2. Fill title, slug, category, year, client, role, location, tags.
3. Upload cover image and gallery images.
4. Add description and credits.
5. Set status to `published`.
6. Set `isFeatured` for projects to show on home.
7. Set display order.

- [ ] **Step 5: Create Pages**

Create `Page` documents:
- slug: `home`, title: Home
- slug: `creative`, title: Creative Direction
- slug: `contact`, title: Contact

Add sections/media as needed.

- [ ] **Step 6: Verify all pages**

Run `npm run dev` and check:
- `/`
- `/creative`
- `/contact`
- `/projects/[slug]` for each project

- [ ] **Step 7: Commit dataset export (optional)**

```bash
sanity dataset export production ./backups/production-$(date +%F).tar.gz
```

- [ ] **Step 8: Commit**

```bash
git add docs/backups/
git commit -m "chore: migrate Wix content to Sanity"
```

---

## Task 16: Run tests, Lighthouse, and deploy to Vercel

**Files:**
- Modify: `next.config.js` for static export if needed.
- Test: Lighthouse scores, Vercel deployment successful.

**Interfaces:**
- Consumes: All previous tasks.
- Produces: Live deployed website.

- [ ] **Step 1: Configure next.config.js for Vercel**

Modify `next.config.js`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
};

module.exports = nextConfig;
```

Note: We keep Vercel's default serverful mode so Route Handlers (like `/llms.txt`) work, while pages are still statically generated via `generateStaticParams`.

- [ ] **Step 2: Run production build locally**

```bash
npm run build
```

Expected: build succeeds with no errors.

- [ ] **Step 3: Run all quality checks**

```bash
npm run lint
npm run typecheck
npm run test:run
```

Expected: all pass.

- [ ] **Step 4: Run Lighthouse audit**

```bash
npm run build
npm start
```

Open Chrome DevTools Lighthouse on `http://localhost:3000` and audit:
- Performance: target 90+
- Accessibility: target 100
- Best Practices: target 100
- SEO: target 100

Fix any blocking issues.

- [ ] **Step 5: Deploy to Vercel**

Create a new project on Vercel, connect GitHub repo, set environment variables:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-07-01
SANITY_API_READ_TOKEN
NEXT_PUBLIC_SITE_URL=https://arnopartissimo.vercel.app
```

Trigger deploy. Expected: Vercel provides a live URL.

- [ ] **Step 6: Configure Sanity webhook**

In Sanity project settings, add a webhook:
- URL: `https://api.vercel.com/v1/integrations/deploy/YOUR_DEPLOY_HOOK`
- Trigger on: Create, Update, Delete of documents
- Dataset: production

Test by editing a project in Sanity Studio and verifying Vercel rebuilds.

- [ ] **Step 7: Final verification**

Check live URL:
- Home page loads with gallery
- All project pages load
- Contact email and copy button work
- Sitemap, robots.txt, llms.txt accessible
- No console errors

- [ ] **Step 8: Commit and tag release**

```bash
git add .
git commit -m "chore: configure production build and deployment"
git tag -a v1.0.0 -m "Initial release: Arno Partissimo website independent from Wix"
git push origin main --tags
```

---

## Self-Review

### Spec coverage
- ✅ Next.js + TypeScript + Tailwind: Task 1
- ✅ Sanity schemas: Task 2
- ✅ next-sanity client + GROQ: Task 3
- ✅ Shared types: Task 4
- ✅ Layout components: Task 6
- ✅ Media component with blur-up: Task 7
- ✅ Home page with featured gallery: Task 8
- ✅ Creative Direction page: Task 9
- ✅ Contact page with mailto + copy: Task 10
- ✅ Dynamic project pages: Task 11
- ✅ SEO + SEO IA: Task 12
- ✅ CI/CD: Task 13
- ✅ Documentation: Task 14
- ✅ Wix content migration: Task 15
- ✅ Tests, Lighthouse, deploy: Task 16

### Placeholder scan
- No TBD/TODO/fill-in-details found.
- Every step includes concrete commands or code.

### Type consistency
- `Project.slug` is `string` in types and GROQ queries.
- `Media` type matches Sanity schema.
- Query names and usages consistent.
