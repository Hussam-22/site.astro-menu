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

### Sitemap dates

`<lastmod>` is set only where the date is provable: blog posts get theirs from
`updatedDate ?? publishDate` in the frontmatter, and the two blog indexes get
the newest post they list. Everything else ships with no `lastmod` at all.

That is deliberate. The sitemap used to stamp `new Date()` on every URL, so a
post untouched since March claimed to have changed on whatever day the site
last deployed. Google stops trusting `lastmod` across an entire site once it
catches that, which is worse than publishing no dates. A build machine has no
honest answer for the marketing pages — file mtimes are the checkout time and
the git clone may be shallow — so those stay blank.

### Redirects

`vercel.json` carries the redirect map from the site that existed before the
August 2026 rebuild. That rebuild dropped the `/docs` tree and replaced the old
blog with new slugs, which left 22 indexed URLs returning a hard 404 — including
the second and third best pages on the site by clicks. JSON cannot hold
comments, so the map is documented here.

Most entries are `permanent: true` (a 308) to the closest surviving page. **Two
are deliberately `permanent: false`** (a 307), and must stay that way:

| URL | Impressions lost | Why temporary |
| --- | --- | --- |
| `/blog/qr-menus-in-hotel-and-hospitality` | 625 | To be rewritten at this exact URL |
| `/blog/phygital-restaurant` | 273 | To be rewritten at this exact URL |

A 307 tells Google the URL is coming back, so it keeps the original indexed and
holds the ranking open. A 308 would tell it to swap in the destination page
permanently and throw the ranking away. Delete these two entries when the posts
are republished — do not "fix" them to `permanent: true`.

Three entries point at `/blog` itself (`future-of-dining`,
`reinventing-the-drive-thru`, `why-your-restaurant-needs-a-blog`). Google treats
a redirect to a hub as a soft 404 and drops the URL, which is the intended
outcome — that content is gone for good and the three of them carried 38
impressions between them. They exist so a human following an old link still
lands somewhere sensible.

## Scripts

| Script | What it does |
| --- | --- |
| `scripts/qa.mjs` | Walks every route: console errors, broken images, heading order, overflow, meta lengths, JSON-LD validity |
| `scripts/qa-mobile.mjs` | The same at 390px, plus minimum font size |
| `scripts/capture-menu.mjs` | Re-shoots product screenshots from the live menu |
| `scripts/probe-meals.mjs` | Ranks every dish on the live menu by description length and portion count, to pick the best one for the item-detail shot |
| `scripts/make-og.mjs` | Regenerates the social share card |
| `scripts/shoot.mjs` | Screenshot one route: `<path> [name] [width] [full\|top\|bottom]` |

Run the dev server first; the QA scripts drive it.

## Before going live

- [ ] Set `CONTACT_FORM_KEY` in `src/config/site.ts` to a real Web3Forms key.
      Until then `/contact` hides the form and leads with email and WhatsApp,
      so no enquiry is silently dropped.
- [ ] Fill the photography slots listed in `src/assets/generated/PROMPTS.md`.
- [ ] Have `privacy.astro` and `terms.astro` reviewed by someone qualified —
      they are written in good faith but are not legal advice.
