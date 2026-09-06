export const SITE = {
	name: 'Astro-Menu',
	domain: 'https://astro-menu.com',
	email: 'hello@astro-menu.com',
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

   Two price books, one plan. Syria is priced for the Syrian market; the UAE
   and everywhere else pay the standard rate. Both are quoted in USD with the
   dirham figure carried alongside where there is one, because USD is what
   Search Console shows the hundred-odd countries in this site's impressions
   are being priced in.

   Both books ship in the HTML of every page. Which one is painted is decided
   by the region resolver in Layout.astro, which stamps html[data-region]
   before first paint — see the rules in global.css. GLOBAL is the default in
   the markup, so it is what a crawler, a visitor with JavaScript off, and
   every piece of page metadata and structured data gets.

   The site is where the number is quoted; app.astro-menu.com is where it is
   charged. Changing a figure here does not change what anyone is billed.
--------------------------------------------------------------------------- */
export const REGIONS = ['global', 'sy'] as const
export type Region = (typeof REGIONS)[number]

/** USD is the lead figure everywhere; AED rides alongside where it is meaningful. */
type Money = { usd: number; aed?: number }

type Plan = {
	monthly: Money
	/** What annual billing works out to per month. */
	annualPerMonth: Money
	/** What actually leaves the account, once a year. */
	annualTotal: Money
	/**
	 * Illustrative print spend for the "compare it to the print bill" block on
	 * /pricing. A stated assumption shown with its arithmetic, not a quote —
	 * the figures differ by region because printing does.
	 */
	print: { runsPerYear: number; costPerRun: number }
}

export const TRIAL_DAYS = 30

export const PLANS: Record<Region, Plan> = {
	/** UAE and the rest of the world. 99 AED a month, 999 AED a year. */
	global: {
		monthly: { usd: 26.95, aed: 99 },
		annualPerMonth: { usd: 22.67, aed: 83.25 },
		annualTotal: { usd: 272, aed: 999 },
		print: { runsPerYear: 3, costPerRun: 150 }
	},
	/** Syria. Priced for the Syrian market, in dollars — AED means nothing here. */
	sy: {
		monthly: { usd: 15.99 },
		annualPerMonth: { usd: 11.25 },
		annualTotal: { usd: 135 },
		print: { runsPerYear: 3, costPerRun: 90 }
	}
}

const usd = (n: number) => `$${Number.isInteger(n) ? n : n.toFixed(2)}`
const aed = (n: number) => `${Number.isInteger(n) ? n : n.toFixed(2)} AED`

function priceBook(plan: Plan) {
	const yearOfMonthly = plan.monthly.usd * 12
	const printYear = plan.print.runsPerYear * plan.print.costPerRun

	return {
		/** Raw numbers, for schema.org Offer values where a formatted string is wrong. */
		monthlyAmount: plan.monthly.usd,
		annualTotalAmount: plan.annualTotal.usd,
		monthly: usd(plan.monthly.usd),
		/** For "commission we take" style rows. */
		zero: usd(0),
		/** null where the region has no dirham figure worth showing. */
		monthlyAed: plan.monthly.aed === undefined ? null : aed(plan.monthly.aed),
		annualPerMonth: usd(plan.annualPerMonth.usd),
		annualPerMonthAed: plan.annualPerMonth.aed === undefined ? null : aed(plan.annualPerMonth.aed),
		annualTotal: usd(plan.annualTotal.usd),
		annualTotalAed: plan.annualTotal.aed === undefined ? null : aed(plan.annualTotal.aed),
		/** Quoted as a saving rather than as "N months free", which would round
		    up a fractional month and overstate it. */
		annualSaving: usd(Math.round((yearOfMonthly - plan.annualTotal.usd) * 100) / 100),
		annualSavingPercent: Math.round((1 - plan.annualTotal.usd / yearOfMonthly) * 100),
		printRunsPerYear: plan.print.runsPerYear,
		printCostPerRun: usd(plan.print.costPerRun),
		printYear: usd(printYear),
		trialDays: TRIAL_DAYS
	}
}

export const PRICES: Record<Region, ReturnType<typeof priceBook>> = {
	global: priceBook(PLANS.global),
	sy: priceBook(PLANS.sy)
}

export type PriceBook = ReturnType<typeof priceBook>

/** The fields <Price> can print, i.e. the ones that are always a string. */
export type PriceField = {
	[K in keyof PriceBook]: PriceBook[K] extends string ? K : never
}[keyof PriceBook]

/**
 * The default book. Page titles, meta descriptions, structured data and
 * llms.txt all quote this one: they are read by crawlers and assistants that
 * have no region, and the standard rate is the honest answer to give them.
 * Anything rendered INTO the page should use <Price> or <Regional> instead,
 * so a visitor in Syria sees their own number.
 */
export const PRICE = PRICES.global

/**
 * The two-region markup for a sentence, as an HTML string.
 *
 * For the handful of places a <Price> or <Regional> cannot reach because the
 * text arrives as a prop rather than as children — a SectionHead `lede`, a
 * CtaBand `body`. Both are rendered with set:html for exactly this. The
 * mechanism is the same one <Price> uses; see the note above.
 *
 * Only ever called with copy written in this repo, never with anything a
 * visitor supplied, so there is nothing here to escape.
 */
export function regionalText(build: (price: PriceBook) => string): string {
	return REGIONS.map(
		(region) => `<span data-region-for="${region}">${build(PRICES[region])}</span>`
	).join('')
}

export const NAV = [
	{ title: 'Home', path: '/' },
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
 * contact page hides the form and leads with email instead, so a
 * visitor never fills in a form that quietly goes nowhere.
 */
export const CONTACT_FORM_KEY = 'REPLACE_WITH_YOUR_WEB3FORMS_ACCESS_KEY'
