# Outreach pipeline

Finds independent UAE venues with no decent menu online, builds them a real
Astro-Menu, and hands you a ready-to-send Instagram DM with their own finished
menu in it.

The offer is the one already on `/contact` — _"send us your menu and we build
the first version free"_ — inverted. We build it **first**, then show them. A
cold DM saying "we do QR menus, 59 AED" gets deleted; "here is your menu,
already built, scan it" gets a reply.

## Why a human presses send

Instagram's Graph API only allows a DM within 24 hours of the user messaging
you first. There is no sanctioned API for cold outbound. Automating it means
driving the web client against Meta's terms, and bulk DMs to non-followers from
an account with no interaction history is close to the textbook ban signal —
which would cost you the account your customers actually find you through.

So the boundary sits one step before the send. Everything up to and including
the drafted message is automated; you open the queue, glance at the menu, and
paste. About ten seconds a lead, and no account risk.

The same reasoning applies to email later: never send cold volume from
`astro-menu.com`. Use a separate warmed domain, or the SEO work is spent.

## Stages

|     | Script                                                                   | State              |
| --- | ------------------------------------------------------------------------ | ------------------ |
| 0   | `notion-setup.mjs` — create the leads database, run once                 | built              |
| 1   | `source-venues.mjs` — Places API → Notion, scored and deduped            | built              |
| 2   | `enrich-instagram.mjs` — resolve handles, pull menu photos               | not yet            |
| 3   | `build-menu.mjs` — extract items, drive the dashboard, get a preview URL | not yet            |
| 4   | `draft-dm.mjs` — write the message, set status to Ready to send          | not yet            |
| 5   | you send, and mark the reply in Notion                                   | manual, on purpose |

Stage 3 is the one that decides whether any of this works. If the generated
menu is not good enough to send unedited, the strategy collapses back to
ordinary cold outreach and is not worth the machinery — so prototype it on ten
venues before building stages 2 and 4.

## Setup

Create `.env` in the repo root (already gitignored):

```
NOTION_TOKEN=secret_...          # notion.so/my-integrations, then share the
NOTION_PARENT_PAGE_ID=...        # parent page with that integration
NOTION_LEADS_DB=...              # printed by notion-setup.mjs
GOOGLE_PLACES_KEY=...            # console.cloud.google.com, Places API (New)
```

`NOTION_PARENT_PAGE_ID` is the 32-character id in the page URL. The integration
must be added to that page via **⋯ → Connections**, or every write 404s.

```bash
node --env-file=.env scripts/outreach/notion-setup.mjs
```

## Running

```bash
node --env-file=.env scripts/outreach/source-venues.mjs --dry
```

`--dry` costs Places requests but writes nothing — it prints the top 20 so you
can sanity-check the ranking before filling the database. Drop the flag to
write. Re-runs are safe: existing rows are matched on `Place ID` and skipped.

## Staying inside the free tier

Places Text Search gives **10,000 free requests a month**. A full sweep is
`CITIES x TERMS x MAX_PAGES` = 8 x 6 x 3 = **144 requests**, so one run costs
nothing. The danger was never one run — it is twenty runs while iterating, or
widening the lists without doing the multiplication.

So the budget is enforced, not remembered:

```bash
node --env-file=.env scripts/outreach/source-venues.mjs --plan
```

`--plan` prints the request count and this month's usage and **exits without
calling the API**. Use it every time you touch `CITIES`, `TERMS`, or
`OUTREACH_MAX_PAGES`.

`lib/budget.mjs` keeps a running per-month count in `.outreach-usage.json`
(gitignored) and refuses to start a run that could breach the cap:

```
Refusing to start: this run could use 144 requests but only 50 remain
under the cap. Narrow CITIES/TERMS, lower OUTREACH_MAX_PAGES, or raise
OUTREACH_REQUEST_CAP deliberately.
```

It refuses _before_ the first request rather than dying halfway with a
part-filled database. Two knobs, both env vars:

|                        | default |                                                                                                                    |
| ---------------------- | ------- | ------------------------------------------------------------------------------------------------------------------ |
| `OUTREACH_REQUEST_CAP` | 2000    | Our ceiling. Far under the 10,000 free tier, so hitting it is a bug to investigate, not a limit to raise casually. |
| `OUTREACH_MAX_PAGES`   | 3       | Pages per query. Places caps text search at 60 results (3 x 20). Set to 1 to cut the sweep to 48 requests.         |

The counter is per-machine, not shared. If this ever runs from two places,
check real usage in the Cloud console before trusting the file.

**One thing to watch if you scale.** The billed SKU is chosen by the field
mask, not the endpoint. `FIELDS` asks for `rating` and `userRatingCount`, which
are atmosphere fields and put the call in the priciest Text Search tier. That
is free at 144 requests a month and would not be at 50,000 — drop those two
fields first if the sweep ever gets big. Stage 3 is the other thing to watch:
Place Photos bills separately per photo.

## Scoring

`lib/score.mjs`, kept separate so the judgement can be checked without spending
requests. Busy venue with nothing digital scores highest, because that is the
venue the pitch actually lands on:

```
 90  400 reviews, 4.6★, no website, Al Ain
 85  400 reviews, 4.6★, Instagram only, Al Ain
 60  150 reviews, 4.2★, linktree, Abu Dhabi
 50  900 reviews, 4.5★, real website, Dubai
 15    4 reviews, brand new
  0  anything whose name repeats in 3+ emirates (chain — head office owns the menu)
```

Al Ain and Abu Dhabi score up because Number Eight is there, so the message can
name a café down the road. That is worth more than any wording.
