/**
 * Creates the "Astro-Menu Leads" database in Notion. Run once.
 *
 * One database, not several. Every stage of the pipeline is a Status value on
 * the same row, so a lead keeps its history in one place and you filter it
 * into Notion views ("Ready to send", "Waiting on reply") rather than moving
 * records between tables and losing the trail.
 *
 *   node --env-file=.env scripts/outreach/notion-setup.mjs
 *
 * Prints the database id. Put it in .env as NOTION_LEADS_DB.
 */
import { createDatabase } from './lib/notion.mjs'

const parent = process.env.NOTION_PARENT_PAGE_ID
if (!parent) throw new Error('NOTION_PARENT_PAGE_ID is not set. See scripts/outreach/README.md')

const sel = (...names) => ({ select: { options: names.map((name) => ({ name })) } })

const db = await createDatabase({
	parent: { type: 'page_id', page_id: parent },
	icon: { type: 'emoji', emoji: '🍽️' },
	title: [{ type: 'text', text: { content: 'Astro-Menu Leads' } }],
	properties: {
		Venue: { title: {} },

		/* Where the lead is. Drives every view you will actually work from. */
		Status: sel(
			'New',
			'Qualified',
			'Menu built',
			'Ready to send',
			'Sent',
			'Replied',
			'Trial',
			'Won',
			'Not interested',
			'Do not contact'
		),
		Score: { number: { format: 'number' } },

		/* Why we think they need us — the personalisation hook. */
		'Menu situation': sel(
			'Unknown',
			'No menu online',
			'Photos only',
			'PDF',
			'Third-party only',
			'Already digital'
		),

		/* Reach. Instagram is the send channel, the rest is context. */
		Instagram: { url: {} },
		'IG handle': { rich_text: {} },
		Website: { url: {} },
		Phone: { phone_number: {} },

		/* Sourcing facts from Google Places. */
		City: { select: { options: [] } },
		Emirate: sel(
			'Abu Dhabi',
			'Dubai',
			'Sharjah',
			'Ajman',
			'Umm Al Quwain',
			'Ras Al Khaimah',
			'Fujairah'
		),
		Category: { select: { options: [] } },
		Rating: { number: { format: 'number' } },
		Reviews: { number: { format: 'number' } },
		Address: { rich_text: {} },
		Maps: { url: {} },
		Chain: { checkbox: {} },

		/** Google's stable venue id. The dedupe key — never edit by hand. */
		'Place ID': { rich_text: {} },

		/* Filled in by later stages. */
		'Preview URL': { url: {} },
		'Draft DM': { rich_text: {} },
		Sourced: { date: {} },
		Contacted: { date: {} }
	}
})

console.log('\nDatabase created.')
console.log('Add this line to .env:\n')
console.log(`NOTION_LEADS_DB=${db.id}`)
console.log(`\n${db.url}`)
