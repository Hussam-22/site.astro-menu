/**
 * The shape a parsed menu has to land in.
 *
 * It mirrors the Firestore documents the menu app reads —
 * `businessProfiles/{id}/menus/{menuID}/sections` and
 * `businessProfiles/{id}/meals` — so src/build/firestore.js is a rename, not a
 * translation. Keeping the schema here rather than inline in the prompt means
 * the model's output and the database write can never drift apart.
 */
import { z } from 'zod'

export const ItemSchema = z.object({
	title: z.string().describe('The dish name exactly as the menu writes it'),
	description: z
		.string()
		.describe("The menu's own description, or an empty string when it gives none. Never invented."),
	price: z
		.number()
		.describe('Price as a number in the menu currency. 0 when the menu shows no price.'),
	portions: z
		.array(
			z.object({
				label: z.string().describe('e.g. "Small", "Large", "250g"'),
				price: z.number()
			})
		)
		.describe('Sizes with their own prices. Empty when the item has a single price.'),
	calories: z.number().describe('Calories per serving, or 0 when the menu does not say'),
	protein: z.number().describe('Grams of protein, or 0 when the menu does not say'),
	carbs: z.number().describe('Grams of carbohydrate, or 0 when the menu does not say'),
	fat: z.number().describe('Grams of fat, or 0 when the menu does not say')
})

export const SectionSchema = z.object({
	title: z.string().describe('The section heading as printed, e.g. "Hot Drinks"'),
	items: z.array(ItemSchema)
})

export const MenuSchema = z.object({
	venueName: z
		.string()
		.describe('The venue name as it appears on the menu, or an empty string if absent'),
	currency: z
		.string()
		.describe('ISO currency code read from the menu, e.g. "AED". Empty if unclear.'),
	language: z
		.string()
		.describe('BCP-47 tag of the language the menu is written in, e.g. "en" or "ar"'),
	sections: z.array(SectionSchema),
	confidence: z
		.number()
		.describe(
			'0-100: how confident you are that every price and item name is correct. ' +
				'Be harsh. A blurry photo or a price you had to guess should score below 60.'
		),
	notes: z
		.string()
		.describe(
			'What a human reviewer must check before this is sent to the venue: ' +
				'anything illegible, ambiguous, or that you inferred rather than read.'
		)
})

/** Totals used for the review queue and for the build row. */
export function menuStats(menu) {
	const sections = menu.sections ?? []
	const items = sections.flatMap((s) => s.items ?? [])
	return {
		sectionCount: sections.length,
		itemCount: items.length,
		pricedItems: items.filter((i) => i.price > 0).length,
		withDescriptions: items.filter((i) => (i.description ?? '').trim().length > 0).length
	}
}
