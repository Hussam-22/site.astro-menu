# Astro-Menu outreach

Finds UAE venues that do not have a digital menu, **builds each one a real
Astro-Menu menu from the menu they already publish**, and hands it to them.

The pitch is not "we make QR menus". The pitch is "here is your menu, scan it".
Everything in this directory exists to make that message cheap enough to send
at volume and accurate enough to survive contact with the owner who wrote the
original.

Nothing here runs as part of the marketing site. It is a separate package with
its own dependencies, its own `.env`, and no import path into `../src`.

---

## The pipeline

```
source ──▶ find-menus ──▶ qualify ──▶ build-menus ──▶ review ──▶ render ──▶ export
  │             │             │            │            │          │          │
Places      crawl their    score &     Claude parses  a HUMAN   Firestore   pages on
grid        website for    segment     the menu       approves  + QR +      astro-menu.com
sweep       a PDF/photos                              or not    screenshot  /m/<slug>
```

Each stage is a separate command, reads from the database, and writes back to
it. They can be run days apart, re-run safely, and stopped between any two.

### 0. Set up

```bash
cd outreach
npm install
cp .env.example .env      # then fill it in
psql "$DATABASE_URL" -f db/schema.sql
```

### 1. Source — who is out there

```bash
npm run source -- --dry-run          # tiles and estimated cost, calls nothing
npm run source -- --area al-ain      # one area
npm run source                       # the whole configured grid
```

Sweeps a lattice of overlapping circles across Al Ain and Abu Dhabi and upserts
every restaurant, café and bakery it finds. Areas are defined in
`src/sources/grid.js` — add an emirate by adding a bounding box there.

A tile that comes back full is hiding venues, so it is automatically re-swept
as a 3×3 block of smaller tiles. `--dry-run` prices the sweep before you spend
anything.

### 2. Find menus — what can we build from

```bash
npm run find-menus -- --limit 200
```

Crawls each venue's own website looking for a PDF, menu photos, or a menu page.
Honours `robots.txt`, stays on one host, stops after eight pages, and
identifies itself. **This is the stage that decides the size of the business**:
a venue whose menu we cannot find is not a lead.

### 3. Qualify — who is worth building for

```bash
npm run qualify
```

Free, pure, and instant. Re-run it after every sourcing or crawling pass —
finding a venue's PDF is what promotes them from `unreachable` to `prospect`.

Segments: `prospect` (buildable), `competitor` (already on a menu platform —
a switching pitch, not this one), `chain` (five or more venues sharing a name;
a different sale), `unreachable`, `disqualified`.

### 4. Build — turn their menu into data

```bash
npm run build-menus -- --limit 20
```

Sends the artifact to Claude and stores the structured menu as an
**unreviewed** build. Nothing is published and nothing is sent. Builds that
come back thin, under-priced or low-confidence are auto-rejected before a human
ever sees them.

### 5. Review — the gate

```bash
node bin/review.mjs                 # the queue, least confident first
node bin/review.mjs --show 12       # read one in full
node bin/review.mjs --approve 12
node bin/review.mjs --reject 12 "prices are last season's"
```

**Nothing reaches a restaurant without passing through here.** A wrong price in
an owner's inbox costs more than every token this pipeline will ever spend, and
it is the one failure that cannot be walked back.

### 6. Render — publish and photograph

```bash
npm run render
```

Writes the approved menu into Firestore as a prospect venue, then renders a
print-ready QR code and a screenshot of the live menu on a phone. This is the
first stage that puts anything on the public internet.

### 7. Export — the claim pages

```bash
npm run export        # writes ../src/data/prospects.json
```

Then redeploy the marketing site. Each prospect gets `/m/<slug>`: "this is your
menu", their live menu, the price, one button. Those pages are `noindex`,
`Disallow`ed in `robots.txt` and excluded from the sitemap — see below.

---

## The rules this pipeline will not break

These are not style preferences. Each one is a way the whole channel dies.

**Never send an unreviewed menu.** The review gate in stage 5 is the product.
A menu with invented dishes or last year's prices does not just lose that
venue, it is screenshotted and shared.

**Never generate food photography.** The parser transcribes; it does not
imagine. A prospect who spots an AI photo of a dish they do not serve is gone,
and so is the reputation. Menus ship photo-less, and "a photo on every item" is
what they get when they claim it.

**Never index the prospect pages.** `/m/*` carries `noindex`, is disallowed for
every crawler group in `public/robots.txt`, and is filtered out of the sitemap
in `astro.config.mjs`. Thousands of thin auto-generated pages about businesses
that are not customers is the fastest way to undo the SEO work the rest of the
site depends on.

**Never resurrect an opt-out.** `venues.opted_out_at` is permanent. The
sourcing upsert skips those rows, the qualifier disqualifies them, and
`renderMessage()` returns `null` for them so no caller can forget.

**Never let a prospect menu outlive its welcome.** Every prospect profile
carries `prospectExpiresAt`. Run `expireProspects()` on a schedule: a menu we
host forever for a business that never said yes becomes, once it drifts out of
date, a wrong menu with our name on it.

**Never cold-message on WhatsApp.** Meta requires opt-in for business-initiated
templates. Cold sends get the number banned, and the number is the channel UAE
restaurants actually reply on. WhatsApp opens only *after* they message first.

---

## Cost

| Stage | What it costs | Notes |
|---|---|---|
| Source | ~$50 per full Al Ain + Abu Dhabi sweep | ~1,600 tiles at the Nearby Search (Pro) rate. `--dry-run` prices it first. Verify the rate — SKU pricing changes. |
| Find menus | Nothing but time | Rate-limited by politeness, not by budget. |
| Qualify | Nothing | Pure functions over the database. |
| Build | A few cents per venue | One Claude call per venue. `ANTHROPIC_MODEL` overrides the model; do not downgrade it without measuring accuracy on real menus first. |
| Render | Nothing but CPU | Playwright and a QR encoder, locally. |

---

## Data protection

Venues are businesses, and this stores what they publish about themselves: a
name, an address, a phone number on their Google listing, the menu on their own
website. It does not store personal data beyond a business contact address.

`venues.opted_out_at` and `venues.deleted_at` exist so an opt-out or an erasure
request is honoured permanently rather than re-sourced on the next sweep.
Google's Places terms allow `place_id` to be kept indefinitely but cap most
other fields at 30 days, which is what `refreshed_at` and
`staleBefore()` in `src/sources/places.js` are for.

---

## What is not built yet

- **Sending.** There is no mail transport here on purpose. Email needs a
  separate warmed sending domain (3–4 weeks before real volume) and a provider
  whose terms permit cold outreach — Resend and Postmark do not, on their
  transactional streams. `src/deliver/templates.js` has the sequence copy ready
  for whichever one you pick.
- **The claim flow.** `/m/<slug>` currently opens an email. Turning "claim this
  menu" into a pre-populated account needs the dashboard repo
  (`app.astro-menu.com`), which is not in this workspace.
- **Instagram.** Where UAE F&B actually lives, but there is no compliant API
  for cold DMs. The pipeline can produce the list; the sending is manual.
- **Scheduling.** Every stage is a command. Wire them to GitHub Actions cron
  when the numbers justify a nightly batch.

---

## Tests

```bash
npm test
```

Covers the parts that are pure logic and can be wrong silently: the search
grid's coverage geometry, the qualification scoring, `robots.txt` parsing, and
the message templates' opt-out guarantees. The stages that talk to Google,
Claude, Firestore and Postgres are not exercised here — they need real
credentials, and **none of this has been run against the live APIs yet.**
