# Design : galerie d’accueil, vignettes Creative Direction et layouts de projet

## Contexte
Le site Next.js recrée le site Wix existant (`arnopartissimo.com`). Trois ajustements visuels restent à apporter :

1. La galerie photo de la page d’accueil doit ressembler au masonry Wix : un seul bloc, mais la première rangée de photos doit démarrer à la même hauteur.
2. Les vignettes des projets sur `/creative` ne s’affichent pas visuellement bien que les URLs d’image soient présentes dans le HTML.
3. Dans la page détail d’un projet (`/projects/[slug]`), les médias de la galerie doivent pouvoir être affichés soit en **wide** (pleine largeur), soit en **square** (2 par ligne).

## Décisions

### 1. Galerie d’accueil : masonry CSS columns, première rangée alignée
- Revenir à un layout **CSS columns** (`column-count`) qui forme naturellement un masonry.
- Avec 4 colonnes sur desktop, les 4 premières images tombent chacune dans une colonne différente : elles sont donc alignées en haut de la première rangée.
- Les images suivantes s’empilent sous celles de leur colonne, créant l’effet masonry.
- Breakpoints :
  - mobile : 1 colonne
  - `sm` (640 px) : 2 colonnes
  - `lg` (1024 px) : 4 colonnes
- Gap : 15 px (correspond au spacing Wix).
- Chaque item a `break-inside-avoid` pour éviter qu’une image soit coupée entre deux colonnes.
- Le composant `SanityImage` actuel (avec normalisation des assets déréférencés) est conservé : il fournit les bonnes dimensions et le blur-up.

### 2. Vignettes `/creative` : correction de `ProjectCard`
- Le HTML contient déjà les URLs Sanity, donc le problème est purement visuel (ratio / conteneur).
- `ProjectCard` utilisera un conteneur clair avec ratio 4/5 et `object-cover`.
- L’image sera rendue avec `fill` à l’intérieur du conteneur ratio.
- Le titre du projet reste en dessous, style inchangé.

### 3. Layout des médias dans un projet
- Ajout d’un champ `layout` dans le schéma Sanity `media` (objet réutilisé dans `project.gallery`).
- Options :
  - `wide` (défaut) : pleine largeur, ratio 16/9.
  - `square` : deux médias par ligne, ratio 1/1.
- Le champ n’est visible que pour les images et vidéos de la galerie d’un projet (ou partout sur `media` si plus simple à maintenir).
- `ProjectGallery` devient un composant dynamique :
  - wide → pleine largeur, `aspect-[16/9]`.
  - square → wrapper à 50% de largeur, 2 par ligne, `aspect-square`.
- Si `layout` n’est pas défini, `wide` est utilisé (compatibilité ascendante).

## Fichiers concernés
- `components/pages/HomeMediaGallery.tsx`
- `app/globals.css` (classes `.home-gallery` et `.home-gallery-item`)
- `components/project/ProjectCard.tsx`
- `sanity/schemaTypes/media.ts`
- `types/index.ts`
- `components/project/ProjectGallery.tsx`
- Tests associés : `HomeMediaGallery.test.tsx`, `ProjectCard.test.tsx`, `ProjectGallery.test.tsx` (à créer ou mettre à jour)

## Vérification
- `npm run typecheck` : 0 erreur
- `npm run test:run` : tous les tests passent
- `npm run build` : build réussi
- Déploiement Vercel + vérification visuelle des 3 pages

## Non-objectifs
- Pas de modification de la navigation, du footer, de la page contact ou du SEO.
- Pas de nouvelle dépendance externe (masonry JS) : on reste sur du CSS columns natif.
