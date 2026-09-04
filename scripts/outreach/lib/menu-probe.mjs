/**
 * Opens a venue's website and works out what state their menu is actually in.
 *
 * This is what separates a real lead from a guess. Places tells us a website
 * exists; it says nothing about whether the menu on it is a PDF, a photo, or
 * absent. We only claim "your menu is a PDF" to someone whose menu we have
 * confirmed is a PDF, so the opening line is never wrong.
 *
 * Returns one of the SITUATION_WEIGHT keys in score.mjs, plus the evidence, so
 * a human can check the call before anything is sent.
 */

const UA =
	'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36'

const THIRD_PARTY = /zomato|talabat|deliveroo|careem|instagram\.com|facebook\.com/i
const MENU_WORD = /menu|قائمة|منيو/i

async function get(url, timeoutMs = 12000) {
	const ctrl = new AbortController()
	const timer = setTimeout(() => ctrl.abort(), timeoutMs)
	try {
		const res = await fetch(url, {
			signal: ctrl.signal,
			redirect: 'follow',
			headers: { 'User-Agent': UA, Accept: 'text/html,application/xhtml+xml,application/pdf' }
		})
		const type = res.headers.get('content-type') ?? ''
		// Never pull a whole PDF or image down; the content-type is the answer.
		const body = type.includes('text/html') ? await res.text() : ''
		return { ok: res.ok, status: res.status, url: res.url, type, body }
	} finally {
		clearTimeout(timer)
	}
}

/** Every href on the page, absolutised, paired with its link text. */
function links(html, base) {
	const out = []
	for (const m of html.matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
		let href
		try {
			href = new URL(m[1], base).href
		} catch {
			continue
		}
		out.push({
			href,
			text: m[2]
				.replace(/<[^>]*>/g, ' ')
				.replace(/\s+/g, ' ')
				.trim()
		})
	}
	return out
}

/**
 * Did the server actually send us a page, or just a shell for JavaScript to
 * fill in? A React/Wix/Squarespace site returns a few KB with no links, and
 * reading "no menu here" off that is how you end up telling a venue they have
 * no menu online while their menu is plainly on screen. Say Unknown instead.
 */
function isUnrenderedShell(html) {
	const anchors = (html.match(/<a/gi) ?? []).length
	const text = html
		.replace(/<script[\s\S]*?<\/script>/gi, '')
		.replace(/<style[\s\S]*?<\/style>/gi, '')
		.replace(/<[^>]*>/g, ' ')
		.replace(/\s+/g, ' ')
		.trim()
	return anchors < 3 && text.length < 500
}

/** Does this page read like a menu a phone can actually use? */
function looksLikeRealMenu(html) {
	const text = html
		.replace(/<script[\s\S]*?<\/script>/gi, '')
		.replace(/<style[\s\S]*?<\/style>/gi, '')
		.replace(/<[^>]*>/g, ' ')
	// A menu in HTML shows prices as text. A menu that is one big image does not.
	const prices = text.match(/\b\d{1,3}(?:\.\d{1,2})?\s?(?:AED|aed|د\.إ|dhs?)\b/gi) ?? []
	return prices.length >= 8
}

export async function probeMenu(websiteUri) {
	if (!websiteUri)
		return { situation: 'No menu online', evidence: 'No website on the Places record' }

	let home
	try {
		home = await get(websiteUri)
	} catch (err) {
		return { situation: 'Unknown', evidence: `Site unreachable: ${err.message}` }
	}
	if (!home.ok) return { situation: 'Unknown', evidence: `Site returned HTTP ${home.status}` }

	// A "website" that is really just their Instagram or a Zomato page.
	if (THIRD_PARTY.test(home.url)) {
		return { situation: 'Third-party only', evidence: `Website redirects to ${home.url}` }
	}
	if (home.type.includes('pdf')) {
		return { situation: 'PDF', evidence: `Website itself is a PDF: ${home.url}` }
	}

	if (isUnrenderedShell(home.body)) {
		return {
			situation: 'Unknown',
			evidence: `${home.url} renders client-side — needs a browser to read. Do NOT claim they have no menu.`
		}
	}

	const all = links(home.body, home.url)
	const menuLinks = all.filter((l) => MENU_WORD.test(l.text) || MENU_WORD.test(l.href))

	if (menuLinks.length === 0) {
		return looksLikeRealMenu(home.body)
			? { situation: 'Already digital', evidence: 'Prices listed on the home page itself' }
			: { situation: 'No menu online', evidence: 'No link containing "menu" anywhere on the site' }
	}

	// A menu link straight to a PDF is the strongest signal we can get.
	const pdf = menuLinks.find((l) => /\.pdf(\?|$)/i.test(l.href))
	if (pdf) return { situation: 'PDF', evidence: `Menu links to a PDF: ${pdf.href}` }

	const offsite = menuLinks.find((l) => THIRD_PARTY.test(l.href))
	if (offsite) {
		return { situation: 'Third-party only', evidence: `Menu link goes to ${offsite.href}` }
	}

	// Follow the first on-site menu link and judge the page it lands on.
	try {
		const page = await get(menuLinks[0].href)
		if (page.type.includes('pdf')) {
			return { situation: 'PDF', evidence: `Menu page serves a PDF: ${page.url}` }
		}
		if (THIRD_PARTY.test(page.url)) {
			return { situation: 'Third-party only', evidence: `Menu page redirects to ${page.url}` }
		}
		if (looksLikeRealMenu(page.body)) {
			return { situation: 'Already digital', evidence: `Readable HTML menu at ${page.url}` }
		}
		// A menu page with images but no prices in text is a scanned/exported menu.
		const imgs = (page.body.match(/<img\b/gi) ?? []).length
		return imgs >= 3
			? {
					situation: 'Photos only',
					evidence: `Menu page is ${imgs} images with no text prices: ${page.url}`
				}
			: { situation: 'Unknown', evidence: `Menu page unclear: ${page.url}` }
	} catch (err) {
		return { situation: 'Unknown', evidence: `Menu link unreachable: ${err.message}` }
	}
}
