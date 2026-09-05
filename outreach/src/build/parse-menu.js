/**
 * Turns a venue's published menu into structured data with Claude.
 *
 * Two rules govern this file, and both exist because the output is going to be
 * sent to the restaurant that wrote the original:
 *
 *   1. Never invent. A description we made up, or a price we guessed, is worse
 *      than an empty field — it is the thing that loses the deal on sight.
 *   2. Report doubt honestly. `confidence` and `notes` drive the human review
 *      queue, so a hedged answer is more useful than a confident wrong one.
 */
import Anthropic from '@anthropic-ai/sdk'
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod'
import { MenuSchema, menuStats } from './menu-schema.js'
import { CONFIG } from '../config.js'
import { log } from '../lib/log.js'

const SYSTEM = `You transcribe restaurant menus into structured data.

You are reading a menu that a real restaurant published. What you produce will
be built into a live menu and shown back to that restaurant's owner. A single
wrong price destroys their trust in the whole thing.

Rules, in order of importance:

1. Transcribe, never invent. Every item name, description and price must be
   readable in the source. If a description is not printed, leave it empty —
   do not write one. If a price is illegible, set it to 0 and say so in notes.
2. Keep the menu's own structure. Use the section headings the menu uses, in
   the order it uses them. Do not merge, split, reorder or rename sections.
3. Keep the menu's own words, including spelling and capitalisation. Do not
   translate. Do not tidy up their prose.
4. Prices are numbers only. Strip currency symbols; put the currency in the
   currency field. "45.-" is 45. "AED 45 / 60" for two sizes means two portions.
5. Skip anything that is not a menu item: opening hours, addresses, allergen
   keys, social handles, "all prices include VAT" footers.
6. Be harsh in confidence. Score below 60 whenever the image is blurry, prices
   are partly hidden, or you inferred a section boundary. Put every doubt in
   notes, addressed to the person who will check your work.`

let client

function anthropic() {
	if (!client) {
		CONFIG.anthropicKey() // throws with a clear message when unset
		client = new Anthropic()
	}
	return client
}

/** A verified artifact -> the content block that carries it to the model. */
function contentBlock(source) {
	const data = source.buffer.toString('base64')
	if (source.kind === 'pdf') {
		return {
			type: 'document',
			source: { type: 'base64', media_type: 'application/pdf', data }
		}
	}
	if (source.kind === 'image') {
		return {
			type: 'image',
			source: { type: 'base64', media_type: source.contentType, data }
		}
	}
	// An HTML menu page: send the text, stripped of markup, rather than bytes.
	const text = source.buffer
		.toString('utf8')
		.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
		.replace(/<[^>]+>/g, ' ')
		.replace(/&nbsp;/g, ' ')
		.replace(/\s+/g, ' ')
		.trim()
		.slice(0, 120_000)
	return { type: 'text', text: `Menu page text:\n\n${text}` }
}

/**
 * Runs the request with a server-side refusal fallback, so a policy decline is
 * rescued inside the same call instead of dropping the venue from the batch.
 *
 * The retry exists because this combination — structured outputs on the beta
 * endpoint plus the fallback parameter — could not be exercised against the
 * live API when this was written. If the API rejects the pairing, the parse
 * still has to happen, so we fall back to the plain call rather than failing a
 * build over a safety net that a menu transcription will almost never need.
 */
async function withRefusalFallback(params) {
	try {
		return await anthropic().beta.messages.parse({
			...params,
			betas: ['server-side-fallback-2026-07-01'],
			fallbacks: 'default'
		})
	} catch (error) {
		const rejected =
			error instanceof Anthropic.BadRequestError &&
			/fallback|beta|output_config|json_schema/i.test(error.message)
		if (!rejected) throw error
		log.warn(`refusal fallback not accepted here (${error.message}); retrying without it`)
		return anthropic().messages.parse(params)
	}
}

/**
 * @param {{name: string}} venue
 * @param {Array<{kind: string, buffer: Buffer, contentType: string, url: string}>} sources
 *        Verified artifacts for one venue — several photos of one printed card
 *        are sent together so the model sees the whole menu at once.
 * @returns {Promise<{menu: object, stats: object, usage: object, model: string}>}
 */
export async function parseMenu(venue, sources) {
	if (sources.length === 0) throw new Error(`No verified menu sources for ${venue.name}`)

	const model = CONFIG.model()
	const blocks = sources.map(contentBlock)

	// Deliberately not streamed: menus are small outputs and parse() gives us
	// schema validation for free. A menu big enough to hit the ceiling is
	// caught below rather than silently truncated.
	const params = {
		model,
		max_tokens: 16000,
		thinking: { type: 'adaptive' },
		output_config: {
			effort: 'high',
			format: zodOutputFormat(MenuSchema, 'menu')
		},
		system: SYSTEM,
		messages: [
			{
				role: 'user',
				content: [
					...blocks,
					{
						type: 'text',
						text:
							`This is the published menu of "${venue.name}"` +
							`${venue.city ? `, ${venue.city}` : ''}` +
							`${venue.address ? ` (${venue.address})` : ''}.\n\n` +
							`Transcribe it. ${
								sources.length > 1
									? `There are ${sources.length} images or files; they are pages of one menu, so produce one menu covering all of them.`
									: ''
							}`
					}
				]
			}
		]
	}

	const response = await withRefusalFallback(params)

	// Structured outputs do not exempt us from checking why generation stopped.
	if (response.stop_reason === 'refusal') {
		throw new Error(
			`Model declined to transcribe ${venue.name}: ${response.stop_details?.explanation ?? 'no explanation'}`
		)
	}
	if (response.stop_reason === 'max_tokens') {
		throw new Error(
			`Menu for ${venue.name} exceeded the output ceiling — split the source into pages and re-run`
		)
	}
	if (!response.parsed_output) {
		throw new Error(`Model returned no parseable menu for ${venue.name}`)
	}

	const menu = response.parsed_output
	const stats = menuStats(menu)

	if (stats.itemCount === 0) {
		throw new Error(`Parsed zero items for ${venue.name} — the source is probably not a menu`)
	}

	log.info(
		`parsed ${venue.name}: ${stats.sectionCount} sections, ${stats.itemCount} items, ` +
			`confidence ${menu.confidence}`
	)

	return {
		menu,
		stats,
		model: response.model,
		usage: {
			input_tokens: response.usage?.input_tokens ?? 0,
			output_tokens: response.usage?.output_tokens ?? 0
		}
	}
}

/**
 * The bar a build must clear before a human even sees it in the review queue.
 * Below this, the source was not good enough and the venue is better served by
 * being asked for a better copy than by being sent a bad menu.
 */
export function isWorthReviewing({ menu, stats }) {
	if (stats.itemCount < 5) return { ok: false, why: 'fewer than 5 items parsed' }
	if (menu.confidence < 45) return { ok: false, why: `confidence ${menu.confidence} too low` }
	if (stats.pricedItems / stats.itemCount < 0.6) {
		return { ok: false, why: 'more than 40% of items have no price' }
	}
	return { ok: true, why: '' }
}
