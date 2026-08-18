/**
 * Screenshot a route from the running dev server.
 *   node scripts/shoot.mjs <path> [outName] [width] [full|top|bottom]
 * Width 390 also switches on mobile emulation.
 */
import { chromium } from 'playwright'

const [, , route = '/', out = 'shot', width = '1280', mode = 'full'] = process.argv
const w = Number(width)
const mobile = w < 768

const browser = await chromium.launch()
const page = await browser.newPage({
	viewport: { width: w, height: mobile ? 900 : 950 },
	isMobile: mobile,
	hasTouch: mobile,
	deviceScaleFactor: mobile ? 2 : 1
})

const errors = []
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
page.on('pageerror', (e) => errors.push(String(e)))

await page.goto('http://localhost:4321' + route, { waitUntil: 'networkidle' })
// scroll-behavior:smooth animates scrollTo, so a reset can still be mid-flight
// when the shutter fires. Disable it for the duration of the capture.
await page.addStyleTag({ content: 'html{scroll-behavior:auto !important}' })
await page.evaluate(async () => {
	window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' })
	await new Promise((r) => setTimeout(r, 700))
	window.scrollTo({ top: 0, behavior: 'instant' })
})
await page.waitForTimeout(600)

if (mode === 'bottom') {
	await page.evaluate(() =>
		window.scrollTo({ top: document.body.scrollHeight - 1400, behavior: 'instant' })
	)
	await page.waitForTimeout(400)
}

await page.screenshot({ path: `.shots/${out}.png`, fullPage: mode === 'full' })
console.log('wrote .shots/' + out + '.png')
console.log('console errors:', errors.length ? errors : 'none')
await browser.close()
