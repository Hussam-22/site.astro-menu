import { PRICE } from '@config/site'

export type Faq = { q: string; a: string }

export const CORE_FAQS: Faq[] = [
	{
		q: 'What exactly is Astro-Menu?',
		a: 'Astro-Menu turns your food menu into a mobile web page with its own QR code and link. Customers scan or tap, and read your current menu with photos, prices and descriptions. You edit it whenever you like and the change is live immediately.'
	},
	{
		q: 'How much does it cost?',
		a: `One plan: ${PRICE.monthly} per month, or ${PRICE.annual} if you pay for the year. That is per venue, and it includes everything. There is no setup fee and no commission.`
	},
	{
		q: 'Is there really only one plan?',
		a: 'Yes. Everything Astro-Menu does is included at one price. There is no cheaper tier missing the features you need and no expensive tier you have to grow into.'
	},
	{
		q: 'Do you take a commission on my sales?',
		a: 'No, and we cannot — Astro-Menu does not process orders or payments at all. Your customers order from your staff and pay you directly, exactly as they do now.'
	},
	{
		q: 'Do I need a POS system or any hardware?',
		a: 'No. There is nothing to buy, install or plug in. Astro-Menu is a menu, not a till. If you already have a POS, keep it — the two do not need to talk to each other.'
	},
	{
		q: 'Can customers order or pay through the menu?',
		a: 'No. This is a deliberate design decision. Astro-Menu shows your menu beautifully and stays out of the transaction, which is why there is no commission and no payment setup.'
	},
	{
		q: 'Do my customers need to download an app?',
		a: 'No. Scanning the QR code opens the menu in whatever browser their phone already has. There is no app, no sign-up and no account for the diner.'
	},
	{
		q: 'What happens when I change a price?',
		a: 'You edit the item and it is live in seconds. The QR code never changes, so you never reprint anything.'
	},
	{
		q: 'Will I have to reprint my QR code?',
		a: 'No. Your QR code points at your menu rather than a particular version of it. Print it once — on table tents, stickers, the window, packaging — and it keeps working forever.'
	},
	{
		q: 'How many languages can my menu have?',
		a: 'As many as you need. Write the menu once and it is translated automatically, so each diner reads it in the language their phone is set to.'
	},
	{
		q: 'Is there a limit on scans or menu views?',
		a: 'No. Menu views are unlimited under a fair usage policy, so a busy weekend never costs you more than a quiet one.'
	},
	{
		q: 'How long does it take to set up?',
		a: 'Most venues are live the same day. If you would rather not type your menu in, send us your existing menu or PDF and we will load the first version for you.'
	},
	{
		q: 'Is there a free trial?',
		a: 'Yes — 30 days, with no card required. If it is not for you, do nothing and it simply ends.'
	},
	{
		q: 'Am I locked into a contract?',
		a: 'No. Monthly billing is month to month and you can stop whenever you like. Annual billing is just a cheaper way to pay for the same thing.'
	},
	{
		q: 'Can I use one subscription for several branches?',
		a: 'Each venue needs its own subscription, because each one gets its own menu, QR code and analytics. Branches of the same brand can run completely different menus.'
	},
	{
		q: 'What can I see in the analytics?',
		a: 'How many people opened your menu, which items they looked at most, and when your busiest viewing times are. It is menu data, not customer data — we do not track individual diners.'
	},
	{
		q: 'Can I show the Wi-Fi password on my menu?',
		a: 'Yes, along with your social links and anything else you want guests to find. It saves your staff being asked all day.'
	},
	{
		q: 'What if I already have a website?',
		a: 'Link to your menu from it. Your menu page is a normal URL, so it works from any website, any listing and any social profile.'
	}
]
