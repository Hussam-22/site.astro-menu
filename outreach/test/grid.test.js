import test from 'node:test'
import assert from 'node:assert/strict'
import { tiles, tilesFor, AREAS } from '../src/sources/grid.js'
import { subdivide } from '../src/sources/places.js'

const EARTH_RADIUS_M = 6_371_000
const toRad = (deg) => (deg * Math.PI) / 180

/** Great-circle distance, good enough at these scales. */
function metresBetween(a, b) {
	const dLat = toRad(b.lat - a.lat)
	const dLng = toRad(b.lng - a.lng)
	const h =
		Math.sin(dLat / 2) ** 2 +
		Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
	return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(h))
}

test('tiles cover their bounding box with no gap', () => {
	const bounds = { south: 24.2, west: 55.7, north: 24.24, east: 55.75 }
	const radiusM = 700
	const centres = tiles({ bounds, radiusM })

	// Sample the box on a fine lattice; every sample must fall inside a circle.
	for (let lat = bounds.south; lat <= bounds.north; lat += 0.002) {
		for (let lng = bounds.west; lng <= bounds.east; lng += 0.002) {
			const covered = centres.some((c) => metresBetween(c, { lat, lng }) <= radiusM)
			assert.ok(covered, `no tile covers ${lat.toFixed(4)},${lng.toFixed(4)}`)
		}
	}
})

test('every configured area produces tiles', () => {
	for (const area of AREAS) {
		assert.ok(tilesFor([area.id]).length > 0, `${area.id} produced no tiles`)
	}
})

test('an unknown area is an error, not an empty sweep', () => {
	assert.throws(() => tilesFor(['atlantis']), /No area matched/)
})

test('tiles carry the emirate and city of their area', () => {
	const [tile] = tilesFor(['al-ain'])
	assert.equal(tile.city, 'Al Ain')
	assert.equal(tile.emirate, 'Abu Dhabi')
})

test('subdividing a saturated tile leaves no uncovered point', () => {
	const tile = { lat: 24.2, lng: 55.75, radiusM: 800 }
	const quarters = subdivide(tile)

	assert.equal(quarters.length, 9)
	// Smaller than the original, or the subdivision relieves nothing.
	for (const quarter of quarters) assert.ok(quarter.radiusM < tile.radiusM)

	// Every point inside the original circle must fall in one of the nine —
	// including the centre, which the naive four-quadrant version misses.
	assert.ok(
		quarters.some((q) => metresBetween(q, tile) <= q.radiusM),
		'the centre of the original tile is not covered'
	)

	for (let bearing = 0; bearing < 360; bearing += 5) {
		for (const fraction of [0.1, 0.25, 0.5, 0.75, 0.9, 1]) {
			const distance = tile.radiusM * fraction
			const dLat = (distance * Math.cos(toRad(bearing))) / EARTH_RADIUS_M / (Math.PI / 180)
			const dLng =
				(distance * Math.sin(toRad(bearing))) /
				(EARTH_RADIUS_M * Math.cos(toRad(tile.lat))) /
				(Math.PI / 180)
			const point = { lat: tile.lat + dLat, lng: tile.lng + dLng }
			const covered = quarters.some((q) => metresBetween(q, point) <= q.radiusM)
			assert.ok(covered, `subdivision misses bearing ${bearing} at ${fraction} of the radius`)
		}
	}
})
