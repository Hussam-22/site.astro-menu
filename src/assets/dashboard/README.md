# Admin dashboard screenshots

Five slots, all filled. `DashboardImage.astro` resolves each by filename stem,
so replacing `dash-meals.png` here changes the site with no code edit. If a file
is ever removed the slot falls back to a captioned placeholder rather than
breaking.

| Slot | Shows | Used on |
| --- | --- | --- |
| `dash-meals` | The Meals list, cropped to the rows around **V60 geisha — Disabled** | Home, the dark "what you control" band |
| `dash-sections` | A menu's Meals and Sections tab: Add Section, and Breakfast with its items | `/features` → dashboard, `/how-it-works` |
| `dash-meal` | One meal's editor: description, macro fields, meal labels, portions | `/features` → diet |
| `dash-branch` | Branch settings and the Social Links grid | `/features` → QR & links |
| `dash-qr` | The Social QR tab: total scans, menu selector, QR code and link | `/features` → analytics |

## Regenerating

The files here are derived, not raw captures. `scripts/prep-dashboard.mjs`
crops and redacts the originals:

```bash
node scripts/prep-dashboard.mjs
```

It reads from a folder outside the repo, so update the `SRC` path in that script
if the originals move. Three things it does that matter:

**`dash-branch` is redacted.** That screen carries a real customer's contact
email, phone number and WhatsApp number. Publishing those on a public marketing
site would expose personal contact details to indexing. The three field
interiors are crushed to a handful of pixels and blown back up before being
blurred, so the original text is not recoverable — a plain blur over text can be
partially reversed, which is not good enough for someone's phone number. The
field *labels* are left readable, so the screenshot still shows what the fields
are. Everything else on that screen — branch name, currency, language, and the
Instagram, Google Review and Maps links — is already public and stays.

**`dash-meals` is cropped, not resized.** The source is 1753x1928, far too tall
for the layout, and the one row that proves the sold-out claim sits near the
bottom. The crop takes a landscape window around that row and drops the left
gutter, which is blank at that scroll depth.

**`dash-qr` is trimmed.** Only the top two thirds of that screen has content.

## Replacing one

PNG is right for these — flat colour and text is what PNG is good at, and Astro
converts to WebP on build. Capture at 1600px or wider with the sidebar expanded.

Check any new screenshot for customer data before committing it: contact
details, real names, anything in a Business Profile or Subscription screen.
