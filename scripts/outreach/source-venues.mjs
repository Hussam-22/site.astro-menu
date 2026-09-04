/**
 * Stage 1 — fill the Notion leads database from the Google Places API.
 *
 * Places, not a Maps scraper: scraping the Maps result page breaks Google's
 * terms and gets the IP blocked, and this list is the foundation of the whole
 * pipeline, so it should not rest on something that can be switched off.
 *
 *   node --env-file=.env scripts/outreach/source-venues.mjs --dry
 *   node --env-file=.env scripts/outreach/source-venues.mjs
 *
 * Text Search is billed per request. The run prints its request count at the
 * end so the cost is never a surprise — check the current SKU price before
 * widening CITIES or TERMS, because the two multiply.
 */
import { writeFileSync } from 'node:fs'
import { createPage, prop, queryAll } from './lib/notion.mjs'
import { instagramHandle, isChain, score, situationFromPlaces } from './lib/score.mjs'
import { FREE_TIER_PER_MONTH, cap, remaining, spend, used } from './lib/budget.mjs'

const DRY = process.argv.includes('--dry')
const PLAN = process.argv.includes('--plan')

/** Pages per query. Places caps a text search at 60 results (3 x 20) anyway. */
const MAX_PAGES = Number(process.env.OUTREACH_MAX_PAGES ?? 3)
const DB = process.env.NOTION_LEADS_DB
const KEY = process.env.GOOGLE_PLACES_KEY

if (!KEY) throw new Error('GOOGLE_PLACES_KEY is not set. See scripts/outreach/README.md')
if (!DB && !DRY) throw new Error('NOTION_LEADS_DB is not set. Run notion-setup.mjs first.')

/**
 * All seven emirates. Al Ain leads the list because the reference venue
 * (Number Eight) is there — a message that can name a café down the road
 * outperforms one that cannot, so those leads are scored up later.
 */
const CITIES = [
	['Al Ain', 'Abu Dhabi'],
	['Abu Dhabi', 'Abu Dhabi'],
	['Dubai', 'Dubai'],
	['Sharjah', 'Sharjah'],
	['Ajman', 'Ajman'],
	['Umm Al Quwain', 'Umm Al Quwain'],
	['Ras Al Khaimah', 'Ras Al Khaimah'],
	['Fujairah', 'Fujairah']
]

/** Independents that print a menu. Not fast food — they have no menu to build. */
const TERMS = [
	'specialty coffee shop',
	'independent coffee shop',
	'espresso bar',
	'coffee roastery cafe'
]

const FIELDS = [
	'places.id',
	'places.displayName',
	'places.formattedAddress',
	'places.rating',
	'places.userRatingCount',
	'places.websiteUri',
	'places.nationalPhoneNumber',
	'places.googleMapsUri',
	'places.primaryTypeDisplayName'
].join(',')

let requests = 0

async function searchText(textQuery, pageToken) {
	// Charge before calling, so an abort never leaves the counter under-reporting.
	spend(1, cap())
	requests++
	const res = await fetch('https://places.googleapis.com/v1/places:searchText', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-Goog-Api-Key': KEY,
			'X-Goog-FieldMask': FIELDS
		},
		body: JSON.stringify({ textQuery, pageSize: 20, pageToken })
	})
	if (!res.ok) throw new Error(`Places ${res.status}: ${await res.text()}`)
	return res.json()
}

/** Up to three pages — Places caps a text search at 60 results anyway. */
async function searchAll(textQuery) {
	const out = []
	let token
	for (let page = 0; page < MAX_PAGES; page++) {
		const data = await searchText(textQuery, token)
		out.push(...(data.places ?? []))
		token = data.nextPageToken
		if (!token) break
		await new Promise((r) => setTimeout(r, 1200)) // token needs a moment to arm
	}
	return out
}

/* --------------------------------- run ---------------------------------- */

const worstCase = CITIES.length * TERMS.length * MAX_PAGES

console.log(`Plan: ${CITIES.length} cities x ${TERMS.length} terms x ${MAX_PAGES} pages`)
console.log(`      up to ${worstCase} requests (fewer when a query returns one page)`)
console.log(`Used this month: ${used()} / ${cap()} cap. Free tier is ${FREE_TIER_PER_MONTH}.`)
console.log(`Remaining under cap: ${remaining(cap())}\n`)

// --plan answers "what would this cost" without spending anything.
if (PLAN) {
	console.log('--plan: no requests made. Drop the flag to run.')
	process.exit(0)
}

// Refuse before the first request rather than dying halfway with a part-filled
// database — a run that stops mid-sweep is worse than one that never starts.
if (worstCase > remaining(cap())) {
	console.error(
		`Refusing to start: this run could use ${worstCase} requests but only ` +
			`${remaining(cap())} remain under the cap.\n` +
			'Narrow CITIES/TERMS, lower OUTREACH_MAX_PAGES, or raise OUTREACH_REQUEST_CAP deliberately.'
	)
	process.exit(1)
}

const found = new Map() // placeId -> place
for (const [city, emirate] of CITIES) {
	for (const term of TERMS) {
		const places = await searchAll(`${term} in ${city}, UAE`)
		for (const p of places) {
			if (!found.has(p.id)) found.set(p.id, { ...p, city, emirate })
		}
		console.log(`  ${city} / ${term}: ${places.length}`)
	}
}

// A name that repeats across the emirates is a chain, and a chain's menu is
// decided at head office. Cheapest possible filter, catches most of them.
const nameCount = new Map()
for (const v of found.values()) {
	const n = v.displayName?.text ?? ''
	nameCount.set(n, (nameCount.get(n) ?? 0) + 1)
}

const leads = [...found.values()]
	.map((v) => {
		const chain = isChain(v.displayName?.text ?? '', nameCount)
		// Places-only guess. menu-probe.mjs refines this before anyone is contacted.
		const situation = situationFromPlaces(v)
		return { ...v, chain, situation, score: score(v, chain, situation) }
	})
	.sort((a, b) => b.score - a.score)

console.log(`\n${found.size} unique venues, ${requests} Places requests`)
console.log(`${leads.filter((l) => l.chain).length} look like chains`)

if (DRY) {
	console.log('\nTop 20 (dry run, nothing written):\n')
	for (const l of leads.slice(0, 20)) {
		console.log(
			`  ${String(l.score).padStart(3)}  ${l.displayName?.text}  (${l.city}, ${l.userRatingCount ?? 0} reviews)  ${l.websiteUri ?? 'no website'}`
		)
	}
	process.exit(0)
}

// Fallback so a missing NOTION_TOKEN never throws away Places spend: this run
// already paid for the requests, so the results are always saved to disk
// first, and Notion is attempted only after that succeeds.
writeFileSync('.outreach-sourced.json', JSON.stringify(leads, null, 2))
console.log(`\nSaved ${leads.length} scored leads to .outreach-sourced.json`)

// One read of the whole database beats one lookup per venue: Notion allows
// roughly three requests a second, so per-row queries would take an hour.
console.log('\nReading existing rows...')
const existing = new Set(
	(await queryAll(DB))
		.map((r) => r.properties['Place ID']?.rich_text?.[0]?.plain_text)
		.filter(Boolean)
)
console.log(`${existing.size} already in Notion`)

const today = new Date().toISOString().slice(0, 10)
let added = 0

for (const l of leads) {
	if (existing.has(l.id)) continue
	if (l.chain) continue

	const ig = instagramHandle(l.websiteUri)
	await createPage({
		parent: { database_id: DB },
		properties: {
			Venue: prop.title(l.displayName?.text),
			Status: prop.select('New'),
			Score: prop.number(l.score),
			'Menu situation': prop.select(l.situation),
			Instagram: prop.url(ig ? `https://instagram.com/${ig}` : null),
			'IG handle': prop.text(ig),
			Website: prop.url(l.websiteUri),
			Phone: prop.phone(l.nationalPhoneNumber),
			City: prop.select(l.city),
			Emirate: prop.select(l.emirate),
			Category: prop.select(l.primaryTypeDisplayName?.text),
			Rating: prop.number(l.rating),
			Reviews: prop.number(l.userRatingCount),
			Address: prop.text(l.formattedAddress),
			Maps: prop.url(l.googleMapsUri),
			Chain: prop.checkbox(false),
			'Place ID': prop.text(l.id),
			Sourced: prop.date(today)
		}
	})
	added++
	if (added % 25 === 0) console.log(`  ${added} written`)
	await new Promise((r) => setTimeout(r, 350)) // stay under Notion's rate limit
}

console.log(`\nDone. ${added} new leads. ${requests} Places requests this run.`)
