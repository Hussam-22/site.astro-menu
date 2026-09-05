#!/usr/bin/env node
/**
 * Stage 2 — qualification.
 *
 *   npm run qualify
 *
 * Pure scoring over what is already in the database: no API calls, no cost.
 * Safe to re-run after every sourcing or menu-finding pass, and worth doing —
 * a venue's score changes the moment the menu finder discovers their PDF.
 */
import { scoreVenue, countNames } from '../src/qualify/score.js'
import { venuesForQualification, saveScore } from '../src/lib/venues.js'
import { recordEvent, close } from '../src/lib/db.js'
import { log } from '../src/lib/log.js'

log.stage('Qualifying')

const venues = await venuesForQualification()
if (venues.length === 0) {
	log.warn('No venues in the database. Run `npm run source` first.')
	await close()
	process.exit(0)
}

const nameCounts = countNames(venues)
const segments = {}

for (const venue of venues) {
	const result = scoreVenue(venue, { nameCounts, menuSources: venue.menu_sources ?? [] })
	await saveScore(venue.id, result)
	segments[result.segment] = (segments[result.segment] ?? 0) + 1
	if (result.segment === 'prospect' && venue.segment !== 'prospect') {
		await recordEvent(venue.id, 'qualified', { score: result.score })
	}
}

const prospects = venues.filter((v) => (v.menu_sources ?? []).length > 0).length

log.summary('Qualification', {
	scored: venues.length,
	...segments,
	'with a menu artifact': prospects
})

await close()
