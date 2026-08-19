/**
 * Prepares the generated photography for src/assets/generated.
 *
 * The raw Gemini output is 2-3MB per image at up to 2752px wide, and the
 * aspect ratios do not all match the slots they fill. Committing 30MB of
 * source JPEG to get a 400px-wide render is a bad trade, so each image is
 * cropped to its slot's exact ratio and re-encoded to WebP at a size the
 * layout actually uses.
 *
 * The crop uses sharp's attention strategy rather than a centre crop — several
 * of these have their subject off-centre (the truck, the bakery hand), and a
 * blind centre crop cuts the wrong half.
 *
 * Re-run after regenerating any image. Sources live outside the repo.
 */
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'

const SRC = 'C:/Users/Hu22aM/Downloads/'
const OUT = 'src/assets/generated/'
await mkdir(OUT, { recursive: true })

/**
 * slot -> [source file, aspect ratio, output width]
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
	'uc-lounge': ['Gemini_Generated_Image_rcwt8nrcwt8nrcwt.jpeg', 5 / 4, 1200]
}

let total = 0
for (const [slot, [file, ratio, width]] of Object.entries(MAP)) {
	const height = Math.round(width / ratio)
	const info = await sharp(SRC + file)
		.resize(width, height, { fit: 'cover', position: sharp.strategy.attention })
		.webp({ quality: 82 })
		.toFile(OUT + slot + '.webp')
	total += info.size
	const src = await sharp(SRC + file).metadata()
	console.log(
		`${slot.padEnd(12)} ${String(width + 'x' + height).padEnd(11)} ${String(Math.round(info.size / 1024) + 'KB').padStart(7)}   <- ${src.width}x${src.height}`
	)
}
console.log(`\n${Object.keys(MAP).length} images, ${Math.round(total / 1024)}KB total`)
