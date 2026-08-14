/**
 * Screenshots the local site for design review.
 *   node scripts/shoot-site.mjs [baseUrl]
 * Writes to .design-shots/ (gitignored).
 */
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, '.design-shots')
const BASE = process.argv[2] || 'http://localhost:4321'
mkdirSync(OUT, { recursive: true })

const PAGES = [
	['home', '/'],
	['pricing', '/pricing'],
	['features', '/features'],
	['compare-google', '/compare/qr-menu-vs-google-business-menu']
]

const browser = await chromium.launch()

for (const [theme, dark] of [
	['light', false],
	['dark', true]
]) {
	for (const [width, label] of [
		[1440, 'desktop'],
		[390, 'mobile']
	]) {
		const ctx = await browser.newContext({
			viewport: { width, height: width === 390 ? 844 : 900 },
			deviceScaleFactor: width === 390 ? 2 : 1
		})
		const page = await ctx.newPage()
		await page.addInitScript((d) => {
			localStorage.setItem('theme', d ? 'dark' : 'light')
		}, dark)

		for (const [name, path] of PAGES) {
			// Only shoot every page on desktop-light; otherwise just the home page.
			if (!(theme === 'light' && label === 'desktop') && name !== 'home') continue
			// Dev server keeps an HMR socket open, so networkidle never fires.
			await page.goto(BASE + path, { waitUntil: 'load', timeout: 60000 })
			await page.waitForTimeout(2000)
			await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
			await page.waitForTimeout(1200)
			await page.evaluate(() => window.scrollTo(0, 0))
			await page.waitForTimeout(600)
			const file = join(OUT, `${name}-${label}-${theme}.png`)
			await page.screenshot({ path: file, fullPage: true })
			console.log('saved', `${name}-${label}-${theme}.png`)
		}
		await ctx.close()
	}
}

await browser.close()
console.log('done →', OUT)
