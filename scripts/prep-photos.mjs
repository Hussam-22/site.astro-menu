/**
 * Prepares the generated photography for src/assets/generated, and the real
 * customer logos for src/assets/logos.
 *
 * The raw Gemini output is 2-3MB per image at up to 2752px wide, and the
 * aspect ratios do not all match the slots they fill. Committing 30MB of
 * source JPEG to get a 400px-wide render is a bad trade, so each image is
 * cropped to its slot's exact ratio and re-encoded to WebP at a size the
 * layout actually uses.
 *
 * The crop uses sharp's attention strategy rather than a centre crop — several
 * of these have their subject off-centre (the truck, the bakery hand), and a
 * blind centre crop cuts the wrong half. The three later shots came in at
 * almost exactly their slot ratio, so they are centre-cropped instead:
 * attention has nothing to gain there and can still shave a forehead.
 *
 * Re-run after regenerating any image. Sources live outside the repo.
 */
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'

const SRC = 'C:/Users/Hu22aM/Downloads/'
const OUT = 'src/assets/generated/'
const LOGO_OUT = 'src/assets/logos/'
await mkdir(OUT, { recursive: true })
await mkdir(LOGO_OUT, { recursive: true })

/**
 * slot -> [source file, aspect ratio, output width, crop position]
 * Ratios mirror the `ratio` prop on each <FoodImage> so the pre-crop and the
 * CSS agree and nothing gets cropped twice.
 */
const MAP = {
	// Hero. Both render small, so they do not need much width.
	'hero-cut': ['Gemini_Generated_Image_ny7lt4ny7lt4ny7l.jpeg', 1 / 1, 800],
	'hero-float': ['Gemini_Generated_Image_kinuqkinuqkinuqk.jpeg', 4 / 3, 900],

	// The three pillars — owner, staff, guest.
	owner: ['Gemini_Generated_Image_nrilmgnrilmgnril.jpeg', 16 / 10, 1400],
	staff: ['Gemini_Generated_Image_rsrmp6rsrmp6rsrm.jpeg', 16 / 10, 1400],
	guests: ['Gemini_Generated_Image_4054uu4054uu4054.jpeg', 16 / 10, 1400],

	// Use-case tiles.
	'uc-cafe': ['Gemini_Generated_Image_d0ys9md0ys9md0ys.jpeg', 5 / 4, 1200],
	'uc-truck': ['Gemini_Generated_Image_vvp6nevvp6nevvp6.jpeg', 5 / 4, 1200],
	'uc-hotel': ['Gemini_Generated_Image_wauwxkwauwxkwauw.jpeg', 5 / 4, 1200],
	'uc-bakery': ['Gemini_Generated_Image_jodomhjodomhjodo.jpeg', 5 / 4, 1152],
	'uc-clinic': ['Gemini_Generated_Image_9pl2gp9pl2gp9pl2.jpeg', 5 / 4, 1200],
	'uc-lounge': ['Gemini_Generated_Image_rcwt8nrcwt8nrcwt.jpeg', 5 / 4, 1200],

	// Supporting shots. Sources are already within a percent of the slot ratio,
	// so the crop is a rounding error and centre keeps faces and hands intact.
	'faq-flatlay': ['faq-flatlay.jpeg', 4 / 3, 1200, 'centre'],
	onboarding: ['onboarding.jpeg', 4 / 3, 1200, 'centre'],
	contact: ['contact.jpeg', 4 / 5, 900, 'centre']
}

/**
 * Customer logos. These are not photographs and must never be cropped — a logo
 * with its edge shaved off is worse than no logo — so they are trimmed of
 * their own dead margin, re-padded to a square in their own background colour
 * and rendered with object-contain. The padding colour is sampled from the
 * source rather than assumed white: Foamy's lockup sits on cream.
 */
const LOGOS = {
	'number-8': 'number-8.webp',
	'foamy-cafe': 'foamy-cafe.webp',
	'carb-protein': 'carb-protine.webp'
}

let total = 0
for (const [slot, [file, ratio, width, position]] of Object.entries(MAP)) {
	const height = Math.round(width / ratio)
	const info = await sharp(SRC + file)
		.resize(width, height, { fit: 'cover', position: position ?? sharp.strategy.attention })
		.webp({ quality: 82 })
		.toFile(OUT + slot + '.webp')
	total += info.size
	const src = await sharp(SRC + file).metadata()
	console.log(
		`${slot.padEnd(12)} ${String(width + 'x' + height).padEnd(11)} ${String(Math.round(info.size / 1024) + 'KB').padStart(7)}   <- ${src.width}x${src.height}`
	)
}
console.log(`\n${Object.keys(MAP).length} images, ${Math.round(total / 1024)}KB total`)

const LOGO_SIZE = 480
/** Fraction of the square the mark is allowed to occupy; the rest is margin.
    Number Eight's mark is a circle that trims flush to its own edge, so
    without this it would collide with the rounded tile it sits in. */
const LOGO_FILL = 0.8
for (const [slot, file] of Object.entries(LOGOS)) {
	const src = sharp(SRC + file)
	// Top-left pixel is the mount colour every one of these sits on.
	const { data } = await src
		.clone()
		.extract({ left: 0, top: 0, width: 1, height: 1 })
		.raw()
		.toBuffer({ resolveWithObject: true })
	const background = { r: data[0], g: data[1], b: data[2], alpha: 1 }
	const inner = Math.round(LOGO_SIZE * LOGO_FILL)
	const mark = await src
		.clone()
		.trim({ threshold: 12 })
		.resize(inner, inner, { fit: 'inside', withoutEnlargement: false })
		.toBuffer({ resolveWithObject: true })
	const pad = (n) => Math.round((LOGO_SIZE - n) / 2)
	const info = await sharp(mark.data)
		.extend({
			top: pad(mark.info.height),
			bottom: LOGO_SIZE - mark.info.height - pad(mark.info.height),
			left: pad(mark.info.width),
			right: LOGO_SIZE - mark.info.width - pad(mark.info.width),
			background
		})
		.webp({ quality: 88 })
		.toFile(LOGO_OUT + slot + '.webp')
	console.log(
		`${slot.padEnd(12)} ${String(LOGO_SIZE + 'x' + LOGO_SIZE).padEnd(11)} ${String(Math.round(info.size / 1024) + 'KB').padStart(7)}   <- ${file} mark ${mark.info.width}x${mark.info.height} on rgb(${background.r},${background.g},${background.b})`
	)
}
