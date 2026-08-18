/**
 * Re-shoots the product screenshots from a REAL customer menu.
 *
 * The site claims every screenshot is a live menu rather than a render, so
 * these must come from the live app. Re-run this whenever the reference venue
 * changes; the filenames are what src/data/content.ts looks up.
 */
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const BASE = 'https://menu.astro-menu.com'
const Q =
	'businessProfileID=MSoxzRsPzpahDlGdoFMY&branchID=2EKctRFUaA06pGIvAT2D&tableID=upxdTRj5NaTRl68f6ly0'
const OUT = 'src/assets/screens'

await mkdir(OUT, { recursive: true })
const browser = await chromium.launch()
const ctx = await browser.newContext({
	viewport: { width: 390, height: 844 },
	deviceScaleFactor: 2,
	isMobile: true,
	hasTouch: true,
	userAgent:
		'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
})
const page = await ctx.newPage()

const settle = async (ms = 2600) => {
	await page.waitForTimeout(ms)
	// Force every lazy image to decode before the shutter.
	await page.evaluate(async () => {
		window.scrollTo(0, document.body.scrollHeight)
		await new Promise((r) => setTimeout(r, 900))
		window.scrollTo(0, 0)
		await Promise.all(
			[...document.images].filter((i) => !i.complete).map((i) => i.decode().catch(() => {}))
		)
	})
	await page.waitForTimeout(900)
}

const shoot = async (name) => {
	await page.screenshot({ path: `${OUT}/${name}.png` })
	console.log('  ->', name)
}

console.log('venue landing')
await page.goto(`${BASE}/qr-menu?${Q}`, { waitUntil: 'domcontentloaded', timeout: 60000 })
await settle()
await shoot('landing')

console.log('menu + sections')
await page.goto(`${BASE}/qr-menu/menu?${Q}`, { waitUntil: 'domcontentloaded', timeout: 60000 })
await settle()
await shoot('menu-sections')

console.log('meal-type filter')
const buttons = await page.$$('header button, form button, button[aria-haspopup="dialog"]')
for (const b of buttons) {
	const html = await b.innerHTML()
	if (html.includes('filter.svg')) {
		await b.click()
		break
	}
}
await page.waitForTimeout(1400)
await shoot('filter-meal-type')

console.log('language picker')
await page.goto(`${BASE}/qr-menu/menu?${Q}`, { waitUntil: 'domcontentloaded', timeout: 60000 })
await settle(2000)
const buttons2 = await page.$$('button')
for (const b of buttons2) {
	const html = await b.innerHTML()
	if (html.includes('language.svg')) {
		await b.click()
		break
	}
}
await page.waitForTimeout(1400)
await shoot('language-switch')

console.log('item detail')
await page.goto(`${BASE}/qr-menu/menu?${Q}`, { waitUntil: 'domcontentloaded', timeout: 60000 })
await settle(2000)
const link = await page.$('a[href*="/qr-menu/meal/"]')
if (link) {
	await link.click()
	await page.waitForLoadState('domcontentloaded')
	await settle(2000)
	await shoot('item-detail')
}

await browser.close()
console.log('done')
