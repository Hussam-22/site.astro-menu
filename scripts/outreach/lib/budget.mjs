/**
 * A hard ceiling on Places requests, counted per calendar month.
 *
 * Places Text Search is free for the first 10,000 requests a month and then
 * charges per thousand. A full sweep is ~144 requests, so the danger is never
 * one run — it is twenty runs while iterating, or someone widening CITIES and
 * TERMS without doing the multiplication. The counter persists to disk so
 * re-runs accumulate, and spend() throws rather than quietly going over.
 *
 * The file is per-machine, not shared state. If the pipeline ever runs from
 * two places, check the real number in the Cloud console before trusting it.
 */
import { readFileSync, writeFileSync } from 'node:fs'

const FILE = '.outreach-usage.json'

/** Google's free allowance. Kept here so the arithmetic below is legible. */
export const FREE_TIER_PER_MONTH = 10000

/**
 * What we allow ourselves. Deliberately far below the free tier so that a
 * mistake costs nothing — hitting this cap is a bug to investigate, not a
 * limit to raise casually.
 */
export const DEFAULT_CAP = 2000

const month = () => new Date().toISOString().slice(0, 7) // YYYY-MM

function load() {
	try {
		return JSON.parse(readFileSync(FILE, 'utf8'))
	} catch {
		return {} // no file yet, or unreadable — start the month at zero
	}
}

export function used() {
	return load()[month()] ?? 0
}

export function remaining(cap = DEFAULT_CAP) {
	return Math.max(0, cap - used())
}

/**
 * Record n requests about to be made. Throws if they would breach the cap, so
 * the caller stops before spending rather than after.
 */
export function spend(n, cap = DEFAULT_CAP) {
	const data = load()
	const m = month()
	const next = (data[m] ?? 0) + n

	if (next > cap) {
		throw new Error(
			`Places request cap reached: ${data[m] ?? 0} used this month, ` +
				`${n} more would exceed the ${cap} cap.\n` +
				`Free tier is ${FREE_TIER_PER_MONTH}/month, so this is a guardrail, not a bill.\n` +
				`Check real usage in the Cloud console before raising OUTREACH_REQUEST_CAP.`
		)
	}

	data[m] = next
	writeFileSync(FILE, JSON.stringify(data, null, 2))
	return next
}

/** Cap from the environment, so a deliberate larger run is an explicit act. */
export const cap = () => Number(process.env.OUTREACH_REQUEST_CAP ?? DEFAULT_CAP)
