# QR Menu View-Only Refocus Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refocus the astro-menu.com marketing site so Astro-Menu is presented strictly as a QR digital menu (browse-only) with a single "Menu" plan at 59 AED/month (468 AED/year), removing all ordering/POS/kitchen/drive-thru features and the entire docs section.

**Architecture:** Astro 7 static site. Changes are content-driven: delete feature components/docs, rewrite marketing copy and structured data (JSON-LD, llms.txt), and collapse the 3-plan pricing array into one. No runtime logic changes beyond a plan-switcher label.

**Tech Stack:** Astro 7.1.6, Tailwind CSS 4 + daisyUI 5, React 19 (plan-switcher, plan-price), Pagefind, astro-seo, astro-content collections.

## Global Constraints

- Build command: `npm run build` (runs `astro build` then `pagefind --site dist`). Must succeed after every task.
- There is NO unit test framework in this repo. Verification = build success + grep audits + preview smoke test. `rg` is NOT installed on this machine — use PowerShell `Get-ChildItem -Recurse | Select-String` or the grep tool.
- Copy rule: the site must never claim ordering, cloud POS, self-order, waitstaff/kitchen dashboards, drive-thru, or analytics as Astro-Menu features. "Kitchen" as a venue word (a chef cooking) is allowed; "kitchen dashboard/kitchen management" is not.
- All pricing in AED. New plan: monthly **59 AED**, yearly **468 AED/year** (39 AED/mo billed annually). Toggle label "2 months free" is WRONG at these prices — never use it.
- Work happens on branch `staging`. Commit after every task. Do not commit unrelated files.
- Pre-existing, non-blocking lint noise (eslint parse errors on `[slug].astro` + `interface` in `src/ui/*.astro`; repo-wide prettier drift) must not get worse.

---

### Task 1: Blog post cleanup

**Files:**
- Delete: `src/content/blog/guide-to-implementing-qr-menu-and-cloud-pos.mdx`
- Delete: `src/content/blog/the-benefits-of-a-cloud-pos-system-for-restaurants.mdx`
- Delete: `src/content/blog/reinventing-the-drive-thru.mdx`
- Delete: `src/content/blog/how-astro-menu-revolutionizes-the-qr-menu-world.mdx`
- Modify: `src/content/blog/why-forcing-customers-to-pay-through-qr-menus-can-backfire.mdx:24`
- Modify: `src/content/blog/how-qr-menus-benefit-social-media-food-businesses.mdx:16`
- Modify: `src/content/blog/the-importance-of-tagging-meals-to-enhance-dining-efficiency-and-boost-sales.mdx:20`
- Modify: `src/content/blog/the-importance-of-an-easy-to-use-qr-menu-design-how-astro-menu-stands-out.mdx:20`

**Interfaces:**
- Consumes: nothing.
- Produces: no remaining blog file imports `@ui/feature-link.astro` (prerequisite for Task 2 which deletes it). Blog count drops from 19 to 15.

- [ ] **Step 1: Delete the 4 feature-specific posts**

Run:
```powershell
Remove-Item -LiteralPath @(
  "src\content\blog\guide-to-implementing-qr-menu-and-cloud-pos.mdx",
  "src\content\blog\the-benefits-of-a-cloud-pos-system-for-restaurants.mdx",
  "src\content\blog\reinventing-the-drive-thru.mdx",
  "src\content\blog\how-astro-menu-revolutionizes-the-qr-menu-world.mdx"
)
```

- [ ] **Step 2: Remove the unused FeatureLink import from the 4 surviving posts**

In each of the 4 files listed under Modify above, delete the exact line:
```
import FeatureLink from "@ui/feature-link.astro";
```
These imports are unused (grep confirms no `<FeatureLink` usage in any blog post). Use the edit tool per file.

- [ ] **Step 3: Verify**

Run:
```powershell
Get-ChildItem "src\content\blog\*.mdx" | Select-String -Pattern "feature-link" | Select-Object -ExpandProperty Line
```
Expected: no output.
Run: `npm run build`
Expected: build succeeds; page count is 15 blog posts fewer than the full 19 (final number verified at end).

- [ ] **Step 4: Commit**

```bash
git add -A src/content/blog
git commit -m "Remove blog posts about cloud POS and drive-thru features"
```

---

### Task 2: Remove the entire docs section

**Files:**
- Delete: `src/pages/docs/` (entire directory — 10 route files: `[slug].astro`, `branches/[slug].astro`, `dashboards/[slug].astro`, `meal-labels/[slug].astro`, `meals/[slug].astro`, `menus/[slug].astro`, `orders-search/[slug].astro`, `qr-menu/[slug].astro`, `waitstaff/[slug].astro`, `welcome/[slug].astro`)
- Delete: `src/content/docs/` (entire directory — 27 MDX/MD files)
- Delete: `src/assets/docs/` (entire directory — images)
- Delete: `src/layouts/FeaturesLayout.astro`
- Delete: `src/ui/feature-link.astro`
- Delete: `src/ui/open-features-list-button.astro`
- Modify: `src/content.config.ts` — remove the `docsCollection` definition and the `docs` key from `collections`
- Modify: `src/components/navbar/navbar.astro` — remove the Docs menu item

**Interfaces:**
- Consumes: Task 1 removed all blog imports of `feature-link.astro`.
- Produces: no `/docs/*` routes exist; `src/content/` contains only `blog/` and `features.js` (features.js removed in Task 5).

- [ ] **Step 1: Delete the docs directories and docs-only components**

Run:
```powershell
Remove-Item -LiteralPath "src\pages\docs" -Recurse -Force
Remove-Item -LiteralPath "src\content\docs" -Recurse -Force
Remove-Item -LiteralPath "src\assets\docs" -Recurse -Force
Remove-Item -LiteralPath "src\layouts\FeaturesLayout.astro"
Remove-Item -LiteralPath "src\ui\feature-link.astro"
Remove-Item -LiteralPath "src\ui\open-features-list-button.astro"
```

- [ ] **Step 2: Remove the docs collection from `src/content.config.ts`**

Delete the `docsCollection` block (lines 25-43) and change the export (lines 45-49) to:
```ts
// 3. Export a single `collections` object to register your collection(s)
//    This key should match your collection directory name in "src/content"
export const collections = {
	blog: blogCollection,
};
```

- [ ] **Step 3: Remove the Docs nav item from `src/components/navbar/navbar.astro`**

Delete this object from the `menuitems` array (lines 28-31):
```js
  {
    title: "Docs",
    path: "/docs/welcome/introduction",
  },
```

- [ ] **Step 4: Verify**

Run:
```powershell
Get-ChildItem "src" -Recurse -File | Select-String -Pattern "FeaturesLayout|feature-link|open-features-list-button|/docs/" | Select-Object -ExpandProperty Line
```
Expected: no output.
Run: `npm run build`
Expected: build succeeds; no `dist/docs` directory is created.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Remove documentation section and docs-only components"
```

---

### Task 3: Refocus homepage (index, hero, why-astro-menu)

**Files:**
- Modify: `src/pages/index.astro` (title, description, SoftwareApplication JSON-LD)
- Modify: `src/components/landing-page/hero.astro`
- Modify: `src/components/landing-page/why-astro-menu.astro`

**Interfaces:**
- Consumes: nothing.
- Produces: new marketing copy + structured data that later tasks' SEO copy mirrors. `why-astro-menu.astro` no longer imports `pos.svg` (Task 9 deletes it).

- [ ] **Step 1: Update `src/pages/index.astro`**

Replace the `softwareApplicationSchema` description (line 19-20) and offer price (lines 27-31):
```js
  description:
    "QR digital menu for restaurants and cafes, including multi-language menus, meal filters, wifi password, and social links.",
```
```js
  offers: {
    "@type": "Offer",
    price: "59",
    priceCurrency: "AED",
  },
```

Replace the `<Layout>` props (lines 48-51):
```astro
<Layout
  title="QR Digital Menu for Restaurants"
  description="Astro-Menu is a QR digital menu for restaurants, cafes, and food brands — customers browse items, prices, and photos in any language, no app download required."
>
```

- [ ] **Step 2: Refocus `src/components/landing-page/hero.astro`**

Replace the imports (lines 4-9): remove `TabletMockup` import and the `waitStaffDashboard` asset import, and remove `import { Image } from "astro:assets";` if now unused (it is — keep only imports actually referenced; the background Image is the only Image usage, so keep the `Image` import).

Replace the H1 (lines 23-28):
```astro
      <h1 class="text-6xl font-extrabold">
        QR Menus for <span
          class="bg-linear-to-r from-purple-500 via-red-500 to-orange-500 bg-clip-text text-transparent"
          >Every Table,</span
        > Truck, and Room.
      </h1>
```

Replace the H2 (lines 30-33):
```astro
      <h2 class="mb-4 text-xl">
        Astro-Menu is a QR digital menu your customers can browse in their own
        language — no app, no ordering, no commissions.
      </h2>
```

Replace the mockup block (lines 40-52):
```astro
    <div class="flex flex-col items-center relative">
      <PhoneMockup
        imgSrc={astroMenuPhone}
        text="Menu View"
        isEager={true}
      />
    </div>
```

- [ ] **Step 3: Refocus `src/components/landing-page/why-astro-menu.astro`**

Replace imports (lines 6-8): drop `import POS from "../../assets/icons/pos.svg";` and add:
```astro
import Translate from "../../assets/icons/translate.svg";
```

Replace the `features` array (lines 10-29):
```js
const features = [
  {
    title: "No Commissions",
    description: `Flat monthly fee, keep your profits`,
    bgColor: "bg-purple-400",
    icon: Commissions,
  },
  {
    title: "Multi-Language",
    description: `Auto-translate your menu for every guest`,
    bgColor: "bg-orange-400",
    icon: Translate,
  },
  {
    title: "Instant QR Menus",
    description: "No app downloads, just scan & browse",
    bgColor: "bg-sky-400",
    icon: QRCode,
  },
];
```

Replace the `<SectionHead>` description (line 36):
```astro
    description="Make your menu effortless to browse. Astro-Menu is a simple QR digital menu that helps you serve customers faster, cut costs, and grow your business — without paying commissions."
```

- [ ] **Step 4: Verify**

Run:
```powershell
Get-ChildItem "src\pages", "src\components\landing-page" -Recurse -File | Select-String -Pattern "Cloud POS|cloud POS|waitStaffDashboard|waitstaff-dashboard" | Select-Object -ExpandProperty Line
```
Expected: no output.
Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Refocus homepage copy to QR menu view-only positioning"
```

---

### Task 4: Single "Menu" plan pricing

**Files:**
- Modify: `src/components/pricing/pricing-component.astro`
- Modify: `src/components/pricing/plan-switcher.jsx`
- Modify: `src/pages/pricing.astro`

**Interfaces:**
- Consumes: nothing.
- Produces: `pricing` array with exactly one plan named `"Menu"` with `price: "59 AED"` and `yearlyPlan: "468 AED"`. `plan-price.jsx` and `pricing-card.astro` are unchanged.

- [ ] **Step 1: Replace the plan array in `src/components/pricing/pricing-component.astro`**

Replace lines 8-74 (`const pricing = [...]`) with:
```js
const pricing = [
  {
    name: "Menu",
    price: "59 AED",
    yearlyPlan: "468 AED",
    popular: false,
    features: [
      `1 QR Code (menu viewing only)`,
      "1 Translation Language",
      "Unlimited Meals",
      "Unlimited Menus",
      "Unlimited Scans (Fair Usage Policy)",
      "Social Media Links",
      "1 Branch",
    ],
    icon: "coffeecup",
    description:
      "Perfect for businesses that want to show their menu digitally.",
  },
];
```

- [ ] **Step 2: Center the single card**

Replace the grid wrapper (line 87):
```astro
  <div class="mx-auto grid max-w-md gap-5">
    {pricing.map((item, index) => <PricingCard plan={item} index={index} />)}
  </div>
```

- [ ] **Step 3: Remove the tailored-plan banner**

Delete lines 96-105 (the `div` starting with `class="bg-black p-8 text-center text-white mt-8 rounded-4xl flex flex-col sm:flex-row items-center gap-4"` containing "Need a tailored plan for your hotel, hospital, or franchise?" and its Contact link).

- [ ] **Step 4: Fix the plan-switcher yearly label in `src/components/pricing/plan-switcher.jsx`**

Replace line 22:
```jsx
        Yearly (Save 240 AED)
      </span>
```

- [ ] **Step 5: Update `src/pages/pricing.astro` description**

Replace line 9:
```astro
  description="Simple pricing for Astro-Menu’s QR digital menu. One plan, no hidden fees."
```

- [ ] **Step 6: Verify**

Run:
```powershell
Get-Content "src\components\pricing\pricing-component.astro" | Select-String -Pattern "Essential|Advanced|Premium|Drive-Thru|Self-Order|Cloud POS|Analytics"
```
Expected: no output.
Run: `npm run build`
Expected: build succeeds. Open `dist/pricing/index.html` and confirm it shows one "Menu" card with 59 AED / 468 AED and no 3-card grid.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "Collapse pricing to single Menu plan at 59 AED/month"
```

---

### Task 5: Refocus the features page

**Files:**
- Modify: `src/pages/features.astro`
- Delete: `src/components/features/pos.astro`
- Delete: `src/components/features/drive-thru.astro`
- Delete: `src/components/features/social-food-business.astro` (dead code, never imported)
- Delete: `src/content/features.js` (dead code — no imports found)
- Modify: `src/components/features/menu-features.astro`
- Modify: `src/components/features/all-features.astro`
- Modify: `src/components/features/why-to-switch.astro`

**Interfaces:**
- Consumes: nothing.
- Produces: features page composed of MenuFeatures → AllFeatures → LetsGoOverNumbers → Concept → WhyToSwitch. `pos.svg` icon no longer imported anywhere (Task 9 cleanup).

- [ ] **Step 1: Delete removed feature components and dead data**

Run:
```powershell
Remove-Item -LiteralPath @(
  "src\components\features\pos.astro",
  "src\components\features\drive-thru.astro",
  "src\components\features\social-food-business.astro",
  "src\content\features.js"
)
```

- [ ] **Step 2: Rewrite `src/pages/features.astro`**

Replace the entire file with:
```astro
---
import AllFeatures from "@components/features/all-features.astro";
import Concept from "@components/features/concept.astro";
import LetsGoOverNumbers from "@components/features/lets-go-over-numbers.astro";
import MenuFeatures from "@components/features/menu-features.astro";
import WhyToSwitch from "@components/features/why-to-switch.astro";
import Layout from "@layouts/Layout.astro";
---

<Layout
  title="Astro-Menu Features"
  description="Explore Astro-Menu features: QR digital menus, multi-language support, meal filters, meal labels, wifi password, and social links for restaurants and cafes."
>
  <div class="flex flex-col gap-32 sm:gap-56">
    <MenuFeatures />
    <AllFeatures />
    <LetsGoOverNumbers />
    <Concept />
    <WhyToSwitch />
  </div>
</Layout>
```

- [ ] **Step 3: Remove the "Call Waiter" tile from `src/components/features/menu-features.astro`**

Delete the `callWaiterMobileView` import (line 2):
```astro
import callWaiterMobileView from "@assets/images/mockups/call-waiter-menu-view.png";
```
Delete the entire "Call Waiter" div block (lines 42-61, the `<!-- Call Waiter -->` comment through its closing `</div>`).
Change the Menu Filter tile so it fills the freed column: on line 66, change `class="rounded-4xl relative overflow-hidden h-96 w-full sm:col-span-2 bg-base-300 py-2 px-3 sm:px-6"` to `class="rounded-4xl relative overflow-hidden h-96 w-full sm:col-span-3 bg-base-300 py-2 px-3 sm:px-6"`.

- [ ] **Step 4: Strip removed features from `src/components/features/all-features.astro`**

Replace the `FEATURES` array (lines 4-33) with:
```js
const FEATURES = [
  "dynamic QR menu",
  "multiple languages",
  "auto translation",
  "meal filters",
  "meal labels",
  "modern design",
  "responsive design",
  "minimum clicks design",
  "wifi password",
  "social links",
  "google review",
  "home page",
  "multi currency",
  "no app download",
  "cloud solution",
  "no physical lock-down",
  "affordable",
  "easy to use",
  "no maintenance",
];
```
Leave the rest of the component (scrollers) untouched — the `slice(0, 14)` / `slice(14)` logic still works.

- [ ] **Step 5: Rewrite 3 entries in `src/components/features/why-to-switch.astro`**

In the `REASONS` array, replace these three entries:

Replace "Increase table turnover" (lines 22-28):
```js
  {
    title: "Real-time updates",
    description:
      "Update prices, specials, and sold-out items instantly — no reprinting.",
    icon: "easy-update",
  },
```

Replace "No more waiting for the waiter" (lines 29-33):
```js
  {
    title: "Browse at your own pace",
    description:
      "No waiting for a printed menu — guests read everything on their own phones.",
    icon: "no-waiting",
  },
```

Replace "Get useful insights" (lines 45-49):
```js
  {
    title: "No ordering pressure",
    description:
      "Guests explore your menu without pressure to order — no upsells, no checkout.",
    icon: "eye-eats-first",
  },
```
(All icon filenames already exist in `public/assets/icons/why-to-switch/`.)

- [ ] **Step 6: Verify**

Run:
```powershell
Get-ChildItem "src\components\features", "src\content" -Recurse -File | Select-String -Pattern "self-order|call waiter|kitchen dashboard|waiter\(ess\)|cloud PoS|Cloud PoS|pos\.svg" | Select-Object -ExpandProperty Line
```
Expected: no output.
Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "Refocus features page to QR menu viewing features"
```

---

### Task 6: Rewrite the use-cases page

**Files:**
- Modify: `src/components/use-cases/use-cases-sections.astro`
- Modify: `src/components/use-cases/hero.astro`
- Modify: `src/pages/use-cases.astro`

**Interfaces:**
- Consumes: `UseCaseSection` (unchanged) and `FeatureCard` (unchanged).
- Produces: four sections with menu-browsing-only copy, no drive-thru/ordering claims.

- [ ] **Step 1: Rewrite all four sections in `src/components/use-cases/use-cases-sections.astro`**

Keep the imports (the four images and the icons stay) EXCEPT remove these two now-unused icon imports:
```astro
import staffOverhead from "@assets/icons/staff-overhead.svg";
import tableTurnOver from "@assets/icons/tables-turnover.svg";
```
(`guestExperience`, `nursingOverhead`, `patientExperience`, `roomService`, `streamlineOperation`, `waitTime` remain used.) Replace the four `<UseCaseSection ...>` blocks (lines 24-135) with:

```astro
<!-- Restaurants & Cafes -->
<UseCaseSection
  bgColor="bg-gradient-to-br from-teal-400 to-sky-400"
  title="an up-to-date menu guests can browse instantly"
  description="Astro-Menu is a QR digital menu for restaurants and cafes. Customers scan a QR code on their table and browse your full menu — items, prices, photos, and dietary labels — in their own language. No app download, no ordering, no commission. Update your menu in real time, share your QR code on social media, show your wifi password, and keep your menu fresh, accurate, and easy to read. Simple for guests, effortless for you."
  leftImage={restaurant}
  leftImageAlt="Restaurant & Cafe"
  rightImage={astro1}
  rightImageAlt="Restaurant & Cafe"
  rightTitle="Restaurant & Cafe"
>
  <div
    slot="features"
    class="flex flex-col md:flex-row justify-between gap-4 items-center"
  >
    <FeatureCard
      title="Browse in Any Language"
      description="Guests read your menu in their preferred language."
      icon={guestExperience}
    />
    <FeatureCard
      title="Always Up-to-Date"
      description="Update prices and specials instantly, no reprinting."
      icon={streamlineOperation}
    />
  </div>
</UseCaseSection>

<!-- Food Trucks -->
<UseCaseSection
  bgColor="bg-gradient-to-br from-red-400 to-orange-400"
  title="daily specials and menus that change with you"
  description="Astro-Menu brings QR menus to food trucks and mobile food businesses. Customers scan a QR code on the truck to browse today's menu — items, prices, photos, and sold-out badges — without crowding the window or asking staff to repeat the specials. Update your menu in real time as items sell out, mark daily specials, and share your QR code on social media so customers can browse your menu anywhere. No drive-thru equipment, no ordering hardware, no app."
  leftImage={foodTruck}
  leftImageAlt="Food Truck"
  rightImage={astro2}
  rightImageAlt="Food Truck"
  rightTitle="Food Truck"
>
  <div
    slot="features"
    class="flex flex-col md:flex-row justify-between gap-4 items-center"
  >
    <FeatureCard
      title="Real-Time Updates"
      description="Mark sold-out items and specials the moment they change."
      icon={waitTime}
    />
    <FeatureCard
      title="Browse on the Go"
      description="Customers check the menu from the queue or from home."
      icon={streamlineOperation}
    />
  </div>
</UseCaseSection>

<!-- Hotel -->
<UseCaseSection
  bgColor="bg-gradient-to-br from-emerald-400 to-yellow-400"
  title="in-room dining without paper menus"
  description="Astro-Menu brings QR-powered menus to hotel rooms. Guests scan a QR code on the table or welcome card and browse the current menu — items, prices, photos, and allergen labels — in their preferred language. No phone calls to ask what's on the menu, no outdated paper menus, and no app to install. Multi-language menus keep international guests comfortable, and real-time updates keep room service information accurate."
  leftImage={hotel}
  leftImageAlt="Hotel Room"
  rightImage={astro3}
  rightImageAlt="Hotel Room"
  rightTitle="Hotel Room"
>
  <div
    slot="features"
    class="flex flex-col md:flex-row justify-between gap-4 items-center"
  >
    <FeatureCard
      title="Multi-Language Menus"
      description="International guests browse comfortably in their own language."
      icon={guestExperience}
    />
    <FeatureCard
      title="No Paper Menus"
      description="Always current menus, nothing to print or reprint."
      icon={roomService}
    />
  </div>
</UseCaseSection>

<!-- Hospital -->
<UseCaseSection
  bgColor="bg-gradient-to-br from-violet-400 to-rose-400"
  title="clear, accessible meal options for patients"
  description="Astro-Menu lets hospitals present meal options digitally. Patients and families scan a QR code at the bedside to browse the day's menu — with clear labels for diabetic, low-sodium, halal, and other diets — in their own language. Clear photos and descriptions reduce confusion, sold-out badges set accurate expectations, and multi-language support makes menus accessible to everyone. No stacks of paper menus to print, update, or reprint."
  leftImage={hospital}
  leftImageAlt="Hospital"
  rightImage={astro4}
  rightImageAlt="Hospital"
  rightTitle="Hospitals"
>
  <div
    slot="features"
    class="flex flex-col md:flex-row justify-between gap-4 items-center"
  >
    <FeatureCard
      title="Clear Diet Labels"
      description="Diabetic, low-sodium, halal, and other labels at a glance."
      icon={patientExperience}
    />
    <FeatureCard
      title="Multi-Language Access"
      description="Menus in each patient's preferred language."
      icon={nursingOverhead}
    />
  </div>
</UseCaseSection>
```

- [ ] **Step 2: Update `src/components/use-cases/hero.astro`**

Replace line 8:
```astro
  description="Discover how Astro-Menu helps restaurants, cafes, food trucks, hotels, and hospitals present a QR menu guests can browse in any language"
```

- [ ] **Step 3: Update `src/pages/use-cases.astro`**

Replace line 10:
```astro
  description="See how Astro-Menu helps restaurants, cafes, hotels, food trucks, and social food brands present a QR digital menu customers love to browse."
```

- [ ] **Step 4: Verify**

Run:
```powershell
Get-ChildItem "src\components\use-cases", "src\pages\use-cases.astro" -Recurse -File | Select-String -Pattern "drive-thru|Drive-Thru|self-order|send orders|send.*kitchen|kitchen team|offline-tolerant|cloud PoS|POS" | Select-Object -ExpandProperty Line
```
Expected: no output.
Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Rewrite use-cases page for QR menu viewing only"
```

---

### Task 7: FAQ data and page SEO copy

**Files:**
- Modify: `src/data/faqs.js`
- Modify: `src/layouts/Layout.astro` (DEFAULT_DESC)
- Modify: `src/pages/contact.astro`
- Modify: `src/pages/blog.astro`
- Modify: `src/pages/rss.xml.js`
- Modify: `src/pages/search.astro`

**Interfaces:**
- Consumes: nothing.
- Produces: consistent menu-view-only descriptions; FAQPage schema on the homepage updates automatically from `faqs.js`.

- [ ] **Step 1: Update `src/data/faqs.js`**

Replace the "Does Astro-Menu integrates with PoS systems?" entry (lines 13-16) with:
```js
  {
    question: "Does Astro-Menu include ordering or a POS?",
    answer:
      "No. Astro-Menu is a QR digital menu for viewing only. Customers scan the QR code to browse your menu, check prices and photos, and view translations. Ordering, payments, and your point of sale are handled by you — Astro-Menu takes no commission on your orders.",
  },
```

Replace the "What is self-order?" entry (lines 18-21) with:
```js
  {
    question: "Can customers place orders from the menu?",
    answer:
      "No. Astro-Menu is a menu-viewing product. Customers browse your menu in their preferred language, but ordering and payments happen through your own process. This keeps things simple and lets you handle payments the way you prefer.",
  },
```

Update the "Can customers pay directly from the menu?" answer (lines 23-26) to:
```js
    answer:
      "No, Astro-Menu is a QR Menu that lets customers view your menu. Payments are managed by you.",
```

Append a new entry after the software-install Q&A (after line 35, before the closing `];`):
```js
  {
    question: "How many QR codes do I get with the Menu plan?",
    answer:
      "One QR code per branch (menu viewing only). If you need more branches or QR codes, contact our sales team at hello@astro-menu.com.",
  },
```

- [ ] **Step 2: Update `src/layouts/Layout.astro` DEFAULT_DESC**

Replace line 13:
```astro
  "Empower your food business with Astro-Menu's QR digital menu. Customers scan and browse your menu in their own language — no app, no ordering, no commissions.";
```

- [ ] **Step 3: Update page descriptions**

`src/pages/contact.astro` line 10:
```astro
  description="Contact the Astro-Menu team to request a demo or ask about QR digital menus."
```

`src/pages/blog.astro` line 21:
```astro
  description="Insights on QR menus and digital transformation for food businesses."
```

`src/pages/rss.xml.js` line 14:
```js
    description:
      "Insights on QR menus and digital transformation for food businesses.",
```

`src/pages/search.astro`:
- line 9: `description="Search Astro-Menu content: blog posts, features, and more."`
- line 14: `Search our blog, features, and more.`

- [ ] **Step 4: Verify**

Run:
```powershell
Get-ChildItem "src\data", "src\layouts", "src\pages" -Recurse -File | Select-String -Pattern "cloud POS|cloud PoS|Cloud POS|self-order" | Select-Object -ExpandProperty Line
```
Expected: no output.
Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Update FAQ and page SEO copy to QR menu positioning"
```

---

### Task 8: Rewrite llms.txt and llms-full.txt

**Files:**
- Modify: `public/llms.txt`
- Modify: `public/llms-full.txt`

**Interfaces:**
- Consumes: final pricing (Task 4) and positioning copy.
- Produces: AI-assist files with no docs/POS/ordering content.

- [ ] **Step 1: Replace `public/llms.txt` entirely**

```markdown
# Astro-Menu

> Astro-Menu is a QR digital menu for restaurants, cafes, hotels, food trucks, and social media food businesses. Customers scan a QR code to browse the menu — items, prices, photos, meal filters, and multi-language translations — no app download, no ordering, no POS.

## Key sections

- [Home](https://astro-menu.com/): Product overview and highlights.
- [Features](https://astro-menu.com/features): QR menus, multi-language, meal filters, meal labels, wifi password, and social links.
- [Use Cases](https://astro-menu.com/use-cases): Restaurants, cafes, food trucks, hotels, hospitals, and social media food businesses.
- [Pricing](https://astro-menu.com/pricing): Menu plan — 59 AED/month or 468 AED/year (39 AED/month billed annually). 14-day free trial, no credit card required. No commission on orders.
- [Blog](https://astro-menu.com/blog): QR menu and food-tech insights.
- [Contact](https://astro-menu.com/contact): hello@astro-menu.com.

## Core links

- [Start free trial](https://app.astro-menu.com/register): Create an account — 14-day free trial, no credit card required.
- [Log in](https://app.astro-menu.com/login): Existing users.
- [Search](https://astro-menu.com/search): Search the site.
- [RSS](https://astro-menu.com/rss.xml): Blog RSS feed.

## Important

- Astro-Menu is a cloud, web-based application — no software installation needed.
- Customers view menus via QR code; ordering and payments are managed by the business, not Astro-Menu.
- Astro-Menu does not include ordering, a POS, or third-party POS integrations.
- Pricing is in AED (UAE).
```

- [ ] **Step 2: Rewrite `public/llms-full.txt`**

Full rewrite with the same product description, these key facts:

```
- Cloud, web-based application. No software to install; works from any device with a browser.
- No commission on orders — flat monthly subscription fee.
- 14-day free trial. No credit card required to start.
- Menu-viewing only: customers browse items, prices, photos, translations, wifi password, and social links.
- Does NOT include ordering, self-order, a POS, kitchen/waitstaff dashboards, drive-thru features, or analytics.
- Payment processing and ordering are managed by the business, not by Astro-Menu.
- Pricing in AED (UAE).
```

Features section:
```
Core:
- Instant QR menus — customers scan and browse, no app download.
- Multi-language menus with automatic translation (e.g. Arabic, and more).
- Meal labels — tag meals (decaf, sugar-free, gluten-free, and more).
- Meal filters — filter by dietary preference or tags.
- WiFi password display.
- Social media links and Google review links on the menu.
- Business landing page (Linktree-style) shown when a QR is scanned.
- Multi-currency price display.
- Responsive, modern design with minimal clicks.
- Cloud solution, no physical hardware, no maintenance.

Highlights ("Why Astro-Menu"):
- No commissions — flat monthly fee, keep your profits.
- Multi-language — auto-translate your menu for every guest.
- Instant QR menus — no app downloads, just scan & browse.
```

Use cases:
```
- Restaurants
- Cafes and coffee shops
- Hotels and room service (menu browsing)
- Food trucks
- Hospitals and patient meal browsing
- Social media food businesses (home-based food brands)
```

Pricing:
```
Menu plan — 59 AED/month or 468 AED/year (39 AED/month billed annually):
- 1 QR code (menu viewing only)
- 1 translation language
- Unlimited meals, menus, and scans (fair usage policy)
- Social media links
- 1 branch

Additional branches: contact hello@astro-menu.com.
```

FAQ (match `src/data/faqs.js` after Task 7):
```
Q: Can I try Astro-Menu before I buy?
A: Yes, you can try Astro-Menu for free for 14 days. Simply create an account and start using Astro-Menu right away.

Q: Can I cancel my subscription at any time?
A: Yes, you can cancel your subscription at any time. Your subscription will be active until the end of the billing cycle.

Q: Does Astro-Menu include ordering or a POS?
A: No. Astro-Menu is a QR digital menu for viewing only. Customers scan the QR code to browse your menu, check prices and photos, and view translations. Ordering, payments, and your point of sale are handled by you — Astro-Menu takes no commission on your orders.

Q: Can customers place orders from the menu?
A: No. Astro-Menu is a menu-viewing product. Customers browse your menu in their preferred language, but ordering and payments happen through your own process.

Q: Can customers pay directly from the menu?
A: No, Astro-Menu is a QR Menu that lets customers view your menu. Payments are managed by you.

Q: How many QR codes do I get with the Menu plan?
A: One QR code per branch (menu viewing only). If you need more branches or QR codes, contact our sales team at hello@astro-menu.com.

Q: How can I add more branches to my subscription?
A: Contact our sales team at hello@astro-menu.com and they will help you add more branches to your subscription.

Q: Do I need to install any software to use Astro-Menu?
A: Astro-Menu is a cloud web-based application. You don't need to install any software to use it. You can access it from any device with a web browser.
```

Blog section: keep the list but remove the 4 deleted posts (delete the entries for `guide-to-implementing-qr-menu-and-cloud-pos`, `the-benefits-of-a-cloud-pos-system-for-restaurants`, `reinventing-the-drive-thru`, and `how-astro-menu-revolutionizes-the-qr-menu-world`).

Site pages section: remove the Docs line. Do NOT add a documentation section.

- [ ] **Step 3: Verify**

Run:
```powershell
Get-Content "public\llms.txt", "public\llms-full.txt" | Select-String -Pattern "cloud POS|cloud PoS|Drive-Thru|drive-thru|waitstaff|kitchen dashboard|self-order|/docs/|149 AED|229 AED|299 AED|Essential|Advanced|Premium" 
```
Expected: no output.
Run: `npm run build`
Expected: build succeeds (both files copied to `dist/`).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Rewrite llms.txt files for QR menu view-only positioning"
```

---

### Task 9: Orphaned asset cleanup and final verification

**Files:**
- Delete (after confirming unused via grep): `src/assets/views/waitstaff-dashboard.png`, `src/assets/images/features/drive-thru-img.png`, `src/assets/images/features/drive-thru-old-img.png`, `src/assets/images/mockups/drive-thru-mobile-view.jpeg`, `src/assets/images/mockups/call-waiter-menu-view.png`, `src/assets/icons/pos.svg`
- Verify-only: `src/components/features/lets-go-over-numbers.astro`, `src/components/features/concept.astro`, `src/pages/blog/[slug].astro`, `src/components/landing-page/testimonials.astro`, `src/components/landing-page/astro-menu-vs-other-menus.astro`

**Interfaces:**
- Consumes: all prior tasks.
- Produces: a clean, verified build on `staging`.

- [ ] **Step 1: Confirm candidates are orphaned, then delete**

For each candidate path, run:
```powershell
Get-ChildItem "src" -Recurse -File | Select-String -Pattern "waitstaff-dashboard|drive-thru-img|drive-thru-old-img|drive-thru-mobile-view|call-waiter-menu-view|icons/pos.svg"
```
Any hit other than the candidate file itself means keep it and skip. For confirmed orphans:
```powershell
Remove-Item -LiteralPath @(
  "src\assets\views\waitstaff-dashboard.png",
  "src\assets\images\features\drive-thru-img.png",
  "src\assets\images\features\drive-thru-old-img.png",
  "src\assets\images\mockups\drive-thru-mobile-view.jpeg",
  "src\assets\images\mockups\call-waiter-menu-view.png",
  "src\assets\icons\pos.svg"
)
```
(Only include each path if its grep check was clean.)

- [ ] **Step 2: Final content audit**

Run:
```powershell
Get-ChildItem "src", "public" -Recurse -File | Select-String -Pattern "cloud POS|cloud PoS|Cloud POS|Cloud PoS|drive-thru|Drive-Thru|waitstaff|Waitstaff|self-order|Self-Order|call waiter|Call Waiter|kitchen dashboard|kitchen management|waiter\(ess\)" | Select-Object -ExpandProperty Path
```
Review each remaining hit — allowed survivors only:
- `why-forcing-customers-to-pay-through-qr-menus-can-backfire.mdx` (uses "waitstaff" discussing QR-payment tipping as a general industry point — acceptable).
- Any use of "kitchen" as a venue word.
If any hit claims an Astro-Menu feature, fix it in this task before continuing.

- [ ] **Step 3: Full build + smoke test**

Run: `npm run build`
Expected: build succeeds; output lists no `/docs` pages; blog count 15; pricing shows the single Menu plan.
Run: `npm run preview` in a separate shell, then:
```powershell
foreach ($p in @("/", "/features", "/use-cases", "/pricing", "/blog", "/contact", "/search", "/rss.xml")) {
  $r = Invoke-WebRequest -UseBasicParsing -Uri ("http://localhost:4321" + $p)
  "{0} -> {1}" -f $p, $r.StatusCode
}
$r = Invoke-WebRequest -UseBasicParsing -Uri "http://localhost:4321/docs/welcome/introduction"
```
Expected: all listed paths return 200; `/docs/welcome/introduction` returns 404 (404 status or error). Stop the preview server afterwards.

- [ ] **Step 4: RSS + Pagefind verification**

Run:
```powershell
(Get-Content "dist\rss.xml" -Raw) -match "<item>" ; Select-String -Path "dist\rss.xml" -Pattern "<item>" -AllMatches | ForEach-Object { $_.Matches.Count }
```
Expected: 15 items. Confirm `dist/pagefind/` exists (postbuild ran) and `dist/search/index.html` exists.

- [ ] **Step 5: Lint noise check**

Run: `npx eslint . --ext .astro,.js,.jsx,.ts 2>&1` and compare to the pre-existing baseline (parse errors on `[slug].astro` files and `interface` in `src/ui/*.astro`). No NEW errors should appear. Do not fix pre-existing issues in this task.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Remove orphaned assets and verify QR menu view-only site"
```

---

## Self-Review Notes

- Spec coverage: docs removal (Task 2), pricing (Task 4), features (Task 5), use cases (Task 6), FAQ/SEO copy (Tasks 3, 7), llms files (Task 8), blog (Task 1), orphaned assets + verification (Task 9). The "2 months free" label correction is in Task 4.
- Ordering dependency: Task 1 (blog FeatureLink imports) must precede Task 2 (deletes feature-link.astro) or the build breaks. Task 3 removes the last `pos.svg` importer before Task 9 deletes the asset.
- No placeholders: every replacement string is written inline above.
