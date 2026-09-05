#!/usr/bin/env node
/**
 * Stage 5 — publish an approved build and photograph it.
 *
 *   npm run render
 *
 * Writes the menu into Firestore as a prospect venue, then renders the QR code
 * and a screenshot of the live menu on a phone. Only approved builds are
 * touched: this is the first stage that puts anything on the public internet.
 */
import { writeProspectMenu } from '../src/build/firestore.js'
import { renderAssets } from '../src/build/render.js'
import { query, recordEvent, close } from '../src/lib/db.js'
import { log } from '../src/lib/log.js'

const args = process.argv.slice(2)
const limit = Number(args[args.indexOf('--limit') + 1]) || 25

log.stage('Publishing approved builds')

const { rows: builds } = await query(
	`SELECT b.*, v.name, v.slug, v.place_id, v.city, v.address
	 FROM builds b JOIN venues v ON v.id = b.venue_id
	 WHERE b.review_state = 'approved' AND b.state = 'parsed'
	 ORDER BY b.parse_confidence DESC
	 LIMIT $1`,
	[limit]
)

if (builds.length === 0) {
	log.warn('No approved builds. Run `node bin/review.mjs` first.')
	await close()
	process.exit(0)
}

let published = 0
let failed = 0

for (const build of builds) {
	try {
		const venue = {
			name: build.name,
			place_id: build.place_id,
			city: build.city,
			address: build.address
		}
		const { businessProfileID, menuID, menuUrl } = await writeProspectMenu(venue, build.parsed_menu)
		const assets = await renderAssets({ menuUrl, slug: build.slug })

		await query(
			`UPDATE builds
			 SET state = 'rendered', business_profile_id = $2, menu_id = $3, menu_url = $4,
			     qr_path = $5, screenshot_path = $6, updated_at = NOW()
			 WHERE id = $1`,
			[build.id, businessProfileID, menuID, menuUrl, assets.qrPath, assets.screenshotPath]
		)
		await recordEvent(build.venue_id, 'published', { buildId: build.id, menuUrl })
		published++
		log.info(`${build.name} -> ${menuUrl}`)
	} catch (error) {
		failed++
		log.error(`${build.name}: ${error.message}`)
		await query('UPDATE builds SET error = $2, updated_at = NOW() WHERE id = $1', [
			build.id,
			error.message
		])
	}
}

log.summary('Publishing', {
	approved: builds.length,
	published,
	failed,
	next: 'npm run export  — then send'
})

await close()
