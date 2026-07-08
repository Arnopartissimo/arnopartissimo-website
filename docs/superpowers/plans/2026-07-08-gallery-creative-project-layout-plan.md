# Gallery, Creative Thumbnails & Project Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Corriger la galerie d’accueil (masonry Wix avec 1ère rangée alignée), afficher les vignettes sur `/creative`, et ajouter le layout wide/square dans les pages projet.

**Architecture:** On reste sur du CSS natif (`column-count`) pour le masonry, on corrige le rendu visuel de `ProjectCard`, et on enrichit le schéma `media` d’un champ `layout` répercuté dans `ProjectGallery`.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS v4, Sanity v6, Vitest.

## Global Constraints
- Pas de nouvelle dépendance externe.
- Toutes les modifications doivent passer `npm run typecheck`, `npm run test:run` et `npm run build`.
- Chaque tâche finit par un commit atomique.
- Les tests existants ne doivent pas être cassés ; les nouveaux comportements doivent être couverts.

---

### Task 1: Home gallery — revenir au masonry CSS columns

**Files:**
- Modify: `arnopartissimo-website/components/pages/HomeMediaGallery.tsx`
- Modify: `arnopartissimo-website/app/globals.css`
- Test: `arnopartissimo-website/tests/components/HomeMediaGallery.test.tsx`

**Interfaces:**
- Consumes: `PageSection[]` depuis la page `/`, `SanityImage`, `VideoEmbed`.
- Produces: rendu HTML avec une liste d’items ayant la classe `home-gallery-item` à l’intérieur d’un conteneur `home-gallery`.

- [ ] **Step 1: Restore CSS classes in globals.css**

  Ajouter (ou restaurer) les classes suivantes dans `app/globals.css` :

  ```css
  .home-gallery {
    column-count: 1;
    column-gap: 15px;
  }

  .home-gallery-item {
    break-inside: avoid;
    margin-bottom: 15px;
  }

  @media (min-width: 640px) {
    .home-gallery {
      column-count: 2;
    }
  }

  @media (min-width: 1024px) {
    .home-gallery {
      column-count: 4;
    }
  }
  ```

- [ ] **Step 2: Update HomeMediaGallery to use CSS columns**

  Remplacer le wrapper `grid grid-cols-1 ... lg:grid-cols-4` par :

  ```tsx
  <div className="home-gallery py-12">
    {mediaSections.map((section, index) => (
      <div
        key={section._key || `home-media-${index}`}
        className="home-gallery-item transition-transform duration-200 hover:scale-[0.985] hover:opacity-90"
      >
        {section.type === 'image' ? (
          <SanityImage
            media={section}
            width={getImageDimensions(section).width}
            height={getImageDimensions(section).height}
            priority={index < 6}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="h-auto w-full"
          />
        ) : (
          <VideoEmbed url={section.videoUrl || ''} className="h-auto w-full" />
        )}
      </div>
    ))}
  </div>
  ```

- [ ] **Step 3: Update HomeMediaGallery test expectations**

  Dans `tests/components/HomeMediaGallery.test.tsx`, vérifier que le conteneur a la classe `home-gallery` et que les items ont la classe `home-gallery-item`.

- [ ] **Step 4: Run tests and typecheck**

  Run:
  ```bash
  npm run typecheck
  npm run test:run -- tests/components/HomeMediaGallery.test.tsx
  ```
  Expected: pass.

- [ ] **Step 5: Commit**

  ```bash
  git add arnopartissimo-website/components/pages/HomeMediaGallery.tsx arnopartissimo-website/app/globals.css arnopartissimo-website/tests/components/HomeMediaGallery.test.tsx
  git commit -m "fix(home): restore CSS columns masonry with aligned first row"
  ```

---

### Task 2: Creative thumbnails — fix ProjectCard image display

**Files:**
- Modify: `arnopartissimo-website/components/project/ProjectCard.tsx`
- Test: `arnopartissimo-website/tests/components/ProjectCard.test.tsx`

**Interfaces:**
- Consumes: objet `{ _id, title, slug, coverImage: Media }`.
- Produces: carte cliquable avec vignette visible en ratio 4/5.

- [ ] **Step 1: Inspect current ProjectCard markup**

  Lire `components/project/ProjectCard.tsx` et confirmer que le problème vient du conteneur `aspect-[4/5]` combiné à `SanityImage` avec `fill`.

- [ ] **Step 2: Simplify the card markup**

  Remplacer le contenu de `ProjectCard` par :

  ```tsx
  import Link from 'next/link';
  import { Media } from '@/types';
  import { SanityImage } from '@/components/media/SanityImage';

  interface ProjectCardProps {
    project: {
      _id: string;
      title: string;
      slug: string;
      coverImage: Media;
    };
    priority?: boolean;
  }

  function isValidImageMedia(
    media?: Media | null
  ): media is Media & { type: 'image'; image: NonNullable<Media['image']> } {
    return !!media && media.type === 'image' && !!media.image;
  }

  export function ProjectCard({ project, priority }: ProjectCardProps) {
    const hasCoverImage = isValidImageMedia(project.coverImage);

    return (
      <Link href={`/projects/${project.slug}`} className="group block">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-800">
          {hasCoverImage ? (
            <SanityImage
              media={project.coverImage}
              fill
              priority={priority}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[0.985]"
            />
          ) : (
            <div className="absolute inset-0 bg-neutral-800" />
          )}
        </div>
        <h3 className="mt-3 text-[11px] uppercase tracking-[0.2em] text-foreground">
          {project.title}
        </h3>
      </Link>
    );
  }
  ```

  Note : passer `className="h-full w-full object-cover"` à `SanityImage` ; vérifier que `SanityImage` accepte et applique cette classe sur son conteneur interne.

- [ ] **Step 3: Update ProjectCard test**

  Dans `tests/components/ProjectCard.test.tsx`, s’assurer que l’image a bien un `src` Sanity et que le lien pointe vers `/projects/${slug}`.

- [ ] **Step 4: Run tests and typecheck**

  Run:
  ```bash
  npm run typecheck
  npm run test:run -- tests/components/ProjectCard.test.tsx
  ```
  Expected: pass.

- [ ] **Step 5: Commit**

  ```bash
  git add arnopartissimo-website/components/project/ProjectCard.tsx arnopartissimo-website/tests/components/ProjectCard.test.tsx
  git commit -m "fix(creative): make project card thumbnails visible"
  ```

---

### Task 3: Sanity schema — add layout field to media

**Files:**
- Modify: `arnopartissimo-website/sanity/schemaTypes/media.ts`

**Interfaces:**
- Consumes: N/A.
- Produces: schéma `media` avec un champ optionnel `layout: 'wide' | 'square'`.

- [ ] **Step 1: Add layout field to mediaType**

  Dans `media.ts`, ajouter après le champ `type` :

  ```ts
  defineField({
    name: 'layout',
    title: 'Layout',
    type: 'string',
    options: {
      list: [
        { title: 'Wide', value: 'wide' },
        { title: 'Square', value: 'square' },
      ],
      layout: 'radio',
    },
    initialValue: 'wide',
  }),
  ```

  Garder le champ visible pour tout type de média (image et vidéo) afin de rester simple.

- [ ] **Step 2: Commit**

  ```bash
  git add arnopartissimo-website/sanity/schemaTypes/media.ts
  git commit -m "feat(sanity): add layout field to media schema"
  ```

---

### Task 4: TypeScript — update Media type

**Files:**
- Modify: `arnopartissimo-website/types/index.ts`

**Interfaces:**
- Consumes: N/A.
- Produces: interface `Media` avec `layout?: 'wide' | 'square'`.

- [ ] **Step 1: Add layout to Media interface**

  ```ts
  export interface Media {
    _type: 'media';
    _key?: string;
    type: 'image' | 'video';
    layout?: 'wide' | 'square';
    image?: MediaImage;
    videoUrl?: string;
    caption?: string;
    credits?: string;
  }
  ```

- [ ] **Step 2: Run typecheck**

  Run:
  ```bash
  npm run typecheck
  ```
  Expected: pass.

- [ ] **Step 3: Commit**

  ```bash
  git add arnopartissimo-website/types/index.ts
  git commit -m "types: add layout to Media interface"
  ```

---

### Task 5: ProjectGallery — support wide and square layouts

**Files:**
- Modify: `arnopartissimo-website/components/project/ProjectGallery.tsx`
- Create: `arnopartissimo-website/tests/components/project/ProjectGallery.test.tsx`

**Interfaces:**
- Consumes: `Media[]` (champ `gallery` d’un projet).
- Produces: grille de médias où `wide` = pleine largeur et `square` = 2 par ligne.

- [ ] **Step 1: Rewrite ProjectGallery with layout support**

  ```tsx
  import { Media } from '@/types';
  import { SanityImage } from '@/components/media/SanityImage';
  import { VideoEmbed } from '@/components/media/VideoEmbed';
  import { cn } from '@/lib/utils/cn';

  interface ProjectGalleryProps {
    items: Media[];
  }

  export function ProjectGallery({ items }: ProjectGalleryProps) {
    return (
      <div className="flex flex-wrap gap-4">
        {items.map((item, index) => {
          const isSquare = item.layout === 'square';

          if (item.type === 'image') {
            return (
              <div
                key={item._key || index}
                className={cn(
                  'relative overflow-hidden',
                  isSquare ? 'aspect-square w-[calc(50%-8px)]' : 'aspect-video w-full'
                )}
              >
                <SanityImage
                  media={item}
                  fill
                  sizes={isSquare ? '50vw' : '100vw'}
                  className="h-full w-full object-cover"
                />
              </div>
            );
          }

          return (
            <div
              key={item._key || index}
              className={cn(isSquare ? 'w-[calc(50%-8px)]' : 'w-full')}
            >
              <VideoEmbed url={item.videoUrl || ''} className="h-auto w-full" />
            </div>
          );
        })}
      </div>
    );
  }
  ```

- [ ] **Step 2: Add ProjectGallery tests**

  Créer `tests/components/project/ProjectGallery.test.tsx` :

  ```tsx
  import { describe, it, expect } from 'vitest';
  import { render, screen } from '@testing-library/react';
  import { ProjectGallery } from '@/components/project/ProjectGallery';
  import { Media } from '@/types';

  const makeImage = (layout?: 'wide' | 'square'): Media => ({
    _type: 'media',
    _key: Math.random().toString(),
    type: 'image',
    layout,
    image: {
      asset: { _ref: 'image-ref', _type: 'reference' },
      alt: 'Test image',
    },
  });

  describe('ProjectGallery', () => {
    it('renders wide items at full width', () => {
      render(<ProjectGallery items={[makeImage('wide')]} />);
      const wrapper = screen.getByRole('img').parentElement;
      expect(wrapper).toHaveClass('w-full');
      expect(wrapper).toHaveClass('aspect-video');
    });

    it('renders square items at half width', () => {
      render(<ProjectGallery items={[makeImage('square')]} />);
      const wrapper = screen.getByRole('img').parentElement;
      expect(wrapper).toHaveClass('w-[calc(50%-8px)]');
      expect(wrapper).toHaveClass('aspect-square');
    });

    it('defaults to wide when layout is undefined', () => {
      render(<ProjectGallery items={[makeImage(undefined)]} />);
      const wrapper = screen.getByRole('img').parentElement;
      expect(wrapper).toHaveClass('w-full');
    });
  });
  ```

- [ ] **Step 3: Run tests and typecheck**

  Run:
  ```bash
  npm run typecheck
  npm run test:run -- tests/components/project/ProjectGallery.test.tsx
  ```
  Expected: pass.

- [ ] **Step 4: Commit**

  ```bash
  git add arnopartissimo-website/components/project/ProjectGallery.tsx arnopartissimo-website/tests/components/project/ProjectGallery.test.tsx
  git commit -m "feat(project): support wide and square gallery layouts"
  ```

---

### Task 6: Sanity type generation

**Files:**
- Modify: `arnopartissimo-website/sanity.types.ts` (si généré automatiquement)

**Interfaces:**
- Consumes: schéma Sanity mis à jour.
- Produces: types TypeScript à jour.

- [ ] **Step 1: Run Sanity typegen**

  Run:
  ```bash
  npm run sanity:typegen
  ```

  Si la commande existe et met à jour `sanity.types.ts`, inclure le fichier dans le commit.

- [ ] **Step 2: Run typecheck**

  Run:
  ```bash
  npm run typecheck
  ```
  Expected: pass.

- [ ] **Step 3: Commit**

  ```bash
  git add arnopartissimo-website/sanity.types.ts
  git commit -m "chore(sanity): regenerate types with layout field"
  ```

  Si `sanity.types.ts` n’est pas modifié, sauter ce commit.

---

### Task 7: Final validation and deploy

**Files:**
- N/A (validation globale).

**Interfaces:**
- N/A.

- [ ] **Step 1: Run full validation**

  Run:
  ```bash
  npm run typecheck
  npm run test:run
  npm run build
  ```
  Expected: all pass.

- [ ] **Step 2: Push to GitHub**

  ```bash
  git push origin master
  ```

- [ ] **Step 3: Trigger Vercel deploy**

  ```bash
  curl -X POST "https://api.vercel.com/v1/integrations/deploy/prj_rl9EuvPE8vyIYWZ2anzGUwHnIWwO/jULkAB3Efp"
  ```

- [ ] **Step 4: Verify live pages**

  Après 1–2 minutes, vérifier :
  - `/` : masonry avec première rangée alignée.
  - `/creative` : vignettes visibles.
  - `/projects/finalshow` : médias en wide/square selon ce qui est configuré dans Sanity.

- [ ] **Step 5: Commit (if any final fixes)**

  Si des ajustements sont nécessaires après la vérification live, les committer séparément.

---

## Self-Review

**Spec coverage:**
- 1ère rangée alignée sur la home → Task 1.
- Vignettes `/creative` visibles → Task 2.
- Layout wide/square dans les projets → Tasks 3, 4, 5.

**Placeholder scan:** aucun TBD/TODO.

**Type consistency:** `layout?: 'wide' | 'square'` est utilisé de manière cohérente dans le schéma Sanity, le type TypeScript et `ProjectGallery`.
