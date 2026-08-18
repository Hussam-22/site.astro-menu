import { SITE } from '../config/site'

/**
 * The three pillars, reframed around WHO benefits rather than around features.
 * Owner, staff, guest — the three people at every table — because "everybody
 * wins" is the thing worth selling and an abstract feature icon cannot sell it.
 */
export const PILLARS = [
	{
		who: 'The owner',
		title: 'No commission, ever',
		body: 'A flat monthly fee and nothing else. We never take a percentage of a bill, an order or a delivery, so what you charge is what you keep.',
		image: 'owner',
		brief: 'Cafe owner grinning, phone in hand, behind the counter',
		tone: 'warm' as const
	},
	{
		who: 'The staff',
		title: 'Changed in seconds',
		body: 'Price rise, sold-out dish, new special. Someone edits it on a phone and every QR code in the room is already showing it. No more apologising table by table.',
		image: 'staff',
		brief: 'Barista laughing mid-service, relaxed, not stressed',
		tone: 'brand' as const
	},
	{
		who: 'The guest',
		title: 'No app, no friction',
		body: 'They point a camera and the menu opens in their own language. Nothing to download, nothing to sign into, nothing for your staff to explain.',
		image: 'guests',
		brief: 'Two friends at a table scanning a QR, laughing at the phone',
		tone: 'dark' as const
	}
]

/** Real venues running Astro-Menu, quoted from their own testimonials. */
export const TESTIMONIALS = [
	{
		venue: 'Number Eight Speciality Coffee',
		person: 'Saeed',
		role: 'Owner',
		quote:
			'Astro-Menu transformed the way our customers interact with our menu. With more than 120 items, it used to take time for people to find what they wanted, but the filtering and clean layout changed everything. Customers can now browse, sort, and locate their preferred drinks or pastries in seconds. This has noticeably reduced ordering time and kept the flow moving smoothly, especially during peak hours.',
		menuUrl: SITE.demoMenuUrl
	},
	{
		venue: 'FOAM Coffee',
		person: 'Mayed',
		role: 'Mobile coffee truck',
		quote:
			'Astro-Menu has been a great addition to how we operate. Managing our menu is incredibly easy, and updates appear instantly. One of the biggest advantages is how smoothly customers can view our menu online through Google, Maps, or even our social media pages before visiting. It helps them decide faster and improves their overall experience.',
		menuUrl: null
	},
	{
		venue: 'The ACAI House Cafe',
		person: 'Ahmed S.',
		role: 'Cafe & drive-thru',
		quote:
			'The implementation of a QR menu system has been a game-changer for the drive-thru. Before this, our staff often felt overwhelmed, especially during peak hours, trying to take orders accurately and quickly. The line of cars would grow, and we could feel the stress from both our employees and our customers. We knew we had to find a better way to operate.',
		menuUrl: null
	}
]

/** The comparison table. Left column is us, right is a printed or PDF menu. */
export const VERSUS = [
	{
		point: 'Changing a price',
		astro: 'Type it. Live in seconds, at no cost.',
		other: 'Reprint the whole run, or live with a sticker over it.'
	},
	{
		point: 'A dish runs out',
		astro: 'One toggle and it disappears from the menu.',
		other: 'The waiter apologises, table by table, all night.'
	},
	{
		point: 'Reading it on a phone',
		astro: 'Built for a phone screen first. Nothing to zoom.',
		other: 'A PDF you pinch, drag and squint at.'
	},
	{
		point: 'Guests who read Arabic',
		astro: 'Every language you add, translated and right-to-left.',
		other: 'A second print run, or nothing at all.'
	},
	{
		point: 'Finding one dish in 120',
		astro: 'Section chips, meal-type filters, photos. Seconds.',
		other: 'Scroll, scroll, scroll, ask a waiter.'
	},
	{
		point: 'Allergies and calories',
		astro: 'Tagged per item, filterable, always current.',
		other: 'A separate sheet nobody can find.'
	},
	{
		point: 'Before they arrive',
		astro: 'The same menu opens from Google, Maps and Instagram.',
		other: 'A PDF download, if it is online at all.'
	},
	{
		point: 'What it tells you',
		astro: 'Views, popular items, peak hours.',
		other: 'Nothing at all.'
	}
]

export const USE_CASES = [
	{
		title: 'Restaurants & cafés',
		body: 'Big menus, table QR codes, and a link that answers "what do they serve?" before anyone books.',
		image: 'uc-cafe',
		brief: 'Busy cafe floor, table tent with QR in focus',
		tone: 'brand' as const
	},
	{
		title: 'Coffee trucks',
		body: 'One code on the hatch. Change the menu when you change the pitch.',
		image: 'uc-truck',
		brief: 'Truck hatch, owner leaning out, QR sticker on the counter',
		tone: 'warm' as const
	},
	{
		title: 'Hotel rooms',
		body: 'Room service, breakfast and pool menus on one code, in every language your guests read.',
		image: 'uc-hotel',
		brief: 'Room-service card on a bed, phone showing the menu',
		tone: 'dark' as const
	},
	{
		title: 'Bakeries & dessert bars',
		body: 'Photos sell the counter. Sold-out trays disappear with a toggle.',
		image: 'uc-bakery',
		brief: 'Counter of pastries, hand pointing at the phone menu',
		tone: 'brand' as const
	},
	{
		title: 'Clinics & staff canteens',
		body: 'Calories, macros and allergens on every item, without a printed sheet.',
		image: 'uc-clinic',
		brief: 'Bright canteen counter, tray of labelled healthy dishes',
		tone: 'warm' as const
	},
	{
		title: 'Lounges & shisha',
		body: 'Long lists, filtered fast, with the Wi-Fi password on the same screen.',
		image: 'uc-lounge',
		brief: 'Evening lounge table, phone glowing with the menu',
		tone: 'dark' as const
	}
]

/** The claims that scroll past on the ribbon under the hero. */
export const RIBBON = [
	'Unlimited menus',
	'Every language',
	'No commission',
	'A photo on every dish',
	'One QR forever',
	'Sold-out toggle',
	'No app to download',
	'Unlimited updates'
]

/**
 * The screenshot rail. Files live in src/assets/screens and are all shot from
 * the live reference menu, so what visitors see here is exactly what they get.
 * `tall` drives the masonry rhythm — mixed heights are what make the grid read
 * as a Pinterest board rather than a table of thumbnails.
 */
export const SCREENS = [
	{
		file: 'landing.png',
		title: 'Your venue, first',
		body: 'Cover photo, logo and your story — plus one tap to call, WhatsApp, Maps, Instagram or leave a Google review.',
		tall: true
	},
	{
		file: 'menu-sections.png',
		title: 'Sections that stay put',
		body: 'Section chips pin to the top. Guests jump straight to Brewed Coffee without scrolling past breakfast.',
		tall: false
	},
	{
		file: 'item-detail.png',
		title: 'Every dish, properly',
		body: 'A full-width photo, the description you wrote, and each size or portion with its own price.',
		tall: true
	},
	{
		file: 'filter-meal-type.png',
		title: 'Filter to what they want',
		body: 'Iced, decaf, healthy, light portion — 120 items narrow to five in two taps.',
		tall: false
	},
	{
		file: 'language-switch.png',
		title: 'In their language',
		body: 'Add a language and the whole menu is translated, right-to-left where it should be.',
		tall: true
	},
	{
		file: 'macros.png',
		title: 'Calories and macros',
		body: 'Per item, if you want them — calories, carbs, fat and protein, with allergen tags alongside. Shown here on another customer’s menu.',
		tall: false
	}
]
