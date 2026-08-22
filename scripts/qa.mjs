/**
 * Walks every route on the dev server, screenshots it, and reports console
 * errors, broken images, heading-order problems and horizontal overflow.
 */
import { chromium } from 'playwright'

/** Defaults to the usual dev port; override when a second checkout is running its own. */
const BASE = process.env.QA_BASE ?? 'http://localhost:4321'

const ROUTES = [
	['/', 'home'],
	['/features', 'features'],
	['/how-it-works', 'how-it-works'],
	['/pricing', 'pricing'],
	['/demo', 'demo'],
	['/faq', 'faq'],
	['/contact', 'contact'],
	['/blog', 'blog'],
	['/blog/how-to-make-a-qr-code-menu', 'post'],
	['/privacy', 'privacy'],
	['/terms', 'terms'],
	['/404', '404']
]

const browser = await chromium.launch()
let bad = 0

for (const [route, name] of ROUTES) {
	const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
	const errors = []
	page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
	page.on('pageerror', (e) => errors.push(String(e)))
	await page.goto(BASE + route, { waitUntil: 'networkidle' })
	await page.evaluate(async () => {
		window.scrollTo(0, document.body.scrollHeight)
		await new Promise((r) => setTimeout(r, 500))
		window.scrollTo(0, 0)
	})
	await page.waitForTimeout(600)

	const report = await page.evaluate(() => {
		const brokenImgs = [...document.images]
			.filter((i) => i.naturalWidth === 0)
			.map((i) => i.getAttribute('src')?.slice(0, 90))
		const h1s = [...document.querySelectorAll('h1')].map((h) => h.textContent.trim().slice(0, 60))
		const levels = [...document.querySelectorAll('h1,h2,h3,h4')].map((h) => +h.tagName[1])
		const jumps = []
		for (let i = 1; i < levels.length; i++)
			if (levels[i] - levels[i - 1] > 1) jumps.push(levels[i - 1] + '->' + levels[i])
		const overflow = document.documentElement.scrollWidth > window.innerWidth + 1
		const emptyLinks = [...document.querySelectorAll('a')].filter(
			(a) => !a.textContent.trim() && !a.getAttribute('aria-label') && !a.querySelector('img,svg')
		).length
		const title = document.title
		const desc = document.querySelector('meta[name=description]')?.content?.length || 0
		const canonical = document.querySelector('link[rel=canonical]')?.href
		const ld = [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => {
			try {
				const p = JSON.parse(s.textContent)
				return (Array.isArray(p) ? p : [p]).map((x) => x['@type']).join('+')
			} catch {
				return 'INVALID-JSON'
			}
		})
		return { brokenImgs, h1s, jumps, overflow, emptyLinks, title, desc, canonical, ld }
	})

	await page.screenshot({ path: `.shots/qa-${name}.png`, fullPage: true })

	const issues = []
	if (errors.length) issues.push('console: ' + errors.join(' | ').slice(0, 200))
	if (report.brokenImgs.length) issues.push('broken imgs: ' + report.brokenImgs.join(', '))
	if (report.h1s.length !== 1) issues.push('h1 count = ' + report.h1s.length)
	if (report.jumps.length) issues.push('heading jumps: ' + report.jumps.join(','))
	if (report.overflow) issues.push('HORIZONTAL OVERFLOW')
	if (report.emptyLinks) issues.push(report.emptyLinks + ' empty links')
	if (report.title.length > 62) issues.push('title ' + report.title.length + ' chars')
	if (report.desc < 70 || report.desc > 165) issues.push('meta desc ' + report.desc + ' chars')
	if (report.ld.some((x) => x === 'INVALID-JSON')) issues.push('INVALID JSON-LD')

	if (issues.length) bad++
	console.log(
		(issues.length ? 'X ' : 'OK') +
			' ' +
			route.padEnd(34) +
			(issues.join(' ; ') || report.ld.join(' '))
	)
	await page.close()
}

console.log('\npages with issues:', bad, '/', ROUTES.length)
await browser.close()
