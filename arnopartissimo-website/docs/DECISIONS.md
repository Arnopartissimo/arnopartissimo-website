# Decisions

## Why Next.js App Router

The App Router is used because it gives us:

- **React Server Components** by default, keeping data fetching close to the page and reducing client-side JavaScript.
- **Built-in static generation** via `dynamic = 'force-static'`, which produces fast, cacheable pages served from the edge.
- **Co-located routes** (`app/page.tsx`, `app/projects/[slug]/page.tsx`) and native support for dynamic metadata, sitemaps, and robots.txt.

For a portfolio site where content changes infrequently, the App Router's static rendering model is a natural fit.

## Why Sanity

Sanity is the CMS because:

- It provides a structured content model and a customizable editorial interface (Sanity Studio) out of the box.
- Content is queried with **GROQ**, a powerful, typed query language that fits well with React Server Components.
- Its real-time APIs and image pipeline (hotspot/crop, on-demand transforms) are well suited for media-heavy portfolios.
- Studio can be embedded in the same repository and run locally with `npm run sanity:dev`.

## Why static generation

Every public route exports `dynamic = 'force-static'`:

- Portfolio content rarely changes minute-to-minute, so there is little benefit from server-side rendering on every request.
- Static pages are fast, cheap to host, and resilient because they do not depend on a live backend at request time.
- Vercel can cache and distribute static pages globally without extra configuration.

When content is updated in Sanity, a rebuild or revalidation can refresh the site.

## Why Tailwind CSS

Tailwind CSS v4 is used for styling because:

- Utility-first CSS keeps component files self-contained and avoids growing bespoke CSS files.
- It integrates cleanly with Next.js via the official PostCSS plugin.
- It provides a consistent spacing, color, and typography scale without requiring a custom design system from scratch.

## Why Vercel

Vercel is the intended deployment platform because:

- It is the native host for Next.js, with first-class support for the App Router, static generation, and edge caching.
- Git-based deployments and preview environments are available with minimal configuration.
- The project already targets the Vercel ecosystem (Next.js + Geist font).

## Why no third-party contact service

The contact page reads `contactEmail` directly from Sanity site settings and displays it as a `mailto:` link:

- It avoids adding an external dependency or service for a simple use case.
- It removes the need for server-side form handling, spam protection services, or API keys.
- The email address can be updated by editors in Sanity without a code change.

If the project later needs a contact form with spam protection, a service or server action can be added without changing the underlying data model.
