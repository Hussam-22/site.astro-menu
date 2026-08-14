import { PRICE } from '@config/site'

export type Industry = {
	slug: string
	name: string
	title: string
	description: string
	h1: string
	lede: string
	body: string[]
	problems: { title: string; body: string }[]
	highlights: string[]
	faqs: { q: string; a: string }[]
}

export const INDUSTRIES: Industry[] = [
	{
		slug: 'restaurants',
		name: 'Restaurants',
		title: 'Digital Menu for Restaurants',
		description:
			`A digital menu for restaurants: photos on every dish, allergen filters, instant price changes and one QR code you never reprint. ${PRICE.monthly} a month.`,
		h1: 'Digital menus for restaurants',
		lede: 'A full restaurant menu is the hardest kind to keep accurate on paper. Sections, modifiers, seasonal dishes, price rises, and a printer who needs three days.',
		body: [
			'The typical restaurant menu goes out of date the moment it is printed. A supplier raises a price, a dish comes off, a new starter goes on, and the choice is either reprinting everything or letting servers apologise their way through the evening. Neither is good.',
			'A digital menu removes the choice. You edit the item, and every diner from that second onwards sees the new version. The QR code on the table does not change, so the cost of an update is zero and the delay is nothing.',
			'It also gives you room you never had on paper. Every dish can carry a photo, a full description, and dietary tags that guests can filter by. Diners who can see what a dish looks like order it more confidently, and tables that can filter for themselves ask fewer questions and order sooner.'
		],
		problems: [
			{
				title: 'Reprints cost more than the menu system',
				body: 'A single reprint of laminated menus for a mid-size restaurant usually costs more than a full year of Astro-Menu — and you will do it more than once a year.'
			},
			{
				title: 'The 86 list never reaches the menu',
				body: 'When a dish runs out, hide it. Nobody orders something the kitchen cannot make, and no server has to walk back to explain.'
			},
			{
				title: 'Allergen questions slow the room down',
				body: 'Tag dishes as vegetarian, vegan, gluten-free or nut-free and let guests filter. Fewer interruptions, fewer mistakes.'
			},
			{
				title: 'Nobody can find your menu online',
				body: 'Your menu becomes a real web page with a real link — one you can put on Google, Instagram and your website instead of a PDF.'
			}
		],
		highlights: [
			'Unlimited sections, dishes and daily specials',
			'A photo on every dish',
			'Dietary and allergen tags with guest-side filtering',
			'Hide and unhide dishes as the kitchen runs out',
			'Automatic translation for every diner',
			'One QR code that never needs reprinting'
		],
		faqs: [
			{
				q: 'Can I run a lunch menu and a dinner menu?',
				a: 'Yes. Build as many menus as you need and choose which one is live. The QR code on the table stays the same.'
			},
			{
				q: 'Can I show a set menu or a tasting menu?',
				a: 'Yes — build it as its own menu with its own sections, and publish it alongside or instead of the à la carte.'
			},
			{
				q: 'Do you handle orders and payments?',
				a: 'No, deliberately. Astro-Menu shows your menu. Your team takes orders and takes payment exactly as they do now, and we never touch a transaction.'
			}
		]
	},
	{
		slug: 'cafes',
		name: 'Cafés',
		title: 'Digital Menu for Cafés & Coffee Shops',
		description:
			`A QR menu for cafés and coffee shops. Show every drink with a photo, swap seasonal specials in seconds, and skip the chalkboard rewrite. ${PRICE.monthly} a month.`,
		h1: 'Digital menus for cafés and coffee shops',
		lede: 'Coffee menus change more often than restaurant menus and have less room to say it. A phone gives you all the space a chalkboard never had.',
		body: [
			'Most cafés run a permanent core and a rotating edge — a seasonal latte, a new bean, a pastry that is only around on weekends. On a chalkboard or a printed card, that edge is where all the effort goes, and it is always slightly out of date.',
			'A digital menu lets the rotating part rotate freely. Add the new drink in the morning, take it off when the syrup runs out, and never rewrite a board again. Regulars who check the menu before they walk in see the current version, not last month’s.',
			'It also gives drinks somewhere to be described properly. Origin, roast, milk options, sweetness, size and price all fit comfortably, along with a photo — which matters more for drinks than most owners expect, because the visual is the product.'
		],
		problems: [
			{
				title: 'The board is always slightly wrong',
				body: 'Seasonal drinks come and go faster than anyone gets around to rewriting the board. Digital updates take seconds.'
			},
			{
				title: 'No room to explain the coffee',
				body: 'Origin, roast notes and milk options do not fit on a board but fit easily on a phone, without making the menu feel long.'
			},
			{
				title: 'Queues form while people decide',
				body: 'A QR code near the door lets people read the full menu while they queue, so they order the moment they reach the counter.'
			},
			{
				title: 'Instagram is your real shopfront',
				body: 'Put your menu link in your bio. People who find you through a photo can see the whole menu without leaving their phone.'
			}
		],
		highlights: [
			'Rotate seasonal drinks without reprinting anything',
			'Photos for drinks, pastries and brunch plates',
			'Milk, size and sweetness options laid out clearly',
			'A QR code for the counter, the window and the table',
			'One link for your Instagram bio',
			'Analytics showing which drinks get looked at most'
		],
		faqs: [
			{
				q: 'Can I show different sizes and prices for the same drink?',
				a: 'Yes. List sizes and their prices under the item so the whole range is visible without cluttering the menu.'
			},
			{
				q: 'Is this useful if I have no table service?',
				a: 'Very. Counter-service cafés get the most out of a QR code by the queue, because people arrive at the till already knowing what they want.'
			},
			{
				q: 'Can I put the Wi-Fi password on the menu?',
				a: 'Yes, and most cafés do. It saves your staff from being asked twenty times a day.'
			}
		]
	},
	{
		slug: 'food-trucks',
		name: 'Food trucks',
		title: 'Digital Menu for Food Trucks',
		description:
			`A QR menu for food trucks and street food stalls. One sticker on the window, a menu you change per pitch, and no printing. ${PRICE.monthly} a month.`,
		h1: 'Digital menus for food trucks and street food',
		lede: 'You move, your menu moves, and you have about one square foot of space to explain both. A QR sticker solves all three.',
		body: [
			'A food truck has the least room and the most change of any food business. The board on the side of the truck has to be small, so it says almost nothing, and rewriting it is a job you do in the dark after service.',
			'A QR sticker on the window points at a menu with unlimited room. Full descriptions, photos, prices, allergens, and today’s specials — all of it readable while someone is standing in the queue, which is exactly when you want them deciding.',
			'And because the menu is a link, it also tells people where you are. Post it with your pitch for the day and anyone following you gets the location and the menu in the same message.'
		],
		problems: [
			{
				title: 'The board is too small for the menu',
				body: 'A phone has unlimited space. Full descriptions, photos and allergens with no squeezing.'
			},
			{
				title: 'Printing makes no sense when you move',
				body: 'Different pitch, different crowd, different menu. Change the digital menu in seconds instead of printing for each event.'
			},
			{
				title: 'Queues are where people decide',
				body: 'A sticker people can scan from ten places back in the line means faster ordering when they reach the hatch.'
			},
			{
				title: 'Your followers need one link',
				body: 'Post the same menu link with every location update. It never changes and it is never out of date.'
			}
		],
		highlights: [
			'One weatherproof QR sticker, printed once',
			'Change the menu per pitch or per event',
			'Full item descriptions with photos',
			'Allergen tags without a laminated folder',
			'A link that works in every social post',
			'Nothing to power, mount or charge'
		],
		faqs: [
			{
				q: 'What if I have no reliable internet at a pitch?',
				a: 'Your customers load the menu on their own phones over mobile data, so your connection does not matter for them to read it. You only need a connection when you want to edit the menu.'
			},
			{
				q: 'Can I run a different menu at different events?',
				a: 'Yes. Keep several menus built and switch which one is live. The sticker on the truck never changes.'
			},
			{
				q: 'Is one subscription enough for one truck?',
				a: `Yes — ${PRICE.monthly} a month covers one venue, and a truck counts as one venue no matter how many places it parks.`
			}
		]
	},
	{
		slug: 'hotels',
		name: 'Hotels',
		title: 'Digital Menu for Hotels & Room Service',
		description:
			`QR menus for hotel outlets, room service and pool bars. Multilingual for international guests, separate menus per outlet, ${PRICE.monthly} per venue per month.`,
		h1: 'Digital menus for hotels and hospitality',
		lede: 'A hotel does not have a menu. It has eight of them, in four languages, and one of them is always out of date.',
		body: [
			'Hotel food and beverage means outlets: a main restaurant, a lobby café, a pool bar, room service, breakfast, and whatever the ballroom is doing this week. Each has its own menu, its own audience and its own update cycle, and printing them all in several languages is a standing cost that never goes away.',
			'Running them digitally means each outlet gets its own menu and its own QR code, changed independently. The pool bar can add a new juice at eleven without anyone touching the restaurant menu.',
			'Translation is where hotels save the most. Instead of printing an English, Arabic and Russian version of every menu, you publish once and every guest reads it in their own language automatically — including languages you would never have printed for.'
		],
		problems: [
			{
				title: 'Every outlet is a separate print job',
				body: 'Give each outlet its own menu and QR code. They change independently and cost nothing to update.'
			},
			{
				title: 'Translated menus multiply the printing',
				body: 'Three languages used to mean three times the printing. Automatic translation makes it one menu for every guest.'
			},
			{
				title: 'In-room menus go missing and get tired',
				body: 'A QR card in the room is cheap to replace and always points at the current menu, however battered the card gets.'
			},
			{
				title: 'Guests want to look before they book a table',
				body: 'Share outlet menu links in the guest directory, on the hotel website and in pre-arrival emails.'
			}
		],
		highlights: [
			'A separate menu and QR code for every outlet',
			'Automatic translation for international guests',
			'Room service menus that update without reprinting cards',
			'Breakfast, all-day and evening menus on one code',
			'Seasonal and event menus published in advance',
			'Menu links that drop into your guest directory'
		],
		faqs: [
			{
				q: 'Is the price per hotel or per outlet?',
				a: `Per outlet. Each outlet is its own venue with its own menu, QR code and analytics, at ${PRICE.monthly} a month each.`
			},
			{
				q: 'Can we match the menu to our hotel branding?',
				a: 'Yes. Each menu page carries your outlet’s name, logo and photos so it reads as yours rather than ours.'
			},
			{
				q: 'Can we embed a menu in our own website?',
				a: 'You can link to it from anywhere. The menu is a normal web page with a normal URL.'
			}
		]
	},
	{
		slug: 'cloud-kitchens',
		name: 'Cloud kitchens',
		title: 'Digital Menu for Cloud Kitchens',
		description:
			`A menu link for cloud kitchens and delivery-only brands. No storefront needed — one link for Instagram, WhatsApp and delivery bags. ${PRICE.monthly} a month.`,
		h1: 'Digital menus for cloud kitchens and delivery brands',
		lede: 'With no dining room, your menu is the entire storefront. It should not be a screenshot.',
		body: [
			'A delivery-only brand lives or dies on how its menu reads on a phone, because the phone is the only place the brand exists. Most cloud kitchens end up with their menu scattered across aggregator listings, Instagram highlights and a WhatsApp image — three versions, all slightly different, none of them yours.',
			'A menu link gives you one canonical version that you own. Post it in your bio, reply to enquiries with it, print it on the bag sticker so repeat customers can order direct next time, and update it without asking anyone.',
			'That last part matters commercially. Every direct order that starts from your own link instead of an aggregator is an order you keep the margin on — and Astro-Menu never takes a commission on any of it.'
		],
		problems: [
			{
				title: 'Your menu lives on someone else’s platform',
				body: 'A menu link you own works everywhere and is not subject to another platform’s layout, ranking or fees.'
			},
			{
				title: 'Aggregator commission eats the margin',
				body: 'A bag sticker with your own menu QR gives repeat customers a direct route back. We charge a flat fee and take no cut.'
			},
			{
				title: 'Screenshots are not a menu',
				body: 'Instagram highlights and WhatsApp images cannot be searched, filtered or updated. A real menu page can.'
			},
			{
				title: 'Multiple brands from one kitchen',
				body: 'Each brand gets its own menu page, branding and link, so they stay properly separate.'
			}
		],
		highlights: [
			'One menu link you own and control',
			'QR codes for bag stickers and flyers',
			'A branded menu page per virtual brand',
			'No commission on any order, ever',
			'Photos and full descriptions for every item',
			'Analytics on what people actually look at'
		],
		faqs: [
			{
				q: 'Do you take orders for delivery?',
				a: 'No. Astro-Menu is the menu, not an ordering platform. Customers order through whatever channel you already use — phone, WhatsApp or an aggregator.'
			},
			{
				q: 'Can I run several virtual brands?',
				a: 'Yes, but each brand is its own venue with its own menu, code and subscription so the branding stays separate.'
			},
			{
				q: 'Can I put the QR on packaging?',
				a: 'Yes. Download it as SVG or PDF at any size, which is what you want for print and sticker artwork.'
			}
		]
	},
	{
		slug: 'bakeries',
		name: 'Bakeries & sweets',
		title: 'Digital Menu for Bakeries & Sweet Shops',
		description:
			`A QR menu for bakeries, patisseries and sweet shops. Show every product with a photo, run seasonal and Ramadan ranges, ${PRICE.monthly} a month.`,
		h1: 'Digital menus for bakeries and sweet shops',
		lede: 'People buy pastries with their eyes. A text list is the worst possible way to sell something that looks like that.',
		body: [
			'A bakery counter sells itself, but only to the person standing in front of it. Everyone else — the customer ordering a cake by phone, the one deciding whether to walk over, the one planning an order for next weekend — is working from whatever you have managed to put online.',
			'A photo-led digital menu fixes that. Every item gets a proper picture, a description, a size and a price, and the whole range is readable from a link you can send to anyone who asks.',
			'Seasonal ranges are the other win. Ramadan and Eid sweets, National Day boxes, Christmas ranges and wedding cakes can be built ahead of time and published on the day they open, then retired without a single reprinted price card.'
		],
		problems: [
			{
				title: 'Photos sell pastries, text does not',
				body: 'Every item carries a photo at a size worth looking at, which is the whole sales pitch for baked goods.'
			},
			{
				title: 'Seasonal ranges arrive and leave fast',
				body: 'Build the Ramadan or Eid range in advance, publish it on day one, and retire it when it ends.'
			},
			{
				title: 'Custom and cake orders start with a question',
				body: 'Send one link with sizes, options and prices instead of answering the same message forty times a week.'
			},
			{
				title: 'Price cards are endless small print jobs',
				body: 'Change a price on the menu instead of reprinting a shelf card every time flour moves.'
			}
		],
		highlights: [
			'A photo on every product',
			'Sizes, weights and box options priced clearly',
			'Seasonal ranges published and retired on schedule',
			'A link for custom order enquiries',
			'Allergen tags for nuts, gluten and dairy',
			'One QR code for the counter and the window'
		],
		faqs: [
			{
				q: 'Can I show prices by weight or by box size?',
				a: 'Yes. List each size or weight with its own price under the item so customers can compare at a glance.'
			},
			{
				q: 'Can I hide a seasonal range until it launches?',
				a: 'Yes. Build it whenever you like and make it visible on the day it opens.'
			},
			{
				q: 'Can I mark items as containing nuts or gluten?',
				a: 'Yes, and customers can filter by those tags to see only what is safe for them.'
			}
		]
	}
]
