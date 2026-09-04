/**
 * Builds the menu, section, branch and social-QR table for one venue, then
 * prints the link to send them.
 *
 *   node --env-file=.env scripts/outreach/build-venue.mjs refill-roastery --dry
 *   node --env-file=.env scripts/outreach/build-venue.mjs refill-roastery
 *
 * Run build-menu.mjs first — this wires up meals that already exist.
 *
 * Every shape here is copied from documents the app itself wrote (see
 * inspect-schema.mjs), because writing straight to Firestore skips the
 * dashboard's validation and the app is the only authority on what it expects.
 *
 * Idempotent on the menu and branch titles, so a rerun updates in place.
 */
import { readFileSync } from 'node:fs'
import { autoId, createDoc, decFields, enc, listDocs, updateDoc } from './lib/firestore.mjs'

const slug = process.argv[2]
const DRY = process.argv.includes('--dry')
if (!slug) throw new Error('Usage: build-venue.mjs <venue-slug> [--dry]')

const BP = process.env.ASTRO_BUSINESS_PROFILE || 'V1iYvft42Rd19Gx2swCo'
const ROOT = `/businessProfiles/${BP}`
const venue = JSON.parse(readFileSync(`scripts/outreach/data/${slug}.json`, 'utf8'))
const now = () => new Date().toISOString()
const put = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, enc(v)]))

/** Find a document in a collection by its title, so reruns update not duplicate. */
async function byTitle(col, title) {
	const { documents = [] } = await listDocs(col, 300)
	const hit = documents.find((d) => decFields(d).title === title)
	return hit ? hit.name.split('/').pop() : null
}

console.log(`${venue.venue}\n`)

/* --- 1. the menu --------------------------------------------------------- */
const menuTitle = venue.venue
let menuID = await byTitle(`${ROOT}/menus`, menuTitle)
const menuDoc = {
	title: menuTitle,
	description: '',
	isActive: true,
	isDeleted: false,
	isDefault: false,
	mostOrderedMeals: 0,
	newMenuID: '',
	businessProfileID: BP,
	lastUpdateBy: BP,
	lastUpdatedAt: now()
}

/* --- 2. the meals, looked up by title ------------------------------------ */
// Keyed on title alone would be unsafe: this profile holds many demo venues,
// and a generic drink name ("Cappuccino") could belong to any of them.
// sourceVenue (written by build-menu.mjs) scopes the lookup to this venue.
const { documents: mealDocs = [] } = await listDocs(`${ROOT}/meals`, 300)
const mealsByTitle = new Map(
	mealDocs
		.map((d) => decFields(d))
		.filter((f) => f.sourceVenue === venue.venue)
		.map((f) => [f.title, f])
)
const wanted = venue.meals.map((m) => {
	const found = mealsByTitle.get(m.en)
	if (!found) throw new Error(`Meal "${m.en}" not in Firestore — run build-menu.mjs first`)
	return { docID: found.docID, isActive: true, isNew: false, portions: found.portions }
})

/* --- 3. the branch and its social-QR table ------------------------------- */
const b = venue.branch
let branchID = await byTitle(`${ROOT}/branches`, b.title)

if (DRY) {
	console.log(`  menu    ${menuID ? 'update' : 'create'}  "${menuTitle}"`)
	console.log(`  section create  "${venue.section}" with ${wanted.length} meals`)
	console.log(`  branch  ${branchID ? 'update' : 'create'}  "${b.title}"  ${b.currency}`)
	console.log('\n--dry: nothing written.')
	process.exit(0)
}

if (menuID) await updateDoc(`${ROOT}/menus/${menuID}`, put({ ...menuDoc, docID: menuID }))
else {
	menuID = autoId()
	await createDoc(`${ROOT}/menus`, put({ ...menuDoc, docID: menuID }), menuID)
}
console.log(`  menu     ${menuID}  "${menuTitle}"`)

// The section carries the meal list twice: `meals` for rendering and
// `mealsQueryArray` for lookups. Both must agree or the menu renders short.
const sectionsCol = `${ROOT}/menus/${menuID}/sections`
let sectionID = await byTitle(sectionsCol, venue.section)
const sectionDoc = {
	title: venue.section,
	order: 1,
	isActive: true,
	menuID,
	businessProfileID: BP,
	meals: wanted,
	mealsQueryArray: wanted.map((m) => m.docID),
	translation: { ar: { title: venue.sectionAr } },
	translationEdited: { ar: { title: venue.sectionAr } }
}
if (sectionID) await updateDoc(`${sectionsCol}/${sectionID}`, put({ ...sectionDoc, docID: sectionID }))
else {
	sectionID = autoId()
	await createDoc(sectionsCol, put({ ...sectionDoc, docID: sectionID }), sectionID)
}
console.log(`  section  ${sectionID}  "${venue.section}"  ${wanted.length} meals`)

const branchDoc = {
	title: b.title,
	menuID,
	currency: b.currency,
	defaultLanguage: b.defaultLanguage,
	taxValue: b.taxValue,
	cover: b.cover ?? null,
	wifiPassword: '',
	email: '',
	number: '',
	whatsApp: '',
	disabledMeals: [],
	allowSelfOrder: false, // a preview is for reading, not ordering
	showCallWaiterBtn: false,
	skipKitchen: true,
	dense: false,
	isActive: true,
	isDeleted: false,
	businessProfileID: BP,
	lastUpdatedBy: '',
	lastUpdatedAt: now(),
	socialLinks: {
		facebook: '', instagram: '', twitter: '', youtube: '', snapchat: '', tiktok: '',
		linkedin: '', website: '', googleReview: '', locationMap: '', other: '', linkTree: '',
		...b.socialLinks
	}
}
if (branchID) await updateDoc(`${ROOT}/branches/${branchID}`, put({ ...branchDoc, docID: branchID }))
else {
	branchID = autoId()
	await createDoc(`${ROOT}/branches`, put({ ...branchDoc, docID: branchID }), branchID)
}
console.log(`  branch   ${branchID}  "${b.title}"`)

// index 0, titled "Menu View only" — the app's own convention for the table
// the Social QR points at, as opposed to the numbered dine-in tables.
const tablesCol = `${ROOT}/branches/${branchID}/tables`
let tableID = await byTitle(tablesCol, 'Menu View only')
const tableDoc = {
	title: 'Menu View only',
	index: 0,
	note: '',
	isActive: true,
	isVisible: true,
	mealAlwaysAvailable: false,
	menuID,
	branchID,
	businessProfileID: BP
}
if (tableID) await updateDoc(`${tablesCol}/${tableID}`, put({ ...tableDoc, docID: tableID }))
else {
	tableID = autoId()
	await createDoc(tablesCol, put({ ...tableDoc, docID: tableID }), tableID)
}
console.log(`  table    ${tableID}  "Menu View only"`)

const url = `https://menu.astro-menu.com/qr-menu?businessProfileID=${BP}&branchID=${branchID}&tableID=${tableID}`
console.log(`\nPreview link:\n${url}\n`)
