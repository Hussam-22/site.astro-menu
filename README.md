# Astro-Menu website

Marketing site for Astro-Menu, a digital QR menu for restaurants, cafés, coffee
trucks and hotels. Static, zero client JavaScript, deploys as plain files.

```bash
npm install     # Node >= 22.19 — see "Node version" below
npm run dev     # http://localhost:4321
npm run build   # -> dist/
```

## Stack

| | |
| --- | --- |
| Astro | 7.x — static output, Rust compiler, zero JS shipped |
| Tailwind CSS | 4.x via `@tailwindcss/vite`, configured in CSS not JS |
| daisyUI | 5.x, themed to match the brand |
| Fonts | Anton (display) + Afacad (body), self-hosted via Fontsource |

There is no `tailwind.config.cjs`. Tailwind 4 is configured entirely in
`src/styles/global.css` with `@theme`, `@plugin` and `@utility`.

### Node version

The Astro 7 / Vite 8 dependency tree pulls in `undici@8`, which declares
`node >= 22.19.0`. On an older Node the install fails the `engine-strict=true`
check in `.npmrc`. It runs correctly on 22.18 in practice, but the supported fix
is to move to Node 22.19+ or 24 LTS. To install on an older Node anyway:

```bash
npm install --engine-strict=false
```

## Design system

Everything lives in `src/styles/global.css`.

Brand colours are taken verbatim from the computed styles of the live
astro-menu.com, so the identity is unchanged:

| Token | Value | Job |
| --- | --- | --- |
| `--color-brand` | `#ff8904` | Fills: buttons, stickers, rules |
| `--color-flame` | `#ff637e` | Terminus of the primary-button gradient |
| `--color-brand-text` | `#ca3500` | The brand used **as small text** |
| `--color-ink` | `#0d0b09` | Warm near-black |
| `--color-paper` | `#fdf6ec` | The ground |

`--color-brand` and `--color-brand-text` are deliberately two tokens.
`#ff8904` measures 2.05:1 on paper, far below the WCAG AA 4.5:1 floor for body
text, so fills and display type use the exact brand orange while small orange
text uses `#ca3500` (5.2:1). Do not collapse them back into one.

Recurring utilities: `slab` / `slab-sm` / `slab-lg` (hard offset shadow),
`slab-hover`, `pin-hover`, `masonry`, `brand-gradient`, `burst`, `drift-track`.

## Content

Copy is data, not markup, so pages cannot drift apart:

- `src/config/site.ts` — URLs, contact details, and **every price**. Change
  `PLAN` and the whole site, its schema and `llms.txt` follow.
- `src/data/plan.ts` — what the subscription includes, excludes, setup steps.
- `src/data/content.ts` — pillars, testimonials, comparison table, use cases.
- `src/data/features.ts` — the `/features` page.
- `src/data/faqs.ts` — every FAQ; also the source for FAQPage schema.
- `src/content/blog/*.md` — posts.

## Images

**Product screenshots** in `src/assets/screens/` are captured from a real live
customer menu. Re-shoot them with:

```bash
node scripts/capture-menu.mjs
```

**Photography** goes in `src/assets/generated/`. `FoodImage.astro` resolves each
slot by filename stem — save `owner.webp` and the `owner` slot fills itself, no
code change. Unfilled slots render a captioned placeholder so the site is never
broken mid-shoot. See `src/assets/generated/PROMPTS.md` for the slot list and a
generation prompt for each.

Use WebP or JPG for photographs, never PNG.

**The share card** `public/opengraph.jpg` is generated, not hand-made:

```bash
node scripts/make-og.mjs
```

## SEO

Per-page title, meta description, canonical and OG tags come from `Layout.astro`.
JSON-LD is assembled per page: `Organization` and `WebSite` on every page, plus
`SoftwareApplication`, `Product`+`Offer`, `FAQPage`, `HowTo`, `BreadcrumbList`
and `BlogPosting` where they apply. `/llms.txt` is generated from the same data
for AI answer engines. `public/robots.txt` allows the major AI crawlers.

## Scripts

| Script | What it does |
| --- | --- |
| `scripts/qa.mjs` | Walks every route: console errors, broken images, heading order, overflow, meta lengths, JSON-LD validity |
| `scripts/qa-mobile.mjs` | The same at 390px, plus minimum font size |
| `scripts/capture-menu.mjs` | Re-shoots product screenshots from the live menu |
| `scripts/make-og.mjs` | Regenerates the social share card |
| `scripts/shoot.mjs` | Full-page screenshot of one route |

Run the dev server first; the QA scripts drive it.

## Before going live

- [ ] Set `CONTACT_FORM_KEY` in `src/config/site.ts` to a real Web3Forms key.
      Until then `/contact` hides the form and leads with email and WhatsApp,
      so no enquiry is silently dropped.
- [ ] Fill the photography slots listed in `src/assets/generated/PROMPTS.md`.
- [ ] Have `privacy.astro` and `terms.astro` reviewed by someone qualified —
      they are written in good faith but are not legal advice.
