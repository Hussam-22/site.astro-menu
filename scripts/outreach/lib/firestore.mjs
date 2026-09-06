/**
 * Minimal Firestore REST client authenticated by a service-account key.
 *
 * No firebase-admin dependency: this repo is a static marketing site and the
 * outreach pipeline is a side tool, so pulling the Admin SDK (and its tree)
 * into package.json would be the wrong trade. Signing a JWT and exchanging it
 * for an access token is about forty lines with node:crypto, and it matches
 * how lib/notion.mjs talks to Notion.
 *
 * The key is full admin on a PRODUCTION project. Everything here is scoped to
 * document paths the caller passes in, there is no delete helper, and the key
 * path comes from the environment so it is never hardcoded.
 */
import { createSign } from 'node:crypto'
import { readFileSync } from 'node:fs'

const TOKEN_URL = 'https://oauth2.googleapis.com/token'
const SCOPE = 'https://www.googleapis.com/auth/datastore'

function key() {
	const path = process.env.GOOGLE_APPLICATION_CREDENTIALS
	if (!path) throw new Error('GOOGLE_APPLICATION_CREDENTIALS is not set (path to the service-account JSON)')
	const k = JSON.parse(readFileSync(path, 'utf8'))
	if (!k.client_email || !k.private_key) throw new Error(`${path} is not a service-account key`)
	return k
}

const b64 = (o) => Buffer.from(typeof o === 'string' ? o : JSON.stringify(o)).toString('base64url')

let cached = null

/** Access token for the Firestore REST API, reused until a minute before expiry. */
export async function token() {
	if (cached && cached.expires > Date.now() + 60_000) return cached.value

	const k = key()
	const now = Math.floor(Date.now() / 1000)
	const claim = { iss: k.client_email, scope: SCOPE, aud: TOKEN_URL, iat: now, exp: now + 3600 }
	const unsigned = `${b64({ alg: 'RS256', typ: 'JWT' })}.${b64(claim)}`
	const sig = createSign('RSA-SHA256').update(unsigned).end().sign(k.private_key).toString('base64url')

	const res = await fetch(TOKEN_URL, {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
			assertion: `${unsigned}.${sig}`
		})
	})
	if (!res.ok) throw new Error(`Token exchange failed ${res.status}: ${await res.text()}`)

	const json = await res.json()
	cached = { value: json.access_token, expires: Date.now() + json.expires_in * 1000 }
	return cached.value
}

const project = () => process.env.FIREBASE_PROJECT_ID || 'menu-app-b268b'
const base = () => `https://firestore.googleapis.com/v1/projects/${project()}/databases/(default)/documents`

async function call(method, path, body) {
	const res = await fetch(`${base()}${path}`, {
		method,
		headers: { Authorization: `Bearer ${await token()}`, 'Content-Type': 'application/json' },
		body: body ? JSON.stringify(body) : undefined
	})
	if (!res.ok) throw new Error(`Firestore ${method} ${path} -> ${res.status}\n${await res.text()}`)
	return res.json()
}

export const getDoc = (path) => call('GET', path)

/**
 * All documents in a collection, following nextPageToken until exhausted.
 *
 * A single-page version of this silently truncated once this business
 * profile's meals collection passed 300 documents (this outreach batch's own
 * volume crossed that line): the existing-meal lookup in build-menu.mjs and
 * build-venue.mjs would miss anything past the first page and treat it as
 * absent, creating duplicates and throwing "not in Firestore" for meals that
 * were, in fact, already there. `pageSize` here is the per-request page size,
 * not a cap on the total returned.
 */
export async function listDocs(path, pageSize = 300) {
	const documents = []
	let pageToken
	do {
		const qs = new URLSearchParams({ pageSize: String(pageSize) })
		if (pageToken) qs.set('pageToken', pageToken)
		const page = await call('GET', `${path}?${qs}`)
		documents.push(...(page.documents ?? []))
		pageToken = page.nextPageToken
	} while (pageToken)
	return { documents }
}
export const createDoc = (collection, fields, id) =>
	call('POST', `${collection}${id ? `?documentId=${encodeURIComponent(id)}` : ''}`, { fields })

/* --- Firestore's REST value format, both directions ---------------------- */

/** JS value -> Firestore typed value. */
export function enc(v) {
	if (v === null || v === undefined) return { nullValue: null }
	if (typeof v === 'boolean') return { booleanValue: v }
	if (typeof v === 'number') return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v }
	if (typeof v === 'string') return { stringValue: v }
	if (v instanceof Date) return { timestampValue: v.toISOString() }
	if (Array.isArray(v)) return { arrayValue: { values: v.map(enc) } }
	return { mapValue: { fields: Object.fromEntries(Object.entries(v).map(([k, x]) => [k, enc(x)])) } }
}

/** Firestore typed value -> JS value. */
export function dec(v) {
	if (!v || typeof v !== 'object') return v
	if ('nullValue' in v) return null
	if ('booleanValue' in v) return v.booleanValue
	if ('integerValue' in v) return Number(v.integerValue)
	if ('doubleValue' in v) return v.doubleValue
	if ('stringValue' in v) return v.stringValue
	if ('timestampValue' in v) return v.timestampValue
	if ('arrayValue' in v) return (v.arrayValue.values ?? []).map(dec)
	if ('mapValue' in v) return Object.fromEntries(Object.entries(v.mapValue.fields ?? {}).map(([k, x]) => [k, dec(x)]))
	return v
}

export const decFields = (doc) =>
	Object.fromEntries(Object.entries(doc.fields ?? {}).map(([k, v]) => [k, dec(v)]))

/** Collection ids directly under a document (or the root when path is ''). */
export async function collectionIds(path = '') {
	const res = await fetch(`${base()}${path}:listCollectionIds`, {
		method: 'POST',
		headers: { Authorization: `Bearer ${await token()}`, 'Content-Type': 'application/json' },
		body: JSON.stringify({ pageSize: 100 })
	})
	if (!res.ok) throw new Error(`listCollectionIds ${path || '/'} -> ${res.status}\n${await res.text()}`)
	return (await res.json()).collectionIds ?? []
}

/** Patch named fields on an existing document, leaving the rest untouched. */
export function updateDoc(path, fields) {
	const mask = Object.keys(fields)
		.map((f) => `updateMask.fieldPaths=${encodeURIComponent(f)}`)
		.join('&')
	return call('PATCH', `${path}?${mask}`, { fields })
}

/** A Firestore-style auto id, so our documents look like the app's own. */
export function autoId() {
	const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
	return Array.from(cryptoBytes(20), (b) => A[b % A.length]).join('')
}
function cryptoBytes(n) {
	return globalThis.crypto.getRandomValues(new Uint8Array(n))
}
