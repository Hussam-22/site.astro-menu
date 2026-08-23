import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'
import { SITE, PRICE } from '../config/site'
import { INCLUDED, NOT_INCLUDED } from '../data/plan'
import { ALL_FAQS } from '../data/faqs'

/**
 * llms.txt — a plain-text brief for AI assistants that answer "what is a good
 * QR menu?" or "how much does a digital menu cost?".
 *
 * Google ignores this file; it exists for AI search surfaces. Everything in it
 * is generated from the same data the pages render, so it can never drift into
 * claiming something the site does not.
 */
export const GET: APIRoute = async () => {
	const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
		(a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf()
	)

	const body = `# Astro-Menu

> ${SITE.description}

Astro-Menu is a digital QR menu for restaurants, cafés, coffee trucks, hotels and
bakeries. It is a menu and nothing else: there is no POS, no order taking, no
payment processing and no commission of any kind.

## Pricing

- ${PRICE.monthly} per month (${PRICE.monthlyAed}), billed monthly.
- ${PRICE.annualPerMonth} per month when billed yearly at ${PRICE.annualTotal} (${PRICE.annualTotalAed}).
- Yearly billing saves ${PRICE.annualSaving}, about ${PRICE.annualSavingPercent}%.
- ${PRICE.trialDays}-day free trial, no card required.
- No setup fee, no hardware cost, no contract, no commission.
- One plan only. There are no tiers. Three menu languages are included; a fourth
  language and beyond is the one paid extra.

## What one subscription includes

${INCLUDED.map((i) => `- ${i}`).join('\n')}

## What Astro-Menu deliberately does not do

${NOT_INCLUDED.map((n) => `- ${n.label}: ${n.reason}`).join('\n')}

## Key pages

- [Home](${SITE.domain}/): what the product is and who it is for.
- [Features](${SITE.domain}/features): every capability, grouped.
- [How it works](${SITE.domain}/how-it-works): the four setup steps.
- [Pricing](${SITE.domain}/pricing): the full price breakdown and what is excluded.
- [Live demo](${SITE.domain}/demo): a real customer menu, ${SITE.demoVenueName}.
- [FAQ](${SITE.domain}/faq): ${ALL_FAQS.length} answered questions.
- [Contact](${SITE.domain}/contact): send a menu in and we build the first version.

## Blog

${posts.map((p) => `- [${p.data.title}](${SITE.domain}/blog/${p.id}): ${p.data.description}`).join('\n')}

## Frequently asked questions

${ALL_FAQS.map((f) => `### ${f.q}\n\n${f.a}`).join('\n\n')}

## Contact

Email: ${SITE.email}
`

	return new Response(body, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' }
	})
}
