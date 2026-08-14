export type Location = {
	slug: string
	emirate: string
	title: string
	description: string
	h1: string
	lede: string
	body: string[]
	context: { title: string; body: string }[]
	languages: string
	areas: string[]
	faqs: { q: string; a: string }[]
}

export const LOCATIONS: Location[] = [
	{
		slug: 'dubai',
		emirate: 'Dubai',
		title: 'QR Menu Dubai — Digital Menus for Restaurants',
		description:
			'A QR menu built for Dubai: multilingual for a city of visitors, instant price updates, and one link for Instagram, Google and the table.',
		h1: 'QR menus for Dubai restaurants and cafés',
		lede: 'Dubai diners arrive from everywhere and decide fast. Your menu needs to load in a second, read in their language, and look like the food is worth the trip.',
		body: [
			'Very few Dubai venues serve one kind of customer. A café in Al Barsha will serve a Filipino breakfast crowd, an Emirati family at lunch and a group of British tourists at six. A printed menu picks one language and hopes. Astro-Menu translates the whole menu automatically, so each diner reads it in the language their phone is already set to.',
			'The other Dubai reality is churn. Supplier prices move, seasonal items come and go, and a menu printed in January is wrong by March. Reprinting for a mid-size venue is a real line item, and the design turnaround alone can eat a week. Changing a price in Astro-Menu takes about ten seconds and costs nothing.',
			'And because your menu is a normal web link, it works in the places Dubai actually discovers restaurants — the Instagram bio, the Google Business Profile, the WhatsApp broadcast, the delivery bag sticker. One link, one menu, always current.'
		],
		context: [
			{
				title: 'A genuinely multilingual room',
				body: 'Dubai’s residents and visitors span dozens of first languages. Auto-translation means you publish once and every diner gets their own version — no second printed menu, no laminated Russian insert.'
			},
			{
				title: 'Rent makes table turnover expensive',
				body: 'When diners can read the menu the moment they sit down, ordering starts sooner. No waiting for a physical menu to be cleared from the last table and brought over.'
			},
			{
				title: 'Discovery happens on a phone first',
				body: 'Most people look you up before they visit. A menu link on your Instagram bio and Google profile means they see real photos and real prices instead of a blurry PDF someone uploaded in 2022.'
			},
			{
				title: 'Fierce competition for a first visit',
				body: 'In a street with fifteen options, the venue whose menu opens instantly and shows photos of the food has an advantage before anyone walks in.'
			}
		],
		languages: 'English, Arabic, Hindi, Urdu, Tagalog, Russian and Chinese are the languages Dubai venues ask for most often.',
		areas: [
			'Downtown Dubai',
			'Dubai Marina & JBR',
			'Business Bay',
			'DIFC',
			'Jumeirah & City Walk',
			'Al Barsha',
			'Deira & Karama',
			'Al Quoz'
		],
		faqs: [
			{
				q: 'Can my menu show prices in AED and another currency?',
				a: 'Your menu displays the currency you set — for Dubai venues that is normally AED. Prices are plain text you control, so you can change them as often as you like.'
			},
			{
				q: 'Does the QR code work for a venue with several outlets in Dubai?',
				a: 'Each outlet gets its own menu and its own QR code, so a Marina branch can run a different menu from a Deira branch. Each one is a separate subscription.'
			},
			{
				q: 'Will the menu work on hotel and mall guest Wi-Fi?',
				a: 'Yes. The menu is a lightweight web page, so it loads on slow or captive-portal Wi-Fi and on mobile data. There is no app for a guest to download.'
			}
		]
	},
	{
		slug: 'abu-dhabi',
		emirate: 'Abu Dhabi',
		title: 'QR Menu Abu Dhabi — Digital Restaurant Menus',
		description:
			'A QR menu for Abu Dhabi restaurants, hotel outlets and cafés. Multilingual, instantly updatable, and one flat fee of 59 AED a month with no commission.',
		h1: 'QR menus for Abu Dhabi restaurants and hotel outlets',
		lede: 'Abu Dhabi dining leans longer and more considered — family tables, business lunches, hotel outlets. A menu that reads well on a phone is worth more than one that just exists.',
		body: [
			'A lot of Abu Dhabi food and beverage sits inside something else: a hotel, a mall, a cultural destination, an office tower. Those venues often run several menus at once — breakfast, all-day, a pool bar, a weekend brunch — and each one is a separate print job with its own version drift. With Astro-Menu you keep them all in one place and switch what is visible without printing anything.',
			'Business lunches and family dinners both reward a menu people can read carefully. Dietary tags matter here: guests filter for vegetarian, gluten-free or nut-free without having to interrogate a server, which speeds up ordering and reduces the chance of a mistake reaching the table.',
			'Because the menu is a link, it also drops neatly into the places guests already look — the hotel’s directory page, a QR card in the room, the venue’s Google listing, or a WhatsApp reply to someone asking what you serve.'
		],
		context: [
			{
				title: 'Multiple outlets, multiple menus',
				body: 'Hotel and destination venues rarely have one menu. Running them digitally means the pool bar menu and the main restaurant menu can change independently, on the same afternoon.'
			},
			{
				title: 'Longer dwell time rewards detail',
				body: 'Guests who linger will actually read descriptions, allergen notes and photos. A digital menu has room for all of it without turning into six laminated pages.'
			},
			{
				title: 'Family dining and dietary needs',
				body: 'Filters for vegetarian, gluten-free and nut-free let a table sort the menu themselves, which is faster and less awkward than asking.'
			},
			{
				title: 'Seasonal and event menus',
				body: 'Ramadan menus, National Day specials and event set menus can be published in advance and switched on the day they start.'
			}
		],
		languages:
			'English and Arabic cover most of the room, with Hindi, Urdu, Tagalog and Russian commonly added for visitor-heavy outlets.',
		areas: [
			'Al Reem Island',
			'Yas Island',
			'Saadiyat Island',
			'The Corniche',
			'Al Khalidiyah',
			'Khalifa City',
			'Al Raha Beach',
			'Masdar City'
		],
		faqs: [
			{
				q: 'Can I run a breakfast menu and a dinner menu separately?',
				a: 'Yes. You can build as many menus as you need and control which one your QR code points at, so the menu on the table matches the time of day.'
			},
			{
				q: 'Is this suitable for a hotel outlet rather than a standalone restaurant?',
				a: 'It works well for outlets. Each outlet keeps its own branded menu page and its own QR code, and the link can be embedded in the hotel’s own guest directory.'
			},
			{
				q: 'Can we publish a Ramadan menu ahead of time?',
				a: 'You can build it whenever you like and make it visible on the day it starts, then switch back afterwards without touching the printed QR code.'
			}
		]
	},
	{
		slug: 'sharjah',
		emirate: 'Sharjah',
		title: 'QR Menu Sharjah — Affordable Digital Menus',
		description:
			'A QR menu for Sharjah cafeterias, family restaurants and cafés. 59 AED a month, no commission, no POS to buy — just your menu on every phone.',
		h1: 'QR menus for Sharjah restaurants and cafeterias',
		lede: 'Sharjah runs on volume and value. A menu system that costs less than a couple of reprints a year is the only kind that makes sense here.',
		body: [
			'Sharjah has an enormous number of independent cafeterias, family restaurants and neighbourhood cafés operating on thin margins. Most digital menu products are priced for hotel groups, bundled with a POS nobody asked for, and charged per branch per feature. That is the wrong shape for a place where the whole point is keeping fixed costs low.',
			'Astro-Menu is 59 AED a month, or 500 AED for a year. For a lot of Sharjah venues that is genuinely cheaper than reprinting laminated menus twice, and it replaces the reprint cycle entirely rather than adding to it.',
			'The family-dining skew here also makes photos worth a lot. A large mixed-age table ordering from a text-only list is slow; the same table looking at pictures orders faster and orders more confidently, especially for shared dishes.'
		],
		context: [
			{
				title: 'Price sensitivity is the whole game',
				body: 'One flat fee, no commission and no hardware means the cost is knowable in advance. There is no per-order cut that grows as you get busier.'
			},
			{
				title: 'High-volume family dining',
				body: 'Photos and clear sections help big tables decide faster, which matters when you are turning covers through a busy evening.'
			},
			{
				title: 'A large student and worker population',
				body: 'University City and the industrial areas bring in diners who almost always order from a phone. A link they can open beats a menu they have to ask for.'
			},
			{
				title: 'Delivery and pickup orders arrive by phone',
				body: 'Send the menu link on WhatsApp instead of a photo of a printed page. It stays readable, and it stays current.'
			}
		],
		languages:
			'Arabic and English first, with Urdu, Hindi, Malayalam and Tagalog frequently added for neighbourhood venues.',
		areas: [
			'Al Majaz',
			'Al Qasba',
			'Al Nahda',
			'Al Taawun',
			'Al Khan',
			'Muweilah',
			'University City',
			'Al Qasimia'
		],
		faqs: [
			{
				q: 'Is 59 AED really the whole price?',
				a: 'Yes — 59 AED per month per venue, or 500 AED if you pay for the year. There is no setup fee, no per-scan charge and no commission on your sales.'
			},
			{
				q: 'I already print menus. Is this cheaper?',
				a: 'For most venues, yes. A single reprint of laminated menus usually costs more than a year of Astro-Menu, and reprints happen more than once a year.'
			},
			{
				q: 'Can I send the menu to customers on WhatsApp?',
				a: 'Yes. Your menu has a normal link you can paste into WhatsApp, and it opens as a proper menu rather than a photo someone has to zoom into.'
			}
		]
	},
	{
		slug: 'ajman',
		emirate: 'Ajman',
		title: 'QR Menu Ajman — Digital Menus for Cafés',
		description:
			'A QR menu for independent Ajman restaurants and corniche cafés. Set it up in an afternoon, update it from your phone, 59 AED a month.',
		h1: 'QR menus for Ajman cafés and restaurants',
		lede: 'Ajman’s food scene is mostly independent operators who do their own marketing. The menu should be something you can change yourself, without calling anyone.',
		body: [
			'If you run a small place in Ajman, you are probably also the person who takes the photos, answers the Instagram messages and decides today’s special. Anything that requires a support ticket to change a price is not going to survive contact with a real week.',
			'Astro-Menu is built for that. You edit the menu from the same phone you use for everything else, and the change is live immediately. No designer, no print shop, no waiting until Sunday.',
			'The corniche and neighbourhood cafés also get a lot of walk-past traffic. A QR sticker in the window lets someone read the full menu with photos before they commit to walking in, which is a much better pitch than a laminated A4 taped to the glass.'
		],
		context: [
			{
				title: 'Owner-operated venues need self-service tools',
				body: 'Every part of the menu is editable by you, from a phone, in seconds. Nothing requires a support request.'
			},
			{
				title: 'Window traffic along the corniche',
				body: 'A QR sticker on the glass turns a passer-by into someone reading your full menu, with photos, before they decide.'
			},
			{
				title: 'Small kitchens change often',
				body: 'When something sells out, switch it off. Nobody orders a dish you cannot make, and no server has to apologise for it.'
			},
			{
				title: 'Low fixed costs matter',
				body: 'At 500 AED for the year there is no seasonal pressure to justify the spend during a quiet month.'
			}
		],
		languages: 'Arabic and English, with Urdu, Hindi and Malayalam commonly requested.',
		areas: ['Ajman Corniche', 'Al Nuaimiya', 'Al Rashidiya', 'Al Jurf', 'Al Rumailah', 'Mushairef'],
		faqs: [
			{
				q: 'Can I set this up myself without a developer?',
				a: 'Yes. You add items the way you would fill in a form. If you would rather not start from scratch, send us your existing menu and we will load the first version for you.'
			},
			{
				q: 'What happens when a dish sells out?',
				a: 'Toggle it off from your phone and it disappears from the live menu immediately. Toggle it back on tomorrow.'
			},
			{
				q: 'Do I need to reprint the QR code when the menu changes?',
				a: 'No. The QR code points at your menu, not at a particular version of it. Print it once and keep it forever.'
			}
		]
	},
	{
		slug: 'ras-al-khaimah',
		emirate: 'Ras Al Khaimah',
		title: 'QR Menu Ras Al Khaimah — Digital Menus',
		description:
			'A QR menu for Ras Al Khaimah resorts, beach cafés and mountain venues. Multilingual for visitors, seasonal menus, 59 AED a month.',
		h1: 'QR menus for Ras Al Khaimah restaurants and resorts',
		lede: 'RAK swings between quiet weeks and packed weekends, and between beach season and mountain season. Your menu should be able to swing with it.',
		body: [
			'Ras Al Khaimah’s food and beverage is unusually seasonal. Al Marjan and Al Hamra fill up in the cooler months, Jebel Jais draws a different crowd with different appetites, and a venue that runs one fixed menu all year is leaving something on the table.',
			'With a digital menu you can build the summer version and the winter version once, then switch between them. Same QR code, same link, different menu. Nothing gets reprinted and nothing gets thrown away.',
			'The visitor mix also makes translation genuinely useful rather than a nice-to-have. Guests arriving from Europe, Russia and the GCC all read the menu in their own language without you printing a single extra page.'
		],
		context: [
			{
				title: 'Strongly seasonal trade',
				body: 'Build a seasonal menu ahead of time and publish it on the day the season turns. No print lead time to plan around.'
			},
			{
				title: 'Resort and day-visitor guests',
				body: 'Visitors read menus on their phones before they choose a venue. A link that opens fast, with photos, wins that comparison.'
			},
			{
				title: 'Outdoor and beachside service',
				body: 'A QR code on a table tent survives sun and wind better than a paper menu, and costs nothing to replace when one does go missing.'
			},
			{
				title: 'Spread-out venues',
				body: 'Beach clubs, mountain cafés and town restaurants can each run their own menu without a shared system dictating the format.'
			}
		],
		languages:
			'English and Arabic as standard, with Russian, German and Hindi common for resort and leisure venues.',
		areas: [
			'Al Marjan Island',
			'Al Hamra',
			'Mina Al Arab',
			'Jebel Jais',
			'Al Nakheel',
			'RAK Corniche'
		],
		faqs: [
			{
				q: 'Can I switch between a summer and winter menu?',
				a: 'Yes. Keep both menus built and choose which one your QR code shows. Switching takes seconds and needs no reprinting.'
			},
			{
				q: 'Will the menu load on weak signal at an outdoor venue?',
				a: 'The menu is a small, image-optimised web page designed to load quickly on poor connections, which is exactly the outdoor case.'
			},
			{
				q: 'Can guests see the menu before they arrive?',
				a: 'Yes — share the same link on your website, Google profile or Instagram and guests can browse the full menu before they set off.'
			}
		]
	},
	{
		slug: 'fujairah',
		emirate: 'Fujairah',
		title: 'QR Menu Fujairah — East Coast Menus',
		description:
			'A QR menu for Fujairah seafood restaurants, beach cafés and dive-town venues. Daily catch updates, multilingual, 59 AED a month.',
		h1: 'QR menus for Fujairah restaurants and beach cafés',
		lede: 'On the east coast the menu changes with the catch. A printed menu cannot keep up with that, and a digital one barely notices.',
		body: [
			'Fujairah and the surrounding coast run a lot of seafood, and seafood is the least predictable thing on any menu. What came in this morning is not what came in last Tuesday, and prices move with it. A digital menu lets you list today’s catch today, at today’s price, and take it off when it is gone.',
			'Dive tourism and weekend traffic from the other emirates bring a steady flow of first-time visitors who have never seen your menu before. They will look it up on their phone before driving over. If what they find is a photo of a laminated page, that is a wasted opportunity.',
			'Beach and hotel venues here also serve long, slow afternoons. A menu with photos and clear sections gets read properly rather than skimmed, which tends to help the things you actually want to sell.'
		],
		context: [
			{
				title: 'Daily catch, daily prices',
				body: 'Add today’s fish in the morning and remove it when it sells out. No printed menu can be honest about a changing catch.'
			},
			{
				title: 'Weekend visitors from across the UAE',
				body: 'People plan an east coast trip in advance and check menus first. Being findable and readable on a phone is the whole pitch.'
			},
			{
				title: 'Dive and adventure tourism',
				body: 'International visitors arrive with no Arabic and no context. Automatic translation and photos remove both problems at once.'
			},
			{
				title: 'Outdoor seating in strong sun',
				body: 'A QR code on a table sticker holds up better than paper, and reprinting a sticker costs almost nothing.'
			}
		],
		languages: 'English and Arabic, with Hindi, Malayalam, Russian and German common in coastal venues.',
		areas: ['Fujairah Corniche', 'Al Faseel', 'Dibba', 'Al Aqah', 'Mirbah', 'Fujairah City'],
		faqs: [
			{
				q: 'Can I change prices daily for market-price seafood?',
				a: 'Yes. Prices are plain text you edit yourself, and the change is live immediately. There is no limit on how often you update.'
			},
			{
				q: 'Can I mark something as sold out without deleting it?',
				a: 'You can hide an item and bring it back later, so you do not have to re-enter it every time the catch comes in.'
			},
			{
				q: 'Do visitors need to install anything?',
				a: 'No. Scanning the code opens the menu in their phone’s browser. There is no app and no sign-up for the diner.'
			}
		]
	},
	{
		slug: 'umm-al-quwain',
		emirate: 'Umm Al Quwain',
		title: 'QR Menu Umm Al Quwain — Digital Menus',
		description:
			'A QR menu for Umm Al Quwain restaurants and cafés. No hardware, no commission, no contract lock-in — just your menu online for 59 AED a month.',
		h1: 'QR menus for Umm Al Quwain restaurants and cafés',
		lede: 'A small market rewards being easy to find. If someone can read your full menu from their phone, you are already ahead of most of the street.',
		body: [
			'Umm Al Quwain is a smaller F&B market made up largely of long-standing independent venues. Many have no website at all, and their online presence is whatever a customer happened to photograph. A menu link fixes that in an afternoon and costs less than a single print run.',
			'It also gives you something to point at. When someone asks what you serve — on the phone, on WhatsApp, on a community group — you send one link instead of five photos of a folded menu.',
			'Because there is no hardware and no POS involved, nothing about your kitchen or your till has to change. You are adding a menu people can read, not replacing the way you run the place.'
		],
		context: [
			{
				title: 'Often the venue’s only web presence',
				body: 'Your menu page acts as a small website: name, photos, hours-relevant menus, social links and directions in one link.'
			},
			{
				title: 'Word of mouth travels by WhatsApp',
				body: 'A link forwards cleanly and stays current, unlike a screenshot that gets passed around for two years after the prices changed.'
			},
			{
				title: 'Weekend and holiday traffic',
				body: 'Visitors from neighbouring emirates check menus before making the drive. Being readable online is what gets you on the shortlist.'
			},
			{
				title: 'Nothing to install or maintain',
				body: 'No tablets, no printers, no service contract. If you can print a QR code, you have everything you need.'
			}
		],
		languages: 'Arabic and English, with Hindi, Urdu and Malayalam commonly added.',
		areas: ['UAQ Corniche', 'Al Salamah', 'Old Town', 'Al Raas', 'Al Haditha'],
		faqs: [
			{
				q: 'I do not have a website at all. Is this enough?',
				a: 'For many venues it is. Your menu page carries your name, logo, photos, social links and Wi-Fi password, which covers most of what a small restaurant website does.'
			},
			{
				q: 'Am I locked into a contract?',
				a: 'No. Monthly billing is month to month. The annual price is simply a cheaper way to pay for a year up front.'
			},
			{
				q: 'How long does setup take?',
				a: 'Most venues are live the same day. Send us your current menu and we will load the first version for you.'
			}
		]
	},
	{
		slug: 'uae',
		emirate: 'the UAE',
		title: 'QR Menu UAE — Digital Menu System',
		description:
			'A QR menu system built for UAE restaurants, cafés and food trucks. Arabic and English, instant updates, 59 AED a month with no commission and no POS.',
		h1: 'QR menus for restaurants across the UAE',
		lede: 'One menu, one link, one flat fee — wherever in the UAE you are serving.',
		body: [
			'The UAE is an unusually good market for digital menus and an unusually bad one for printed ones. Diners are multilingual, phone-first and used to scanning things. Menus change often because supplier prices and seasonal availability change often. And print costs are real money that has to be spent again every time something moves.',
			'Astro-Menu covers the whole country from one place. Whether you are a café in Sharjah, a resort outlet in Ras Al Khaimah or a food truck that moves between emirates, the product is the same: your menu, on a link and a QR code, editable by you, in Arabic and English and whatever else your customers read.',
			'And the pricing does not change based on where you are or how busy you get. 59 AED a month, or 500 AED for the year, per venue. No commission, no per-scan fee, no hardware.'
		],
		context: [
			{
				title: 'Arabic and English as standard',
				body: 'Both languages come out of the box, with automatic translation into anything else your customers read.'
			},
			{
				title: 'Priced in AED for local businesses',
				body: 'A flat monthly or annual fee in dirhams, with no revenue share and no surprise usage charges.'
			},
			{
				title: 'Works for every venue type',
				body: 'Restaurants, cafés, food trucks, hotel outlets, cloud kitchens and bakeries all run on the same simple menu system.'
			},
			{
				title: 'Nothing to install anywhere',
				body: 'No POS to integrate, no tablets to buy, no engineer to schedule. A printed QR code is the entire installation.'
			}
		],
		languages:
			'Arabic and English are the defaults; Hindi, Urdu, Malayalam, Tagalog, Russian and Chinese are the most commonly added.',
		areas: [
			'Dubai',
			'Abu Dhabi',
			'Sharjah',
			'Ajman',
			'Ras Al Khaimah',
			'Fujairah',
			'Umm Al Quwain'
		],
		faqs: [
			{
				q: 'Do you work with venues outside the UAE?',
				a: 'Yes. The product is not region-locked and prices are shown in USD as well as AED. The UAE is simply where most of our customers are.'
			},
			{
				q: 'Is the price per venue or per company?',
				a: 'Per venue. Each location gets its own menu, its own QR code and its own analytics, at 59 AED a month each.'
			},
			{
				q: 'Do you take a commission on orders?',
				a: 'Never. Astro-Menu does not process orders or payments at all, so there is nothing for us to take a percentage of.'
			}
		]
	}
]
