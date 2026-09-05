/**
 * Reads and writes against the `venues` table.
 *
 * Upserts are keyed on place_id, which is the one Places field we are allowed
 * to keep indefinitely. Everything else is refreshed on write, which is both
 * what the licence requires and what keeps a moved or renamed venue accurate.
 */
import { query } from './db.js'
import { uniqueSlug } from './slug.js'

const COLUMNS = [
	'place_id',
	'name',
	'slug',
	'primary_type',
	'emirate',
	'city',
	'address',
	'lat',
	'lng',
	'phone',
	'website',
	'maps_url',
	'rating',
	'rating_count',
	'price_level',
	'business_status',
	'photo_names'
]

/** Slugs already in use, so a new batch cannot collide with an old one. */
export async function takenSlugs() {
	const { rows } = await query('SELECT slug FROM venues')
	return new Set(rows.map((r) => r.slug))
}

/**
 * Inserts new venues and refreshes existing ones.
 *
 * A venue that has opted out is deliberately left untouched: re-sourcing it
 * would quietly resurrect a lead someone asked us to drop.
 */
export async function upsertVenues(venues, taken = new Set()) {
	let inserted = 0
	let refreshed = 0

	for (const venue of venues) {
		const slug = uniqueSlug(venue.name, venue.place_id, taken)
		if (!slug) continue
		taken.add(slug)

		const values = COLUMNS.map((col) => (col === 'slug' ? slug : (venue[col] ?? null)))
		const placeholders = COLUMNS.map((_, i) => `$${i + 1}`).join(', ')
		// slug is not refreshed: the /m/<slug> link may already be in an inbox.
		const updates = COLUMNS.filter((c) => c !== 'place_id' && c !== 'slug')
			.map((c) => `${c} = EXCLUDED.${c}`)
			.join(', ')

		const { rows } = await query(
			`INSERT INTO venues (${COLUMNS.join(', ')})
			 VALUES (${placeholders})
			 ON CONFLICT (place_id) DO UPDATE
			   SET ${updates}, refreshed_at = NOW()
			   WHERE venues.opted_out_at IS NULL
			 RETURNING (xmax = 0) AS is_insert`,
			values
		)
		if (rows.length === 0) continue
		rows[0].is_insert ? inserted++ : refreshed++
	}

	return { inserted, refreshed }
}

/** Venues due a qualification pass, with their discovered menu sources attached. */
export async function venuesForQualification() {
	const { rows } = await query(`
		SELECT v.*,
		       COALESCE(
		         JSON_AGG(JSON_BUILD_OBJECT('kind', m.kind, 'url', m.url))
		           FILTER (WHERE m.id IS NOT NULL),
		         '[]'
		       ) AS menu_sources
		FROM venues v
		LEFT JOIN menu_sources m ON m.venue_id = v.id
		WHERE v.deleted_at IS NULL
		GROUP BY v.id
	`)
	return rows
}

export async function saveScore(venueId, { score, segment, reasons }) {
	await query('UPDATE venues SET score = $2, segment = $3, score_reasons = $4 WHERE id = $1', [
		venueId,
		score,
		segment,
		JSON.stringify(reasons)
	])
}

/** The top of the queue for a given stage, highest score first. */
export async function topVenues({ segment = 'prospect', limit = 50, minScore = 0 } = {}) {
	const { rows } = await query(
		`SELECT * FROM venues
		 WHERE segment = $1 AND score >= $2
		   AND deleted_at IS NULL AND opted_out_at IS NULL
		 ORDER BY score DESC NULLS LAST, rating_count DESC NULLS LAST
		 LIMIT $3`,
		[segment, minScore, limit]
	)
	return rows
}
