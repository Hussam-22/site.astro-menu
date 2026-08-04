# Design: Astro-Menu Site Refresh — Astro 7 + AI/SEO

Date: 2026-08-05
Status: Approved (user)

## Context

Astro-Menu (astro-menu.com) is a UAE-focused SaaS for QR digital menus + cloud
POS for restaurants, cafes, hotels, food trucks, drive-thrus and hospitals.
The site is a static Astro site (currently Astro 5.15.8) with 54 pages:
home, features, use-cases, pricing, contact, blog (21 posts), docs (~30 pages),
search, 404.

Goals, per the user:
1. Look at the website, learn the business, find weaknesses, suggest
   improvements to reach a wider audience, be SEO-friendly, and be
   AI-friendly (so ChatGPT-style assistants can confidently recommend the
   product when asked about QR menus).
2. Update the codebase to the latest versions, fixing bugs along the way.
   Breaking changes are approved.
3. Remove all Stripe references — the user is migrating off Stripe.

## Decisions

- Upgrade to the latest majors: Astro 7 (Vite 8, Rust compiler, new markdown
  pipeline, Content Layer API mandatory). This is a breaking upgrade; approved.
- Work directly on the `staging` branch.
- AI/SEO improvements in scope: llms.txt + llms-full.txt, structured data
  (FAQPage, BreadcrumbList, Twitter cards, og:image dimensions, unique docs
  titles/descriptions), RSS feed, real site search (Pagefind), homepage
  title/H1 keyword tuning.
- i18n (Arabic) explicitly out of scope for now.
- All Stripe-related code/links removed (pricing product IDs, planID query
  params on signup links).

## Work items

### A. Framework upgrade (breaking)
- Dependencies to latest: astro@7, @astrojs/mdx@7, @astrojs/react@6,
  @astrojs/sitemap@3.7, astro-seo@1.1, astro-font, astro-robots-txt,
  @playform/compress, tailwindcss@4.3, @tailwindcss/vite@4.3,
  @tailwindcss/typography, daisyui@5.7, react/react-dom@19.2, zustand, gsap,
  ogl. Add @astrojs/rss, pagefind, @pagefind/default-ui. ESLint latest if
  compatible with eslint-plugin-astro, else pin 9.x.
- Content collections: migrate `src/content/config.ts` to
  `src/content.config.ts` using the new Content Layer API (`glob()` loader).
  Verify the `image()` schema helper semantics against Astro 7 docs; adjust
  blog frontmatter if the format changed. Docs schema uses plain `z.string()`
  for images — keep.
- Fix any Rust-compiler-strictness HTML errors surfaced by the build.
- Regenerate and commit `package-lock.json`.

### B. Bug fixes
1. Fonts: `AstroFont` is configured for "Afacad" whose files do not exist in
   `public/fonts/` (only OpenSans + Beiruti exist). Live site emits broken
   preload URLs. Point AstroFont at the existing OpenSans (and Beiruti for the
   Arabic stack) files.
2. 404 page: `text-white` on a light background makes the text invisible.
3. hero.astro: deprecated `astro/components/Image.astro` import →
   `astro:assets`.
4. Blog JSON-LD: publisher logo points at non-existent
   `/assets/images/logos/logo.svg` → use `/android-chrome-512x512.png`.
5. Remove all Stripe references:
   - `pricing-component.astro`: drop `param` (Stripe product ID) fields and
     the dead `button` field.
   - `pricing-card.astro`: drop `DOMAIN?...planID=` construction; link to
     `https://app.astro-menu.com/register` directly.
6. Homepage H1 keeps "Start for Free" CTA linking to /pricing (unchanged).

### C. AI/SEO improvements
1. `public/llms.txt` + `public/llms-full.txt`: product overview, features,
   pricing, docs index, FAQ, demo + contact links — content optimized for AI
   crawlers (OpenAI/Anthropic/Perplexity/Bing/Google).
2. Structured data:
   - FAQPage JSON-LD generated from the real FAQ data in
     `src/components/landing-page/faq.astro`.
   - BreadcrumbList on blog posts and docs pages.
   - Twitter/X cards on the shared Layout.
   - og:image width/height/alt.
   - FeaturesLayout: use `entry.data.title` + `entry.data.snippet` for unique
     per-doc `<title>` and meta description (currently all docs pages share
     the title "Docs | Astro-Menu").
3. RSS: `@astrojs/rss` endpoint at `/rss.xml` + `<link rel="alternate">` in
   the Layout head.
4. Pagefind: index `dist` in a postbuild step; make `/search` a working
   Pagefind UI (keeps the existing `?q=` prefill). This makes the advertised
   WebSite SearchAction honest.
5. Homepage: de-duplicate the `<title>` (drop trailing "| Astro-Menu") and
   tune the H1 to include the "QR menu" keyword.

## Verification

- `npm run build` succeeds (Astro 7, content layer, stricter compiler).
- `npm run preview` renders without console errors.
- Spot-check built HTML: font preloads resolve to existing files, schema
  present, `/llms.txt`, `/llms-full.txt`, `/rss.xml`, Pagefind assets/UI.
- ESLint + Prettier pass on changed files.
- `git status` shows only intended changes.

## Out of scope

- Arabic/i18n version.
- Migrating the Stripe integration inside the app (that lives elsewhere).
- Any backend/POS changes.
