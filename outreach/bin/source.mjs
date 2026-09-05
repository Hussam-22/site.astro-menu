#!/usr/bin/env node
/**
 * Stage 1 — sourcing.
 *
 *   npm run source                      # every area in the grid
 *   npm run source -- --area al-ain     # one area
 *   npm run source -- --dry-run         # print the plan and the cost, call nothing
 *
 * Sweeps the search grid, upserts what it finds, and stops. Nothing here
 * contacts a venue or spends a token on parsing.
 */
import { tilesFor, AREAS } from '../src/sources/grid.js'
import { sweep } from '../src/sources/places.js'
import { upsertVenues, takenSlugs } from '../src/lib/venues.js'
import { recordEvent, close, query } from '../src/lib/db.js'
import { log } from '../src/lib/log.js'

const args = process.argv.slice(2)
const areaIds = args.filter((a, i) => args[i - 1] === '--area')
const dryRun = args.includes('--dry-run')

const tiles = tilesFor(areaIds)

log.stage(`Sourcing ${areaIds.length > 0 ? areaIds.join(', ') : AREAS.map((a) => a.id).join(', ')}`)
log.info(`${tiles.length} tiles to sweep`)

if (dryRun) {
	// Nearby Search (Pro) is roughly $32 per 1,000 calls at the time of
	// writing. A saturated tile adds nine more, so the ceiling is ten times the
	// tile count — only reached if every single tile saturates, which no real
	// sweep does.
	const low = (tiles.length / 1000) * 32
	log.summary('Dry run — nothing called', {
		tiles: tiles.length,
		'estimated cost (no subdivision)': `$${low.toFixed(2)}`,
		'estimated cost (every tile saturated)': `$${(low * 10).toFixed(2)}`,
		note: 'verify the rate at https://mapsplatform.google.com/pricing/'
	})
	process.exit(0)
}

const taken = await takenSlugs()
let swept = 0

const { venues, requests, subdivided } = await sweep(tiles, {
	onTile: ({ found, total }) => {
		swept++
		if (swept % 25 === 0 || found >= 20) {
			log.info(`tile ${swept}/${tiles.length} · +${found} · ${total} unique so far`)
		}
	}
})

log.info(`sweep done: ${venues.length} unique venues from ${requests} requests`)

const { inserted, refreshed } = await upsertVenues(venues, taken)

// One 'sourced' event per newly inserted venue, so the funnel view has a top.
const { rows } = await query(
	`SELECT id FROM venues WHERE place_id = ANY($1) AND created_at > NOW() - INTERVAL '1 hour'`,
	[venues.map((v) => v.place_id)]
)
for (const row of rows) await recordEvent(row.id, 'sourced')

log.summary('Sourcing', {
	tiles: tiles.length,
	'requests made': requests,
	'tiles subdivided': subdivided,
	'unique venues': venues.length,
	'new rows': inserted,
	refreshed
})

await close()
