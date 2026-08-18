/**
 * /features, grouped. Each group is a section on the page; `screen` names a
 * file in src/assets/screens to illustrate it, or null for a text-only group.
 */
export const FEATURE_GROUPS = [
	{
		id: 'the-menu',
		eyebrow: 'What guests see',
		title: 'A menu built for the phone it opens on',
		lede: 'Not a PDF on a screen. A menu laid out for a thumb, that loads before the water arrives.',
		screen: 'menu-sections.png',
		items: [
			{
				title: 'A photo on every item',
				body: 'People order what they can see. Upload one photo per dish and the menu becomes a shopfront rather than a price list.'
			},
			{
				title: 'Sections that pin to the top',
				body: 'Your sections become chips that follow the guest down the page. Twelve sections stay one tap apart.'
			},
			{
				title: 'Sizes and portions',
				body: 'Single or double, small or large, regular or geisha — each with its own price, on the item, where it belongs.'
			},
			{
				title: 'Descriptions with room to work',
				body: 'Write the full sentence. There is no column width to fight and no reprint cost for a longer line.'
			},
			{
				title: 'Loads in under a second',
				body: 'Images are compressed and sized on upload. Nobody abandons the menu waiting for it.'
			},
			{
				title: 'No app, no sign-in',
				body: 'It opens in whatever browser the phone already has. No download, no account, no cookie wall.'
			}
		]
	},
	{
		id: 'languages',
		eyebrow: 'Reach',
		title: 'Every language your dining room speaks',
		lede: 'Add a language in the dashboard and the entire menu — sections, items, descriptions — comes back translated.',
		screen: 'language-switch.png',
		items: [
			{
				title: 'Automatic translation',
				body: 'You write the menu once, in your language. Guests switch to theirs from the header.'
			},
			{
				title: 'Proper right-to-left Arabic',
				body: 'Not a mirrored English layout. The menu rebuilds itself for Arabic readers.'
			},
			{
				title: 'Edit any translation',
				body: 'Machine translation gets a dish name wrong now and then. Override it and the correction sticks.'
			}
		]
	},
	{
		id: 'diet',
		eyebrow: 'Diet & nutrition',
		title: 'Answer the allergy question before it is asked',
		lede: 'The information a guest needs to order confidently, attached to the item instead of a laminated sheet behind the till.',
		screen: 'macros.png',
		items: [
			{
				title: 'Calories and macros',
				body: 'Calories, carbs, fat and protein per item. Optional — switch them off for the whole menu if you would rather not.'
			},
			{
				title: 'Allergen and dietary tags',
				body: 'Vegan, vegetarian, gluten-free, nut-free, halal. Tag once and the tag travels with the item everywhere.'
			},
			{
				title: 'Meal-type filters',
				body: 'Hot, cold, decaf, healthy, light portion, sweet. Guests filter a long menu down to the shortlist they actually want.'
			}
		]
	},
	{
		id: 'qr',
		eyebrow: 'Your code & link',
		title: 'One code. Print it once.',
		lede: 'The QR points at your menu, not at a file. Change the menu a hundred times and the code on the table still works.',
		screen: 'landing.png',
		items: [
			{
				title: 'A code that never expires',
				body: 'The commonest and most expensive QR mistake is encoding a PDF. Ours resolves to your live menu, permanently.'
			},
			{
				title: 'Print-ready downloads',
				body: 'PNG for quick jobs, SVG for the printer, PDF for table tents, stickers and window decals.'
			},
			{
				title: 'A plain link, too',
				body: 'The same menu opens from your Instagram bio, your Google Business profile, a WhatsApp reply or a delivery bag.'
			},
			{
				title: 'Your own venue page',
				body: 'Cover photo, logo, your story, and one-tap call, WhatsApp, Maps, Instagram and Google review buttons.'
			},
			{
				title: 'Wi-Fi password on the menu',
				body: 'The second most common question at any table, answered on the screen already in their hand.'
			}
		]
	},
	{
		id: 'dashboard',
		eyebrow: 'What you control',
		title: 'The whole menu, from your phone',
		lede: 'Everything a guest sees is a field you own. Nothing needs a designer, a developer or a support ticket.',
		screen: null,
		items: [
			{
				title: 'Unlimited menus',
				body: 'Breakfast, lunch, weekend brunch, Ramadan. Build them all, publish the one that applies.'
			},
			{
				title: 'Reorder by dragging',
				body: 'Section and item order is a merchandising decision. Make it in ten seconds, as often as you like.'
			},
			{
				title: 'Sold-out toggle',
				body: 'Hide a dish the minute it runs out and bring it back tomorrow. No guest orders what you cannot serve.'
			},
			{
				title: 'Brand it',
				body: 'Cover, logo, accent colour. The menu looks like your venue, not like our software.'
			},
			{
				title: 'Unlimited updates',
				body: 'There is no edit limit and no publish queue. Save is live.'
			}
		]
	},
	{
		id: 'analytics',
		eyebrow: 'Evidence',
		title: 'Find out what the menu is actually doing',
		lede: 'A printed menu tells you nothing. This one tells you what got opened and what got scrolled past.',
		screen: null,
		items: [
			{
				title: 'Views and scans',
				body: 'How many people opened the menu, and whether that is going up.'
			},
			{
				title: 'Popular items',
				body: 'Which dishes get opened most — and which get ignored, which is the more useful list.'
			},
			{
				title: 'Peak hours',
				body: 'When the scanning happens, so you know when the menu is doing its work.'
			}
		]
	}
]
