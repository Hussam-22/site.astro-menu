/**
 * Captures screenshots of a live Astro-Menu menu for use on the marketing site.
 *
 *   node scripts/capture-menu.mjs            # capture into src/assets/screens
 *   node scripts/capture-menu.mjs --explore  # dump clickable elements instead
 *
 * The URL is the public demo menu configured in src/config/site.ts.
 */
import { chromium, devices } from 'playwright'
import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'src/assets/screens')
const MENU_URL =
	'https://menu.astro-menu.com/qr-menu/menu?businessProfileID=QpPFdtogRHoWo1uL0KGe&branchID=2EKctRFUaA06pGIvAT2D&tableID=upxdTRj5NaTRl68f6ly0'
const HOME_URL = MENU_URL.replace('/qr-menu/menu?', '/qr-menu?')

const explore = process.argv.includes('--explore')
mkdirSync(OUT, { recursive: true })

const settle = async (page, ms = 2500) => {
	await page.waitForLoadState('networkidle').catch(() => {})
	await page.waitForTimeout(ms)
}

const shot = async (page, name) => {
	const path = join(OUT, `${name}.png`)
	await page.screenshot({ path })
	console.log('  saved', name + '.png')
}

const browser = await chromium.launch()
const context = await browser.newContext({
	...devices['iPhone 13 Pro'],
	deviceScaleFactor: 2,
	locale: 'en-US'
})
const page = await context.newPage()

console.log('opening menu…')
await page.goto(MENU_URL, { waitUntil: 'domcontentloaded', timeout: 60000 })
await settle(page, 4000)

if (explore) {
	const info = await page.evaluate(() => {
		const clickable = [...document.querySelectorAll('button,[role=button],a,svg,img')]
			.filter((el) => el.getBoundingClientRect().width > 8)
			.slice(0, 60)
			.map((el) => ({
				tag: el.tagName,
				cls: (el.getAttribute('class') || '').slice(0, 70),
				text: (el.textContent || '').trim().slice(0, 40),
				alt: el.getAttribute('alt') || null,
				box: (() => {
					const r = el.getBoundingClientRect()
					return [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)]
				})()
			}))
		return { title: document.title, clickable }
	})
	console.log(JSON.stringify(info, null, 1))
	await browser.close()
	process.exit(0)
}

// 1. Menu sections, scrolled to the top.
await shot(page, 'menu-sections')

// 2. Macros — scroll a little so item cards with CAL/CARB/FAT/PRO fill the frame.
await page.evaluate(() => window.scrollBy(0, 320))
await page.waitForTimeout(900)
await shot(page, 'macros')
await page.evaluate(() => window.scrollTo(0, 0))
await page.waitForTimeout(600)

// The two header controls sit at fixed positions on this layout.
const GLOBE = { x: 320, y: 203 }
const FILTER = { x: 356, y: 205 }

const dismiss = async () => {
	await page.keyboard.press('Escape').catch(() => {})
	await page.waitForTimeout(400)
	const close = page.getByRole('button', { name: /close/i }).first()
	if (await close.isVisible().catch(() => false)) await close.click().catch(() => {})
	await page.waitForTimeout(900)
}

// 3. Language picker.
try {
	await page.mouse.click(GLOBE.x, GLOBE.y)
	await page.waitForTimeout(1400)
	await shot(page, 'language-switch')
	await dismiss()
} catch (e) {
	console.log('  ! language picker:', e.message.split('\n')[0])
}

// 4. Filter sheet.
try {
	await page.mouse.click(FILTER.x, FILTER.y)
	await page.waitForTimeout(1400)
	await shot(page, 'filter-meal-type')
	await dismiss()
} catch (e) {
	console.log('  ! filter sheet:', e.message.split('\n')[0])
}

// 5. Item detail — tap a dish card.
try {
	await page.evaluate(() => window.scrollTo(0, 0))
	await page.waitForTimeout(700)
	const card = page.locator('img[alt]:not([alt="branch cover"]):not([alt="branch logo"])').first()
	await card.click({ timeout: 6000 })
	await page.waitForTimeout(2200)
	await shot(page, 'item-detail')
} catch (e) {
	console.log('  ! item detail:', e.message.split('\n')[0])
}

// 6. Venue landing page.
try {
	console.log('opening venue landing…')
	await page.goto(HOME_URL, { waitUntil: 'domcontentloaded', timeout: 60000 })
	await settle(page, 3500)
	await shot(page, 'landing')
} catch (e) {
	console.log('  ! landing:', e.message.split('\n')[0])
}

await browser.close()
console.log('done →', OUT)
