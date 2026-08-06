# Design: Refocus astro-menu.com to QR Menu View Only — Single "Menu" Plan

Date: 2026-08-06
Status: Approved by user

## Problem

The marketing site currently positions Astro-Menu as a QR digital menu **and cloud POS** platform. It sells three plans whose differentiators are ordering + operations features: self-order, cloud POS, waitstaff/kitchen dashboards, drive-thru, analytics. The product direction has changed: Astro-Menu is now strictly a **QR menu viewing** product (browse items, prices, images, languages, wifi password, social links — no ordering, no back-office dashboards). The site must be refocused to match, with a single renamed plan and the docs section removed.

## New positioning

Astro-Menu is a QR digital menu — customers scan and browse the menu in their own language: items, prices, photos, labels, wifi password, and social links. No app, no ordering, no POS. One simple plan.

## Decisions (confirmed with user)

- Menu view = **browsing only**. No cart, no order placement, no call-waiter.
- Single plan name: **"Menu"**.
- Single plan keeps the old Essential feature set: 1 QR code, 1 translation language, unlimited meals/menus/scans (fair usage), social media links, 1 branch.
- Pricing: **59 AED/month** or **468 AED/year** (39 AED/mo billed annually, "2 months free" label).
- Delete 4 blog posts whose topic is a removed feature.
- Keep the Use Cases page, rewritten for menu-view-only messaging.

## What to remove

### Docs (entire section)
- `src/pages/docs/**` — all 10 route files (`[slug].astro` + branches, dashboards, meal-labels, meals, menus, orders-search, qr-menu, waitstaff, welcome).
- `src/content/docs/**` — 27 MDX/MD files.
- `src/layouts/FeaturesLayout.astro`.
- `src/ui/feature-link.astro` (docs-only usage; blog imports are unused).
- `src/ui/open-features-list-button.astro` (imported only by FeaturesLayout).
- `docs` collection from `src/content.config.ts`.
- `src/assets/docs/**` images.
- Navbar "Docs" link (`src/components/navbar/navbar.astro`).
- Search page "documentation" wording (`src/pages/search.astro`).
- llms.txt / llms-full.txt docs sections.

### Feature components / copy selling removed features
- `src/components/features/pos.astro` — whole Cloud PoS section.
- `src/components/features/drive-thru.astro` — whole section.
- `src/components/features/social-food-business.astro` — dead code (never imported).
- `src/components/features/menu-features.astro` — "Call Waiter" tile + its mockup image (`call-waiter-menu-view.png`).
- `src/components/features/all-features.astro` — strip: self-order, call waiter, pos/waitstaff dashboard, kitchen dashboard, admin/cms dashboard, analytics, most ordered, email receipt, print receipt, real-time updates.
- `src/components/features/why-to-switch.astro` — rewrite/trim "Increase table turnover" (ordering claim) and "Get useful insights" (analytics claim).
- `src/content/features.js` — remove self-order, waiter/kitchen dashboard, analytics entries (verify usage first).
- `src/components/landing-page/hero.astro` — remove Waitstaff Dashboard tablet mockup (`waitstaff-dashboard.png`), refocus H1.
- Orphaned assets introduced by the above removals (verify via grep before deleting): `assets/views/waitstaff-dashboard.png`, `assets/images/features/drive-thru-*.png`, `assets/images/mockups/call-waiter-menu-view.png`, icons referenced only by removed sections.

### Blog
- Delete: `guide-to-implementing-qr-menu-and-cloud-pos.mdx`, `the-benefits-of-a-cloud-pos-system-for-restaurants.mdx`, `reinventing-the-drive-thru.mdx`, `how-astro-menu-revolutionizes-the-qr-menu-world.mdx`.

## What to rewrite

### Pricing
- `src/components/pricing/pricing-component.astro` — replace the 3-plan array with a single **"Menu"** plan:
  - 59 AED/month, 468 AED/year.
  - Features: 1 QR Code (menu viewing only), 1 Translation Language, Unlimited Meals, Unlimited Menus, Unlimited Scans (Fair Usage Policy), Social Media Links, 1 Branch.
  - Remove the "Need a tailored plan for your hotel, hospital, or franchise?" banner.
- `src/components/pricing/plan-switcher.jsx` — update the yearly label. It currently says "Yearly (2 months free)", but at the new prices (59 vs 39) the annual saving is 240 AED (~4 months at the monthly rate), so "2 months free" is wrong. Replace with "Yearly" plus an accurate savings note (e.g., "Yearly — save 240 AED" or "Yearly (Save ~34%)").
- `src/components/pricing/plan-price.jsx` — keep as-is (already handles monthly/yearly).
- `src/pages/pricing.astro` — description without "cloud POS".

### Home / landing
- `src/pages/index.astro` — title → "QR Digital Menu for Restaurants"; description; SoftwareApplication JSON-LD description drops "cloud POS"; offer price → 59 AED. FAQPage schema auto-updates from `faqs.js`.
- `src/components/landing-page/hero.astro` — H1 refocus from "Rooms, Trucks, Tables, and More" to menu-view messaging; remove Waitstaff Dashboard mockup; keep phone menu mockup; CTA unchanged.
- `src/components/landing-page/why-astro-menu.astro` — replace "Cloud POS Included" card with a menu-view benefit (e.g., "Multi-Language" / "No app download"); update section description; the remaining cards "No Commissions" and "Instant QR Menus" stay.

### Features page
- `src/pages/features.astro` — drop Pos and DriveThru imports; section order: MenuFeatures → AllFeatures → LetsGoOverNumbers → Concept → WhyToSwitch; update meta description.

### Use Cases
- `src/components/use-cases/use-cases-sections.astro` — rewrite all four sections (restaurant & cafes, food truck, hotel, hospital) for menu-browsing-only messaging. Remove: "send orders straight to the kitchen", drive-thru lanes, dual-lane syncing, offline-tolerant ordering, self-order, cloud POS references. Emphasize: browse menu, photos, filters, languages, wifi password, social links, always up-to-date menu.
- `src/components/use-cases/hero.astro` — description without "drive-thrus".
- `src/pages/use-cases.astro` — description update.

### FAQ
- `src/data/faqs.js` — replace "Does Astro-Menu integrate with PoS systems?" and "What is self-order?" with menu-view Q&As (e.g., "Can customers place orders from the menu?" → No, ordering and payments are handled by the business; customers browse the menu). Keep trial/cancel/install/branches/payment Q&As (adjust wording if needed).
- `src/components/landing-page/faq.astro` — no structural change (renders from `faqs.js`).

### Page SEO copy (drop "cloud POS")
- `src/layouts/Layout.astro` default description.
- `src/pages/contact.astro` description.
- `src/pages/blog.astro` description.
- `src/pages/rss.xml.js` description.
- `src/pages/search.astro` copy ("documentation" wording).

### AI assets
- `public/llms.txt` and `public/llms-full.txt` — full rewrite: menu-view-only product, single Menu plan pricing, no docs section, no cloud POS/drive-thru/ordering claims.

### Blog post cleanup (build safety)
- Remove unused `import FeatureLink from "@ui/feature-link.astro";` from the 4 surviving posts that still import it:
  - `why-forcing-customers-to-pay-through-qr-menus-can-backfire.mdx`
  - `how-qr-menus-benefit-social-media-food-businesses.mdx`
  - `the-importance-of-tagging-meals-to-enhance-dining-efficiency-and-boost-sales.mdx`
  - `the-importance-of-an-easy-to-use-qr-menu-design-how-astro-menu-stands-out.mdx`

## What stays

- Home page sections: AstroMenuVsOtherMenus, Testimonials, landing Use Cases component (reframed copy where needed).
- Navbar (minus Docs), footer, logo.
- Search page (minus "docs" wording), Pagefind config.
- Contact form.
- Blog framework + remaining 15 posts.
- Fonts, GA tag, robots/sitemap, favicons, opengraph.
- `plan-switcher.jsx`, `plan-price.jsx`, `global-store.js`.

## Out of scope

- The product itself (`app.astro-menu.com`) and `menu.astro-menu.com` demo links — not part of this site repo.
- Payment/checkout logic.
- Non-English localization of the site itself.

## Verification

1. `npm run build` succeeds; page count drops below 54; no `/docs/*` routes generated.
2. Preview server smoke test: all top-level routes return 200; `/docs/welcome/introduction` and other docs routes 404.
3. Grep for `cloud POS|drive-thru|kitchen dashboard|waitstaff|self-order|call waiter` across `src/` and `public/` — remaining hits only in allowed content (e.g., surviving blog posts using the words in passing, "kitchen" as a venue word).
4. Pagefind reindexes; `/search` still works.
5. `/rss.xml` has 15 items.
6. `npm run lint` / prettier: only the pre-existing repo-wide issues remain (eslint `[slug].astro` parse + `interface` in ui/*.astro; prettier on pre-existing files). No NEW lint errors introduced.
7. Commit to `staging`.
