/**
 * Writes a parsed menu into Firestore as a *prospect* menu.
 *
 * Everything this file creates is quarantined from the paying-customer
 * surface, in three ways that all have to hold:
 *
 *   1. Every document carries `isProspect: true`. Anything that reports on
 *      customers, bills them, or counts them must filter it out.
 *   2. Every business profile carries `prospectExpiresAt`. A prospect menu is
 *      a demo with a shelf life, not a free tier — `expireProspects()` deletes
 *      the lapsed ones.
 *   3. Nothing here ever writes to an existing profile. A prospect that later
 *      subscribes is migrated deliberately, not by this pipeline.
 *
 * The document shapes mirror what menu.astro-menu-v3 actually reads. Two of
 * them are load-bearing and easy to get wrong:
 *   - `meals/{id}.translation` must be non-empty or `fsGetMealInfo` throws.
 *   - `meals/{id}.translationEdited` and `.mealLabels` must exist, or the meal
 *     card throws the moment a viewer switches language or filters.
 */
import { initializeApp, applicationDefault, cert, getApps } from 'firebase-admin/app'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import { readFileSync } from 'node:fs'
import { CONFIG } from '../config.js'
import { log } from '../lib/log.js'

/** How long a prospect menu stays live before it is cleaned up. */
export const PROSPECT_TTL_DAYS = 90

function app() {
	if (getApps().length > 0) return getApps()[0]

	const path = process.env.GOOGLE_APPLICATION_CREDENTIALS
	const projectId = process.env.FIREBASE_PROJECT_ID

	// A path, raw JSON, or ambient credentials — whichever the environment has.
	let credential
	if (path && path.trim().startsWith('{')) {
		credential = cert(JSON.parse(path))
	} else if (path) {
		credential = cert(JSON.parse(readFileSync(path, 'utf8')))
	} else {
		credential = applicationDefault()
	}

	return initializeApp({
		credential,
		projectId,
		storageBucket: process.env.FIREBASE_STORAGE_BUCKET
	})
}

const store = () => getFirestore(app())

/** Firestore rejects undefined; a menu with no calories has real gaps. */
const clean = (object) =>
	Object.fromEntries(Object.entries(object).filter(([, value]) => value !== undefined))

/**
 * Portions in the shape the meal card sorts and prices.
 * A single-price item still gets one portion, because `sortedPortions[0].price`
 * is the only place the card reads a price from.
 */
function portionsFor(item) {
	if (item.portions?.length > 0) {
		return item.portions.map((p) => ({
			portionSize: p.label || 'Regular',
			price: Number(p.price) || 0
		}))
	}
	return [{ portionSize: 'Regular', price: Number(item.price) || 0 }]
}

function nutritionFor(item) {
	const facts = clean({
		calories: item.calories > 0 ? item.calories : undefined,
		protein: item.protein > 0 ? item.protein : undefined,
		carbs: item.carbs > 0 ? item.carbs : undefined,
		fat: item.fat > 0 ? item.fat : undefined
	})
	return Object.keys(facts).length > 0 ? facts : null
}

/**
 * Creates the whole prospect venue — profile, branch, table, menu, sections and
 * meals — in one batch, so a half-written venue can never be linked to.
 *
 * @param {object} venue   a `venues` row
 * @param {object} menu    the parsed menu
 * @param {{coverUrl?: string, logoUrl?: string}} media
 * @returns {Promise<{businessProfileID: string, menuID: string, menuUrl: string}>}
 */
export async function writeProspectMenu(venue, menu, media = {}) {
	const db = store()
	const branchID = CONFIG.prospectBranchId()
	const tableID = CONFIG.prospectTableId()

	const profileRef = db.collection('businessProfiles').doc()
	const businessProfileID = profileRef.id
	const menuRef = profileRef.collection('menus').doc()
	const menuID = menuRef.id

	const expiresAt = new Date(Date.now() + PROSPECT_TTL_DAYS * 24 * 60 * 60 * 1000)
	const language = (menu.language || 'en').slice(0, 2)

	const batch = db.batch()

	batch.set(
		profileRef,
		clean({
			docID: businessProfileID,
			businessName: venue.name,
			isActive: true,
			logo: media.logoUrl ?? null,
			languages: [language],
			defaultLanguage: language,

			// The quarantine markers. Anything counting customers filters on these.
			isProspect: true,
			prospectPlaceId: venue.place_id,
			prospectExpiresAt: expiresAt,
			createdAt: FieldValue.serverTimestamp()
		})
	)

	const branchRef = profileRef.collection('branches').doc(branchID)
	batch.set(
		branchRef,
		clean({
			docID: branchID,
			title: venue.name,
			cover: media.coverUrl ?? null,
			isActive: true,
			defaultLanguage: language,
			dense: false,
			disabledMeals: [],
			translationEdited: {},
			isProspect: true
		})
	)

	// index 0 is the public "social media" table — the one the canonical URL
	// points at, per fsGetPublicMenuTableID in the menu app.
	batch.set(branchRef.collection('tables').doc(tableID), {
		docID: tableID,
		index: 0,
		isActive: true,
		mealAlwaysAvailable: true,
		isProspect: true
	})

	batch.set(menuRef, {
		docID: menuID,
		title: 'Menu',
		isActive: true,
		isProspect: true
	})

	let order = 0
	let mealCount = 0

	for (const section of menu.sections ?? []) {
		const items = section.items ?? []
		if (items.length === 0) continue

		const sectionRef = menuRef.collection('sections').doc()
		const sectionMeals = []

		for (const item of items) {
			const mealRef = profileRef.collection('meals').doc()
			const portions = portionsFor(item)
			const nutrition = nutritionFor(item)

			batch.set(
				mealRef,
				clean({
					docID: mealRef.id,
					title: item.title,
					description: item.description || '',
					cover: '',
					isActive: true,
					isDeleted: false,
					isNew: false,
					// Non-empty or the app throws. It is honest about what it is:
					// a prospect menu is transcribed, never machine-translated.
					translation: `prospect:${language}`,
					translationEdited: {},
					mealLabels: [],
					nutritionFacts: nutrition ?? undefined,
					portions,
					isProspect: true
				})
			)

			sectionMeals.push({ docID: mealRef.id, portions, isActive: true })
			mealCount++
		}

		batch.set(sectionRef, {
			docID: sectionRef.id,
			title: section.title,
			order: order++,
			isActive: true,
			meals: sectionMeals,
			translationEdited: {},
			isProspect: true
		})
	}

	if (mealCount === 0) throw new Error(`Refusing to write an empty menu for ${venue.name}`)

	await batch.commit()

	const menuUrl =
		`${CONFIG.menuBaseUrl()}/qr-menu/menu` +
		`?businessProfileID=${businessProfileID}&branchID=${branchID}&tableID=${tableID}`

	log.info(`wrote ${venue.name}: ${order} sections, ${mealCount} meals -> ${businessProfileID}`)

	return { businessProfileID, menuID, menuUrl }
}

/**
 * Deletes prospect venues whose demo has lapsed.
 *
 * Run it on a schedule. A prospect menu left live forever is a menu we are
 * hosting for a business that never said yes — and, once it drifts out of
 * date, a wrong menu with our name on it.
 */
export async function expireProspects({ dryRun = false } = {}) {
	const db = store()
	const snapshot = await db
		.collection('businessProfiles')
		.where('isProspect', '==', true)
		.where('prospectExpiresAt', '<', new Date())
		.get()

	if (dryRun) return { found: snapshot.size, deleted: 0 }

	let deleted = 0
	for (const doc of snapshot.docs) {
		// Recursive delete is the only way to take the subcollections with it.
		await db.recursiveDelete(doc.ref)
		deleted++
	}
	return { found: snapshot.size, deleted }
}
