/**
 * What one Astro-Menu subscription actually contains. Every list on the site
 * reads from here so /pricing, /features and the home page can never drift
 * apart. Wording is drawn from what the live reference menu genuinely does.
 */
export const INCLUDED = [
	'Unlimited menus, sections and items',
	'Unlimited menu views — no scan limits',
	'A photo on every item',
	'Sizes and portions, each with its own price',
	'Calories and macros per item, if you want them',
	'Automatic translation into any language, Arabic included',
	'Dietary and allergen tags',
	'Filter the menu by meal type',
	'One QR code that never changes, however often the menu does',
	'Print-ready QR downloads — PNG, SVG and PDF',
	'A shareable link for Instagram, WhatsApp and Google',
	'Your own branded venue page with cover photo and logo',
	'Wi-Fi password, phone, WhatsApp, Maps and review links',
	'Menu analytics — views, popular items, peak hours',
	'Works in any phone browser, no app to download',
	'Unlimited updates, live in seconds',
	'Email support, and we will load your first menu for you'
]

export const INCLUDED_AR: string[] = [
	'منيوهات وأقسام وأصناف غير محدودة',
	'مشاهدات غير محدودة للمنيو، بلا حدود للمسح',
	'صورة لكل صنف',
	'أحجام وحصص، لكل منها سعرها الخاص',
	'السعرات الحرارية والعناصر الغذائية لكل صنف، إذا بدك',
	'ترجمة تلقائية لأي لغة، والعربية من ضمنها',
	'علامات النظام الغذائي والحساسية',
	'تصفية المنيو حسب نوع الوجبة',
	'رمز QR واحد ما بيتغيّر، مهما تغيّر المنيو',
	'تحميل رمز QR جاهز للطباعة، بصيغ PNG وSVG وPDF',
	'رابط قابل للمشاركة على إنستغرام وواتساب وجوجل',
	'صفحة مطعمك الخاصة بعلامتك التجارية، مع صورة غلاف وشعار',
	'كلمة سر الواي فاي، والهاتف، وواتساب، والخرائط، وروابط التقييمات',
	'تحليلات المنيو — المشاهدات، الأصناف الأكثر طلبًا، وساعات الذروة',
	'يشتغل على أي متصفح موبايل، بلا حاجة لتطبيق',
	'تحديثات غير محدودة، تظهر مباشرة خلال ثوانٍ',
	'دعم عبر البريد الإلكتروني، ومنحمّلك منيوك الأول بنفسنا'
]

/**
 * The deliberate omissions. This is the sharpest thing we can say against
 * Orderific, eMenu, TableQR and the rest — most of them bundle a POS and price
 * accordingly. Saying plainly what we do not do is what makes the price
 * believable.
 */
export const NOT_INCLUDED = [
	{
		label: 'No POS or till system',
		reason: 'Keep the till you already have. We never sit between you and your customer.',
		labelAr: 'لا نظام نقاط بيع أو صندوق كاشير',
		reasonAr: 'خلّي الكاشير يلي عندك زي ما هو. نحن ما منوقف أبدًا بينك وبين زبونك.'
	},
	{
		label: 'No order taking, no payments',
		reason: 'Your staff take orders the way they always have, and the money goes straight to you.',
		labelAr: 'لا استقبال طلبات، ولا مدفوعات',
		reasonAr: 'طاقمك بياخد الطلبات متل ما اعتاد دايمًا، والمصاري بتوصلك مباشرة.'
	},
	{
		label: 'No commission, on anything',
		reason: 'One flat fee. We never take a cut of a bill, an order or a delivery.',
		labelAr: 'لا عمولة على أي شيء',
		reasonAr: 'رسم واحد ثابت. نحن ما ناخد أبدًا نسبة من فاتورة أو طلب أو توصيل.'
	},
	{
		label: 'No hardware to buy',
		reason: 'No tablets, no printers, no installation visit. A printed QR code is the hardware.',
		labelAr: 'لا أجهزة تُشترى',
		reasonAr: 'لا أجهزة لوحية، لا طابعات، لا زيارة تركيب. رمز QR مطبوع هو كل الجهاز يلي محتاجه.'
	}
]

export const STEPS = [
	{
		n: '01',
		title: 'Send us your menu',
		body: 'Send the PDF, the photos, even a snapshot of the printed card. We do the conversion by hand — every section, item, description and price — and hand the finished menu back for you to check.',
		detail: 'This is the part that takes real work, and it is the part we do for you.',
		titleAr: 'ابعتلنا منيوك',
		bodyAr: 'ابعتلنا ملف الـPDF، أو الصور، أو حتى لقطة للكرت المطبوع. منسوي التحويل يدويًا — كل قسم وصنف ووصف وسعر — ومنرجعلك المنيو جاهز تراجعه.',
		detailAr: 'هاد هو الجزء يلي بيحتاج شغل حقيقي، وهو يلي منسويه نيابة عنك.'
	},
	{
		n: '02',
		title: 'Make it yours',
		body: 'Cover photo, logo, colours, section order, a photo on each dish. Add the languages you serve in and Astro-Menu translates the whole menu.',
		detail: 'Everything is a field in the dashboard. No designer, no ticket.',
		titleAr: 'خلّيها منيوك أنت',
		bodyAr: 'صورة غلاف، شعار، ألوان، ترتيب الأقسام، صورة لكل طبق. ضيف اللغات يلي بتخدم فيها زبائنك، وبتترجم Astro-Menu المنيو بأكمله.',
		detailAr: 'كل شيء عبارة عن حقل في لوحة التحكم. بلا مصمم، وبلا تذكرة دعم.'
	},
	{
		n: '03',
		title: 'Print the code, share the link',
		body: 'Download the QR print-ready and copy your link. Both point at the same live menu, and neither ever changes.',
		detail: 'Table tents, window decals, Instagram bio, Google profile, delivery bags.',
		titleAr: 'اطبع الرمز، وشارك الرابط',
		bodyAr: 'حمّل رمز QR جاهز للطباعة وانسخ رابطك. الاثنين بيشيروا لنفس المنيو المباشر، وما بيتغيّر أي منهما أبدًا.',
		detailAr: 'بطاقات الطاولات، ملصقات النوافذ، بايو الإنستغرام، صفحة جوجل، أكياس التوصيل.'
	},
	{
		n: '04',
		title: 'Change it whenever you like',
		body: 'Sold out of the salmon? Toggle it off. New price? Type it. The change is live before you put your phone down.',
		detail: 'No reprint, no re-sticker, no waiting on anyone.',
		titleAr: 'غيّرها متى ما بدك',
		bodyAr: 'خلص السلمون؟ أطفئه بلمسة وحدة. سعر جديد؟ اكتبه. والتغيير بيصير مباشر قبل ما تحط موبايلك جنب.',
		detailAr: 'بلا إعادة طباعة، بلا إعادة لصق، وبلا انتظار لحدا.'
	}
]

/** Feeds the "what you control" section. Mirrors the real dashboard surface. */
export const DASHBOARD_CONTROLS = [
	{
		title: 'Menus',
		body: 'Run separate menus for breakfast, lunch, brunch and the weekend. Publish one, keep the rest waiting.',
		titleAr: 'المنيوهات',
		bodyAr: 'شغّل منيوهات منفصلة للفطور والغداء والبرانش وعطلة نهاية الأسبوع. انشر واحد، وخلّي الباقي جاهز بالانتظار.'
	},
	{
		title: 'Sections',
		body: 'Create, rename and reorder sections. The order you set is the order guests scroll — and it changes what they order.',
		titleAr: 'الأقسام',
		bodyAr: 'أنشئ الأقسام وأعد تسميتها وترتيبها. الترتيب يلي تحدده هو نفسه ترتيب تصفح الزبون — وهاد يلي بيغيّر شو بيطلب.'
	},
	{
		title: 'Items & prices',
		body: 'Photo, description, price, portions, calories, allergen tags. Edit any field and it is live immediately.',
		titleAr: 'الأصناف والأسعار',
		bodyAr: 'صورة، وصف، سعر، حصص، سعرات حرارية، علامات الحساسية. عدّل أي حقل وبيصير مباشرًا فورًا.'
	},
	{
		title: 'Availability',
		body: 'One toggle hides a dish the moment it runs out, and brings it back tomorrow. Nobody orders what you cannot serve.',
		titleAr: 'التوفر',
		bodyAr: 'زر واحد بيخفي الطبق لحظة ما يخلص، وبيرجعه بكرة. ما حدا بيطلب شي ما بتقدر تقدّمه.'
	},
	{
		title: 'Languages',
		body: 'Add the languages your guests read. Astro-Menu translates the whole menu and switches to right-to-left for Arabic.',
		titleAr: 'اللغات',
		bodyAr: 'ضيف اللغات يلي بيقراها زبائنك. Astro-Menu بتترجم المنيو بأكمله وبتحوّل الاتجاه من اليمين لليسار للعربي.'
	},
	{
		title: 'Look & feel',
		body: 'Cover photo, logo, brand colour, venue story, Wi-Fi password, socials, Maps and review links.',
		titleAr: 'المظهر والطابع',
		bodyAr: 'صورة غلاف، شعار، لون علامتك التجارية، قصة المكان، كلمة سر الواي فاي، حسابات التواصل، وروابط الخرائط والتقييمات.'
	},
	{
		title: 'QR & links',
		body: 'Download the code print-ready in PNG, SVG or PDF, and grab the plain link for anywhere a URL goes.',
		titleAr: 'رمز QR والروابط',
		bodyAr: 'حمّل الرمز جاهز للطباعة بصيغ PNG أو SVG أو PDF، وخد الرابط البسيط لاستخدامه بأي مكان بيقبل رابط.'
	},
	{
		title: 'Analytics',
		body: 'Which items get opened, which get ignored, when the scans happen. Evidence for the next menu you write.',
		titleAr: 'التحليلات',
		bodyAr: 'أي الأصناف بتنفتح، وأيها بتنتجاهل، وإيمتى بتصير عمليات المسح. أدلة بتفيدك وأنت بتكتب منيوك الجاي.'
	}
]
