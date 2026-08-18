/**
 * What one Astro-Menu subscription actually contains. Every list on the site
 * reads from here so /pricing, /features and the home page can never drift
 * apart. Wording is drawn from what the live reference menu genuinely does.
 */
export const INCLUDED = [
	'Unlimited menus, sections and items',
	'Unlimited menu views — no scan limits',
	'A photo on every item',
	'Sizes and portions, each with its own price',
	'Calories and macros per item, if you want them',
	'Automatic translation into any language, Arabic included',
	'Dietary and allergen tags',
	'Filter the menu by meal type',
	'One QR code that never changes, however often the menu does',
	'Print-ready QR downloads — PNG, SVG and PDF',
	'A shareable link for Instagram, WhatsApp and Google',
	'Your own branded venue page with cover photo and logo',
	'Wi-Fi password, phone, WhatsApp, Maps and review links',
	'Menu analytics — views, popular items, peak hours',
	'Works in any phone browser, no app to download',
	'Unlimited updates, live in seconds',
	'Email support, and we will load your first menu for you'
]

/**
 * The deliberate omissions. This is the sharpest thing we can say against
 * Orderific, eMenu, TableQR and the rest — most of them bundle a POS and price
 * accordingly. Saying plainly what we do not do is what makes the price
 * believable.
 */
export const NOT_INCLUDED = [
	{
		label: 'No POS or till system',
		reason: 'Keep the till you already have. We never sit between you and your customer.'
	},
	{
		label: 'No order taking, no payments',
		reason: 'Your staff take orders the way they always have, and the money goes straight to you.'
	},
	{
		label: 'No commission, on anything',
		reason: 'One flat fee. We never take a cut of a bill, an order or a delivery.'
	},
	{
		label: 'No hardware to buy',
		reason: 'No tablets, no printers, no installation visit. A printed QR code is the hardware.'
	}
]

export const STEPS = [
	{
		n: '01',
		title: 'Send us your menu',
		body: 'Send the PDF, the photos, even a snapshot of the printed card. We do the conversion by hand — every section, item, description and price — and hand the finished menu back for you to check.',
		detail: 'This is the part that takes real work, and it is the part we do for you.'
	},
	{
		n: '02',
		title: 'Make it yours',
		body: 'Cover photo, logo, colours, section order, a photo on each dish. Add the languages you serve in and Astro-Menu translates the whole menu.',
		detail: 'Everything is a field in the dashboard. No designer, no ticket.'
	},
	{
		n: '03',
		title: 'Print the code, share the link',
		body: 'Download the QR print-ready and copy your link. Both point at the same live menu, and neither ever changes.',
		detail: 'Table tents, window decals, Instagram bio, Google profile, delivery bags.'
	},
	{
		n: '04',
		title: 'Change it whenever you like',
		body: 'Sold out of the salmon? Toggle it off. New price? Type it. The change is live before you put your phone down.',
		detail: 'No reprint, no re-sticker, no waiting on anyone.'
	}
]

/** Feeds the "what you control" section. Mirrors the real dashboard surface. */
export const DASHBOARD_CONTROLS = [
	{
		title: 'Menus',
		body: 'Run separate menus for breakfast, lunch, brunch and the weekend. Publish one, keep the rest waiting.'
	},
	{
		title: 'Sections',
		body: 'Create, rename and reorder sections. The order you set is the order guests scroll — and it changes what they order.'
	},
	{
		title: 'Items & prices',
		body: 'Photo, description, price, portions, calories, allergen tags. Edit any field and it is live immediately.'
	},
	{
		title: 'Availability',
		body: 'One toggle hides a dish the moment it runs out, and brings it back tomorrow. Nobody orders what you cannot serve.'
	},
	{
		title: 'Languages',
		body: 'Add the languages your guests read. Astro-Menu translates the whole menu and switches to right-to-left for Arabic.'
	},
	{
		title: 'Look & feel',
		body: 'Cover photo, logo, brand colour, venue story, Wi-Fi password, socials, Maps and review links.'
	},
	{
		title: 'QR & links',
		body: 'Download the code print-ready in PNG, SVG or PDF, and grab the plain link for anywhere a URL goes.'
	},
	{
		title: 'Analytics',
		body: 'Which items get opened, which get ignored, when the scans happen. Evidence for the next menu you write.'
	}
]
