/**
 * The smallest Notion client that does what the outreach pipeline needs.
 *
 * Deliberately not @notionhq/client: the pipeline runs on a schedule from a
 * plain Node process and only touches four endpoints, so a dependency-free
 * fetch wrapper keeps this repo's install unchanged. Everything here throws
 * loudly — a silent write failure would look like a lead that was contacted.
 */

const API = 'https://api.notion.com/v1'
const VERSION = '2022-06-28'

const token = () => {
	const t = process.env.NOTION_TOKEN
	if (!t) throw new Error('NOTION_TOKEN is not set. See scripts/outreach/README.md')
	return t
}

async function call(method, path, body) {
	const res = await fetch(`${API}${path}`, {
		method,
		headers: {
			Authorization: `Bearer ${token()}`,
			'Notion-Version': VERSION,
			'Content-Type': 'application/json'
		},
		body: body ? JSON.stringify(body) : undefined
	})

	if (!res.ok) {
		const detail = await res.text()
		throw new Error(`Notion ${method} ${path} -> ${res.status}\n${detail}`)
	}
	return res.json()
}

export const createDatabase = (body) => call('POST', '/databases', body)
export const createPage = (body) => call('POST', '/pages', body)
export const updatePage = (id, body) => call('PATCH', `/pages/${id}`, body)

/** Every row matching a filter, following pagination to the end. */
export async function queryAll(databaseId, filter) {
	const rows = []
	let cursor
	do {
		const page = await call('POST', `/databases/${databaseId}/query`, {
			filter,
			start_cursor: cursor,
			page_size: 100
		})
		rows.push(...page.results)
		cursor = page.has_more ? page.next_cursor : undefined
	} while (cursor)
	return rows
}

/* --- property shorthands, so callers read as data not as Notion plumbing --- */
export const prop = {
	title: (v) => ({ title: [{ text: { content: String(v ?? '').slice(0, 2000) } }] }),
	text: (v) =>
		v == null || v === ''
			? { rich_text: [] }
			: { rich_text: [{ text: { content: String(v).slice(0, 2000) } }] },
	number: (v) => ({ number: v == null || Number.isNaN(v) ? null : Number(v) }),
	select: (v) => (v ? { select: { name: String(v).slice(0, 100) } } : { select: null }),
	url: (v) => ({ url: v || null }),
	phone: (v) => ({ phone_number: v || null }),
	date: (v) => ({ date: v ? { start: v } : null }),
	checkbox: (v) => ({ checkbox: Boolean(v) })
}
