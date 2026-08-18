import { SITE } from '../config/site'
import type { Faq } from '../data/faqs'

/**
 * BreadcrumbList for a page. Home is prepended, so pass only the trail after
 * it — the same shape the visible <Breadcrumbs> component takes, so the two can
 * never disagree about where a page sits.
 */
export function crumbSchema(trail: { name: string; path: string }[]) {
	const all = [{ name: 'Home', path: '/' }, ...trail]
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: all.map((c, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: c.name,
			item: new URL(c.path, SITE.domain).href
		}))
	}
}

/** FAQPage for any set of question/answer pairs. */
export function faqSchema(items: Faq[]) {
	return {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: items.map((f) => ({
			'@type': 'Question',
			name: f.q,
			acceptedAnswer: { '@type': 'Answer', text: f.a }
		}))
	}
}
