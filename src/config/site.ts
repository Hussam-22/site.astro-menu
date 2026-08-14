export const SITE = {
	name: 'Astro-Menu',
	domain: 'https://astro-menu.com',
	email: 'hello@astro-menu.com',
	tagline: 'QR menus for restaurants, cafés and food trucks',
	description:
		'Astro-Menu turns your food menu into a fast, mobile QR menu you can update any time. One plan, 59 AED a month. No POS, no commission, no hardware.',
	signupUrl: 'https://app.astro-menu.com/register',
	loginUrl: 'https://app.astro-menu.com/login',
	demoMenuUrl:
		'https://menu.astro-menu.com/qr-menu/menu?businessProfileID=QpPFdtogRHoWo1uL0KGe&branchID=2EKctRFUaA06pGIvAT2D&tableID=upxdTRj5NaTRl68f6ly0',
	locale: 'en_AE',
	twitter: '@astromenu',
	// Replace with your own key from https://web3forms.com — the previous value was the
	// starter template's demo key, which delivered submissions to the template author.
	web3formsKey: 'REPLACE_WITH_YOUR_WEB3FORMS_ACCESS_KEY'
} as const

export const PLAN = {
	name: 'Astro-Menu',
	monthly: { aed: 59, usd: 15.99 },
	annual: { aed: 500, usd: 135 },
	trialDays: 30
} as const

export const ANNUAL_SAVING = {
	aed: PLAN.monthly.aed * 12 - PLAN.annual.aed,
	usd: Math.round((PLAN.monthly.usd * 12 - PLAN.annual.usd) * 100) / 100,
	percent: Math.round((1 - PLAN.annual.aed / (PLAN.monthly.aed * 12)) * 100)
}

export const NAV = [
	{ title: 'How it works', path: '/how-it-works' },
	{ title: 'Features', path: '/features' },
	{ title: 'Pricing', path: '/pricing' },
	{ title: 'Compare', path: '/compare' },
	{ title: 'Blog', path: '/blog' },
	{ title: 'Contact', path: '/contact' }
]
