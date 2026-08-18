import { chromium } from 'playwright'
const BASE = 'https://menu.astro-menu.com'
const Q = 'businessProfileID=MSoxzRsPzpahDlGdoFMY&branchID=2EKctRFUaA06pGIvAT2D&tableID=upxdTRj5NaTRl68f6ly0'
const browser = await chromium.launch()
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
const page = await ctx.newPage()
await page.goto(`${BASE}/qr-menu/menu?${Q}`, { waitUntil: 'domcontentloaded', timeout: 60000 })
await page.waitForTimeout(4000)
await page.evaluate(async () => { window.scrollTo(0, document.body.scrollHeight); await new Promise(r => setTimeout(r, 1500)) })
await page.waitForTimeout(1500)

const links = await page.evaluate(() =>
	[...document.querySelectorAll('a[href*="/qr-menu/meal/"]')].map((a) => a.getAttribute('href'))
)
console.log('meal links found:', links.length)

const results = []
for (const href of links.slice(0, 40)) {
	await page.goto(BASE + href, { waitUntil: 'domcontentloaded', timeout: 60000 })
	await page.waitForTimeout(1700)
	const r = await page.evaluate(() => {
		const t = document.body.innerText
		const lines = t.split('\n').map((s) => s.trim()).filter(Boolean)
		const name = lines[0] || ''
		const portionIdx = lines.findIndex((l) => /sizes\/portions/i.test(l))
		const portions = portionIdx >= 0 ? lines.slice(portionIdx + 1).filter((l) => !/powered by|astro-menu/i.test(l)).length : 0
		const desc = lines.slice(1, portionIdx > 0 ? portionIdx : 3).join(' ')
		return { name, portions, descLen: desc.length, textLen: t.length }
	})
	results.push({ href, ...r })
}
results.sort((a, b) => b.portions * 100 + b.descLen - (a.portions * 100 + a.descLen))
console.log('\ntop candidates (portions / descLen / name):')
for (const r of results.slice(0, 10)) console.log(`  ${String(r.portions).padStart(2)}  ${String(r.descLen).padStart(4)}  ${r.name.slice(0, 40).padEnd(42)} ${r.href.split('?')[0]}`)
await browser.close()
