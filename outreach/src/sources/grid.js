/**
 * The search grid.
 *
 * Places `searchNearby` returns at most 20 results per call and has no paging,
 * so coverage comes from geometry, not pagination: cover each area in
 * overlapping circles small enough that a dense street never has more than 20
 * matching venues inside one.
 *
 * 700 m is the working radius. In Al Ain's low-density blocks that is
 * generous; on Abu Dhabi's Hamdan Street it still saturates, which is why
 * `densityRadiusM` exists per area — a saturated tile is re-swept at a smaller
 * radius by src/sources/places.js rather than silently returning a truncated 20.
 */

/** Bounding boxes drawn to the built-up area, not the emirate's legal border. */
export const AREAS = [
	{
		id: 'al-ain',
		emirate: 'Abu Dhabi',
		city: 'Al Ain',
		// Al Ain city proper, out to Al Jimi and Al Muwaiji.
		bounds: { south: 24.14, west: 55.68, north: 24.31, east: 55.83 },
		densityRadiusM: 700
	},
	{
		id: 'abu-dhabi-island',
		emirate: 'Abu Dhabi',
		city: 'Abu Dhabi',
		// The island: the densest F&B in the emirate, so a tighter radius.
		bounds: { south: 24.42, west: 54.32, north: 24.52, east: 54.42 },
		densityRadiusM: 450
	},
	{
		id: 'abu-dhabi-mainland',
		emirate: 'Abu Dhabi',
		city: 'Abu Dhabi',
		// Khalifa City, Mussafah, Mohammed Bin Zayed City.
		bounds: { south: 24.3, west: 54.42, north: 24.52, east: 54.68 },
		densityRadiusM: 700
	}
]

const EARTH_RADIUS_M = 6_371_000

/**
 * Circle centres covering a bounding box, spaced so neighbouring circles
 * overlap rather than leaving a gap at the corners.
 *
 * Circles on a square lattice of pitch `p` cover the plane only if the circle
 * radius reaches the cell's corner, i.e. r >= p·√2/2. Solving for the pitch
 * gives p = r·√2, and shrinking that by 10% leaves margin for the latitude
 * approximation below.
 */
export function tiles({ bounds, radiusM }) {
	const pitchM = radiusM * Math.SQRT2 * 0.9

	const latStepDeg = (pitchM / EARTH_RADIUS_M) * (180 / Math.PI)
	const centres = []

	for (let lat = bounds.south; lat <= bounds.north + latStepDeg / 2; lat += latStepDeg) {
		// A degree of longitude shortens towards the poles, so the east-west
		// step is recomputed per row. At UAE latitudes this is a ~9% correction
		// — small, but over a whole emirate it is the difference between full
		// coverage and a striped gap.
		const lngStepDeg =
			(pitchM / (EARTH_RADIUS_M * Math.cos((lat * Math.PI) / 180))) * (180 / Math.PI)
		for (let lng = bounds.west; lng <= bounds.east + lngStepDeg / 2; lng += lngStepDeg) {
			centres.push({ lat: Number(lat.toFixed(6)), lng: Number(lng.toFixed(6)), radiusM })
		}
	}
	return centres
}

/** Every tile for the named areas, or for all of them. */
export function tilesFor(areaIds = []) {
	const wanted = areaIds.length > 0 ? AREAS.filter((a) => areaIds.includes(a.id)) : AREAS
	if (wanted.length === 0) {
		throw new Error(
			`No area matched ${areaIds.join(', ')}. Known areas: ${AREAS.map((a) => a.id).join(', ')}`
		)
	}
	return wanted.flatMap((area) =>
		tiles({ bounds: area.bounds, radiusM: area.densityRadiusM }).map((tile) => ({
			...tile,
			areaId: area.id,
			emirate: area.emirate,
			city: area.city
		}))
	)
}
