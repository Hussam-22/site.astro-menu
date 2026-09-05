/**
 * Turns a live prospect menu into the two things that go in the message: a
 * print-ready QR code, and a photograph of their menu on a phone.
 *
 * The screenshot is what earns the reply. An email saying "we built your menu"
 * is a claim; an image of their own dishes, their own prices, on a phone, is
 * evidence — and it survives an email client that blocks links.
 */
import { chromium } from 'playwright'
import QRCode from 'qrcode'
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { OUT_DIR } from '../config.js'
import { log } from '../lib/log.js'

/** Brand colours, taken from the site's design tokens in src/styles/global.css. */
const INK = '#0d0b09'
const PAPER = '#fdf6ec'

/**
 * A QR code as PNG and SVG. SVG is what a printer wants; PNG is what an email
 * can show inline.
 */
export async function renderQr(url, slug) {
	const dir = join(OUT_DIR, 'qr')
	await mkdir(dir, { recursive: true })

	const options = {
		// High correction: these get printed small, laminated, and wiped down.
		errorCorrectionLevel: 'H',
		margin: 2,
		color: { dark: INK, light: PAPER }
	}

	const pngPath = join(dir, `${slug}.png`)
	const svgPath = join(dir, `${slug}.svg`)

	await QRCode.toFile(pngPath, url, { ...options, width: 1200, type: 'png' })
	await writeFile(svgPath, await QRCode.toString(url, { ...options, type: 'svg' }), 'utf8')

	return { pngPath, svgPath }
}

/**
 * The menu as it looks on a phone.
 *
 * Waits for a real meal card rather than for a network-idle event: the menu is
 * a React app reading Firestore, so "the network went quiet" and "the menu
 * rendered" are different moments, and only the second one is worth a picture.
 */
export async function screenshotMenu(menuUrl, slug, { timeoutMs = 45_000 } = {}) {
	const dir = join(OUT_DIR, 'screens')
	await mkdir(dir, { recursive: true })
	const path = join(dir, `${slug}.png`)

	const browser = await chromium.launch()
	try {
		const context = await browser.newContext({
			viewport: { width: 390, height: 844 },
			deviceScaleFactor: 3,
			isMobile: true,
			hasTouch: true,
			userAgent:
				'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 ' +
				'(KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
		})
		const page = await context.newPage()
		await page.goto(menuUrl, { waitUntil: 'domcontentloaded', timeout: timeoutMs })

		// h3 is the meal title in the menu app's meal card.
		await page.waitForSelector('h3', { timeout: timeoutMs })
		// Let the item images settle so the shot is not half grey boxes.
		await page.waitForLoadState('networkidle', { timeout: timeoutMs }).catch(() => {})

		await page.screenshot({ path })
		return { path }
	} finally {
		await browser.close()
	}
}

/**
 * Both assets for one built menu. A failed screenshot does not fail the build —
 * the QR still works and the menu is still live, so the venue can still be
 * contacted, just with a weaker message.
 */
export async function renderAssets({ menuUrl, slug }) {
	const qr = await renderQr(menuUrl, slug)
	let screenshot = null
	try {
		screenshot = await screenshotMenu(menuUrl, slug)
	} catch (error) {
		log.warn(`screenshot failed for ${slug}: ${error.message}`)
	}
	return { qrPath: qr.pngPath, qrSvgPath: qr.svgPath, screenshotPath: screenshot?.path ?? null }
}
