# Design — Refonte d'arnopartissimo.com (hors Wix)

## 1. Contexte et objectifs

Le site actuel [arnopartissimo.com](https://arnopartissimo.com) est hébergé et construit sur Wix. L'objectif est de le recréer from-scratch de manière indépendante, propre, évolutive et gratuite à héberger, tout en conservant une copie fidèle du rendu actuel. Les améliorations seront faites par itérations après la livraison de la base.

### Objectifs principaux
- Ne plus dépendre de Wix (hébergement + builder).
- Site rapide, maintenable par un humain, avec un code propre et documenté.
- Interface d'administration via CMS pour ajouter/modifier des projets facilement.
- Hébergement gratuit avec déploiement automatique.
- SEO classique + optimisation pour le référencement par les IA.

## 2. Périmètre

### Pages à recréer
- `/` — Accueil avec la galerie principale (sélection de photos mises en avant).
- `/creative` — Page Creative Direction.
- `/contact` — Page Contact (email avec `mailto:` + copie dans le presse-papiers).
- `/projects/[slug]` — Pages dynamiques pour chaque projet :
  - `stadedefranceapplication`
  - `complicated`
  - `delxps13`
  - `wannabeloved`
  - `upinthesky`
  - `finalshow`
  - et les autres projets identifiés dans le sitemap Wix.

### Hors périmètre (pour l'instant)
- Store / e-commerce.
- Pages légales (privacy, terms, refund, shipping, accessibility).
- Pages challenges, members, loyalty, refer-friends, file-share.
- Pages de test (`storebeta`, `testproducts`, `blank-6`, etc.).

## 3. Architecture et stack

| Couche | Technologie |
|--------|-------------|
| Framework | Next.js 14+ avec App Router |
| Langage | TypeScript (mode strict) |
| Styling | Tailwind CSS |
| CMS | Sanity Studio v3 |
| Connexion CMS | `next-sanity` + requêtes GROQ |
| Images / médias | Sanity CDN + `next/image` |
| Hébergement | Vercel (plan gratuit) |
| Versioning | GitHub |
| CI/CD | GitHub Actions + déploiement Vercel |
| Formulaire de contact | Aucun service tiers : `mailto:` + copie d'email |

### Choix techniques
- **Next.js App Router** : rendu statique par défaut, excellent SEO, performances.
- **Sanity** : CMS headless avec interface d'admin, plan gratuit suffisant pour un portfolio.
- **Vercel** : hébergement gratuit, déploiement automatique, previews de PR.

## 4. Structure du site et routing

```
app/
├── layout.tsx              # Header + Footer + Navigation
├── page.tsx                # Accueil
├── creative/
│   └── page.tsx            # Creative Direction
├── contact/
│   └── page.tsx            # Contact
└── projects/
    └── [slug]/
        └── page.tsx        # Page projet dynamique
```

- Pas de page `/photo` séparée : la galerie principale est sur l'accueil.
- Les projets utilisent des URLs propres : `/projects/[slug]`.
- `generateStaticParams` génère les pages de projets au build.

## 5. Modèle de données Sanity

### Type réutilisable `media`
Pour faciliter l'ajout de médias partout :
- `type` : `image` | `video`
- `image` : image Sanity avec hotspot/crop
- `videoUrl` : URL externe (YouTube/Vimeo) ou fichier vidéo
- `alt` : texte alternatif (accessibilité)
- `caption` : légende
- `credits` : crédits photo/vidéo

### Documents

#### `siteSettings`
- `title` : titre du site
- `description` : description globale
- `logo` : logo
- `favicon` : favicon
- `socialLinks` : liens réseaux sociaux
- `contactEmail` : email de contact
- `footerText` : texte du footer
- `defaultSeoImage` : image SEO par défaut
- `analyticsId` : ID analytics
- `customScripts` : scripts tiers

#### `page`
Pour les pages statiques (accueil, creative, contact) :
- `slug` : `home` | `creative` | `contact`
- `title`
- `metaTitle`, `metaDescription`, `ogImage`, `noIndex`
- `sections` : blocs flexibles (hero visuel, galerie, texte, image pleine largeur, grille de projets, section contact...)

#### `project`
Pour chaque projet :
- `title`
- `slug`
- `category` : référence vers `category`
- `year`
- `client`
- `role` : ex. Photographer, Creative Director
- `location`
- `tags`
- `coverImage` : `media`
- `gallery` : liste de `media`
- `description` : texte riche
- `credits`
- `externalLink`
- `relatedProjects` : références vers d'autres projets
- `order` : position d'affichage
- `isFeatured` : mis en avant sur l'accueil
- `status` : `draft` | `published`
- `publishedAt`, `updatedAt`

#### `category`
- `title`
- `slug`
- `description`
- `coverImage`

## 6. Composants UI

### Layout
- `Header` : logo + navigation
- `Footer` : liens sociaux, crédits
- `Navigation` : desktop + mobile

### Pages
- `HomeGallery` : sélection de photos mises en avant sur l'accueil
- `ProjectCard` : carte de navigation vers un projet
- `ProjectDetail` : mise en page d'un projet (galerie, description, crédits)
- `Media` / `SanityImage` : image optimisée avec `next/image`
- `VideoEmbed` : intégration vidéo
- `RichTextBlock` : rendu du texte riche Sanity
- `ContactSection` : affichage email + `mailto:` + bouton copier

### Utilitaires
- `Container` : largeur maximale cohérente
- `Section` : espacements verticaux cohérents
- `LoadingState` / `ErrorBoundary` : gestion des états

## 7. Images et médias

- Images hébergées sur Sanity et servies via le Sanity CDN.
- Composant `SanityImage` : wrapper autour de `next/image` gérant :
  - redimensionnement
  - formats modernes (WebP/AVIF)
  - hotspot/crop Sanity
  - blur-up (placeholder basse qualité)
- Les 2 à 3 premières images de la galerie d'accueil sont chargées en `eager`.
- Le reste des images utilise le lazy loading natif.
- Fallback : placeholder blur-up si l'image est manquante.
- Vidéos : préférence pour les URLs externes (YouTube/Vimeo) pour économiser le stockage Sanity.

## 8. Déploiement et workflow

1. **Repo GitHub** héberge le code source.
2. **Branche `main`** déclenche un déploiement automatique sur Vercel.
3. **Preview deployments** : chaque PR génère une URL de preview.
4. **Sanity Studio** déployé séparément (Vercel ou local).
5. **Workflow de mise à jour du contenu** :
   - Modifier le contenu dans Sanity Studio.
   - Publier.
   - Webhook Sanity → Vercel.
   - Vercel regénère le site statique.

## 9. SEO, performance et référencement IA

### SEO classique
- `metadata` Next.js par page.
- `robots.txt` et `sitemap.xml` générés automatiquement.
- URLs canoniques propres.
- Open Graph, Twitter Card.
- Images avec `alt` et noms de fichiers optimisés.

### SEO IA / référencement par les moteurs intelligents
- **Schema.org JSON-LD** :
  - `WebSite`
  - `Person` / `Organization`
  - `CreativeWork` / `VisualArtwork` pour chaque projet
  - `ImageObject` pour les images principales
  - `BreadcrumbList`
- **Contenu textuel structuré** : descriptions détaillées, crédits, tags, catégories.
- **Fichier `llms.txt`** à la racine : résumé structuré pour les grands modèles de langage.
- **HTML sémantique** : `<main>`, `<article>`, `<section>`, `<figure>`, `<figcaption>`.

### Performance
- Rendu statique par défaut.
- `next/image` pour les images.
- `next/font` pour les polices.
- JS client minimal.

### Accessibilité
- Contraste suffisant.
- Navigation clavier.
- `aria-label` sur les éléments interactifs.

## 10. Migration du contenu Wix

Le contenu actuel sera recopié manuellement dans Sanity :

1. **Extraction** :
   - Liste des pages/projets via le sitemap Wix.
   - Sauvegarde des textes et images.

2. **Upload dans Sanity** :
   - Création des documents `project`.
   - Upload des images.
   - Rédaction des descriptions si absentes.

3. **Pages statiques** :
   - Recopie de l'accueil.
   - Recopie de Creative Direction.
   - Création de la page Contact.

4. **Vérification** :
   - Comparaison visuelle page par page.
   - Tests des liens et images.

## 11. Tests et qualité

- **Tests automatiques** :
  - Vitest + React Testing Library pour les composants.
  - Requêtes Sanity mockées.
- **Qualité de code** :
  - ESLint + Prettier.
  - TypeScript strict.
  - Husky + lint-staged avant chaque commit.
- **Vérifications manuelles** :
  - Comparaison visuelle avec Wix.
  - Responsive (mobile, tablette, desktop).
  - Lighthouse.
  - Rich Results Test.

## 12. Structure du code et maintenabilité

```
arnopartissimo-website/
├── app/                    # Pages Next.js App Router
├── components/             # Composants React organisés par domaine
│   ├── layout/
│   ├── pages/
│   ├── project/
│   ├── media/
│   ├── ui/
│   └── seo/
├── lib/                    # Clients, requêtes, helpers
│   ├── sanity/
│   ├── utils/
│   └── seo/
├── sanity/                 # Schémas et config Sanity Studio
│   ├── schemas/
│   ├── structure/
│   └── config.ts
├── types/                  # Types TypeScript globaux
├── public/                 # Fichiers statiques
├── tests/                  # Tests
├── docs/                   # Documentation du projet
│   ├── README.md
│   ├── ARCHITECTURE.md
│   ├── SETUP.md
│   └── DECISIONS.md
├── .github/workflows/      # CI/CD GitHub Actions
├── .env.example
├── package.json
└── next.config.js
```

### Exigences de maintenabilité
- README complet avec installation, commandes, déploiement.
- `SETUP.md` : guide pas à pas.
- `ARCHITECTURE.md` : explication des dossiers et conventions.
- `DECISIONS.md` : ADRs (pourquoi Next.js, Sanity, cette structure).
- Scripts npm clairs : `dev`, `build`, `lint`, `test`, `typecheck`, `sanity:typegen`.
- `.env.example` documenté.
- CI/CD GitHub Actions : types, lint, tests à chaque PR.
- Conventional Commits.
- Séparation des responsabilités : données dans `lib/sanity/`, affichage dans `components/`.
- Pas de logique métier dans les pages.

## 13. Prochaines étapes

1. Créer le plan d'implémentation détaillé (skill `writing-plans`).
2. Initialiser le projet Next.js + Sanity.
3. Configurer les schémas Sanity.
4. Créer les composants et pages.
5. Migrer le contenu Wix.
6. Tester, déployer, valider.
