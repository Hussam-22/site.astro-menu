/**
 * Who is worth a DM, and why. Kept apart from source-venues.mjs so the
 * judgement can be checked without spending Places requests.
 *
 * The menu situation drives the score, not the venue's size. A busy cafe with
 * a PDF menu is a better lead than a busier one with a working digital menu,
 * because the pitch is "your menu is a PDF nobody can read on a phone" — a
 * pain the owner already knows about. Guessing at venues whose menu situation
 * is Unknown is how outreach turns into spam.
 */

/** instagram.com/<handle> out of whatever they listed as a website. */
export function instagramHandle(url) {
	if (!url) return null
	const m = url.match(/instagram\.com\/([A-Za-z0-9._]+)/i)
	if (!m) return null
	const handle = m[1]
	// instagram.com/p/... is a post permalink, not a profile.
	return ['p', 'reel', 'explore', 'stories'].includes(handle.toLowerCase()) ? null : handle
}

const LINK_IN_BIO = /linktr\.ee|linkin\.bio|bio\.link|beacons\.ai/i
const THIRD_PARTY = /zomato|talabat|deliveroo|careem|restaurantguru|tripadvisor|foursquare/i

/** A name repeating across the emirates is a chain; head office owns the menu. */
export function isChain(name, nameCount) {
	return (nameCount.get(name) ?? 0) > 2
}

/**
 * How much pain each situation represents, which is the same as how strong our
 * opening line is. "No menu online" and "PDF" are the two we can name out loud
 * without sounding like we are guessing.
 */
const SITUATION_WEIGHT = {
	'No menu online': 50, // "there is no menu anywhere" — undeniable
	PDF: 45, // "your menu is a PDF people pinch-zoom" — undeniable
	'Photos only': 35, // menu is an Instagram photo, already out of date
	'Third-party only': 25, // Zomato owns their menu page and their branding
	Unknown: 0, // we have not looked. Do not contact on a guess.
	'Already digital': -40 // they solved it. Different conversation entirely.
}

export function score(v, chain, situation = 'Unknown') {
	if (chain) return 0 // head office decides, not the venue. Never worth a DM.

	let s = SITUATION_WEIGHT[situation] ?? 0
	const reviews = v.userRatingCount ?? 0

	s += Math.min(reviews / 15, 30) // busy enough to afford 59 AED/month
	if (reviews < 20) s -= 20 // too new or too quiet to convert

	if ((v.rating ?? 0) >= 4.0) s += 10 // good food, bad menu — our exact buyer
	if (/Al Ain|Abu Dhabi/i.test(v.formattedAddress ?? '')) s += 15 // local proof point

	return Math.round(s)
}

/**
 * What we can infer from the Places record alone. Deliberately conservative:
 * anything with a real website stays Unknown until menu-probe.mjs has actually
 * opened it, because "they have a website" says nothing about whether the menu
 * on it is a PDF, an image, or missing.
 */
export function situationFromPlaces(v) {
	if (!v.websiteUri) return 'No menu online'
	if (instagramHandle(v.websiteUri) || LINK_IN_BIO.test(v.websiteUri)) return 'Photos only'
	if (THIRD_PARTY.test(v.websiteUri)) return 'Third-party only'
	return 'Unknown'
}
