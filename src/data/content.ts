import { SITE } from '../config/site'

/**
 * The three pillars, reframed around WHO benefits rather than around features.
 * Owner, staff, guest — the three people at every table — because "everybody
 * wins" is the thing worth selling and an abstract feature icon cannot sell it.
 */
export const PILLARS = [
	{
		who: 'The owner',
		title: 'No commission, ever',
		body: 'A flat monthly fee and nothing else. We never take a percentage of a bill, an order or a delivery, so what you charge is what you keep.',
		image: 'owner',
		brief: 'Cafe owner grinning, phone in hand, behind the counter',
		tone: 'warm' as const,
		whoAr: 'صاحب المطعم',
		titleAr: 'بلا عمولة، أبدًا',
		bodyAr: 'رسم شهري ثابت ولا شيء غيره. لا نأخذ أبدًا نسبة من فاتورة أو طلب أو توصيل، فما تتقاضاه هو ما تحتفظ به بالكامل.'
	},
	{
		who: 'The staff',
		title: 'Changed in seconds',
		body: 'Price rise, sold-out dish, new special. Someone edits it on a phone and every QR code in the room is already showing it. No more apologising table by table.',
		image: 'staff',
		brief: 'Barista laughing mid-service, relaxed, not stressed',
		tone: 'brand' as const,
		whoAr: 'فريق العمل',
		titleAr: 'يتغيّر خلال ثوانٍ',
		bodyAr: 'ارتفاع سعر، طبق نفد، عرض جديد. أحدهم يعدّله من هاتفه وكل رمز QR في الصالة يعرضه فورًا. لا مزيد من الاعتذار طاولة تلو الأخرى.'
	},
	{
		who: 'The guest',
		title: 'No app, no friction',
		body: 'They point a camera and the menu opens in their own language. Nothing to download, nothing to sign into, nothing for your staff to explain.',
		image: 'guests',
		brief: 'Two friends at a table scanning a QR, laughing at the phone',
		tone: 'dark' as const,
		whoAr: 'الضيف',
		titleAr: 'بلا تطبيق، بلا عناء',
		bodyAr: 'يوجّه الكاميرا فيفتح القائمة بلغته هو. لا شيء يُحمَّل، ولا حساب يُنشأ، ولا شيء يحتاج موظفوك لشرحه.'
	}
]

/**
 * Real venues running Astro-Menu, each with its own logo and a menu anyone can
 * open. `logo` is a filename stem in src/assets/logos — these are the venues'
 * own marks, used with permission, never a stand-in.
 */
export const VENUES = [
	{
		id: 'number-eight',
		name: 'Number Eight Speciality Coffee',
		kind: 'Speciality coffee shop',
		logo: 'number-8',
		blurb:
			'120 items across fourteen sections, in Al Ain. Every screenshot on this site is shot from this menu.',
		menuUrl: SITE.demoMenuUrl,
		nameAr: 'نمبر إيت للقهوة المختصة',
		kindAr: 'مقهى قهوة مختصة',
		blurbAr:
			'120 صنفًا في أربعة عشر قسمًا، في العين. كل لقطة شاشة على هذا الموقع مأخوذة من هذه القائمة.'
	},
	{
		id: 'foamy',
		name: 'Foamy Coffee Cafe',
		kind: 'Mobile coffee truck',
		logo: 'foamy-cafe',
		blurb: 'A coffee truck menu that moves with the truck — edited from a phone between pitches.',
		menuUrl:
			'https://menu.astro-menu.com/qr-menu/?businessProfileID=mbiRz8YmVGjOTvtknUOq&branchID=2EKctRFUaA06pGIvAT2D&tableID=upxdTRj5NaTRl68f6ly0',
		nameAr: 'فومي كوفي كافيه',
		kindAr: 'شاحنة قهوة متنقلة',
		blurbAr: 'قائمة شاحنة قهوة تتنقل مع الشاحنة — تُعدَّل من الهاتف بين موقع وآخر.'
	},
	{
		id: 'carb-protein',
		name: 'Carb & Protein Healthy Restaurant',
		kind: 'Healthy restaurant',
		logo: 'carb-protein',
		blurb:
			'An Abu Dhabi restaurant whose menu is built around a goal rather than a cuisine — meals balanced for weight loss or weight gain, every dish tagged with calories, carbs, fat and protein, plus multi-day plans. The macros screenshot on this site is theirs.',
		menuUrl:
			'https://menu.astro-menu.com/qr-menu/?businessProfileID=QpPFdtogRHoWo1uL0KGe&branchID=2EKctRFUaA06pGIvAT2D&tableID=upxdTRj5NaTRl68f6ly0',
		nameAr: 'كارب آند بروتين مطعم صحي',
		kindAr: 'مطعم صحي',
		blurbAr:
			'مطعم في أبوظبي تُبنى قائمته حول هدف لا حول مطبخ — وجبات موزونة لإنقاص الوزن أو زيادته، وكل طبق موسوم بالسعرات والكربوهيدرات والدهون والبروتين، إضافة إلى برامج متعددة الأيام. لقطة العناصر الغذائية على هذا الموقع من قائمتهم.'
	}
] as const

export type VenueId = (typeof VENUES)[number]['id']

/** Looks a venue up by id, so a testimonial never carries a duplicate copy of the logo or URL. */
export const venue = (id: VenueId) => VENUES.find((v) => v.id === id)!

/**
 * The quote for a venue, if that venue has given one. Returns undefined
 * otherwise, and the caller falls back to describing the menu in our own words.
 * Deliberately not "every venue must have a quote": inventing one to fill a
 * card is the exact failure this whole file is arranged to prevent.
 */
export const testimonialFor = (id: VenueId) => TESTIMONIALS.find((t) => t.venueId === id)

/**
 * Quotes from their own testimonials, word for word. `venueId` points at the
 * VENUES entry, which supplies the logo shown beside the quote and the link to
 * their live menu — so a venue can never end up wearing another one's mark.
 */
export const TESTIMONIALS = [
	{
		venueId: 'number-eight' as const,
		person: 'Saeed',
		role: 'Owner',
		quote:
			'Astro-Menu transformed the way our customers interact with our menu. With more than 120 items, it used to take time for people to find what they wanted, but the filtering and clean layout changed everything. Customers can now browse, sort, and locate their preferred drinks or pastries in seconds. This has noticeably reduced ordering time and kept the flow moving smoothly, especially during peak hours.',
		roleAr: 'المالك',
		quoteAr:
			'غيّرت Astro-Menu الطريقة التي يتفاعل بها عملاؤنا مع قائمتنا. مع أكثر من 120 صنفًا، كان الأمر يستغرق وقتًا حتى يجد الناس ما يريدون، لكن الفلترة والتصميم الواضح غيّرا كل شيء. أصبح بإمكان العملاء الآن التصفح والفرز وإيجاد مشروبهم أو حلواهم المفضلة خلال ثوانٍ. هذا خفّض وقت الطلب بشكل ملحوظ وحافظ على انسيابية الحركة، خصوصًا في أوقات الذروة.'
	},
	{
		venueId: 'foamy' as const,
		person: 'Mayed',
		role: 'Mobile coffee truck',
		quote:
			'Astro-Menu has been a great addition to how we operate. Managing our menu is incredibly easy, and updates appear instantly. One of the biggest advantages is how smoothly customers can view our menu online through Google, Maps, or even our social media pages before visiting. It helps them decide faster and improves their overall experience.',
		roleAr: 'شاحنة قهوة متنقلة',
		quoteAr:
			'كانت Astro-Menu إضافة رائعة لطريقة عملنا. إدارة قائمتنا سهلة للغاية، والتحديثات تظهر فورًا. من أكبر المزايا هي السلاسة التي يستطيع بها العملاء الاطلاع على قائمتنا أونلاين عبر جوجل أو الخرائط أو حتى صفحاتنا على وسائل التواصل الاجتماعي قبل الزيارة. هذا يساعدهم على اتخاذ القرار بسرعة أكبر ويحسّن تجربتهم بشكل عام.'
	}
]

/** The comparison table. Left column is us, right is a printed or PDF menu. */
export const VERSUS = [
	{
		point: 'Changing a price',
		astro: 'Type it. Live the moment you save, at no cost.',
		other: 'Reprint the whole run, or live with a sticker over it.',
		pointAr: 'تغيير سعر',
		astroAr: 'اكتبه فقط. يظهر مباشرة لحظة الحفظ، بلا أي تكلفة.',
		otherAr: 'أعد طباعة القائمة بالكامل، أو تعايش مع ملصق فوقه.'
	},
	{
		point: 'A dish runs out',
		astro: 'One toggle and it disappears from the menu.',
		other: 'The waiter apologises, table by table, all night.',
		pointAr: 'نفاد طبق',
		astroAr: 'مفتاح واحد ويختفي الطبق من القائمة.',
		otherAr: 'النادل يعتذر، طاولة تلو الأخرى، طوال الليل.'
	},
	{
		point: 'Reading it on a phone',
		astro: 'Built for a phone screen first. Nothing to zoom.',
		other: 'A PDF you pinch, drag and squint at.',
		pointAr: 'القراءة على الهاتف',
		astroAr: 'مصمم لشاشة الهاتف أولًا. لا حاجة للتكبير.',
		otherAr: 'ملف PDF تكبّره وتسحبه وتحدّق فيه بصعوبة.'
	},
	{
		point: 'Guests who read Arabic',
		astro: 'Every language you add, translated and right-to-left.',
		other: 'A second print run, or nothing at all.',
		pointAr: 'الضيوف الذين يقرؤون العربية',
		astroAr: 'كل لغة تضيفها، مترجمة وبالاتجاه الصحيح من اليمين لليسار.',
		otherAr: 'طبعة ثانية، أو لا شيء على الإطلاق.'
	},
	{
		point: 'Finding one dish in 120',
		astro: 'Section chips, meal-type filters, photos. Seconds.',
		other: 'Scroll, scroll, scroll, ask a waiter.',
		pointAr: 'إيجاد طبق واحد بين 120',
		astroAr: 'أقسام سريعة، فلاتر لنوع الوجبة، صور. خلال ثوانٍ.',
		otherAr: 'تمرير، تمرير، تمرير، ثم سؤال النادل.'
	},
	{
		point: 'Allergies and calories',
		astro: 'Tagged per item, filterable, always current.',
		other: 'A separate sheet nobody can find.',
		pointAr: 'الحساسية والسعرات الحرارية',
		astroAr: 'موسومة لكل صنف، قابلة للفلترة، محدّثة دائمًا.',
		otherAr: 'ورقة منفصلة لا يجدها أحد.'
	},
	{
		point: 'Before they arrive',
		astro: 'The same menu opens from Google, Maps and Instagram.',
		other: 'A PDF download, if it is online at all.',
		pointAr: 'قبل وصولهم',
		astroAr: 'نفس القائمة تُفتح من جوجل والخرائط وإنستغرام.',
		otherAr: 'تنزيل ملف PDF، إن وُجد أونلاين أصلًا.'
	},
	{
		point: 'What it tells you',
		astro: 'Views, popular items, peak hours.',
		other: 'Nothing at all.',
		pointAr: 'ما تخبرك به',
		astroAr: 'المشاهدات، الأصناف الأكثر طلبًا، ساعات الذروة.',
		otherAr: 'لا شيء على الإطلاق.'
	}
]

export const USE_CASES = [
	{
		title: 'Restaurants & cafés',
		body: 'Big menus, table QR codes, and a link that answers "what do they serve?" before anyone books.',
		image: 'uc-cafe',
		brief: 'Busy cafe floor, table tent with QR in focus',
		tone: 'brand' as const,
		titleAr: 'المطاعم والمقاهي',
		bodyAr: 'قوائم كبيرة، رموز QR على الطاولات، ورابط يجيب على سؤال "ماذا يقدّمون؟" قبل أن يحجز أحد.'
	},
	{
		title: 'Coffee trucks',
		body: 'One code on the hatch. Change the menu when you change the pitch.',
		image: 'uc-truck',
		brief: 'Truck hatch, owner leaning out, QR sticker on the counter',
		tone: 'warm' as const,
		titleAr: 'شاحنات القهوة',
		bodyAr: 'رمز واحد على النافذة. غيّر القائمة كلما غيّرت الموقع.'
	},
	{
		title: 'Hotel rooms',
		body: 'Room service, breakfast and pool menus on one code, in every language your guests read.',
		image: 'uc-hotel',
		brief: 'Room-service card on a bed, phone showing the menu',
		tone: 'dark' as const,
		titleAr: 'غرف الفنادق',
		bodyAr: 'خدمة الغرف والإفطار وقوائم المسبح على رمز واحد، بكل لغة يقرؤها ضيوفك.'
	},
	{
		title: 'Bakeries & dessert bars',
		body: 'Photos sell the counter. Sold-out trays disappear with a toggle.',
		image: 'uc-bakery',
		brief: 'Counter of pastries, hand pointing at the phone menu',
		tone: 'brand' as const,
		titleAr: 'المخابز وبارات الحلويات',
		bodyAr: 'الصور تبيع ما في الكاونتر. الصواني النافدة تختفي بمفتاح واحد.'
	},
	{
		title: 'Clinics & staff canteens',
		body: 'Calories, macros and allergens on every item, without a printed sheet.',
		image: 'uc-clinic',
		brief: 'Bright canteen counter, tray of labelled healthy dishes',
		tone: 'warm' as const,
		titleAr: 'العيادات ومطاعم الموظفين',
		bodyAr: 'السعرات الحرارية والعناصر الغذائية ومسببات الحساسية على كل صنف، بلا ورقة مطبوعة.'
	},
	{
		title: 'Lounges',
		body: 'Long lists, filtered fast, with the Wi-Fi password on the same screen.',
		image: 'uc-lounge',
		brief: 'Evening lounge table, phone glowing with the menu',
		tone: 'dark' as const,
		titleAr: 'الصالات',
		bodyAr: 'قوائم طويلة، تُفلتر بسرعة، مع كلمة مرور الواي فاي على نفس الشاشة.'
	}
]

/** The claims that scroll past on the ribbon under the hero. */
export const RIBBON = [
	'Unlimited menus',
	'Every language',
	'No commission',
	'A photo on every dish',
	'One QR forever',
	'Sold-out toggle',
	'No app to download',
	'Unlimited updates'
]

export const RIBBON_AR: string[] = [
	'قوائم غير محدودة',
	'كل لغة',
	'بلا عمولة',
	'صورة على كل طبق',
	'رمز QR واحد للأبد',
	'مفتاح النفاد',
	'بلا تطبيق يُحمَّل',
	'تحديثات غير محدودة'
]

/**
 * The screenshot rail. Files live in src/assets/screens and are all shot from
 * the live reference menu, so what visitors see here is exactly what they get.
 * `tall` drives the masonry rhythm — mixed heights are what make the grid read
 * as a Pinterest board rather than a table of thumbnails.
 */
export const SCREENS = [
	{
		file: 'landing.png',
		title: 'Your venue, first',
		body: 'Cover photo, logo and your story — plus one tap to call, WhatsApp, Maps, Instagram or leave a Google review.',
		tall: true,
		titleAr: 'مكانك، في المقدمة',
		bodyAr: 'صورة غلاف وشعار وقصتك — بالإضافة إلى ضغطة واحدة للاتصال أو واتساب أو الخرائط أو إنستغرام أو ترك تقييم على جوجل.'
	},
	{
		file: 'menu-sections.png',
		title: 'Sections that stay put',
		body: 'Section chips pin to the top. Guests jump straight to Brewed Coffee without scrolling past breakfast.',
		tall: false,
		titleAr: 'أقسام تبقى في مكانها',
		bodyAr: 'أزرار الأقسام تثبت في الأعلى. يقفز الضيوف مباشرة إلى القهوة المحمّصة دون التمرير عبر قسم الإفطار.'
	},
	{
		file: 'item-detail.png',
		title: 'Every dish, properly',
		body: 'A full-width photo, the description you wrote, sizes and portions each with their own price, and add-ons — priced or free.',
		tall: true,
		titleAr: 'كل طبق، كما يجب',
		bodyAr: 'صورة بعرض الشاشة، الوصف الذي كتبته، الأحجام والحصص وكل منها بسعره الخاص، والإضافات — مسعّرة أو مجانية.'
	},
	{
		file: 'filter-meal-type.png',
		title: 'Filter to what they want',
		body: 'Iced, decaf, healthy, light portion — 120 items narrow to five in two taps.',
		tall: false,
		titleAr: 'فلترة لما يريدونه',
		bodyAr: 'مثلج، بدون كافيين، صحي، حصة خفيفة — 120 صنفًا تتقلص إلى خمسة بضغطتين.'
	},
	{
		file: 'language-switch.png',
		title: 'In their language',
		body: 'Add a language and the whole menu is translated, right-to-left where it should be.',
		tall: true,
		titleAr: 'بلغتهم هم',
		bodyAr: 'أضف لغة وتُترجم القائمة بأكملها، من اليمين لليسار حيث ينبغي ذلك.'
	},
	{
		file: 'macros.png',
		title: 'Calories and macros',
		body: 'Per item, if you want them — calories, carbs, fat and protein, with allergen tags alongside.',
		tall: false,
		/** Not Number Eight's menu, so it is credited to the venue it belongs to. */
		credit: 'carb-protein' as const,
		titleAr: 'السعرات الحرارية والعناصر الغذائية',
		bodyAr:
			'لكل صنف، إن أردت ذلك — السعرات الحرارية والكربوهيدرات والدهون والبروتين، مع وسوم مسببات الحساسية بجانبها.'
	}
]
