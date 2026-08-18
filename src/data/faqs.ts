import { PRICE, SITE } from '../config/site'

export type Faq = { q: string; a: string }
export type FaqGroup = { heading: string; items: Faq[] }

/**
 * Grouped for /faq, and a subset is pulled onto the home page. Everything here
 * is emitted as FAQPage JSON-LD, so answers are written to stand alone — a
 * search result or an AI answer will quote one without the question around it.
 */
export const FAQ_GROUPS: FaqGroup[] = [
	{
		heading: 'Getting started',
		items: [
			{
				q: 'How long does it take to set up a QR menu?',
				a: `Most menus are live the same day. You can type your items in yourself, or send us your existing PDF, photos or printed menu and we will load the first version for you and hand it back ready to check. There is a ${PRICE.trialDays}-day free trial and no card is needed to start.`
			},
			{
				q: 'Do I need to be technical to use it?',
				a: 'No. Everything is a form field in a dashboard — item name, price, description, photo. If you can post to Instagram you can run an Astro-Menu menu. There is nothing to install and nothing to host.'
			},
			{
				q: 'What do you need from me to build the first menu?',
				a: 'Your current menu in any form — a PDF, a photo of the printed card, or a spreadsheet — plus your logo and a cover photo of the venue. Dish photos are optional at the start and can be added item by item afterwards.'
			},
			{
				q: 'Can I try it before paying?',
				a: `Yes. Every account starts with a ${PRICE.trialDays}-day free trial and no card is required. You can build the whole menu, print the code and put it on tables during the trial.`
			}
		]
	},
	{
		heading: 'Pricing',
		items: [
			{
				q: 'How much does Astro-Menu cost?',
				a: `Astro-Menu is ${PRICE.monthly} per month, or ${PRICE.annualPerMonth} per month when you pay ${PRICE.annualTotal} for the year — a saving of ${PRICE.annualSaving}, about ${PRICE.annualSavingPercent}%. That is one price for everything: unlimited menus, unlimited items, unlimited views, every language and all updates. In dirhams it is ${PRICE.monthlyAed} a month or ${PRICE.annualTotalAed} a year.`
			},
			{
				q: 'Do you take a commission on orders?',
				a: 'No, and we could not — Astro-Menu does not process orders or payments at all. It is a menu. Your staff take orders the way they always have, and every dirham your customer spends goes straight to you.'
			},
			{
				q: 'Are there setup fees, hardware costs or contracts?',
				a: 'None. There is no setup fee, nothing to buy and no minimum term. A printed QR code is the only hardware involved, and you can cancel from the dashboard whenever you like.'
			},
			{
				q: 'Is there a limit on scans or menu views?',
				a: 'No. Menu views are unlimited, whether you get fifty scans a month or fifty thousand.'
			},
			{
				q: 'What happens if I cancel?',
				a: 'Your menu stops being served and the QR code stops resolving. Nothing else happens — there is no exit fee and no notice period. Come back later and your menu is still there.'
			}
		]
	},
	{
		heading: 'How the menu works',
		items: [
			{
				q: 'Do my customers need to download an app?',
				a: 'No. The menu opens in whatever browser is already on the phone. Point the camera at the code and it opens — no download, no account, no sign-in.'
			},
			{
				q: 'Will I have to reprint the QR code when the menu changes?',
				a: 'No, and this is the single most important thing to get right. The code points at your menu, not at a file. Change prices, add dishes, rebuild the whole menu — the printed code on the table keeps working. Codes that encode a PDF have to be reprinted every time, which is what forces most venues to start over.'
			},
			{
				q: 'Can I show the menu in Arabic?',
				a: 'Yes. Add Arabic in the dashboard and the whole menu is translated and laid out right-to-left. Guests switch language from the header. Any language works the same way, and you can override an individual translation if a dish name comes back wrong.'
			},
			{
				q: 'Can I hide a dish that has sold out?',
				a: 'Yes — one toggle. The item disappears from the live menu immediately and comes back whenever you switch it on again, so nobody orders something you cannot serve.'
			},
			{
				q: 'Can I show calories, macros and allergens?',
				a: 'Yes. Calories, carbs, fat and protein can be shown per item, and dietary and allergen tags attach to the item so they travel with it. Both are optional — switch them off for the whole menu if you would rather not display them.'
			},
			{
				q: 'Can guests filter a long menu?',
				a: 'Yes. Guests filter by meal type — hot, cold, decaf, healthy, light portion, sweet — and jump between sections from chips pinned at the top of the screen. On a 120-item menu that is the difference between finding a drink in seconds and giving up.'
			},
			{
				q: 'Does it work without an internet connection?',
				a: 'The guest needs a connection to load the menu the first time, the same as opening any web page. Most venues put their Wi-Fi password on the menu page itself for exactly this reason.'
			}
		]
	},
	{
		heading: 'Sharing and search',
		items: [
			{
				q: 'Can I use the menu outside the restaurant?',
				a: 'Yes, and most of the value is there. Every menu has a plain link as well as a QR code, so the same menu opens from your Google Business profile, Google Maps, your Instagram bio, a WhatsApp reply or a printed flyer. People decide where to eat before they leave the house.'
			},
			{
				q: 'Will my menu show up on Google?',
				a: 'A hosted menu page can be crawled and indexed, which a PDF or a photograph of a menu effectively cannot. Adding your menu link to your Google Business profile is the highest-return thing you can do with it.'
			},
			{
				q: 'Can I use it across several branches?',
				a: `Each branch gets its own menu, its own QR code and its own venue page, so prices and availability can differ between them. Email ${SITE.email} for a multi-branch setup.`
			}
		]
	},
	{
		heading: 'What Astro-Menu is not',
		items: [
			{
				q: 'Is there a POS or till system?',
				a: 'No. Astro-Menu is a digital menu and nothing else. Keep whatever till you already use — we do not replace it, integrate with it, or sit between you and your customer.'
			},
			{
				q: 'Can customers order and pay from the menu?',
				a: 'No. There is no cart, no ordering and no payment. That is deliberate: it keeps the product simple, keeps the price at one flat fee, and means we never take a commission.'
			},
			{
				q: 'Do you supply tablets, printers or stands?',
				a: 'No hardware at all. You print the QR code on whatever you already use — a table tent, a sticker, a window decal, the back of a business card.'
			}
		]
	}
]

export const ALL_FAQS: Faq[] = FAQ_GROUPS.flatMap((g) => g.items)

/** The subset shown on the home page — the questions that actually block a sale. */
const HOME_FAQ_QUESTIONS = [
	'How much does Astro-Menu cost?',
	'Will I have to reprint the QR code when the menu changes?',
	'Do my customers need to download an app?',
	'Do you take a commission on orders?',
	'Can I show the menu in Arabic?',
	'How long does it take to set up a QR menu?'
]

export const HOME_FAQS: Faq[] = HOME_FAQ_QUESTIONS.map((q) => {
	const found = ALL_FAQS.find((f) => f.q === q)
	// Fails the build rather than silently dropping a question if one is renamed.
	if (!found) throw new Error(`HOME_FAQ_QUESTIONS names a question missing from FAQ_GROUPS: ${q}`)
	return found
})
