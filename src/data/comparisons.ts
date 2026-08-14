import { PRICE } from '@config/site'

export type Comparison = {
	slug: string
	against: string
	title: string
	description: string
	h1: string
	lede: string
	body: string[]
	fair: string
	rows: { criterion: string; theirs: string; ours: string }[]
	verdict: string
	faqs: { q: string; a: string }[]
}

export const COMPARISONS: Comparison[] = [
	{
		slug: 'qr-menu-vs-pdf-menu',
		against: 'a PDF menu',
		title: 'QR Menu vs PDF Menu — Which Is Better?',
		description:
			'A PDF menu is a printed menu that happens to be a file. An honest comparison with a proper QR menu on cost, updates, mobile reading and search.',
		h1: 'QR menu vs PDF menu',
		lede: 'A PDF is a printed menu that has been emailed. It solves the distribution problem and none of the reading problems.',
		body: [
			'Linking a PDF from a QR code is the most common first attempt at a digital menu, and it is genuinely better than nothing. It costs almost nothing to set up and the file is easy to hand around.',
			'The trouble is that a PDF is a fixed-size page. On a phone it arrives zoomed out to illegibility, and the diner has to pinch, drag and hunt their way around a layout designed for A4 paper. Some phones download it rather than displaying it, which means a diner is now looking at their Downloads folder instead of your food.',
			'Updating is the other catch. A new PDF means opening the design file, exporting, re-uploading and — if the link changed — reprinting the QR code. In practice that friction means PDFs get updated far less often than the menu actually changes, and diners end up reading last season’s prices.'
		],
		fair: 'A PDF is fine if your menu genuinely never changes and you only need it as a downloadable document. Most menus change more than their owners expect.',
		rows: [
			{
				criterion: 'Reading on a phone',
				theirs: 'Fixed page size — pinch and zoom to read',
				ours: 'Built for phone screens, readable immediately'
			},
			{
				criterion: 'Opening the menu',
				theirs: 'Often downloads instead of opening',
				ours: 'Opens instantly in the browser'
			},
			{
				criterion: 'Changing a price',
				theirs: 'Edit the design file, re-export, re-upload',
				ours: 'Edit the item — live in seconds'
			},
			{
				criterion: 'Photos of dishes',
				theirs: 'Whatever fits the print layout',
				ours: 'A photo on every item'
			},
			{
				criterion: 'Dietary filtering',
				theirs: 'Not possible',
				ours: 'Tag and filter by dietary need'
			},
			{
				criterion: 'Other languages',
				theirs: 'A separate PDF per language',
				ours: 'Automatic — one menu, every language'
			},
			{
				criterion: 'On your Google listing',
				theirs: 'A file people must download to read',
				ours: 'A link that opens your live menu in one tap'
			},
			{
				criterion: 'Knowing what diners viewed',
				theirs: 'No data at all',
				ours: 'Views, popular items and peak hours'
			}
		],
		verdict:
			'A PDF menu is a document. A QR menu is a page built for the device people actually read it on. If your menu ever changes, the difference compounds quickly.',
		faqs: [
			{
				q: 'Can I move my existing PDF menu across?',
				a: 'Yes. Send us your PDF and we will load the first version of your menu for you, so you are not retyping anything.'
			},
			{
				q: 'Is a PDF menu bad for SEO?',
				a: 'It is not the menu itself that ranks — your Google Business Profile is what people find. The practical problem with a PDF is what happens next: someone taps your menu link and gets a file to download instead of something they can read, which is where you lose them.'
			},
			{
				q: 'Can I still offer a PDF for download?',
				a: 'Nothing stops you keeping one for print. Most venues find they stop needing it once the live menu is up.'
			}
		]
	},
	{
		slug: 'qr-menu-vs-printed-menu',
		against: 'a printed menu',
		title: 'QR Menu vs Printed Menu — Cost Compared',
		description:
			'An honest comparison of printed menus and QR menus: reprint costs, update speed, wear and tear, languages and what printed menus still do better.',
		h1: 'QR menu vs printed menu',
		lede: 'Printed menus have one real advantage, and it is not the one most people defend them for.',
		body: [
			'The genuine case for print is tactile: a heavy, well-designed menu is part of the experience in a fine dining room, and no phone screen replaces that. If that is your venue, keep the printed menu. The two are not mutually exclusive.',
			'For everyone else, the arithmetic is unkind. A print run has a design cost, a print cost, a lamination cost and a lead time, and every single price change starts the cycle again. Menus also get spilled on, torn and walked off with, so the run has to be larger than the number of tables.',
			'A QR menu has none of that. The QR code is printed once — on a table tent, a sticker or the window — and it keeps pointing at the current menu forever. A price change costs nothing and takes seconds, which means the menu on the table is actually accurate, which is the part diners notice.'
		],
		fair: 'Printed menus still win on presentation in high-end rooms, and on the rare occasion your diners have no phone at all. Plenty of venues run both — print in the dining room, QR on the window and online.',
		rows: [
			{
				criterion: 'Cost of a price change',
				theirs: 'A full reprint of every copy',
				ours: 'Free, in seconds'
			},
			{
				criterion: 'Lead time',
				theirs: 'Days, via a designer and a printer',
				ours: 'Immediate'
			},
			{
				criterion: 'Wear and tear',
				theirs: 'Spills, tears and copies that walk off',
				ours: 'A replaced sticker costs almost nothing'
			},
			{
				criterion: 'Menu length',
				theirs: 'Limited by pages and cost',
				ours: 'Unlimited items and sections'
			},
			{
				criterion: 'Photos',
				theirs: 'Expensive, and dates the menu quickly',
				ours: 'A photo on every item, changed any time'
			},
			{
				criterion: 'Other languages',
				theirs: 'A separate printed menu per language',
				ours: 'Automatic translation for every diner'
			},
			{
				criterion: 'Sold-out items',
				theirs: 'A verbal apology from the server',
				ours: 'Hidden from the menu instantly'
			},
			{
				criterion: 'Presentation and feel',
				theirs: 'Still the better experience in a fine dining room',
				ours: 'A screen, not an object'
			}
		],
		verdict:
			'If your menu is stable and the physical object is part of the experience, keep printing. If your prices move, your dishes rotate, or you have ever apologised for a sold-out item, the printed menu is costing you more than it looks.',
		faqs: [
			{
				q: 'How much does a printed menu actually cost per year?',
				a: `It depends entirely on your run size and finish, but the useful comparison is simple: add up what you spent on menu printing last year, including design time, and compare it with ${PRICE.annual}.`
			},
			{
				q: 'Can I use both a printed menu and a QR menu?',
				a: 'Many venues do. The printed menu stays in the dining room and the QR menu covers the window, social media, Google and takeaway.'
			},
			{
				q: 'What about diners who do not want to use a phone?',
				a: 'Keep a small number of printed copies for them. The point of going digital is to stop printing for every table, not to refuse anyone a menu.'
			}
		]
	},
	{
		slug: 'qr-menu-vs-instagram-menu',
		against: 'an Instagram menu',
		title: 'QR Menu vs an Instagram Menu',
		description:
			'Many restaurants use Instagram highlights as their menu. What that costs you in readability, search visibility and control.',
		h1: 'QR menu vs an Instagram highlights menu',
		lede: 'Posting your menu as an Instagram highlight puts it where your customers are. It also puts it somewhere it can barely be read and cannot be found.',
		body: [
			'Using Instagram as your menu is understandable — it is free, it is where your audience already is, and posting a few screenshots takes ten minutes. For a new venue it is a reasonable stopgap.',
			'What it costs you is everything outside Instagram. A highlight cannot be found on Google, cannot be linked to as a menu, cannot be searched or filtered, and cannot be read by anyone who does not have the app. Screenshots of a printed menu compress badly, so the prices are often genuinely hard to read on a small screen.',
			'It is also rented ground. The layout, the ordering and the reach all belong to a platform that can change any of them. A menu link is yours: it works in the Instagram bio, in a WhatsApp message, on Google, on a table tent and on a bag sticker, all at once.'
		],
		fair: 'Instagram is excellent at what it is for — showing your food to people who do not know you yet. It is just a poor filing cabinet. Use it for reach, and link to a real menu from the bio.',
		rows: [
			{
				criterion: 'Legibility',
				theirs: 'Compressed screenshots of a printed page',
				ours: 'Real text, sized for a phone'
			},
			{
				criterion: 'Finding a specific dish',
				theirs: 'Tap through highlights one by one',
				ours: 'Sections and filters'
			},
			{
				criterion: 'Use on your Google listing',
				theirs: 'Cannot be linked as your menu',
				ours: 'The menu link your Business Profile opens'
			},
			{
				criterion: 'Updating a price',
				theirs: 'Re-screenshot and re-upload the highlight',
				ours: 'Edit the item — live in seconds'
			},
			{
				criterion: 'Sharing outside the app',
				theirs: 'Awkward — needs the app to view properly',
				ours: 'A link that opens anywhere'
			},
			{
				criterion: 'Who controls it',
				theirs: 'The platform',
				ours: 'You'
			},
			{
				criterion: 'Use on a table',
				theirs: 'Not practical',
				ours: 'The same menu, from a QR code'
			},
			{
				criterion: 'Reach to new customers',
				theirs: 'Genuinely strong — this is what it is for',
				ours: 'None on its own — pair it with your social accounts'
			}
		],
		verdict:
			'Keep Instagram for reach and put the menu link in your bio. Let the platform do discovery and let a real menu do the reading.',
		faqs: [
			{
				q: 'Can I keep using Instagram as well?',
				a: 'Absolutely, and you should. Astro-Menu gives you a link for your bio; your posts keep doing what they already do well.'
			},
			{
				q: 'Does the menu link preview nicely when shared?',
				a: 'Yes. Your menu page carries proper preview images and titles, so it looks like a real page when shared on social apps or WhatsApp.'
			},
			{
				q: 'Will people scan a QR if they already follow me?',
				a: 'Regulars usually use the link rather than the code. Both point at the same menu, so it does not matter which one they pick.'
			}
		]
	},
	{
		slug: 'qr-menu-vs-google-business-menu',
		against: 'a Google Business Profile menu',
		title: 'QR Menu vs Google Business Profile Menu',
		description:
			'Search your restaurant on Google and you usually find blurry photos of a menu board, or a delivery app’s copy of your menu. Neither is yours. Here is the fix.',
		h1: 'QR menu vs the menu Google shows for you',
		lede: 'Go and search your own restaurant on Google right now, on a phone, and tap Menu. Whatever comes up is what every new customer sees before they decide. Most owners have never looked.',
		body: [
			'There are usually only three things Google can show in that Menu tab, and you control exactly one of them.',
			'The first is photographs of your physical menu — a wall board, a laminated card, a printed sheet — taken on a phone by you or by a customer and uploaded to your listing. Google shows them as a photo carousel. They are shot at an angle, half of them are out of focus, the prices are barely legible on a phone, and they show whatever your menu happened to say on the day the photo was taken. Nobody goes back to delete the one from two years ago.',
			'The second is a menu marked "provided by" a delivery aggregator. That is not your menu — it is the aggregator\'s copy of it, formatted their way, showing their prices, which include their commission. It updates when they update it, not when you change something, and it usually only contains the items you list for delivery rather than your full menu. It is also, quietly, an advert for a platform that charges you a percentage.',
			'The third is a menu link you supply yourself. That is the one worth having, because it is the only one that is actually current, actually complete, actually yours, and actually readable on the phone the person is holding.',
			'This is the whole argument for having a real menu link. Someone who finds you on Google is a customer who has not decided yet. Give them a fast page with a photo on every dish, today\'s prices, and their own language — instead of a squint at a photograph of a board, or a delivery app\'s version of you.'
		],
		fair: 'Google Business Profile is genuinely the most valuable listing you have, and you should keep it complete and accurate — the photos, the hours, the reviews, all of it. This is not an argument against your Google listing. It is an argument about what the Menu button on that listing should open.',
		rows: [
			{
				criterion: 'What people usually see',
				theirs: 'Phone photos of a menu board, or a delivery app’s copy',
				ours: 'Your real menu, as you published it'
			},
			{
				criterion: 'Who controls it',
				theirs: 'Customers who upload photos, or an aggregator',
				ours: 'You'
			},
			{
				criterion: 'How current it is',
				theirs: 'As current as the last photo someone took',
				ours: 'Updated the second you change it'
			},
			{
				criterion: 'Whose prices are shown',
				theirs: 'Often the delivery price, with commission built in',
				ours: 'Your prices'
			},
			{
				criterion: 'Readability on a phone',
				theirs: 'Pinch and zoom into a photo of a board',
				ours: 'Real text, sized for the screen'
			},
			{
				criterion: 'How much of the menu',
				theirs: 'Whatever was photographed, or the delivery range only',
				ours: 'Everything you serve'
			},
			{
				criterion: 'Photos per dish',
				theirs: 'A photo of the menu, not of the food',
				ours: 'A photo on every item'
			},
			{
				criterion: 'Other languages',
				theirs: 'Whatever language the board was printed in',
				ours: 'Automatic translation for every diner'
			},
			{
				criterion: 'Being found nearby',
				theirs: 'Excellent — this is exactly what a listing is for',
				ours: 'Not a search product on its own'
			}
		],
		verdict:
			'Keep the Google listing and add your menu link to it. Google is unbeatable at getting you found; it is just a poor place to read a menu. The five minutes it takes to paste your link into your profile replaces a blurry photo of a board with the actual menu, for every person who looks you up from now on.',
		faqs: [
			{
				q: 'How do I add my menu link to my Google Business Profile?',
				a: 'In your Business Profile, open Edit profile, then Menu (under Business information). Paste your Astro-Menu link into the menu link field and save. It usually appears within a day.'
			},
			{
				q: 'Can I remove the delivery app’s menu from my listing?',
				a: 'You cannot always remove a third-party menu directly, but adding your own menu link gives Google an authoritative source from you, which is what it prefers to show. Keeping your own link current is the most effective thing you can do.'
			},
			{
				q: 'What about the menu photos customers have uploaded?',
				a: 'You can report photos that are inaccurate or out of date through your Business Profile, though removal is at Google’s discretion. The more reliable fix is giving people a proper menu link so the photos stop being the only thing to read.'
			},
			{
				q: 'Will my menu itself rank in Google search?',
				a: 'Treat it as a link, not a search asset. Your menu is built to open fast for a diner who already has it — from your listing, your bio or a QR code. The page that should rank for your restaurant is your Google Business Profile, and the menu link is what makes that listing worth clicking.'
			}
		]
	}
]
