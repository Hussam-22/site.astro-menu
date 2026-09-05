#!/usr/bin/env node
/**
 * The human gate.
 *
 *   node bin/review.mjs                 # the queue, worst confidence first
 *   node bin/review.mjs --show 12       # read build 12 in full
 *   node bin/review.mjs --approve 12
 *   node bin/review.mjs --reject 12 "prices are last year's"
 *
 * Nothing reaches a restaurant without passing through here. The queue is
 * sorted by confidence ascending on purpose: the builds most likely to be
 * wrong are the ones you should look at while you are still fresh.
 */
import { query, recordEvent, close } from '../src/lib/db.js'
import { log } from '../src/lib/log.js'

const args = process.argv.slice(2)
const flag = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : null)

const show = flag('--show')
const approve = flag('--approve')
const reject = flag('--reject')

if (approve) {
	await query(`UPDATE builds SET review_state = 'approved', updated_at = NOW() WHERE id = $1`, [
		approve
	])
	const { rows } = await query('SELECT venue_id FROM builds WHERE id = $1', [approve])
	if (rows[0]) await recordEvent(rows[0].venue_id, 'approved', { buildId: Number(approve) })
	log.info(`build ${approve} approved — run \`npm run render\` to publish it`)
} else if (reject) {
	const reason = args[args.indexOf('--reject') + 2] ?? 'rejected in review'
	await query(
		`UPDATE builds SET review_state = 'rejected', error = $2, updated_at = NOW() WHERE id = $1`,
		[reject, reason]
	)
	log.info(`build ${reject} rejected: ${reason}`)
} else if (show) {
	const { rows } = await query(
		`SELECT b.*, v.name, v.website, v.address FROM builds b
		 JOIN venues v ON v.id = b.venue_id WHERE b.id = $1`,
		[show]
	)
	const build = rows[0]
	if (!build) {
		log.error(`no build ${show}`)
	} else {
		console.log(`\n${build.name} — ${build.address ?? 'no address'}`)
		console.log(`source: ${build.website ?? 'none'}`)
		console.log(`confidence: ${build.parse_confidence}   items: ${build.item_count}`)
		console.log(`notes: ${build.parse_notes || '(none)'}\n`)
		for (const section of build.parsed_menu?.sections ?? []) {
			console.log(`  ${section.title}`)
			for (const item of section.items ?? []) {
				const prices = item.portions?.length
					? item.portions.map((p) => `${p.label} ${p.price}`).join(' / ')
					: item.price
				console.log(`    ${item.title.padEnd(40)} ${prices}`)
			}
		}
		console.log(`\napprove: node bin/review.mjs --approve ${show}`)
	}
} else {
	const { rows } = await query(
		`SELECT b.id, b.parse_confidence, b.item_count, b.section_count, b.parse_notes, v.name
		 FROM builds b JOIN venues v ON v.id = b.venue_id
		 WHERE b.review_state = 'unreviewed' AND b.state = 'parsed'
		 ORDER BY b.parse_confidence ASC NULLS FIRST, b.item_count DESC`
	)
	if (rows.length === 0) {
		log.info('Review queue is empty.')
	} else {
		console.log(`\n${rows.length} builds awaiting review — least confident first\n`)
		for (const row of rows) {
			console.log(
				`  #${String(row.id).padEnd(5)} ${String(row.parse_confidence).padStart(3)}%  ` +
					`${String(row.item_count).padStart(3)} items  ${row.name}`
			)
			if (row.parse_notes) console.log(`         ${row.parse_notes.slice(0, 100)}`)
		}
		console.log(`\nnode bin/review.mjs --show <id>\n`)
	}
}

await close()
