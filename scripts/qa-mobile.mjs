import { chromium } from 'playwright'
const ROUTES = ['/', '/features', '/how-it-works', '/pricing', '/demo', '/faq', '/contact', '/blog']
const browser = await chromium.launch()
for (const route of ROUTES) {
	const page = await browser.newPage({
		viewport: { width: 390, height: 844 },
		isMobile: true,
		hasTouch: true,
		deviceScaleFactor: 2
	})
	await page.goto('http://localhost:4321' + route, { waitUntil: 'networkidle' })
	await page.waitForTimeout(400)
	const r = await page.evaluate(() => {
		const docW = document.documentElement.scrollWidth
		const winW = window.innerWidth
		const wide = [...document.querySelectorAll('body *')]
			.filter((el) => {
				const b = el.getBoundingClientRect()
				return b.width > winW + 2 && b.right > winW + 2 && getComputedStyle(el).overflowX !== 'auto'
			})
			.slice(0, 4)
			.map((el) => el.tagName + '.' + String(el.className).split(' ').slice(0, 3).join('.'))
		// smallest rendered font size in body copy
		const sizes = [...document.querySelectorAll('p,li,span,a')]
			.map((el) => parseFloat(getComputedStyle(el).fontSize))
			.filter((n) => n > 0)
		return { overflow: docW - winW, wide, minFont: Math.min(...sizes) }
	})
	const bad = r.overflow > 1 || r.minFont < 12
	console.log(
		(bad ? 'X ' : 'OK') +
			' ' +
			route.padEnd(16) +
			'overflow ' + r.overflow + 'px, min font ' + r.minFont + 'px' +
			(r.wide.length ? ' | wide: ' + r.wide.join(', ') : '')
	)
	await page.screenshot({ path: `.shots/m${route.replace(/\//g, '-') || '-home'}.png`, fullPage: false })
	await page.close()
}
await browser.close()
