/**
 * Prepares the admin dashboard screenshots for the site.
 *
 * Two of them need work before they can be published:
 *
 *  - dash-branch carries a real customer's email, phone and WhatsApp number.
 *    Those three fields are blurred out. The labels are left intact so the
 *    screenshot still shows WHAT the fields are.
 *  - The Meals list is 1753x1928, far too tall for the layout, and the one row
 *    that proves the sold-out claim sits near the bottom. It is cropped to a
 *    landscape window around that row.
 *
 * Re-run after replacing any source file. Sources live outside the repo.
 */
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'

const SRC = 'C:/Users/Hu22aM/Downloads/'
const OUT = 'src/assets/dashboard/'
await mkdir(OUT, { recursive: true })

const copy = async (from, to) => {
	const m = await sharp(SRC + from).metadata()
	await sharp(SRC + from).png({ quality: 92 }).toFile(OUT + to)
	console.log(`${to.padEnd(20)} ${m.width}x${m.height}  <- ${from}`)
}

// Straight copies.
await copy('image-1787168582684.png', 'dash-sections.png')
await copy('Screenshot_19-8-2026_233045_app.astro-menu.com.jpeg', 'dash-meal.png')

// The QR screen only fills the top two thirds; the rest is empty page.
{
	const src = SRC + 'Screenshot_19-8-2026_233216_app.astro-menu.com.jpeg'
	const m = await sharp(src).metadata()
	const height = Math.round(m.height * 0.72)
	await sharp(src).extract({ left: 0, top: 0, width: m.width, height }).png().toFile(OUT + 'dash-qr.png')
	console.log(`dash-qr.png          ${m.width}x${height}  <- trimmed empty page below`)
}

// The Meals list, cropped to the rows around the one switched off — that row
// is the sold-out claim proved in a single frame. The sidebar has ended by this
// scroll depth, so the left gutter is cropped away too rather than left blank.
{
	const src = SRC + 'Screenshot_19-8-2026_23317_app.astro-menu.com.jpeg'
	const m = await sharp(src).metadata()
	const left = 460
	const crop = {
		left,
		top: Math.round(m.height * 0.6),
		width: 1100,
		height: Math.round(m.height * 0.33)
	}
	await sharp(src).extract(crop).png().toFile(OUT + 'dash-meals.png')
	console.log(`dash-meals.png       ${crop.width}x${crop.height}  <- cropped from ${m.width}x${m.height}`)
}

// Branch settings, with the three personal fields blurred.
{
	const src = SRC + 'Screenshot_19-8-2026_23326_app.astro-menu.com.jpeg'
	const m = await sharp(src).metadata()
	const s = m.height / 1491 // source was measured at this height

	/** Interiors of the three inputs, leaving their labels readable. */
	const redact = [
		{ left: 496, top: 502, width: 268, height: 34 }, // Contact Email
		{ left: 796, top: 502, width: 268, height: 34 }, // Contact Number
		{ left: 496, top: 567, width: 268, height: 34 } // WhatsApp Number
	].map((r) => ({
		left: Math.round(r.left * s),
		top: Math.round(r.top * s),
		width: Math.round(r.width * s),
		height: Math.round(r.height * s)
	}))

	// Destructive on purpose. A light blur over text can be partially recovered,
	// which is not good enough for someone's phone number — so each field is
	// crushed to a handful of pixels and blown back up, discarding the detail
	// entirely, then blurred so the result still looks like a soft empty field.
	const patches = await Promise.all(
		redact.map(async (r) => ({
			input: await sharp(src)
				.extract(r)
				.resize(6, 3, { fit: 'fill' })
				.resize(r.width, r.height, { fit: 'fill', kernel: 'cubic' })
				.blur(10)
				.toBuffer(),
			left: r.left,
			top: r.top
		}))
	)

	await sharp(src).composite(patches).png().toFile(OUT + 'dash-branch.png')
	console.log(`dash-branch.png      ${m.width}x${m.height}  <- 3 fields blurred`)
}
