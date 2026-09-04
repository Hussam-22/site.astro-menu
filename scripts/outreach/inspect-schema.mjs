/**
 * Walks the Firestore tree to find where meals live, then prints one real meal
 * document verbatim.
 *
 * Run this before build-menu.mjs ever writes anything. Writing straight to
 * Firestore skips the dashboard's own validation, so the only safe way to
 * shape a new meal is to copy the shape of one the app itself created.
 *
 *   node --env-file=.env scripts/outreach/inspect-schema.mjs
 */
import { collectionIds, decFields, listDocs } from './lib/firestore.mjs'

const BP = process.env.ASTRO_BUSINESS_PROFILE || 'V1iYvft42Rd19Gx2swCo'

console.log('Root collections:')
const roots = await collectionIds()
console.log(' ', roots.join(', ') || '(none visible)')

// The dashboard scopes everything to one business profile, so meals should sit
// under that document rather than at the root.
for (const root of roots) {
	let subs = []
	try {
		subs = await collectionIds(`/${root}/${BP}`)
	} catch {
		continue // not the collection holding business profiles
	}
	if (!subs.length) continue
	console.log(`\n/${root}/${BP} contains: ${subs.join(', ')}`)

	const mealsCol = subs.find((s) => /^meals?$/i.test(s))
	if (!mealsCol) continue

	const path = `/${root}/${BP}/${mealsCol}`
	const { documents = [] } = await listDocs(path, 3)
	console.log(`\n${documents.length} sample doc(s) from ${path}\n`)

	for (const d of documents) {
		console.log('id:', d.name.split('/').pop())
		console.log(JSON.stringify(decFields(d), null, 2))
		console.log('---')
	}
	console.log(`\nMEAL COLLECTION PATH: ${path}`)
	process.exit(0)
}

console.log('\nCould not locate a meals collection. Root list above is the place to start.')
