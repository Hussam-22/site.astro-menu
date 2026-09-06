/**
 * Seeds one venue's meals straight into Firestore.
 *
 *   node --env-file=.env scripts/outreach/build-menu.mjs refill-roastery --dry
 *   node --env-file=.env scripts/outreach/build-menu.mjs refill-roastery
 *
 * Writing directly skips the dashboard's validation, so every document here is
 * shaped from a real meal the app itself created — see inspect-schema.mjs.
 *
 * Two things this fixes that the dashboard gets wrong for outreach:
 *
 *  1. The app machine-translates the title. It rendered "Refill Blend" as
 *     "مزيج إعادة التعبئة" — literally "refill mixture". Sending a venue their
 *     own brand name mistranslated is worse than sending nothing, so we set
 *     the translations explicitly from the venue's OWN store copy.
 *  2. Meal images uploaded through the dashboard did not persist (cover came
 *     back null). We point `cover` at the venue's own CDN instead, which is
 *     both reliable and verifiably their photograph.
 *
 * Idempotent per venue: meals are matched on (venue, title) via a `sourceVenue`
 * tag written onto every meal doc, so a second run for the SAME venue updates
 * rather than duplicates. Title alone is not a safe key — this business
 * profile holds many unrelated demo venues, and generic drink names
 * ("Cappuccino", "Flat White") collide across them. An earlier version of
 * this script matched on bare title and silently let venue N's "Cappuccino"
 * overwrite the description on venue 1 through N-1's shared document (price
 * stayed correct, since it's a snapshot baked into each section — only the
 * live-looked-up title/description was wrong). `sourceVenue` fixes that.
 */
import { readFileSync } from 'node:fs'
import { autoId, createDoc, decFields, enc, listDocs, updateDoc } from './lib/firestore.mjs'

const slug = process.argv[2]
const DRY = process.argv.includes('--dry')
if (!slug) throw new Error('Usage: build-menu.mjs <venue-slug> [--dry]')

const BP = process.env.ASTRO_BUSINESS_PROFILE || 'V1iYvft42Rd19Gx2swCo'
const LABEL = process.env.ASTRO_COFFEE_LABEL || 'DRkmW09qZ0pIMB5uOQWK'
const COL = `/businessProfiles/${BP}/meals`

const venue = JSON.parse(readFileSync(`scripts/outreach/data/${slug}.json`, 'utf8'))
// A real menu has categories (Coffee, Breakfast, Desserts...) — `sections`
// (plural) is the normal shape now. The old flat `venue.meals` still works
// for single-category files.
venue.meals = venue.sections ? venue.sections.flatMap((s) => s.meals) : venue.meals
console.log(`${venue.venue} — ${venue.meals.length} meals\nSource: ${venue.source}\n`)

// A bare name and a number reads like a spreadsheet. The description is what
// makes the menu look like a menu, so refuse to build one without it rather
// than quietly shipping a thin page to a prospect.
const undescribed = venue.meals.filter((m) => !m.desc?.trim())
if (undescribed.length) {
	throw new Error(
		`${undescribed.length} meal(s) have no description: ${undescribed.map((m) => m.en).join(', ')}\n` +
			'Add a "desc" (and ideally "descAr") to each in the venue data file.'
	)
}

/** The document the app would have written, had it written a correct one. */
function mealDoc(m, docID) {
	const tr = {
		// Their Arabic, from their own store. Never machine-translated.
		ar: { title: m.ar || m.en, desc: m.descAr ?? '' },
		// No trustworthy Russian for a coffee origin or a brand — leaving the
		// original beats inventing one, which is how "Refill Blend" became
		// "Смесь для повторного наполнения".
		ru: { title: m.en, desc: m.desc }
	}
	return {
		title: m.en,
		description: m.desc,
		cover: m.cover ?? null,
		portions: m.prices.map((p) => ({ portionSize: p.size, price: p.aed })),
		mealLabels: [LABEL],
		nutritionFacts: { calories: '', carbohydrates: '', protein: '', fat: '' },
		translation: tr,
		translationEdited: tr,
		businessProfileID: BP,
		// Tags which of the many demo venues in this shared profile a meal
		// belongs to, so the lookup below never matches a different venue's
		// document that happens to share a generic drink name.
		sourceVenue: venue.venue,
		isActive: true,
		isAvailable: true,
		isDeleted: false,
		isNew: false,
		lastUpdatedAt: new Date().toISOString(),
		docID
	}
}

const { documents = [] } = await listDocs(COL, 300)
// Keyed on (venue, title) — bare title is not safe once more than one venue
// shares this profile, since "Cappuccino" from venue A and venue B would
// otherwise resolve to the same document.
const existing = new Map(
	documents
		.map((d) => decFields(d))
		.filter((f) => f.sourceVenue === venue.venue && f.title)
		.map((f) => [f.title, f.docID])
)
console.log(`${existing.size} meals already tagged to "${venue.venue}" in this profile\n`)

let created = 0
let updated = 0

for (const m of venue.meals) {
	const prior = existing.get(m.en)
	const docID = prior ?? autoId()
	const doc = mealDoc(m, docID)
	const priceLabel = m.prices.map((p) => `${p.size} ${p.aed}`).join(' / ')

	if (DRY) {
		console.log(`  ${prior ? 'update' : 'create'}  ${m.en.padEnd(38)} ${priceLabel}`)
		continue
	}

	const fields = Object.fromEntries(Object.entries(doc).map(([k, v]) => [k, enc(v)]))
	if (prior) {
		await updateDoc(`${COL}/${prior}`, fields)
		updated++
	} else {
		await createDoc(COL, fields, docID)
		created++
	}
	console.log(`  ${prior ? 'updated' : 'created'}  ${m.en.padEnd(38)} ${priceLabel}`)
}

console.log(DRY ? '\n--dry: nothing written.' : `\nDone. ${created} created, ${updated} updated.`)
