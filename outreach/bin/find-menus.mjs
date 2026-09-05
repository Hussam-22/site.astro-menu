#!/usr/bin/env node
/**
 * Stage 3 — find the menu each venue already publishes.
 *
 *   npm run find-menus -- --limit 100
 *
 * Crawls politely and costs nothing but time. Re-run `npm run qualify`
 * afterwards: finding a venue's PDF is what turns them from 'unreachable' into
 * a real prospect.
 */
import { findMenuSources } from '../src/enrich/menu-finder.js'
import { query, recordEvent, close } from '../src/lib/db.js'
import { log } from '../src/lib/log.js'

const args = process.argv.slice(2)
const limit = Number(args[args.indexOf('--limit') + 1]) || 100

log.stage(`Finding menus for up to ${limit} venues`)

// Venues with a website we have not crawled yet, best-rated first — a venue
// that cares about its Google rating usually cares about its menu too.
const { rows: venues } = await query(
	`SELECT v.* FROM venues v
	 WHERE v.website IS NOT NULL
	   AND v.deleted_at IS NULL AND v.opted_out_at IS NULL
	   AND NOT EXISTS (SELECT 1 FROM menu_sources m WHERE m.venue_id = v.id)
	 ORDER BY v.rating_count DESC NULLS LAST
	 LIMIT $1`,
	[limit]
)

if (venues.length === 0) {
	log.warn('No venues left to crawl. Run `npm run source` first, or raise --limit.')
	await close()
	process.exit(0)
}

let withMenus = 0
let sourcesFound = 0

for (const [index, venue] of venues.entries()) {
	let sources = []
	try {
		sources = await findMenuSources(venue.website)
	} catch (error) {
		log.warn(`${venue.name}: ${error.message}`)
	}

	for (const source of sources) {
		await query(
			`INSERT INTO menu_sources (venue_id, kind, url, discovered_on)
			 VALUES ($1, $2, $3, $4)
			 ON CONFLICT (venue_id, url) DO NOTHING`,
			[venue.id, source.kind, source.url, source.discovered_on]
		)
		sourcesFound++
	}

	if (sources.length > 0) {
		withMenus++
		await recordEvent(venue.id, 'menu_found', { count: sources.length })
	}

	log.info(`${index + 1}/${venues.length} ${venue.name}: ${sources.length} artifacts`)
}

log.summary('Menu discovery', {
	crawled: venues.length,
	'venues with a menu artifact': withMenus,
	'artifacts found': sourcesFound,
	'hit rate': `${Math.round((withMenus / venues.length) * 100)}%`
})

await close()
