# Admin dashboard screenshots

Five slots. `DashboardImage.astro` resolves each by filename stem, so saving
`dash-meals.png` here fills the `dash-meals` slot with no code change. Until a
file exists the site renders a captioned placeholder in browser chrome, so
nothing looks broken.

PNG is fine here — these are UI screenshots with flat colour and text, which is
exactly what PNG is good at. Astro converts to WebP on build anyway.

Take them at a wide desktop width (1600px+) with the sidebar expanded.

| Slot | What it must show | Used on |
| --- | --- | --- |
| `dash-meals` | The **Meals** list: search box, rows of dishes with photo, portions and prices, and the Active/Disable column with at least one item **Disabled** | Home, the dark "what you control" band |
| `dash-sections` | A menu's **Meals and Sections** tab: the Add Section field and a section such as Breakfast with its items and the section action icons | `/features` → dashboard, `/how-it-works` |
| `dash-meal` | A single meal's **Menu Info**: title, description, the Carbohydrates / Calories / Protein / Fat fields, Meal Labels with some selected, and Portions with a price | `/features` → diet |
| `dash-branch` | A branch's **Branches info** tab: branch name, currency, default language, cover photo, and the Social Links grid | `/features` → QR & links |
| `dash-qr` | A branch's **Social QR** tab: Total Scans, the menu selector, the QR code and the menu link | `/features` → analytics |

## Redact before saving `dash-branch`

That screen carries a real customer's private contact details. On the shot taken
from the Number Eight branch that is:

- **Contact Email** — `numbereight5440@gmail.com`
- **Contact Number** — `0565956180`
- **WhatsApp Number** — `565956180`

Publishing those on a public marketing site exposes a customer's personal
contact information, and it is the sort of thing that is very hard to walk back
once it is indexed. Blur or overwrite all three fields before saving the file
here, or retake the shot on a test branch with dummy details.

The Instagram, Google Review and Location Map links on the same screen are
already public, so they can stay — they are good evidence that the social links
are real.

Nothing else in the five needs redacting. The branch and meal IDs in the
breadcrumbs are already public in the demo menu URL.
