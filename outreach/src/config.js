/**
 * Every environment variable the pipeline reads, in one place, with a loud
 * failure when a required one is missing.
 *
 * Each stage declares only the keys it needs, so `npm run source` does not
 * demand an Anthropic key and `npm run build-menus` does not demand a Places
 * key. A stage that quietly ran without credentials and produced an empty
 * result would be worse than one that refuses to start.
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

// Load outreach/.env if it exists. Deliberately not a dependency: the file is
// a handful of KEY=value lines and dotenv's edge cases are not worth a package.
function loadEnvFile() {
	try {
		const text = readFileSync(resolve(process.cwd(), '.env'), 'utf8')
		for (const line of text.split('\n')) {
			const trimmed = line.trim()
			if (!trimmed || trimmed.startsWith('#')) continue
			const eq = trimmed.indexOf('=')
			if (eq === -1) continue
			const key = trimmed.slice(0, eq).trim()
			// An empty assignment means "not set", not "set to empty string".
			const value = trimmed
				.slice(eq + 1)
				.trim()
				.replace(/^["']|["']$/g, '')
			if (value && process.env[key] === undefined) process.env[key] = value
		}
	} catch (error) {
		if (error.code !== 'ENOENT') throw error
	}
}

loadEnvFile()

/**
 * Reads the named variables, throwing with all the missing ones at once rather
 * than one per run.
 */
export function require_(...names) {
	const missing = names.filter((name) => !process.env[name])
	if (missing.length > 0) {
		throw new Error(
			`Missing required environment ${missing.length === 1 ? 'variable' : 'variables'}: ` +
				`${missing.join(', ')}. See outreach/.env.example.`
		)
	}
	return Object.fromEntries(names.map((name) => [name, process.env[name]]))
}

export const CONFIG = {
	databaseUrl: () => require_('DATABASE_URL').DATABASE_URL,
	placesKey: () => require_('GOOGLE_PLACES_API_KEY').GOOGLE_PLACES_API_KEY,
	anthropicKey: () => require_('ANTHROPIC_API_KEY').ANTHROPIC_API_KEY,
	model: () => process.env.ANTHROPIC_MODEL || 'claude-opus-5',
	menuBaseUrl: () =>
		(process.env.MENU_BASE_URL || 'https://menu.astro-menu.com').replace(/\/$/, ''),
	siteBaseUrl: () => (process.env.SITE_BASE_URL || 'https://astro-menu.com').replace(/\/$/, ''),
	prospectBranchId: () => process.env.PROSPECT_BRANCH_ID || '2EKctRFUaA06pGIvAT2D',
	prospectTableId: () => process.env.PROSPECT_TABLE_ID || 'upxdTRj5NaTRl68f6ly0'
}

/** Where per-run output lands. Gitignored — regenerate rather than commit. */
export const OUT_DIR = resolve(process.cwd(), 'out')
