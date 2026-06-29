# Carnet Habitat

Magazine en ligne éditorial dédié à l'habitat : **maison, travaux, jardin, énergie, décoration**.
Conçu comme un véritable média professionnel — crédible, lisible, optimisé pour le SEO et prêt à accueillir des partenariats éditoriaux.

> Style éditorial premium, minimaliste et élégant. Palette : fond `#FAFAF8`, texte `#222222`, vert sauge `#7A8F7A`, terracotta `#C87B5A`.

---

## Stack technique

| Domaine | Choix |
|---|---|
| Framework | **Next.js 15** (App Router) |
| Langage | **TypeScript** (strict) |
| Styles | **Tailwind CSS v4** (design tokens en CSS) |
| Contenu | **MDX** + frontmatter (`gray-matter`) |
| Typographie | `next/font` — **Fraunces** (titres) & **Inter** (corps) |
| Rendu MDX | `next-mdx-remote/rsc` + `remark-gfm` + `rehype-slug` |
| SEO | Metadata API, sitemap & robots dynamiques, JSON-LD Schema.org |
| Images | `next/image` (AVIF/WebP, lazy, responsive) |

Le site est **statiquement généré** (SSG) : chaque page (accueil, catégories, articles, pagination) est pré-rendue en HTML pour des Core Web Vitals optimaux.

---

## Démarrage rapide

```bash
# 1. Installer les dépendances
npm install

# 2. (Optionnel) Configurer les variables d'environnement
cp .env.example .env.local

# 3. Lancer le serveur de développement
npm run dev
# → http://localhost:3000
```

### Build de production

```bash
npm run build   # build optimisé + génération statique
npm run start   # sert le build de production en local
```

### Lint

```bash
npm run lint
```

---

## Structure du projet

```
.
├── content/
│   └── articles/                 # 20 articles MDX (1 fichier = 1 article)
│       └── traiter-cave-humide.mdx
├── public/                       # (assets statiques éventuels)
├── src/
│   ├── app/
│   │   ├── layout.tsx            # Layout racine : polices, header, footer, JSON-LD global
│   │   ├── page.tsx              # Page d'accueil (hero, catégories, derniers articles…)
│   │   ├── globals.css           # Design system (tokens Tailwind v4, typographie article)
│   │   ├── [category]/
│   │   │   ├── page.tsx          # Page catégorie (intro SEO + liste + pagination)
│   │   │   ├── [slug]/page.tsx   # Template d'article éditorial
│   │   │   └── page/[page]/page.tsx  # Pagination des catégories (/maison/page/2…)
│   │   ├── a-propos/             # Page À propos
│   │   ├── contact/              # Page Contact (+ formulaire)
│   │   ├── mentions-legales/
│   │   ├── politique-de-confidentialite/
│   │   ├── recherche/            # Page de recherche (instantanée)
│   │   ├── api/
│   │   │   ├── newsletter/route.ts   # Inscription newsletter (prêt pour Brevo)
│   │   │   └── contact/route.ts      # Formulaire de contact
│   │   ├── sitemap.ts            # Sitemap XML automatique
│   │   ├── robots.ts             # robots.txt automatique
│   │   ├── opengraph-image.tsx   # Image Open Graph générée dynamiquement
│   │   ├── icon.svg              # Favicon
│   │   ├── apple-icon.tsx        # Icône Apple Touch
│   │   └── not-found.tsx         # Page 404
│   ├── components/               # Header, Footer, cartes, newsletter, TOC, FAQ, recherche…
│   └── lib/
│       ├── site.ts              # Configuration centrale du site
│       ├── categories.ts        # Définition des 5 rubriques (+ intros SEO)
│       ├── authors.ts           # Équipe éditoriale
│       ├── articles.ts          # Chargement & parsing des articles MDX (serveur)
│       ├── search.ts            # Index de recherche (serveur)
│       ├── search-core.ts       # Logique de recherche (client-safe)
│       ├── seo.ts               # Helpers metadata + JSON-LD (Article, FAQ, Breadcrumb…)
│       ├── format.ts            # Formatage des dates / temps de lecture (fr-FR)
│       └── nav.ts               # Navigation header/footer
├── next.config.mjs
├── tailwind / postcss config
└── .env.example
```

---

## Gérer le contenu

### Ajouter ou modifier un article

Créez un fichier `content/articles/mon-slug.mdx`. Le **nom du fichier = l'URL** (`/<categorie>/mon-slug`).

```mdx
---
title: "Titre de l'article"
description: "Méta description SEO (140–160 caractères)."   # ← balise <meta name=description> + OG
category: "maison"          # maison | travaux | jardin | energie | decoration
author: "claire-deniau"     # clé définie dans src/lib/authors.ts
date: "2026-05-14"
updated: "2026-05-14"       # optionnel
cover: "https://images.unsplash.com/photo-…?auto=format&fit=crop&w=1600&q=70"
coverAlt: "Texte alternatif de l'image"
ogImage: "https://…"        # optionnel — surcharge l'image Open Graph (sinon: cover)
excerpt: "Résumé court affiché sur les cartes."
tags: ["humidité", "cave", "ventilation"]
featured: true              # optionnel — met l'article en « Guides populaires »
faq:
  - question: "Une question fréquente ?"
    answer: "La réponse, claire et concise."
---

Paragraphe d'introduction (pas de titre H1, il vient du frontmatter).

## Un titre de section (H2)
Texte…

### Un sous-titre (H3)
Texte…

## Conclusion
Texte de conclusion.
```

**Tout est automatique** à partir du frontmatter :
- Temps de lecture (calculé sur le contenu)
- Table des matières (générée depuis les `##` / `###`)
- Fil d'Ariane, articles liés, bloc FAQ
- Metadata : `title`, `meta description`, `og:image` (les 3 sont modifiables par article via `title`, `description`, `ogImage`)
- JSON-LD : `Article`, `FAQPage`, `BreadcrumbList`
- Inclusion dans le sitemap et l'index de recherche

> Composant disponible dans le corps MDX : `<Note>…</Note>` pour un encadré « bon à savoir ».

### Modifier les catégories, les auteurs ou le site

- **Catégories** (nom, intro SEO, image, accent) : `src/lib/categories.ts`
- **Auteurs** (nom, rôle, bio, avatar) : `src/lib/authors.ts`
- **Identité du site** (nom, URL, e-mail, réseaux sociaux, articles/page) : `src/lib/site.ts`

---

## Newsletter (prête pour Brevo)

Le composant `<Newsletter />` poste vers `/api/newsletter`. Par défaut il fonctionne en **mode démonstration** (inscription simulée).

Pour activer l'inscription réelle via **Brevo** (ex-Sendinblue), renseignez dans `.env.local` :

```bash
BREVO_API_KEY=xkeysib-…          # clé API Brevo v3
BREVO_LIST_ID=12                  # identifiant numérique de la liste
```

L'endpoint gère automatiquement la création de contact, la mise à jour et les doublons. Aucune autre modification de code n'est nécessaire.

Le **formulaire de contact** (`/api/contact`) valide les champs et renvoie un succès ; il suffit d'y brancher votre fournisseur d'e-mail (Brevo, Resend, SMTP…) à l'endroit indiqué par le commentaire `// TODO (production)`.

---

## SEO — ce qui est en place

- ✅ **Sitemap XML** automatique (`/sitemap.xml`) — accueil, catégories, pagination, articles, pages légales
- ✅ **robots.txt** automatique (`/robots.txt`) avec lien vers le sitemap
- ✅ **URL canoniques** sur chaque page
- ✅ **Open Graph** & **Twitter Cards** (image OG générée dynamiquement)
- ✅ **JSON-LD Schema.org** : `Organization`, `WebSite` (+ `SearchAction`), `BreadcrumbList`, `Article`, `FAQPage`, `CollectionPage`
- ✅ **Fil d'Ariane** (visuel + structuré)
- ✅ Métadonnées par article facilement éditables (`title`, `description`, `ogImage`)
- ✅ Anti-contenu dupliqué : un article n'est accessible que sous sa propre catégorie (les autres combinaisons renvoient 404)

### Performance / Core Web Vitals

- Pages **statiquement générées** (SSG)
- Polices optimisées via `next/font` (pas de FOUT, `display: swap`)
- Images `next/image` (AVIF/WebP, `lazy`, `sizes` responsives, `priority` ciblé)
- JS client minimal (≈ 102 kB partagés) ; la majorité du site est en composants serveur
- En-têtes de sécurité (`X-Content-Type-Options`, `Referrer-Policy`, etc.) dans `next.config.mjs`

Objectifs Lighthouse visés : Performance > 95, SEO 100, Best Practices > 95, Accessibilité > 95.

---

## Recherche

Recherche **locale instantanée** (sans service externe), sur titre, extrait, catégorie et tags :
- Accessible depuis le header (bouton **Rechercher**, raccourci `⌘/Ctrl + K`)
- Page dédiée `/recherche` (partageable via `?q=`)

L'index est généré côté serveur à partir des articles, puis filtré côté client (résultats immédiats).

---

## Déploiement sur Vercel

Vercel détecte automatiquement Next.js — aucune configuration spéciale requise.

### Option A — via l'interface Vercel (recommandé)

1. Poussez le projet sur un dépôt Git (GitHub, GitLab, Bitbucket).
2. Sur [vercel.com](https://vercel.com) → **Add New… → Project** → importez le dépôt.
3. Framework Preset : **Next.js** (auto-détecté). Build : `next build` (auto).
4. **Environment Variables** — ajoutez :
   - `NEXT_PUBLIC_SITE_URL` = `https://votre-domaine.fr` (sans slash final)
   - `BREVO_API_KEY` et `BREVO_LIST_ID` (si vous activez la newsletter)
5. **Deploy**. Vercel fournit une URL de production et déploie chaque push automatiquement.
6. Ajoutez votre domaine dans **Settings → Domains**.

### Option B — via la CLI

```bash
npm i -g vercel        # une seule fois
vercel                 # déploiement de prévisualisation
vercel --prod          # déploiement en production
```

Pensez à définir `NEXT_PUBLIC_SITE_URL` (sinon l'URL par défaut de `src/lib/site.ts` est utilisée pour les canonicals et le sitemap).

---

## Variables d'environnement

| Variable | Requis | Description |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Recommandé | URL absolue de production (canonicals, sitemap, OG). |
| `BREVO_API_KEY` | Optionnel | Active l'inscription newsletter réelle via Brevo. |
| `BREVO_LIST_ID` | Optionnel | Identifiant de la liste Brevo. |

Sans ces variables, le site fonctionne (la newsletter passe en mode démonstration).

---

## Notes

- Les **photographies** proviennent d'Unsplash (illustratives). Remplacez l'URL `cover` dans le frontmatter de chaque article par vos propres visuels avant une mise en production définitive.
- Les **comptes de réseaux sociaux**, l'**équipe** et certaines mentions légales sont fictifs : à compléter avec vos informations réelles (voir `src/lib/site.ts`, `src/lib/authors.ts` et les pages légales).
- `postsPerPage` (pagination) est réglé à `3` dans `src/lib/site.ts` pour démontrer la pagination ; augmentez-le selon votre volume de contenu.
