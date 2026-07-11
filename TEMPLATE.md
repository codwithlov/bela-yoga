# CMS/LDP Template Guide

This repository is structured as a reusable CMS/LDP starter. For a new site, start by changing the template layer first, then seed CMS data.

## 1. Main template files

- `config/template/site.ts`
  - brand name, legal name, tagline, SEO defaults
  - logo/favicon paths
  - contact/social links
  - default header/footer menus
  - home page copy
  - feature flags for optional widgets
- `config/template/theme.ts`
  - font stack
  - core brand colors used by Ant Design
  - layout/radius defaults
- `styles/globals.scss`
  - CSS variables for runtime theme colors
  - layout width variable
  - shared brand gradient utilities
- `tailwind.config.ts`
  - Tailwind `sgt` palette mapped to CSS variables

## 2. Recommended new-site init flow

1. Replace logo assets in `public/assets/images/logo/` or update `templateSiteConfig.assets`.
2. Update brand/contact/social/SEO in `config/template/site.ts`.
3. Update colors in both:
   - `config/template/theme.ts` for Ant Design tokens
   - `styles/globals.scss` `--template-*` variables for Tailwind/CSS runtime theme
4. Seed or edit CMS data:
   - header/footer/account menus
   - products/store items
   - posts/post types
   - home sections
   - dynamic pages
5. Keep new public pages CMS/menu-driven when possible instead of creating fixed route folders.

## 3. Template conventions

- Static public routes should stay minimal:
  - home
  - products
  - product detail
  - posts
  - post detail
  - about
  - search/tags when needed
- Business-specific UI should use neutral naming:
  - `Listing*` for cards/carousels/search listing UI
  - `Market*` for market/category/entity grouping
  - avoid domain names like tour/sport in reusable guest components unless it is an admin legacy module
- Optional widgets should be gated through `templateSiteConfig.features`.

## 4. Validation

Run:

```bash
./node_modules/.bin/tsc --noEmit --pretty false
npm run build
```

If old `.next` validator files reference deleted routes, remove `.next` before validating.
