export const LANGUAGES = { en: 'English', ar: 'العربية' } as const
export const DEFAULT_LANG = 'en'
export type Lang = keyof typeof LANGUAGES

export const ui = {
	en: {
		'nav.home': 'Home',
		'nav.features': 'Features',
		'nav.how': 'How it works',
		'nav.pricing': 'Pricing',
		'nav.demo': 'Live demo',
		'nav.blog': 'Blog',
		'nav.login': 'Log in',
		'nav.startFree': 'Start free',
		'nav.startFreeTrial': 'Start free trial',
		'nav.language': 'Language',
		'nav.openMenu': 'Open menu',

		'footer.tagline':
			'The QR menu your customers can actually read. One flat price, no POS, no commission, no hardware.',
		'footer.product': 'Product',
		'footer.learn': 'Learn',
		'footer.legal': 'Legal',
		'footer.rights': 'All rights reserved.',
		'footer.slogan': 'Modern, effortless, deliciously digital.',

		'common.skipToContent': 'Skip to content',
		'common.home': 'Home'
	},
	ar: {
		'nav.home': 'الرئيسية',
		'nav.features': 'المزايا',
		'nav.how': 'كيف تعمل',
		'nav.pricing': 'الأسعار',
		'nav.demo': 'عرض حيّ',
		'nav.blog': 'المدونة',
		'nav.login': 'تسجيل الدخول',
		'nav.startFree': 'ابدأ مجانًا',
		'nav.startFreeTrial': 'ابدأ الفترة التجريبية',
		'nav.language': 'اللغة',
		'nav.openMenu': 'افتح القائمة',

		'footer.tagline':
			'قائمة QR التي يستطيع عملاؤك قراءتها فعلًا. سعر ثابت واحد، بلا نظام نقاط بيع، بلا عمولة، بلا أجهزة.',
		'footer.product': 'المنتج',
		'footer.learn': 'تعلّم',
		'footer.legal': 'قانوني',
		'footer.rights': 'جميع الحقوق محفوظة.',
		'footer.slogan': 'عصري، سهل، ورقمي بامتياز.',

		'common.skipToContent': 'تخطَّ إلى المحتوى',
		'common.home': 'الرئيسية'
	}
} as const

export function getLangFromUrl(url: URL): Lang {
	const [, lang] = url.pathname.split('/')
	if (lang in ui) return lang as Lang
	return DEFAULT_LANG
}

export function useTranslations(lang: Lang) {
	return function t(key: keyof (typeof ui)['en']): string {
		return ui[lang][key] ?? ui[DEFAULT_LANG][key]
	}
}

/** Prefixes a root-relative path with the locale, e.g. "/pricing" -> "/ar/pricing". */
export function localizePath(path: string, lang: Lang): string {
	if (lang === DEFAULT_LANG) return path
	return path === '/' ? '/ar' : `/ar${path}`
}
