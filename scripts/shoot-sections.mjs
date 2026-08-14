/**
 * Screenshots individual sections of the local home page at full resolution,
 * so design detail is actually legible.
 *   node scripts/shoot-sections.mjs [baseUrl] [--dark]
 */
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, '.design-shots')
const args = process.argv.slice(2)
const dark = args.includes('--dark')
const BASE = args.find((a) => a.startsWith('http')) || 'http://localhost:4321'
mkdirSync(OUT, { recursive: true })

const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })
const page = await ctx.newPage()
await page.addInitScript((d) => localStorage.setItem('theme', d ? 'dark' : 'light'), dark)
await page.goto(BASE + '/', { waitUntil: 'load', timeout: 60000 })
await page.waitForTimeout(2500)

const suffix = dark ? '-dark' : ''
const sections = await page.locator('main > *, body section, body > div > section').all()

// Name sections by their first heading.
let i = 0
for (const s of sections) {
	const box = await s.boundingBox()
	if (!box || box.height < 180) continue
	const heading = (
		await s
			.locator('h1,h2')
			.first()
			.textContent()
			.catch(() => null)
	)?.trim()
	const slug =
		(heading || `section-${i}`)
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-|-$/g, '')
			.slice(0, 40) || `section-${i}`
	await s.scrollIntoViewIfNeeded()
	await page.waitForTimeout(700)
	await s.screenshot({ path: join(OUT, `sec-${String(i).padStart(2, '0')}-${slug}${suffix}.png`) })
	console.log('saved', `sec-${String(i).padStart(2, '0')}-${slug}${suffix}.png`)
	i++
	if (i > 14) break
}

await browser.close()
console.log('done →', OUT)
