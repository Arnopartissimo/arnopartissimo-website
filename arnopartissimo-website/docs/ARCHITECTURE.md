# Architecture

## Directory overview

```
app/                  # Next.js App Router routes and pages
components/           # React UI components, organized by domain
lib/                  # Shared helpers, Sanity client, SEO schema
  sanity/             # Sanity client, GROQ queries, image helpers
  seo/                # JSON-LD schema builders
  utils/              # cn(), copy-to-clipboard, etc.
sanity/               # Sanity Studio v3 configuration and schemas
  schemaTypes/        # Content models: project, page, category, media, siteSettings
  structure.ts        # Studio document structure
  config.ts           # Studio config
types/                # Shared TypeScript types
public/               # Static assets
tests/                # Vitest component and smoke tests
```

## `app/` — routing and pages

The App Router owns every public route. Pages are React Server Components that fetch data from Sanity at build time.

| Route              | File                           | Purpose                                                                          |
| ------------------ | ------------------------------ | -------------------------------------------------------------------------------- |
| `/`                | `app/page.tsx`                 | Home gallery listing all published projects.                                     |
| `/projects/[slug]` | `app/projects/[slug]/page.tsx` | Individual project detail page.                                                  |
| `/creative`        | `app/creative/page.tsx`        | Creative direction page driven by a Sanity `page` document with slug `creative`. |
| `/contact`         | `app/contact/page.tsx`         | Contact page that reads `contactEmail` from site settings.                       |
| `/sitemap.xml`     | `app/sitemap.ts`               | Dynamic sitemap generated from Sanity content.                                   |
| `/robots.txt`      | `app/robots.ts`                | Dynamic robots.txt.                                                              |
| `/llms.txt`        | `app/llms.txt/route.ts`        | Plain-text route for LLM crawlers.                                               |

Every route exports `dynamic = 'force-static'`, so Next.js pre-renders pages at build time.

## `components/` — UI organized by domain

Components are grouped by responsibility:

- `layout/` — `Header`, `Footer`, `Navigation`. Used by the root layout.
- `pages/` — Route-level sections such as `HomeGallery`, `CreativePage`, `ContactSection`.
- `project/` — `ProjectCard`, `ProjectDetail`, `ProjectGallery` for rendering project content.
- `media/` — `SanityImage`, `VideoEmbed` for responsive images and video embeds.
- `seo/` — `Seo`, `JsonLd` for metadata and structured data.
- `ui/` — Generic primitives: `Container`, `Section`, `LoadingState`, `ErrorBoundary`.

## `lib/sanity/` — client, queries, image helpers

- `client.ts` — `next-sanity` client configured with the project ID, dataset, API version, and `perspective: 'published'`. Uses the CDN in production.
- `queries.ts` — GROQ queries for site settings, pages, projects, and featured projects.
- `image.ts` — `urlFor` builder for Sanity image URLs using `@sanity/image-url`.

## `sanity/` — CMS schemas and studio config

- `config.ts` — Sanity Studio configuration. Loads `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` from environment variables.
- `structure.ts` — Defines the Studio sidebar structure (site settings, projects, pages, categories, media).
- `schemaTypes/` — Content schemas:
  - `siteSettings` — Global site metadata and contact info.
  - `project` — Portfolio project with gallery, credits, categories, and related projects.
  - `page` — Flexible content pages (e.g., creative direction).
  - `category` — Project taxonomy.
  - `media` — Reusable image/video block used in galleries.

## `types/` — shared TypeScript types

`types/index.ts` defines the interfaces used across the frontend: `Project`, `Page`, `Category`, `Media`, `SiteSettings`, and `NavItem`. These mirror the Sanity schemas.

## Data flow

```
Sanity CMS
    │
    ▼
GROQ queries (lib/sanity/queries.ts)
    │
    ▼
React Server Component (app/.../page.tsx)
    │
    ▼
Domain components (components/project, components/media, etc.)
    │
    ▼
Static HTML at build time
```

At build time, Next.js calls each page component, which runs the GROQ queries through `sanityClient.fetch`. The returned data is passed into domain-specific components that render the final markup. Because pages are forced static, no runtime Sanity calls happen in production unless the route is explicitly revalidated or visited in development.
