export const SITE = {
	name: 'Astro-Menu',
	domain: 'https://astro-menu.com',
	email: 'hello@astro-menu.com',
	tagline: 'QR menus for restaurants, cafés and food trucks',
	description:
		'Astro-Menu turns your food menu into a fast, mobile QR menu you can update any time. One plan, $15.99 a month. No POS, no commission, no hardware.',
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

/**
 * The currency the site quotes prices in by default: page copy, meta
 * descriptions, Offer schema and the initial state of the pricing toggle.
 * Change this one value to switch the whole site over — every price string is
 * derived from it. Visitors can still flip to the other currency on /pricing.
 */
export const CURRENCY: 'usd' | 'aed' = 'usd'

export const PLAN = {
	name: 'Astro-Menu',
	monthly: { aed: 59, usd: 15.99 },
	annual: { aed: 500, usd: 135 },
	trialDays: 30
} as const

const money = (n: number, c: 'usd' | 'aed' = CURRENCY) =>
	c === 'usd' ? `$${Number.isInteger(n) ? n : n.toFixed(2)}` : `${n} AED`

export const ANNUAL_SAVING = {
	aed: PLAN.monthly.aed * 12 - PLAN.annual.aed,
	usd: Math.round((PLAN.monthly.usd * 12 - PLAN.annual.usd) * 100) / 100,
	percent: Math.round((1 - PLAN.annual[CURRENCY] / (PLAN.monthly[CURRENCY] * 12)) * 100)
}

/**
 * Formatted price strings for the default currency. Use these in copy instead
 * of writing "59 AED" by hand, so switching CURRENCY updates everything.
 * The `*WithLocal` variants are for UAE-targeted pages, which keep the dirham
 * figure alongside so a local reader still recognises the number.
 */
export const PRICE = {
	code: CURRENCY.toUpperCase(),
	amountMonthly: PLAN.monthly[CURRENCY],
	amountAnnual: PLAN.annual[CURRENCY],
	monthly: money(PLAN.monthly[CURRENCY]),
	annual: money(PLAN.annual[CURRENCY]),
	zero: money(0),
	saving: money(ANNUAL_SAVING[CURRENCY]),
	monthlyWithLocal:
		CURRENCY === 'usd'
			? `${money(PLAN.monthly.usd)} (about ${PLAN.monthly.aed} AED)`
			: money(PLAN.monthly.aed, 'aed'),
	annualWithLocal:
		CURRENCY === 'usd'
			? `${money(PLAN.annual.usd)} (about ${PLAN.annual.aed} AED)`
			: money(PLAN.annual.aed, 'aed')
} as const

export const NAV = [
	{ title: 'How it works', path: '/how-it-works' },
	{ title: 'Features', path: '/features' },
	{ title: 'Pricing', path: '/pricing' },
	{ title: 'Compare', path: '/compare' },
	{ title: 'Blog', path: '/blog' },
	{ title: 'Contact', path: '/contact' }
]
