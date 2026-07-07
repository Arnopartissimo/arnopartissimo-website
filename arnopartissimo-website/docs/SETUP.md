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
NEXT_PUBLIC_SANITY_PROJECT_ID=rny99uvc
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-07-01
SANITY_API_READ_TOKEN=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`SANITY_API_READ_TOKEN` is only required for fetching draft content or when using a private dataset. For public `production` data, the site can read from Sanity's API without a token.

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

## Other useful commands

```bash
npm run lint        # Run ESLint
npm run typecheck   # Run TypeScript checks
npm run test:run    # Run the Vitest suite
npm run build       # Build for production
```
