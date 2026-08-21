/**
 * /features, grouped. Each group is a section on the page.
 *
 * `screen` names a phone screenshot in src/assets/screens — what the guest
 * sees. `dash` names an admin screenshot in src/assets/dashboard — what the
 * owner sees. A group may have either, both, or neither.
 */
export const FEATURE_GROUPS = [
	{
		id: 'the-menu',
		eyebrow: 'What guests see',
		title: 'A menu made for phones',
		lede: 'Not a PDF squeezed onto a phone. It is made for touch, easy to browse, and quick to load.',
		screen: 'menu-sections.png',
		eyebrowAr: 'ما يشوفه الزبون',
		titleAr: 'منيو مصممة للموبايل من الأساس',
		ledeAr: 'مو ملف PDF عالشاشة. منيو مصممة للإبهام، تحمّل قبل ما توصل كاسة الماء.',
		items: [
			{
				title: 'A photo on every item',
				body: 'People order what they can see. Upload one photo per dish and the menu becomes a shopfront rather than a price list.',
				titleAr: 'صورة لكل صنف',
				bodyAr: 'الناس بتطلب يلي بتشوفه. حمّل صورة وحدة لكل طبق وتصير المنيو واجهة عرض مو مجرد لستة أسعار.'
			},
			{
				title: 'Sections that pin to the top',
				body: 'Your sections become chips that follow the guest down the page. Twelve sections stay one tap apart.',
				titleAr: 'أقسام تثبت فوق',
				bodyAr: 'أقسامك بتصير أزرار بتلاحق الزبون وهو نازل بالصفحة. اثنا عشر قسم يضلوا على بعد ضغطة وحدة.'
			},
			{
				title: 'Sizes and portions',
				body: 'Single or double, small or large, regular or geisha — each with its own price, on the item, where it belongs.',
				titleAr: 'الأحجام والحصص',
				bodyAr: 'سنغل أو دبل، صغير أو كبير، عادي أو غيشا — كل وحدة بسعرها الخاص، عالصنف نفسه، وين ما لازم تكون.'
			},
			{
				title: 'Descriptions with room to work',
				body: 'Write the full sentence. There is no column width to fight and no reprint cost for a longer line.',
				titleAr: 'أوصاف إلها مساحة تتنفس',
				bodyAr: 'اكتب الجملة كاملة. ما في عرض عمود يحدّك ولا تكلفة طباعة لسطر أطول.'
			},
			{
				title: 'Loads in under a second',
				body: 'Images are compressed and sized on upload. Nobody abandons the menu waiting for it.',
				titleAr: 'تحمّل بأقل من ثانية',
				bodyAr: 'الصور تنضغط وتتحجّم لحظة الرفع. محدا بيسيب المنيو وهو مستني تحميلها.'
			},
			{
				title: 'No app, no sign-in',
				body: 'It opens in whatever browser the phone already has. No download, no account, no cookie wall.',
				titleAr: 'بلا تطبيق، بلا تسجيل دخول',
				bodyAr: 'بتفتح بأي متصفح موجود أصلًا عالموبايل. بلا تحميل، بلا حساب، بلا جدار موافقة كوكيز.'
			}
		]
	},
	{
		id: 'languages',
		eyebrow: 'Reach',
		title: 'Serve guests in their language',
		lede: 'Add a language in the dashboard and the entire menu — sections, items, descriptions — comes back translated.',
		screen: 'language-switch.png',
		eyebrowAr: 'الوصول',
		titleAr: 'اعرض منيو مطعمك باللغة يلي بيفضّلها زباينك',
		ledeAr: 'ضيف لغة من لوحة التحكم وترجع القائمة كلها — الأقسام والأصناف والأوصاف — مترجمة.',
		items: [
			{
				title: 'Automatic translation',
				body: 'You write the menu once, in your language. Guests switch to theirs from the header.',
				titleAr: 'ترجمة تلقائية',
				bodyAr: 'تكتب المنيو مرة وحدة، بلغتك. وبيقدر الزبون يبدّل للغته من أعلى المنيو.'
			},
			{
				title: 'Proper right-to-left Arabic',
				body: 'Not a mirrored English layout. The menu rebuilds itself for Arabic readers.',
				titleAr: 'عربي صحيح من اليمين لليسار',
				bodyAr: 'مش تخطيط إنجليزي معكوس. المنيو بتبني حالها من جديد لقارئ العربي.'
			},
			{
				title: 'Edit any translation',
				body: 'Machine translation gets a dish name wrong now and then. Override it and the correction sticks.',
				titleAr: 'عدّل أي ترجمة',
				bodyAr: 'الترجمة الآلية ممكن تخطئ أحيانًا باسم طبق. عدّلها مرة، وبيضل تعديلك محفوظ.'
			}
		]
	},
	{
		id: 'diet',
		dash: 'dash-meal',
		dashBrief: 'The meal editor: calories and macro fields, dietary labels, portions',
		eyebrow: 'Diet & nutrition',
		title: 'Answer the allergy question before it is asked',
		lede: 'The information a guest needs to order confidently, attached to the item instead of a laminated sheet behind the till.',
		screen: 'macros.png',
		dashBriefAr: 'محرر الوجبة: حقول السعرات الحرارية والعناصر الغذائية، الوسوم الغذائية، الحصص',
		eyebrowAr: 'النظام الغذائي والتغذية',
		titleAr: 'جاوب عن سؤال الحساسية قبل ما يُسأل',
		ledeAr: 'المعلومات يلي بيحتاجها الزبون ليطلب وهو مطمئن، ملصقة بالصنف نفسه بدل ورقة مغلفنة خلف الكاشير.',
		items: [
			{
				title: 'Calories and macros',
				body: 'Calories, carbs, fat and protein per item. Optional — switch them off for the whole menu if you would rather not.',
				titleAr: 'السعرات الحرارية والعناصر الغذائية',
				bodyAr: 'سعرات حرارية، كربوهيدرات، دهون وبروتين لكل صنف. اختياري — تقدر توقفها للمنيو كله إذا حبيت.'
			},
			{
				title: 'Allergen and dietary tags',
				body: 'Vegan, vegetarian, gluten-free, nut-free, halal. Tag once and the tag travels with the item everywhere.',
				titleAr: 'وسوم الحساسية والنظام الغذائي',
				bodyAr: 'نباتي صرف، نباتي، خالي من الغلوتين، خالي من المكسرات، حلال. حط الوسم مرة وبيلحق الصنف وين ما راح.'
			},
			{
				title: 'Meal-type filters',
				body: 'Hot, cold, decaf, healthy, light portion, sweet. Guests filter a long menu down to the shortlist they actually want.',
				titleAr: 'فلاتر نوع الوجبة',
				bodyAr: 'ساخن، بارد، بدون كافيين، صحي، حصة خفيفة، حلو. الزبون بيفلتر منيو طويلة لقائمة قصيرة هي يلي فعلًا بدو ياها.'
			}
		]
	},
	{
		id: 'qr',
		dash: 'dash-branch',
		dashBrief: 'Branch settings: cover photo, currency, language and the social links grid',
		eyebrow: 'Your code & link',
		title: 'One code. Print it once.',
		lede: 'The QR points at your menu, not at a file. Change the menu a hundred times and the code on the table still works.',
		screen: 'landing.png',
		dashBriefAr: 'إعدادات الفرع: صورة الغلاف، العملة، اللغة وشبكة روابط التواصل الاجتماعي',
		eyebrowAr: 'رمزك ورابطك',
		titleAr: 'رمز واحد. اطبعه مرة وخلص.',
		ledeAr: 'الـQR بيفتح منيو مطعمك مباشرة، مو ملف PDF. غيّر المنيو مية مرة وبيضل الرمز عالطاولة شغال.',
		items: [
			{
				title: 'A code that never expires',
				body: 'The commonest and most expensive QR mistake is encoding a PDF. Ours resolves to your live menu, permanently.',
				titleAr: 'رمز ما بتنتهي صلاحيته',
				bodyAr: 'أشيع غلطة بالـQR وأغلاها هي ترميز ملف PDF. رمزنا بيوصلك مباشرة لمنيوك الحية، بشكل دائم.'
			},
			{
				title: 'Print-ready downloads',
				body: 'PNG for quick jobs, SVG for the printer, PDF for table tents, stickers and window decals.',
				titleAr: 'تنزيلات جاهزة للطباعة',
				bodyAr: 'PNG للشغلات السريعة، SVG للمطبعة، PDF لحوامل الطاولات والملصقات وملصقات الشبابيك.'
			},
			{
				title: 'A plain link, too',
				body: 'The same menu opens from your Instagram bio, your Google Business profile, a WhatsApp reply or a delivery bag.',
				titleAr: 'ورابط بسيط كمان',
				bodyAr: 'نفس المنيو بتفتح من بايو إنستغرام، أو ملف نشاطك على جوجل، أو رد واتساب، أو كيس توصيل.'
			},
			{
				title: 'Your own venue page',
				body: 'Cover photo, logo, your story, and one-tap call, WhatsApp, Maps, Instagram and Google review buttons.',
				titleAr: 'صفحة مطعمك الخاصة',
				bodyAr: 'صورة غلاف وشعار وقصتك، وأزرار اتصال وواتساب وخرائط وإنستغرام وتقييم جوجل بضغطة وحدة.'
			},
			{
				title: 'Wi-Fi password on the menu',
				body: 'The second most common question at any table, answered on the screen already in their hand.',
				titleAr: 'كلمة سر الواي فاي عالمنيو',
				bodyAr: 'ثاني أكتر سؤال بيتسأل عأي طاولة، وجوابه عالشاشة الموجودة بإيدهم أصلًا.'
			}
		]
	},
	{
		id: 'dashboard',
		dash: 'dash-sections',
		dashBrief: 'A menu being built: sections added, reordered and filled with items',
		dashBriefAr: 'منيو قيد الإنشاء: أقسام مضافة ومُعاد ترتيبها ومملوءة بالأصناف',
		eyebrow: 'What you control',
		eyebrowAr: 'ما تتحكم فيه',
		title: 'The whole menu, from your phone',
		titleAr: 'المنيو كله، من موبايلك',
		lede: 'Everything a guest sees is a field you own. Nothing needs a designer, a developer or a support ticket.',
		ledeAr: 'كل شي بيشوفه الزبون هو حقل تملكه إنت. ما في شي بده مصمم أو مطور أو تذكرة دعم.',
		screen: null,
		items: [
			{
				title: 'Unlimited menus',
				titleAr: 'قوائم بلا حدود',
				body: 'Breakfast, lunch, weekend brunch, Ramadan. Build them all, publish the one that applies.',
				bodyAr: 'فطور، غدا، برنش الويكند، رمضان. ابنيها كلها، وانشر يلي بيناسب اللحظة.'
			},
			{
				title: 'Reorder by dragging',
				titleAr: 'رتّب بالسحب والإفلات',
				body: 'Section and item order is a merchandising decision. Make it in ten seconds, as often as you like.',
				bodyAr: 'ترتيب الأقسام والأصناف قرار تسويقي. سوّيه بعشر ثواني، وبقد ما بدك.'
			},
			{
				title: 'Sold-out toggle',
				titleAr: 'مفتاح النفاد',
				body: 'Hide a dish the minute it runs out and bring it back tomorrow. No guest orders what you cannot serve.',
				bodyAr: 'اخفي طبق لحظة ما يخلص ورجّعه بكرة. ما حدا بيطلب شي ما فيك تقدمه.'
			},
			{
				title: 'Brand it',
				titleAr: 'خلّيها بهويتك',
				body: 'Cover, logo, accent colour. The menu looks like your venue, not like our software.',
				bodyAr: 'غلاف، شعار، لون مميز. المنيو بتبين متلك، مش متل برنامجنا.'
			},
			{
				title: 'Unlimited updates',
				titleAr: 'تحديثات بلا حدود',
				body: 'There is no edit limit and no publish queue. Save is live.',
				bodyAr: 'ما في حد للتعديل ولا طابور نشر. لما تحفظ، بتنشر عالفور.'
			}
		]
	},
	{
		id: 'analytics',
		dash: 'dash-qr',
		dashBrief: 'The QR panel: total scans, the menu it points at, and the shareable link',
		dashBriefAr: 'لوحة الـQR: إجمالي المسحات، المنيو يلي بيشير إلها، والرابط القابل للمشاركة',
		eyebrow: 'Evidence',
		eyebrowAr: 'الدليل',
		title: 'Find out what the menu is actually doing',
		titleAr: 'شوف شو عم يعمل المنيو فعليًا',
		lede: 'A printed menu tells you nothing. This one tells you what got opened and what got scrolled past.',
		ledeAr: 'المنيو المطبوعة ما بتحكيلك شي. هاي بتقلك شو انفتح وشو تم تجاوزه.',
		screen: null,
		items: [
			{
				title: 'Views and scans',
				titleAr: 'المشاهدات والمسحات',
				body: 'How many people opened the menu, and whether that is going up.',
				bodyAr: 'كم واحد فتح المنيو، وهل هالعدد عم يزيد.'
			},
			{
				title: 'Popular items',
				titleAr: 'الأصناف الأكثر طلبًا',
				body: 'Which dishes get opened most — and which get ignored, which is the more useful list.',
				bodyAr: 'أي طبق بينفتح أكتر — وأيهم بيتجاهله الزبون، وهاي أهم قائمة فعليًا.'
			},
			{
				title: 'Peak hours',
				titleAr: 'ساعات الذروة',
				body: 'When the scanning happens, so you know when the menu is doing its work.',
				bodyAr: 'إيمتى بيصير المسح، تعرف إيمتى المنيو عم تشتغل صح.'
			}
		]
	}
]
