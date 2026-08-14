/**
 * Checks the brand tokens in src/styles/theme.css against WCAG AA, and suggests
 * derived tones when a role fails.
 *
 *   node scripts/brand-check.mjs                # check what is in theme.css
 *   node scripts/brand-check.mjs "#F472B6"      # try a hue before committing to it
 *
 * The brand accent has three jobs and one value rarely does all three:
 *   fill   (--c-brand)      + on-fill text (--c-brand-on)   needs 4.5:1
 *   ink    (--c-brand-ink)  as text on page/card             needs 4.5:1
 *   deep   (--c-brand-deep) as text on a white chip          needs 4.5:1
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const CSS = join(dirname(fileURLToPath(import.meta.url)), '..', 'src/styles/theme.css')

const lum = ([r, g, b]) => {
	const f = (v) => {
		v /= 255
		return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
	}
	return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
}
const contrast = (a, b) => {
	const [x, y] = [lum(a), lum(b)]
	return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)
}
const hex2rgb = (h) => {
	const s = h.replace('#', '')
	return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16))
}
const rgb2hex = (c) => '#' + c.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')
const fmt = (n) => n.toFixed(2).padStart(5)

// Darken toward black until white text on it clears `target`.
const darkenUntil = (rgb, against, target) => {
	let c = [...rgb]
	for (let i = 0; i < 100; i++) {
		if (contrast(c, against) >= target) return c
		c = c.map((v) => v * 0.96)
	}
	return c
}

const css = readFileSync(CSS, 'utf8')
const light = css.slice(0, css.indexOf('.dark'))
const dark = css.slice(css.indexOf('.dark'))
const token = (block, name) => {
	const m = block.match(new RegExp(`--c-${name}:\\s*([0-9]+)[ ,]+([0-9]+)[ ,]+([0-9]+)`))
	return m ? [+m[1], +m[2], +m[3]] : null
}

const override = process.argv[2]
const BRAND = override ? hex2rgb(override) : token(light, 'brand')
const ON = token(light, 'brand-on') || [12, 12, 14]
const INK_L = override ? null : token(light, 'brand-ink')
const INK_D = override ? null : token(dark, 'brand-ink')
const DEEP = override ? null : token(light, 'brand-deep')

const WHITE = [255, 255, 255]
const CARD_L = token(light, 'card') || [245, 245, 247]
const PAGE_D = token(dark, 'page') || [10, 10, 12]

console.log(`\nbrand fill  ${rgb2hex(BRAND)}`)
const rows = [
	['on-fill text', ON, BRAND, 'text/icons sitting on the fill'],
	['white on fill', WHITE, BRAND, 'the alternative on-fill colour'],
	INK_L && ['ink on card (light)', INK_L, CARD_L, 'brand used as text, light mode'],
	INK_D && ['ink on page (dark)', INK_D, PAGE_D, 'brand used as text, dark mode'],
	DEEP && ['deep on white chip', DEEP, WHITE, 'brand text on a white button']
].filter(Boolean)

let fails = 0
for (const [label, fg, bg, note] of rows) {
	const r = contrast(fg, bg)
	const ok = r >= 4.5
	if (!ok && label !== 'white on fill') fails++
	console.log(
		`  ${ok ? 'PASS' : 'FAIL'}  ${fmt(r)}:1  ${label.padEnd(20)} ${rgb2hex(fg)} on ${rgb2hex(bg)}   ${note}`
	)
}

if (contrast(ON, BRAND) < 4.5 && contrast(WHITE, BRAND) < 4.5) {
	const suggestion = darkenUntil(BRAND, WHITE, 4.5)
	console.log(
		`\n  Neither dark nor white text clears 4.5:1 on this fill.` +
			`\n  Darken the fill to about ${rgb2hex(suggestion)} to carry white text.`
	)
}
if (INK_L && contrast(INK_L, CARD_L) < 4.5) {
	console.log(`\n  Suggested --c-brand-ink (light): ${rgb2hex(darkenUntil(BRAND, CARD_L, 4.5))}`)
}
if (DEEP && contrast(DEEP, WHITE) < 4.5) {
	console.log(`  Suggested --c-brand-deep:        ${rgb2hex(darkenUntil(BRAND, WHITE, 4.5))}`)
}

console.log(fails === 0 ? '\nAll brand roles pass AA.\n' : `\n${fails} role(s) below AA.\n`)
process.exit(fails === 0 ? 0 : 1)
