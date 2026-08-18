// Headless screenshots of the dev server, used for visual QA in this session.
// Usage: node scripts/shoot.mjs <path> [outName] [width]
import { chromium } from 'playwright'

const [, , path = '/', out = 'home', width = '1280'] = process.argv
const browser = await chromium.launch()
const page = await browser.newPage({
	viewport: { width: Number(width), height: 900 },
	deviceScaleFactor: 1
})
const errors = []
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
page.on('pageerror', (e) => errors.push(String(e)))
await page.goto(`http://localhost:4321${path}`, { waitUntil: 'networkidle' })
await page.waitForTimeout(700)
await page.screenshot({ path: `.shots/${out}.png`, fullPage: true })
console.log('shot .shots/' + out + '.png')
console.log('console errors:', errors.length ? errors : 'none')
await browser.close()
