# Reproduction du site Wix — V1 Design Spec

**Date** : 2026-07-08  
**Projet** : arnopartissimo-website  
**Objectif** : faire ressembler le site Next.js actuellement hébergé sur Vercel (`arnopartissimo-website.vercel.app`) au site Wix actuel (`arnopartissimo.com`), avec un code propre et évolutif.

---

## 1. Contexte

Le site Wix utilise :

- un fond sombre `#1F1F1F` ;
- un header transparent et centré avec le logo `ARNO PARTISSIMO.` et la navigation `PHOTO. / CREATIVE DIRECTION. / CONTACT / STORE.` ;
- une galerie d’accueil en grille 4 colonnes, ratios d’origine, images statiques ;
- un footer transparent à deux colonnes avec liens Instagram et email.

Le site Next.js actuel utilise un thème clair (Tailwind par défaut), un header blanc à gauche, une galerie 3 colonnes avec crop forcé, et un footer minimal.

---

## 2. Scope de la v1

- Reproduire l’identité visuelle principale de Wix (pas un pixel-perfect absolu).
- Thème sombre + police Inter.
- Header centré transparent avec navigation `PHOTO.`, `CREATIVE DIRECTION.`, `CONTACT`.
- Footer Wix à deux colonnes, éditable via Sanity.
- Page d’accueil : grille 4 colonnes, ratios d’origine, hover subtil, images statiques, ordre Sanity respecté.
- Page `/creative` : grille de cartes projet avec image de couverture et titre, adaptée au thème sombre.
- Page `/contact` : contenu actuel conservé, adapté au thème sombre.
- Pas de lien `STORE.` dans la navigation pour l’instant.
- Pas de lightbox ni de clic sur les images de la galerie d’accueil.

---

## 3. Approche choisie

**Approche B — Refonte avec Design System minimal.**

On crée des tokens sémantiques et des composants réutilisables (NavLink, FooterColumn, Logo, etc.) pour faciliter les évolutions futures, tout en restant concentré sur la reproduction Wix.

---

## 4. Architecture / nouveaux fichiers

```
app/
  globals.css                    # tokens Tailwind + imports
  layout.tsx                     # layout global, chargement Inter
components/
  design-system/
    tokens.ts                    # source de vérité des tokens (couleurs, typo, espacements)
    Logo.tsx                     # logo texte centré
    NavLink.tsx                  # lien de navigation avec état actif
    FooterColumn.tsx             # colonne de liens du footer
  layout/
    Header.tsx                   # header transparent centré
    Footer.tsx                   # footer Wix à deux colonnes
    Navigation.tsx               # liste des liens + état actif + menu mobile plein écran
  pages/
    HomeMediaGallery.tsx         # grille 4 colonnes masonry-like
    CreativePage.tsx             # grille de cartes projet
    ContactSection.tsx           # page contact adaptée
sanity/
  schemaTypes/
    siteSettings.ts              # ajout des champs footer/instagram
```

---

## 5. Thème et tokens

### Couleurs

| Token          | Valeur hex                 | Usage                                     |
| -------------- | -------------------------- | ----------------------------------------- |
| `--background` | `#1F1F1F`                  | fond de page                              |
| `--foreground` | `#FCFCFC`                  | texte principal                           |
| `--muted`      | `#747279`                  | liens de nav inactifs, textes secondaires |
| `--accent`     | `#FCFCFC`                  | liens actifs et survol                    |
| `--border`     | `rgba(252, 252, 252, 0.1)` | séparateurs discrets                      |

### Typographie

- Police principale : **Inter** via `next/font/google`.
- Logo : `20px`, uppercase, tracking `0.15em`.
- Navigation : `11px`, uppercase, tracking `0.2em`.
- Footer : `10px`, uppercase, tracking `0.3em`.

### Espacements

- Header : hauteur ~`80px` desktop, padding vertical `16px`.
- Galerie : gap entre images `15px`.
- Footer : padding vertical `32px`, séparateur horizontal `1px`.

---

## 6. Layout

### Header

- Position `fixed`, transparent, `z-50`.
- Logo `ARNO PARTISSIMO.` centré en haut.
- Navigation centrée juste en dessous.
- Le point final après `PHOTO.` et `CREATIVE DIRECTION.` est conservé.
- Pas de backdrop-blur, pas de fond blanc.

### Navigation

- Liens : `PHOTO.` → `/`, `CREATIVE DIRECTION.` → `/creative`, `CONTACT` → `/contact`.
- Lien inactif : couleur `--muted`.
- Lien actif : couleur `--accent`.
- Survol : transition rapide vers `--accent`.
- Mobile : hamburger à droite, menu plein écran sombre avec les 3 liens centrés.

### Footer

- Fond transparent, texte blanc, en bas de page.
- Deux colonnes séparées par une fine ligne horizontale.
- Colonne gauche :
  - `ARNO PARTISSIMO`
  - `INSTAGRAM.` (lien vers `siteSettings.instagramUrl`)
- Colonne droite :
  - `AVAILABLE WORLDWIDE`
  - `BOOKING / GENERAL INQUIRIES`
  - `ARNO@ARNOPARTISSIMO.COM` (mailto + copie au clic)
- Même footer sur desktop et mobile.

---

## 7. Page d’accueil

### Galerie

- Grille 4 colonnes sur desktop, 2 colonnes sur tablette, 1 colonne sur mobile.
- Respect des ratios d’origine des images : pas de crop forcé.
- Gap de `15px`.
- Images statiques, pas d’interaction au clic.
- Ordre défini dans Sanity respecté exactement.
- Les 6 premières images chargent avec `priority`.
- Les images suivantes utilisent lazy loading avec un placeholder flou (blur-up) si disponible.
- Effet hover : opacité légèrement réduite + `transform: scale(0.985)`, transition `200ms ease`.

### Données

- Source : page Sanity `home`, sections de type `media`.
- 25 images déjà importées.

---

## 8. Page Creative

- Présentation sous forme de grille de cartes projet.
- Chaque carte affiche l’image de couverture du projet + son titre.
- Style adapté au thème sombre.
- Les projets proviennent des références dans `page-creative.sections`.

---

## 9. Page Contact

- Contenu actuel conservé (texte + image + bouton copie email).
- Adaptation au thème sombre.
- Le bouton de copie d’email reste fonctionnel.

---

## 10. Sanity — schémas

### `siteSettings` : champs à ajouter

```ts
instagramUrl: url
availableWorldwideText: string (default: "AVAILABLE WORLDWIDE")
bookingEmail: string (default: "arno@arnopartissimo.com")
footerLeftLabel: string (default: "ARNO PARTISSIMO")
footerRightLabel: string (default: "BOOKING / GENERAL INQUIRIES")
```

Les champs existants (`title`, `description`, `contactEmail`, `socialLinks`, `footerText`, `defaultSeoImage`) sont conservés.

### `page`, `media`, `project`, `textBlock`, `category`

Aucun changement structurel. Seuls les composants de rendu sont adaptés au thème sombre.

---

## 11. SEO et performance

- Conserver `generateMetadata` dans `layout.tsx`.
- Conserver `sitemap.ts` et `robots.ts`.
- Conserver les données structurées JSON-LD (`websiteSchema`, `personSchema`).
- Utiliser `next/image` avec `priority` sur les 6 premières images et lazy loading sur les autres.
- Préférer les placeholders flous générés par Sanity (`metadata.lqip`) quand disponibles.

---

## 12. Tests et validation

- `npm run typecheck` passe sans erreur.
- `npm run lint` passe sans erreur.
- `npm run test:run` passe sans régression.
- `npm run build` réussit.
- Déploiement Vercel réussi via webhook Sanity.
- Vérification visuelle desktop + mobile du rendu final.

---

## 13. Non-scope / à ne pas faire dans cette v1

- Ne pas ajouter de lien `STORE.` ni de page `/soon`.
- Ne pas ajouter de lightbox sur la galerie d’accueil.
- Ne pas recréer pixel-perfect toutes les animations Wix.
- Ne pas changer la structure des projets ou la logique de Creative Direction.
- Ne pas importer de nouvelles images depuis Wix (on utilise les 25 déjà présentes).
