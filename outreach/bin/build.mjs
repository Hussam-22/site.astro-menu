#!/usr/bin/env node
/**
 * Stage 4 — build the menu.
 *
 *   npm run build-menus -- --limit 20
 *   npm run build-menus -- --limit 5 --venue 42
 *
 * Parses each venue's published menu with Claude and stores the result as an
 * UNREVIEWED build. Nothing is written to Firestore and nothing is sent here —
 * a build has to be approved first, because a wrong price in a restaurant
 * owner's inbox costs more than every token this stage will ever spend.
 */
import { verifySource } from '../src/enrich/menu-finder.js'
import { parseMenu, isWorthReviewing } from '../src/build/parse-menu.js'
import { query, recordEvent, close } from '../src/lib/db.js'
import { log } from '../src/lib/log.js'

const args = process.argv.slice(2)
const limit = Number(args[args.indexOf('--limit') + 1]) || 20
const venueId = args.includes('--venue') ? Number(args[args.indexOf('--venue') + 1]) : null

log.stage('Building menus')

const { rows: venues } = await query(
	`SELECT v.* FROM venues v
	 WHERE v.segment = 'prospect'
	   AND v.deleted_at IS NULL AND v.opted_out_at IS NULL
	   AND ($1::BIGINT IS NULL OR v.id = $1)
	   AND NOT EXISTS (SELECT 1 FROM builds b WHERE b.venue_id = v.id AND b.state <> 'failed')
	 ORDER BY v.score DESC NULLS LAST
	 LIMIT $2`,
	[venueId, limit]
)

if (venues.length === 0) {
	log.warn('Nothing to build. Run `npm run find-menus` then `npm run qualify` first.')
	await close()
	process.exit(0)
}

const counts = { built: 0, rejected: 0, failed: 0 }

for (const venue of venues) {
	const { rows: sourceRows } = await query(
		// PDFs first, then images: a PDF is text, and text beats a photo of text.
		`SELECT * FROM menu_sources WHERE venue_id = $1
		 ORDER BY CASE kind WHEN 'pdf' THEN 0 WHEN 'image' THEN 1 ELSE 2 END
		 LIMIT 6`,
		[venue.id]
	)

	// Verify before spending tokens — a "menu.pdf" that 404s to an HTML page is
	// common enough to be worth a fetch each.
	const checked = []
	for (const source of sourceRows) {
		const ok = await verifySource(source)
		if (ok) checked.push(ok)
	}

	// One kind per build. A PDF and three photos sent together read as one
	// menu with its pages shuffled, and the model transcribes the overlap twice.
	const verified = checked.filter((source) => source.kind === checked[0]?.kind)

	if (verified.length === 0) {
		log.warn(`${venue.name}: no usable artifact`)
		counts.failed++
		continue
	}

	try {
		const { menu, stats, usage, model } = await parseMenu(venue, verified)
		const verdict = isWorthReviewing({ menu, stats })

		const { rows } = await query(
			`INSERT INTO builds (venue_id, menu_source_id, state, review_state, parsed_menu,
			                     section_count, item_count, parse_confidence, parse_notes,
			                     model, input_tokens, output_tokens)
			 VALUES ($1, $2, 'parsed', $3, $4, $5, $6, $7, $8, $9, $10, $11)
			 RETURNING id`,
			[
				venue.id,
				verified[0].id ?? null,
				verdict.ok ? 'unreviewed' : 'rejected',
				JSON.stringify(menu),
				stats.sectionCount,
				stats.itemCount,
				menu.confidence,
				verdict.ok ? menu.notes : `${verdict.why}. ${menu.notes}`,
				model,
				usage.input_tokens,
				usage.output_tokens
			]
		)

		if (verdict.ok) {
			counts.built++
			await recordEvent(venue.id, 'built', { buildId: rows[0].id, items: stats.itemCount })
		} else {
			counts.rejected++
			log.warn(`${venue.name}: auto-rejected — ${verdict.why}`)
		}
	} catch (error) {
		counts.failed++
		log.error(`${venue.name}: ${error.message}`)
		await query(
			`INSERT INTO builds (venue_id, state, review_state, error) VALUES ($1, 'failed', 'rejected', $2)`,
			[venue.id, error.message]
		)
	}
}

log.summary('Builds', {
	attempted: venues.length,
	'awaiting review': counts.built,
	'auto-rejected': counts.rejected,
	failed: counts.failed,
	next: 'npm run review  — then npm run render'
})

await close()
