#!/usr/bin/env node
/**
 * Stage 6 — export published prospects for the marketing site.
 *
 *   npm run export
 *
 * Writes ../src/data/prospects.json, which the Astro site turns into one
 * noindexed /m/<slug> claim page per venue. Only builds that are approved AND
 * rendered are exported: a page cannot exist for a menu nobody checked.
 */
import { writeFile, mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { query, close } from '../src/lib/db.js'
import { log } from '../src/lib/log.js'

const OUTPUT = resolve(process.cwd(), '../src/data/prospects.json')

const { rows } = await query(`
	SELECT v.slug, v.name, v.city, v.emirate, b.menu_url, b.item_count, b.section_count
	FROM builds b
	JOIN venues v ON v.id = b.venue_id
	WHERE b.state = 'rendered' AND b.review_state = 'approved'
	  AND v.opted_out_at IS NULL AND v.deleted_at IS NULL
	ORDER BY v.name
`)

const prospects = rows.map((row) => ({
	slug: row.slug,
	name: row.name,
	city: row.city ?? row.emirate ?? '',
	menuUrl: row.menu_url,
	itemCount: row.item_count,
	sectionCount: row.section_count
}))

await mkdir(dirname(OUTPUT), { recursive: true })
await writeFile(OUTPUT, `${JSON.stringify(prospects, null, '\t')}\n`, 'utf8')

log.summary('Export', {
	prospects: prospects.length,
	written: OUTPUT,
	next: 'redeploy the site — pages appear at /m/<slug>, noindexed'
})

await close()
