/**
 * Qualification.
 *
 * The pipeline's whole advantage is that it arrives with the venue's menu
 * already built, so the score answers two questions in order:
 *
 *   1. Can we build their menu at all?  (do they publish one anywhere)
 *   2. Do they visibly lack what we sell?  (no digital menu of their own)
 *
 * A venue we cannot build for is not a lead, however good it looks otherwise.
 * Everything here is a pure function over a venue row so it can be tested and
 * re-run over the database without touching an API.
 */

/** Menu platforms a venue may already be on. Seeing one changes the pitch. */
export const COMPETITOR_HOSTS = [
	'orderific.com',
	'menu.tf',
	'tableqr.',
	'qmenu.',
	'emenu.',
	'mycloudmenu.',
	'menuu.',
	'flipdish.',
	'gloriafood.',
	'menutiger.',
	'scanmenu.',
	'thefork.',
	'zomato.com',
	'talabat.com',
	'deliveroo.',
	'noon.com'
]

/** Link-in-bio and social hosts — a venue "website" that is not a website. */
export const PLACEHOLDER_HOSTS = [
	'linktr.ee',
	'linkin.bio',
	'lnk.bio',
	'bio.link',
	'instagram.com',
	'facebook.com',
	'm.facebook.com',
	'wa.me',
	'api.whatsapp.com',
	'beacons.ai',
	'taplink.'
]

const hostOf = (url) => {
	try {
		return new URL(url).hostname.toLowerCase().replace(/^www\./, '')
	} catch {
		return ''
	}
}

const matches = (host, list) => list.some((needle) => host.includes(needle))

/** Chains are a different sale; the self-serve pitch is wrong for them. */
export function looksLikeChain(venue, nameCounts) {
	const count = nameCounts.get(normaliseName(venue.name)) ?? 1
	return count >= 5
}

/** "Foamy Coffee Cafe (Al Jimi)" and "Foamy Coffee Cafe" are the same brand. */
export function normaliseName(name) {
	return String(name)
		.toLowerCase()
		.replace(/\(.*?\)/g, '')
		.replace(/\b(branch|br|llc|l\.l\.c|co|company|restaurant|cafe|coffee)\b/g, '')
		.replace(/[^a-z0-9؀-ۿ]+/g, '')
		.trim()
}

/**
 * @param {object} venue                a row from `venues`
 * @param {object} context
 * @param {Map<string, number>} context.nameCounts  normalised name -> how many venues carry it
 * @param {Array<{kind: string}>} [context.menuSources]  what the menu finder discovered
 * @returns {{ score: number, segment: string, reasons: string[] }}
 */
export function scoreVenue(venue, { nameCounts = new Map(), menuSources = [] } = {}) {
	const reasons = []
	let score = 0

	// --- Hard disqualifiers -------------------------------------------------
	if (venue.business_status && venue.business_status !== 'OPERATIONAL') {
		return { score: 0, segment: 'disqualified', reasons: ['not operational'] }
	}
	if (venue.opted_out_at) {
		return { score: 0, segment: 'disqualified', reasons: ['opted out'] }
	}

	if (looksLikeChain(venue, nameCounts)) {
		return {
			score: 0,
			segment: 'chain',
			reasons: [`${nameCounts.get(normaliseName(venue.name))} venues share this name`]
		}
	}

	const host = hostOf(venue.website ?? '')

	// --- Already on a competitor -------------------------------------------
	// Not a disqualifier: they have proved they want a digital menu and are
	// paying someone for it. But it is a switching pitch, not a first-menu
	// pitch, so it is segmented away from the main sequence.
	if (host && matches(host, COMPETITOR_HOSTS)) {
		return { score: 30, segment: 'competitor', reasons: [`already on ${host}`] }
	}

	// --- Can we build for them? --------------------------------------------
	// This dominates the score. Everything else is a tiebreak.
	const kinds = new Set(menuSources.map((s) => s.kind))
	if (kinds.has('pdf')) {
		score += 45
		reasons.push('publishes a PDF menu we can parse')
	} else if (kinds.has('image')) {
		score += 35
		reasons.push('publishes menu photos we can parse')
	} else if (kinds.has('html')) {
		score += 25
		reasons.push('has a menu page we can parse')
	} else if (menuSources.length === 0) {
		reasons.push('no menu artifact found yet')
	}

	// --- Do they visibly lack a digital menu? ------------------------------
	if (!venue.website) {
		score += 25
		reasons.push('no website at all')
	} else if (matches(host, PLACEHOLDER_HOSTS)) {
		score += 20
		reasons.push(`"website" is ${host}, not a site`)
	}

	// --- Is this a real, active, independent business? ---------------------
	const ratings = venue.rating_count ?? 0
	if (ratings >= 50 && ratings <= 2000) {
		score += 15
		reasons.push(`${ratings} reviews — established, not a chain`)
	} else if (ratings >= 20) {
		score += 8
		reasons.push(`${ratings} reviews`)
	} else {
		reasons.push(`only ${ratings} reviews — may be too new or inactive`)
	}

	const rating = Number(venue.rating ?? 0)
	if (rating >= 4.3) {
		score += 10
		reasons.push(`${rating}★ — a venue that cares how it presents`)
	} else if (rating >= 4.0) {
		score += 5
		reasons.push(`${rating}★`)
	}

	// --- Can we reach them? ------------------------------------------------
	if (venue.phone) {
		score += 5
		reasons.push('phone number on file')
	} else {
		reasons.push('no phone number — hard to reach')
	}

	// A venue with photos gives us a cover image, which is the difference
	// between a built menu that looks like theirs and one that looks generic.
	if ((venue.photo_names ?? []).length >= 3) {
		score += 5
		reasons.push('enough photos for a cover image')
	}

	const buildable = kinds.size > 0
	const segment = buildable ? 'prospect' : 'unreachable'

	return { score: Math.min(100, score), segment, reasons }
}

/**
 * Counts how many venues share each normalised name, so the chain test has
 * something to test against. Built once per qualification run.
 */
export function countNames(venues) {
	const counts = new Map()
	for (const venue of venues) {
		const key = normaliseName(venue.name)
		if (!key) continue
		counts.set(key, (counts.get(key) ?? 0) + 1)
	}
	return counts
}
