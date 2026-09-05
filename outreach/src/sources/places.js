/**
 * Google Places API (New) — the sourcing stage.
 *
 * On caching: Google's terms let us store `place_id` indefinitely, but the
 * other fields are licensed content with a 30-day cache limit. So every row
 * carries `refreshed_at`, the sweep re-fetches anything older than that, and
 * `place_id` is the only field we treat as ours to keep. `staleBefore()` below
 * is what enforces it.
 *
 * Cost: one searchNearby call per tile. The Al Ain + Abu Dhabi grid is ~1,600
 * tiles, which at the current Nearby Search (Pro) rate is roughly $50 a full
 * sweep — verify against https://mapsplatform.google.com/pricing/ before
 * committing to a schedule, since SKU pricing changes.
 */
import { getJson } from '../lib/http.js'
import { log } from '../lib/log.js'
import { CONFIG } from '../config.js'

const ENDPOINT = 'https://places.googleapis.com/v1/places:searchNearby'

/** The venue types worth a QR menu. Bars and night clubs are deliberately out. */
export const INCLUDED_TYPES = [
	'restaurant',
	'cafe',
	'coffee_shop',
	'bakery',
	'meal_takeaway',
	'breakfast_restaurant',
	'brunch_restaurant',
	'juice_shop',
	'dessert_shop',
	'ice_cream_shop'
]

/**
 * The field mask is billing: each field group moves the call into a more
 * expensive SKU. This is the minimum that lets the qualifier do its job —
 * anything not scored is not requested.
 */
const FIELD_MASK = [
	'places.id',
	'places.displayName',
	'places.primaryType',
	'places.formattedAddress',
	'places.addressComponents',
	'places.location',
	'places.nationalPhoneNumber',
	'places.internationalPhoneNumber',
	'places.websiteUri',
	'places.googleMapsUri',
	'places.rating',
	'places.userRatingCount',
	'places.priceLevel',
	'places.businessStatus',
	'places.photos'
].join(',')

/** Anything cached longer than this must be re-fetched, per Google's terms. */
export const staleBefore = (now = new Date()) => new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

/**
 * One tile. Returns up to `maxResultCount` places; `saturated` is true when the
 * tile came back full, which means it is hiding venues and should be re-swept
 * at a smaller radius.
 */
export async function searchTile(tile, { maxResultCount = 20 } = {}) {
	const body = {
		includedTypes: INCLUDED_TYPES,
		maxResultCount,
		locationRestriction: {
			circle: {
				center: { latitude: tile.lat, longitude: tile.lng },
				radius: tile.radiusM
			}
		}
	}

	const data = await getJson(ENDPOINT, {
		method: 'POST',
		headers: {
			'content-type': 'application/json',
			'x-goog-api-key': CONFIG.placesKey(),
			'x-goog-fieldmask': FIELD_MASK
		},
		body: JSON.stringify(body)
	})

	const places = data.places ?? []
	return { places, saturated: places.length >= maxResultCount }
}

/**
 * A saturated tile re-swept as a 3x3 block of smaller tiles.
 *
 * The obvious version — four circles of half the radius, one per quadrant —
 * does not actually cover the original circle. A point due north at a quarter
 * of the radius is 0.56R from the nearest quarter-centre but only 0.5R is
 * covered, so it falls in the gap between all four, and the venues there are
 * silently lost. Covering a disc with four equal discs needs a radius of about
 * 0.72R, which barely relieves the saturation the subdivision exists to fix.
 *
 * So: nine centres on a lattice at spacing R/2. The furthest any point of the
 * original disc can be from the nearest centre is then R/2 (a rim point due
 * north of the top-middle centre), so a radius of 0.55R covers it with margin
 * — and nine tiles of 20 results each raise the tile's ceiling from 20 venues
 * to 180.
 */
export const SUBDIVISION_RADIUS_FACTOR = 0.55

export function subdivide(tile) {
	const radiusM = tile.radiusM * SUBDIVISION_RADIUS_FACTOR
	const spacingM = tile.radiusM / 2

	const latStep = (spacingM / 6_371_000) * (180 / Math.PI)
	const lngStep = latStep / Math.cos((tile.lat * Math.PI) / 180)

	const centres = []
	for (const dLat of [-1, 0, 1]) {
		for (const dLng of [-1, 0, 1]) {
			centres.push({
				...tile,
				lat: tile.lat + dLat * latStep,
				lng: tile.lng + dLng * lngStep,
				radiusM
			})
		}
	}
	return centres
}

/** Pulls the emirate out of the address components, falling back to the tile. */
function emirateOf(place, tile) {
	const admin = (place.addressComponents ?? []).find((c) =>
		(c.types ?? []).includes('administrative_area_level_1')
	)
	return admin?.longText ?? tile.emirate ?? null
}

/** Places API shape -> the `venues` table shape. */
export function toVenue(place, tile) {
	return {
		place_id: place.id,
		name: place.displayName?.text ?? '',
		primary_type: place.primaryType ?? null,
		emirate: emirateOf(place, tile),
		city: tile.city ?? null,
		address: place.formattedAddress ?? null,
		lat: place.location?.latitude ?? null,
		lng: place.location?.longitude ?? null,
		phone: place.internationalPhoneNumber ?? place.nationalPhoneNumber ?? null,
		website: place.websiteUri ?? null,
		maps_url: place.googleMapsUri ?? null,
		rating: place.rating ?? null,
		rating_count: place.userRatingCount ?? null,
		price_level: place.priceLevel ?? null,
		business_status: place.businessStatus ?? null,
		// Photo resource names, not URLs: a URL expires, the name does not, and
		// the media endpoint turns a name back into bytes when we need a cover.
		photo_names: (place.photos ?? []).slice(0, 6).map((p) => p.name)
	}
}

/**
 * Sweeps every tile, subdividing saturated ones, and returns venues keyed by
 * place_id so the same venue seen from four overlapping circles is one row.
 *
 * `onTile` is called after each request so a long sweep can report progress
 * and persist incrementally rather than holding everything in memory.
 */
export async function sweep(tiles, { onTile, maxResultCount = 20 } = {}) {
	const byPlaceId = new Map()
	let requests = 0
	let subdivided = 0

	const queue = [...tiles]
	while (queue.length > 0) {
		const tile = queue.shift()
		let result
		try {
			result = await searchTile(tile, { maxResultCount })
			requests++
		} catch (error) {
			log.warn(`tile ${tile.lat},${tile.lng} failed: ${error.message}`)
			continue
		}

		for (const place of result.places) {
			if (!place.id) continue
			// First sighting wins. A later tile's copy carries the same licensed
			// fields, so re-assigning would only churn.
			if (!byPlaceId.has(place.id)) byPlaceId.set(place.id, toVenue(place, tile))
		}

		// Only subdivide an original tile, never a subdivision — one level deep.
		if (result.saturated && !tile.subdivided) {
			subdivided++
			queue.push(...subdivide(tile).map((t) => ({ ...t, subdivided: true })))
		}

		if (onTile) await onTile({ tile, found: result.places.length, total: byPlaceId.size, requests })
	}

	return { venues: [...byPlaceId.values()], requests, subdivided }
}
