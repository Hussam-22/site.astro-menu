/**
 * Contrast + touch-target audit against the built site, in both themes.
 *   node scripts/a11y-check.mjs [baseUrl] [path...]
 */
import { chromium } from 'playwright'

const args = process.argv.slice(2)
const BASE = args.find((a) => a.startsWith('http')) || 'http://localhost:4331'
const PATHS = args.filter((a) => !a.startsWith('http'))
const paths = PATHS.length ? PATHS : ['/', '/pricing', '/features', '/faq']

const AUDIT = () => {
	const lum = (c) =>
		((x) => 0.2126 * x[0] + 0.7152 * x[1] + 0.0722 * x[2])(
			c.map((v) => {
				v /= 255
				return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
			})
		)
	const parse = (s) => {
		const m = s.match(/rgba?\(([^)]+)\)/)
		if (!m) return null
		const p = m[1].split(',').map(Number)
		return { rgb: [p[0], p[1], p[2]], a: p.length > 3 ? p[3] : 1 }
	}
	const bgOf = (el) => {
		let n = el
		while (n && n !== document.documentElement) {
			const b = parse(getComputedStyle(n).backgroundColor)
			if (b && b.a > 0.5) return b.rgb
			n = n.parentElement
		}
		return parse(getComputedStyle(document.body).backgroundColor).rgb
	}
	const ratio = (a, b) => {
		const L1 = lum(a),
			L2 = lum(b)
		return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)
	}

	const bad = []
	document
		.querySelectorAll('p,h1,h2,h3,h4,li,a,span,td,th,button,summary,dt,dd,label')
		.forEach((el) => {
			if (!el.textContent.trim()) return
			const cs = getComputedStyle(el)
			if (cs.display === 'none' || cs.visibility === 'hidden') return
			const fg = parse(cs.color)
			if (!fg || fg.a < 0.5) return
			const r = ratio(fg.rgb, bgOf(el))
			const size = parseFloat(cs.fontSize)
			const min = size >= 24 || (size >= 18.66 && parseInt(cs.fontWeight) >= 700) ? 3 : 4.5
			if (r < min) bad.push({ txt: el.textContent.trim().slice(0, 30), ratio: +r.toFixed(2) })
		})
	const seen = new Set()
	const contrast = bad.filter((b) => (seen.has(b.txt) ? false : (seen.add(b.txt), true)))

	const small = [...document.querySelectorAll('a,button,[role=button],input,select')]
		.filter((e) => {
			const r = e.getBoundingClientRect()
			return r.width > 0 && r.height < 44 && !e.closest('footer')
		})
		.map((e) => ({ t: (e.textContent || e.tagName).trim().slice(0, 20), h: Math.round(e.getBoundingClientRect().height) }))

	return { contrast, small }
}

const browser = await chromium.launch()
let fails = 0

for (const dark of [false, true]) {
	for (const path of paths) {
		const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } })
		const page = await ctx.newPage()
		await page.addInitScript((d) => localStorage.setItem('theme', d ? 'dark' : 'light'), dark)
		await page.goto(BASE + path, { waitUntil: 'load', timeout: 60000 })
		await page.waitForTimeout(800)
		const { contrast, small } = await page.evaluate(AUDIT)
		const label = `${dark ? 'dark ' : 'light'} ${path}`.padEnd(24)
		const bad = contrast.length + small.length
		fails += bad
		console.log(
			`${label} contrast:${String(contrast.length).padStart(2)}  small-targets:${String(small.length).padStart(2)}`
		)
		contrast.slice(0, 4).forEach((c) => console.log(`    contrast ${c.ratio}  "${c.txt}"`))
		small.slice(0, 4).forEach((s) => console.log(`    ${s.h}px  "${s.t}"`))
		await ctx.close()
	}
}

await browser.close()
console.log(fails === 0 ? '\nPASS — no contrast or touch-target failures' : `\n${fails} issue(s)`)
process.exit(fails === 0 ? 0 : 1)
