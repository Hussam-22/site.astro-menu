/**
 * Finds the menu a venue already publishes.
 *
 * The whole pipeline hinges on this: if we cannot find their menu, we cannot
 * build it, and without a built menu there is no reason for them to open our
 * email. So this is deliberately broad about where it looks and strict about
 * what it accepts.
 *
 * It stays within one host and two levels of depth, respects robots.txt, and
 * never touches a page that is not plausibly a menu. Politeness here is not
 * only manners — an aggressive crawler gets the sending domain blocklisted,
 * and that costs the whole channel.
 */
import { request, getBinary } from '../lib/http.js'
import { log } from '../lib/log.js'

/** Words that mark a link or file as a menu, in both languages we sell in. */
const MENU_WORDS = [
	'menu',
	'menus',
	'our-menu',
	'food',
	'drinks',
	'dishes',
	'carte',
	'قائمة',
	'المنيو',
	'منيو',
	'الطعام',
	'المشروبات'
]

const IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])

const looksLikeMenu = (text) => {
	const lower = String(text).toLowerCase()
	return MENU_WORDS.some((word) => lower.includes(word))
}

/**
 * Parses robots.txt just far enough to honour Disallow for our user agent.
 * A full robots parser is overkill; refusing to crawl what a site asked us not
 * to crawl is not.
 */
export function parseRobots(text) {
	const disallowed = []
	let applies = false
	for (const raw of String(text).split('\n')) {
		const line = raw.split('#')[0].trim()
		if (!line) continue
		const [field, ...rest] = line.split(':')
		const value = rest.join(':').trim()
		const key = field.trim().toLowerCase()
		if (key === 'user-agent') {
			applies = value === '*' || value.toLowerCase().includes('astro-menu')
		} else if (key === 'disallow' && applies && value) {
			disallowed.push(value)
		}
	}
	return disallowed
}

export const isAllowed = (pathname, disallowed) =>
	!disallowed.some((rule) => pathname.startsWith(rule))

async function robotsFor(origin) {
	try {
		const response = await request(`${origin}/robots.txt`, { retries: 1, timeoutMs: 8000 })
		if (!response.ok) return []
		return parseRobots(await response.text())
	} catch {
		// No robots.txt is permission by omission, not a reason to stop.
		return []
	}
}

/** Absolute, fragment-free, same-host URLs only. */
function resolveLinks(html, base) {
	const links = new Set()
	for (const match of html.matchAll(/<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>(.*?)<\/a>/gis)) {
		const [, href, label] = match
		try {
			const url = new URL(href, base)
			if (url.hostname !== new URL(base).hostname) continue
			url.hash = ''
			// The link text matters as much as the URL: "Our Menu" pointing at
			// /pages/12 is still a menu link.
			if (looksLikeMenu(url.pathname) || looksLikeMenu(label.replace(/<[^>]+>/g, ''))) {
				links.add(url.toString())
			}
		} catch {
			/* an unparseable href is not a link */
		}
	}
	return [...links]
}

/** Images and PDFs referenced by a page, filtered to menu-looking ones. */
function resolveAssets(html, base) {
	const assets = new Set()
	const patterns = [
		/<a\b[^>]*href\s*=\s*["']([^"']+\.pdf(?:\?[^"']*)?)["']/gi,
		/<img\b[^>]*src\s*=\s*["']([^"']+)["']/gi,
		/<source\b[^>]*srcset\s*=\s*["']([^"',]+)/gi
	]
	for (const pattern of patterns) {
		for (const [, href] of html.matchAll(pattern)) {
			try {
				const url = new URL(href, base)
				url.hash = ''
				if (looksLikeMenu(url.pathname)) assets.add(url.toString())
			} catch {
				/* skip */
			}
		}
	}
	return [...assets]
}

/**
 * Crawls a venue's website looking for menu artifacts.
 *
 * @returns {Promise<Array<{kind: 'pdf'|'image'|'html', url: string, discovered_on: string}>>}
 */
export async function findMenuSources(website, { maxPages = 8 } = {}) {
	if (!website) return []

	let origin
	try {
		origin = new URL(website).origin
	} catch {
		return []
	}

	const disallowed = await robotsFor(origin)
	const found = new Map()
	const seen = new Set()
	const queue = [website]

	while (queue.length > 0 && seen.size < maxPages) {
		const pageUrl = queue.shift()
		if (seen.has(pageUrl)) continue
		seen.add(pageUrl)

		let pathname
		try {
			pathname = new URL(pageUrl).pathname
		} catch {
			continue
		}
		if (!isAllowed(pathname, disallowed)) {
			log.warn(`robots.txt disallows ${pathname}`)
			continue
		}

		let html
		try {
			const response = await request(pageUrl, { retries: 1 })
			if (!response.ok) continue
			const type = (response.headers.get('content-type') ?? '').toLowerCase()

			if (type.includes('application/pdf')) {
				found.set(pageUrl, { kind: 'pdf', url: pageUrl, discovered_on: 'website' })
				continue
			}
			if (!type.includes('html')) continue
			html = await response.text()
		} catch (error) {
			log.warn(`could not fetch ${pageUrl}: ${error.message}`)
			continue
		}

		// A page whose own URL says "menu" is itself a candidate artifact.
		if (looksLikeMenu(pathname) && pathname !== '/') {
			found.set(pageUrl, { kind: 'html', url: pageUrl, discovered_on: 'website' })
		}

		for (const asset of resolveAssets(html, pageUrl)) {
			const kind = asset.toLowerCase().includes('.pdf') ? 'pdf' : 'image'
			found.set(asset, { kind, url: asset, discovered_on: 'website' })
		}

		for (const link of resolveLinks(html, pageUrl)) {
			if (!seen.has(link)) queue.push(link)
		}
	}

	return [...found.values()]
}

/**
 * Confirms an artifact is what its URL claims and is small enough to send to
 * the model. A "menu.pdf" that is really a 404 HTML page wastes a build slot
 * and a chunk of tokens, so it is checked before it ever reaches the parser.
 */
export async function verifySource(source) {
	try {
		const { buffer, contentType } = await getBinary(source.url, { maxBytes: 24 * 1024 * 1024 })
		if (contentType === 'application/pdf') {
			return { ...source, kind: 'pdf', bytes: buffer.byteLength, contentType, buffer }
		}
		if (IMAGE_TYPES.has(contentType)) {
			return { ...source, kind: 'image', bytes: buffer.byteLength, contentType, buffer }
		}
		if (contentType.includes('html') && source.kind === 'html') {
			return { ...source, kind: 'html', bytes: buffer.byteLength, contentType, buffer }
		}
		return null
	} catch (error) {
		log.warn(`could not verify ${source.url}: ${error.message}`)
		return null
	}
}
