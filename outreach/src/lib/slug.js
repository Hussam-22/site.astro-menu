/**
 * Venue name -> URL slug, used for the /m/<slug> claim page.
 *
 * Arabic and other non-Latin names are common in this market and transliterating
 * them badly is worse than not transliterating them at all, so any name that
 * leaves nothing usable falls back to the place_id. The slug only has to be
 * stable and unique; it is never read aloud.
 */
export function slugify(name, placeId = '') {
	const base = String(name)
		.normalize('NFKD')
		// Strip combining marks so "Café" becomes "cafe" rather than "caf".
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/&/g, ' and ')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 60)
		.replace(/-+$/g, '')

	if (base) return base

	// Place ids are opaque and case-sensitive; lowercasing keeps the slug a
	// valid single-case path segment and collisions are still impossible in
	// practice because the id is 27 characters of entropy.
	const fallback = placeId.toLowerCase().replace(/[^a-z0-9]+/g, '')
	return fallback ? `venue-${fallback.slice(0, 24)}` : ''
}

/**
 * Makes a slug unique against a set of slugs already taken, by appending -2,
 * -3 and so on. Two branches of the same name are common enough that silently
 * overwriting one would lose a lead.
 */
export function uniqueSlug(name, placeId, taken) {
	const base = slugify(name, placeId)
	if (!base) return ''
	if (!taken.has(base)) return base
	for (let n = 2; n < 1000; n++) {
		const candidate = `${base}-${n}`
		if (!taken.has(candidate)) return candidate
	}
	return `${base}-${placeId
		.toLowerCase()
		.replace(/[^a-z0-9]/g, '')
		.slice(0, 8)}`
}
