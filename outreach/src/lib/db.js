/**
 * Postgres access. A thin wrapper over `pg` — the pipeline's queries are
 * simple enough that an ORM would be more code than it saves.
 */
import pg from 'pg'
import { CONFIG } from '../config.js'

let pool

export function db() {
	if (!pool) {
		pool = new pg.Pool({
			connectionString: CONFIG.databaseUrl(),
			// Supabase and most managed Postgres require TLS but present a
			// certificate chain node does not ship a root for.
			ssl: process.env.PGSSLMODE === 'disable' ? false : { rejectUnauthorized: false },
			max: 4
		})
	}
	return pool
}

export const query = (text, params) => db().query(text, params)

export async function close() {
	if (pool) {
		await pool.end()
		pool = undefined
	}
}

/**
 * Records a funnel event. Fire-and-remember: every stage calls this, and the
 * `funnel` view in db/schema.sql reads them back.
 */
export const recordEvent = (venueId, kind, detail = {}) =>
	query('INSERT INTO events (venue_id, kind, detail) VALUES ($1, $2, $3)', [
		venueId,
		kind,
		JSON.stringify(detail)
	])
