/**
 * What we actually say.
 *
 * The message is short because the asset does the work. Every touch links to
 * the venue's own menu, already built; none of them describe features, and
 * none of them ask for a meeting. The offer is "look at this thing that
 * exists", and the only ask is a yes or a no.
 *
 * Three rules hold across every template here:
 *   - Never claim they asked for this. They did not.
 *   - Never imply the menu is live to their customers. It is a demo we built.
 *   - Every message carries a one-line, no-reply-needed way to opt out, and an
 *     opt-out is honoured permanently in `venues.opted_out_at`.
 */
import { CONFIG } from '../config.js'

/** The claim page on the marketing site, where the message always points. */
export const claimUrl = (slug) => `${CONFIG.siteBaseUrl()}/m/${slug}`

/**
 * The four-touch sequence, over about three weeks.
 *
 * Touch 1 delivers the menu. Touch 2 assumes they missed it. Touch 3 changes
 * the angle from the artifact to the analytics. Touch 4 closes the loop and
 * stops. There is no touch 5, ever.
 */
export const SEQUENCE = [
	{
		step: 1,
		dayOffset: 0,
		subject: (venue) => `${venue.name}'s menu, already built`,
		body: (venue, build) =>
			`Hi ${venue.name},

We build QR menus for restaurants and cafes in the UAE, and rather than send
you a pitch, we built yours. It took your published menu — ${build.section_count} sections,
${build.item_count} items — and turned it into a menu that opens on a phone in about a second:

${claimUrl(venue.slug)}

It is a demo, not live to your customers, and nobody sees it unless you send
them to it. If you want it, it is yours: 59 AED a month, no commission, no
hardware, no POS to replace. If you do not, no follow-up beyond a couple of
short notes.

Worth a look either way — it is your menu.

— Astro-Menu, astro-menu.com
Reply "no thanks" and we will not write again.`
	},
	{
		step: 2,
		dayOffset: 4,
		subject: (venue) => `Did the link open? (${venue.name})`,
		body: (venue) =>
			`Hi ${venue.name},

Following up once on the menu we built for you — some mail clients strip the
link, so in case it never arrived:

${claimUrl(venue.slug)}

Scan it with your phone camera. That is the whole product: one code that never
changes, and a menu you edit from a dashboard in seconds.

— Astro-Menu
Reply "no thanks" and we will stop here.`
	},
	{
		step: 3,
		dayOffset: 11,
		subject: () => 'Which items people actually open',
		body: (venue) =>
			`Hi ${venue.name},

One thing the printed card cannot do: tell you which dishes people open, which
they skip, and when they look. Your menu is still here with that switched on —

${claimUrl(venue.slug)}

It is the part owners tell us they did not expect to care about, and then use
to decide what goes on next season's menu.

— Astro-Menu
Reply "no thanks" and we will stop here.`
	},
	{
		step: 4,
		dayOffset: 21,
		subject: (venue) => `Closing the file on ${venue.name}`,
		body: (venue) =>
			`Hi ${venue.name},

Last note. The menu we built stays up for a while yet if you want it:

${claimUrl(venue.slug)}

If the timing is wrong or it is simply not for you, that is a fine answer and
this is the last you will hear from us.

Thanks for the time either way.

— Astro-Menu`
	}
]

/**
 * The printed card, for walking into a venue.
 *
 * The card exists because in Al Ain and Abu Dhabi the highest-converting
 * channel is a person handing a manager something they can scan. The QR points
 * at their own menu, so the conversation starts after they have already seen it
 * work rather than before.
 */
export const CARD = {
	front: (venue) => ({
		heading: 'This is your menu.',
		sub: venue.name,
		instruction: 'Scan it.',
		instructionAr: 'امسح الرمز.'
	}),
	back: (venue, build) => ({
		lines: [
			`We built ${venue.name}'s menu from the one you already publish —`,
			`${build.item_count} items across ${build.section_count} sections.`,
			'',
			'59 AED a month. No commission. No POS. No hardware.',
			'One QR that never changes, however often the menu does.',
			'',
			'astro-menu.com · hello@astro-menu.com'
		],
		linesAr: [
			`بنينا منيو ${venue.name} من المنيو يلي ناشرينه أصلًا —`,
			`${build.item_count} صنف موزعين على ${build.section_count} أقسام.`,
			'',
			'٥٩ درهم بالشهر. بلا عمولة. بلا نظام كاشير. بلا أجهزة.',
			'رمز QR واحد ما بيتغيّر، مهما تغيّر المنيو.',
			'',
			'astro-menu.com · hello@astro-menu.com'
		]
	})
}

/**
 * Renders one touch for one venue.
 * Returns null when the venue has opted out — the check lives here so no caller
 * can forget it.
 */
export function renderMessage(step, venue, build) {
	if (venue.opted_out_at) return null
	const touch = SEQUENCE.find((s) => s.step === step)
	if (!touch) throw new Error(`No sequence step ${step}`)
	return {
		step,
		subject: touch.subject(venue, build),
		body: touch.body(venue, build)
	}
}
