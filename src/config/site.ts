export const SITE = {
	name: 'Astro-Menu',
	domain: 'https://astro-menu.com',
	email: 'hello@astro-menu.com',
	whatsapp: '+971565956180',
	tagline: 'The QR menu your customers can actually read',
	description:
		'Astro-Menu turns your food menu into a fast, photo-led QR menu you update from a dashboard in seconds. One flat price, no POS, no commission, no hardware.',
	signupUrl: 'https://app.astro-menu.com/register',
	loginUrl: 'https://app.astro-menu.com/login',
	locale: 'en_AE',
	/**
	 * A real, live customer menu — Number Eight Speciality Coffee, Al Ain.
	 * Every screenshot on this site comes from it, and /demo links straight to
	 * it. If this venue ever leaves, swap the URL here and reshoot the gallery.
	 */
	demoMenuUrl:
		'https://menu.astro-menu.com/qr-menu/menu?businessProfileID=MSoxzRsPzpahDlGdoFMY&branchID=2EKctRFUaA06pGIvAT2D&tableID=upxdTRj5NaTRl68f6ly0',
	demoVenueUrl:
		'https://menu.astro-menu.com/qr-menu?businessProfileID=MSoxzRsPzpahDlGdoFMY&branchID=2EKctRFUaA06pGIvAT2D&tableID=upxdTRj5NaTRl68f6ly0',
	demoVenueName: 'Number Eight Speciality Coffee'
} as const

/* ---------------------------------------------------------------------------
   Pricing.

   One plan. Priced in USD, with the dirham figure carried alongside because
   most customers are in the UAE and recognise the AED number. Billing annually
   is quoted as a PER-MONTH figure (the way the buyer compares it) with the
   yearly total spelled out next to it, so the discount is legible without
   anyone doing arithmetic.
--------------------------------------------------------------------------- */
export const PLAN = {
	monthly: { usd: 15.99, aed: 59 },
	/** What annual billing works out to per month. */
	annualPerMonth: { usd: 11.25, aed: 41.67 },
	/** What actually leaves the account, once a year. */
	annualTotal: { usd: 135, aed: 500 },
	trialDays: 30
} as const

const usd = (n: number) => `$${Number.isInteger(n) ? n : n.toFixed(2)}`
const aed = (n: number) => `${Number.isInteger(n) ? n : n.toFixed(2)} AED`

const yearOfMonthly = PLAN.monthly.usd * 12

export const PRICE = {
	/** Raw numbers, for schema.org Offer values where a formatted string is wrong. */
	monthlyAmount: PLAN.monthly.usd,
	annualTotalAmount: PLAN.annualTotal.usd,
	monthly: usd(PLAN.monthly.usd),
	/** For "commission we take" style rows. */
	zero: usd(0),
	monthlyAed: aed(PLAN.monthly.aed),
	annualPerMonth: usd(PLAN.annualPerMonth.usd),
	annualTotal: usd(PLAN.annualTotal.usd),
	annualTotalAed: aed(PLAN.annualTotal.aed),
	/** $56.88 exactly. Quoted as a saving rather than as "N months free",
	    which would round 3.6 up to 4 and overstate it. */
	annualSaving: usd(Math.round((yearOfMonthly - PLAN.annualTotal.usd) * 100) / 100),
	annualSavingPercent: Math.round((1 - PLAN.annualTotal.usd / yearOfMonthly) * 100),
	trialDays: PLAN.trialDays
} as const

export const NAV = [
	{ title: 'Features', path: '/features' },
	{ title: 'How it works', path: '/how-it-works' },
	{ title: 'Pricing', path: '/pricing' },
	{ title: 'Live demo', path: '/demo' },
	{ title: 'Blog', path: '/blog' }
] as const

export const FOOTER_NAV = [
	{
		heading: 'Product',
		links: [
			{ title: 'Features', path: '/features' },
			{ title: 'How it works', path: '/how-it-works' },
			{ title: 'Pricing', path: '/pricing' },
			{ title: 'See a live menu', path: '/demo' }
		]
	},
	{
		heading: 'Learn',
		links: [
			{ title: 'Blog', path: '/blog' },
			{ title: 'FAQ', path: '/faq' },
			{ title: 'Contact us', path: '/contact' }
		]
	},
	{
		heading: 'Legal',
		links: [
			{ title: 'Privacy policy', path: '/privacy' },
			{ title: 'Terms & conditions', path: '/terms' }
		]
	}
] as const

/**
 * Web3Forms access key for the /contact form. Get one free at
 * https://web3forms.com and paste it here. While this is the placeholder, the
 * contact page hides the form and leads with email and WhatsApp instead, so a
 * visitor never fills in a form that quietly goes nowhere.
 */
export const CONTACT_FORM_KEY = 'REPLACE_WITH_YOUR_WEB3FORMS_ACCESS_KEY'
