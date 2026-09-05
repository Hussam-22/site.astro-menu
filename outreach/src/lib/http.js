/**
 * Fetch with a timeout, bounded retries and a polite user agent.
 *
 * The crawler touches strangers' websites, most of them small restaurant sites
 * on shared hosting. It identifies itself, backs off on 429 and 5xx, gives up
 * quickly on 404, and never retries a request that a server answered clearly.
 */
import { log } from './log.js'

export const USER_AGENT =
	'Astro-Menu-Bot/0.1 (+https://astro-menu.com/contact; menu discovery; hello@astro-menu.com)'

const RETRYABLE = new Set([408, 429, 500, 502, 503, 504])

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * @param {string} url
 * @param {{ method?: string, headers?: object, body?: string,
 *           timeoutMs?: number, retries?: number, accept?: string }} options
 * @returns {Promise<Response>}
 */
export async function request(url, options = {}) {
	const { timeoutMs = 20_000, retries = 3, headers = {}, ...rest } = options

	let lastError
	for (let attempt = 0; attempt <= retries; attempt++) {
		if (attempt > 0) {
			// 1s, 2s, 4s — enough to clear a rate limit without stalling a batch.
			const backoff = 1000 * 2 ** (attempt - 1)
			await sleep(backoff)
		}

		const controller = new AbortController()
		const timer = setTimeout(() => controller.abort(), timeoutMs)
		try {
			const response = await fetch(url, {
				...rest,
				headers: { 'user-agent': USER_AGENT, ...headers },
				redirect: 'follow',
				signal: controller.signal
			})
			if (RETRYABLE.has(response.status) && attempt < retries) {
				log.warn(`${response.status} from ${url}, retrying`)
				continue
			}
			return response
		} catch (error) {
			lastError = error
			// A timeout or a dead host is worth one more try; a bad URL is not.
			if (error instanceof TypeError && !/fetch failed/i.test(error.message)) throw error
			if (attempt === retries) break
		} finally {
			clearTimeout(timer)
		}
	}
	throw lastError ?? new Error(`Request to ${url} failed after ${retries + 1} attempts`)
}

/** GET returning parsed JSON, or throwing with the body when the status is not ok. */
export async function getJson(url, options = {}) {
	const response = await request(url, options)
	const text = await response.text()
	if (!response.ok) {
		throw new Error(`${response.status} ${response.statusText} from ${url}: ${text.slice(0, 500)}`)
	}
	return JSON.parse(text)
}

/**
 * Downloads a binary, refusing anything larger than `maxBytes`. A 90 MB
 * "menu.pdf" is a scanned brochure that will cost more to send to the model
 * than the lead is worth, so the cap is a cost control, not just a guard.
 */
export async function getBinary(url, { maxBytes = 24 * 1024 * 1024, ...options } = {}) {
	const response = await request(url, options)
	if (!response.ok) throw new Error(`${response.status} ${response.statusText} from ${url}`)

	const declared = Number(response.headers.get('content-length') ?? 0)
	if (declared > maxBytes) {
		throw new Error(`${url} is ${declared} bytes, over the ${maxBytes} limit`)
	}

	const buffer = Buffer.from(await response.arrayBuffer())
	if (buffer.byteLength > maxBytes) {
		throw new Error(`${url} is ${buffer.byteLength} bytes, over the ${maxBytes} limit`)
	}
	return {
		buffer,
		contentType: (response.headers.get('content-type') ?? '').split(';')[0].trim().toLowerCase()
	}
}
