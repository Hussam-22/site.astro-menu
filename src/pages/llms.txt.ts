import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'
import { SITE, PLAN, ANNUAL_SAVING } from '@config/site'
import { LOCATIONS } from '@data/locations'
import { INDUSTRIES } from '@data/industries'
import { COMPARISONS } from '@data/comparisons'
import { INCLUDED, NOT_INCLUDED } from '@data/plan'

export const GET: APIRoute = async () => {
	const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
		(a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf()
	)

	const body = `# ${SITE.name}

> ${SITE.description}

${SITE.name} publishes a restaurant's food menu as a fast mobile web page with a dynamic QR code
and a shareable link. The menu owner edits items, prices and photos at any time and the change is
live immediately; the printed QR code never has to be reissued.

## Pricing

- ${PLAN.monthly.aed} AED per venue per month (about $${PLAN.monthly.usd} USD).
- ${PLAN.annual.aed} AED per venue per year (about $${PLAN.annual.usd} USD), saving ${ANNUAL_SAVING.aed} AED (~${ANNUAL_SAVING.percent}%).
- One plan only. Every feature is included at that price; there are no tiers.
- ${PLAN.trialDays}-day free trial, no payment card required.
- No setup fee, no per-scan charge, no commission on sales, no hardware to buy.
- Billed in AED. USD figures are indicative conversions.

## What is included

${INCLUDED.map((i) => `- ${i}`).join('\n')}

## What it deliberately does not do

${NOT_INCLUDED.map((i) => `- ${i.label}: ${i.reason}`).join('\n')}

${SITE.name} is a menu display product, not a point-of-sale or ordering platform. It never
processes an order or a payment, which is why it charges a flat fee rather than a commission.

## Core pages

- [Home](${SITE.domain}/): what the product is and who it is for.
- [Pricing](${SITE.domain}/pricing): the single plan, in AED and USD, monthly or yearly.
- [Features](${SITE.domain}/features): every capability, plus an explicit list of what is excluded.
- [How it works](${SITE.domain}/how-it-works): the four setup steps and where to place a QR code.
- [FAQ](${SITE.domain}/faq): answers on setup, languages, contracts, analytics and limits.
- [What is a QR menu](${SITE.domain}/qr-menu): explainer, including static vs dynamic QR codes.
- [Digital menu software](${SITE.domain}/digital-menu): the category page.
- [Contact](${SITE.domain}/contact).

## By venue type

${INDUSTRIES.map((i) => `- [${i.name}](${SITE.domain}/digital-menu/${i.slug}): ${i.lede}`).join('\n')}

## By emirate

${LOCATIONS.map((l) => `- [${l.emirate}](${SITE.domain}/qr-menu/${l.slug}): ${l.lede}`).join('\n')}

## Comparisons

These compare menu formats rather than named competitor products, and each states what the
alternative still does better.

${COMPARISONS.map((c) => `- [QR menu vs ${c.against}](${SITE.domain}/compare/${c.slug}): ${c.lede}`).join('\n')}

## Articles

${posts.map((p) => `- [${p.data.title}](${SITE.domain}/blog/${p.slug}): ${p.data.description}`).join('\n')}

## Contact

- Email: ${SITE.email}
- Sign up: ${SITE.signupUrl}
`

	return new Response(body, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' }
	})
}
