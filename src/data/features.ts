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
		title: 'A menu built for the phone it opens on',
		lede: 'Not a PDF on a screen. A menu laid out for a thumb, that loads before the water arrives.',
		screen: 'menu-sections.png',
		eyebrowAr: 'ما يراه الضيوف',
		titleAr: 'قائمة مصممة للهاتف الذي تُفتح عليه',
		ledeAr: 'ليست ملف PDF على شاشة. قائمة مصممة للإبهام، تُحمَّل قبل وصول كوب الماء.',
		items: [
			{
				title: 'A photo on every item',
				body: 'People order what they can see. Upload one photo per dish and the menu becomes a shopfront rather than a price list.',
				titleAr: 'صورة لكل صنف',
				bodyAr: 'الناس يطلبون ما يرونه. ارفع صورة واحدة لكل طبق وتتحوّل القائمة إلى واجهة عرض بدلًا من قائمة أسعار.'
			},
			{
				title: 'Sections that pin to the top',
				body: 'Your sections become chips that follow the guest down the page. Twelve sections stay one tap apart.',
				titleAr: 'أقسام تثبت في الأعلى',
				bodyAr: 'تتحوّل أقسامك إلى أزرار تلاحق الضيف أثناء تصفح الصفحة. اثنا عشر قسمًا تبقى على بُعد ضغطة واحدة.'
			},
			{
				title: 'Sizes and portions',
				body: 'Single or double, small or large, regular or geisha — each with its own price, on the item, where it belongs.',
				titleAr: 'الأحجام والحصص',
				bodyAr: 'سنغل أو دبل، صغير أو كبير، عادي أو غيشا — كل منها بسعره الخاص، على الصنف نفسه، حيث ينبغي أن يكون.'
			},
			{
				title: 'Descriptions with room to work',
				body: 'Write the full sentence. There is no column width to fight and no reprint cost for a longer line.',
				titleAr: 'أوصاف بمساحة كافية',
				bodyAr: 'اكتب الجملة كاملة. لا عرض عمود يحدّك ولا تكلفة إعادة طباعة لسطر أطول.'
			},
			{
				title: 'Loads in under a second',
				body: 'Images are compressed and sized on upload. Nobody abandons the menu waiting for it.',
				titleAr: 'تُحمَّل في أقل من ثانية',
				bodyAr: 'تُضغط الصور وتُحجَّم عند الرفع. لا أحد يغادر القائمة بانتظار تحميلها.'
			},
			{
				title: 'No app, no sign-in',
				body: 'It opens in whatever browser the phone already has. No download, no account, no cookie wall.',
				titleAr: 'بلا تطبيق، بلا تسجيل دخول',
				bodyAr: 'تُفتح في أي متصفح موجود مسبقًا على الهاتف. بلا تحميل، بلا حساب، بلا جدار موافقة على الكوكيز.'
			}
		]
	},
	{
		id: 'languages',
		eyebrow: 'Reach',
		title: 'Every language your dining room speaks',
		lede: 'Add a language in the dashboard and the entire menu — sections, items, descriptions — comes back translated.',
		screen: 'language-switch.png',
		eyebrowAr: 'الوصول',
		titleAr: 'كل لغة يتحدثها صالة مطعمك',
		ledeAr: 'أضف لغة من لوحة التحكم وتعود القائمة بأكملها — الأقسام والأصناف والأوصاف — مترجمة.',
		items: [
			{
				title: 'Automatic translation',
				body: 'You write the menu once, in your language. Guests switch to theirs from the header.',
				titleAr: 'ترجمة تلقائية',
				bodyAr: 'تكتب القائمة مرة واحدة، بلغتك. يبدّل الضيوف إلى لغتهم من الرأس العلوي.'
			},
			{
				title: 'Proper right-to-left Arabic',
				body: 'Not a mirrored English layout. The menu rebuilds itself for Arabic readers.',
				titleAr: 'عربية صحيحة من اليمين لليسار',
				bodyAr: 'ليست تخطيطًا إنجليزيًا معكوسًا. القائمة تعيد بناء نفسها لقارئ العربية.'
			},
			{
				title: 'Edit any translation',
				body: 'Machine translation gets a dish name wrong now and then. Override it and the correction sticks.',
				titleAr: 'عدّل أي ترجمة',
				bodyAr: 'الترجمة الآلية قد تخطئ في اسم طبق أحيانًا. صحّحها وتبقى التصحيح ثابتًا.'
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
		titleAr: 'أجب عن سؤال الحساسية قبل أن يُطرح',
		ledeAr: 'المعلومات التي يحتاجها الضيف ليطلب بثقة، مرفقة بالصنف نفسه بدلًا من ورقة مغلّفة خلف الصندوق.',
		items: [
			{
				title: 'Calories and macros',
				body: 'Calories, carbs, fat and protein per item. Optional — switch them off for the whole menu if you would rather not.',
				titleAr: 'السعرات الحرارية والعناصر الغذائية',
				bodyAr: 'السعرات الحرارية والكربوهيدرات والدهون والبروتين لكل صنف. اختياري — أوقفها للقائمة بأكملها إن أردت.'
			},
			{
				title: 'Allergen and dietary tags',
				body: 'Vegan, vegetarian, gluten-free, nut-free, halal. Tag once and the tag travels with the item everywhere.',
				titleAr: 'وسوم الحساسية والنظام الغذائي',
				bodyAr: 'نباتي صرف، نباتي، خالٍ من الغلوتين، خالٍ من المكسرات، حلال. ضع الوسم مرة واحدة ويرافق الصنف أينما ظهر.'
			},
			{
				title: 'Meal-type filters',
				body: 'Hot, cold, decaf, healthy, light portion, sweet. Guests filter a long menu down to the shortlist they actually want.',
				titleAr: 'فلاتر نوع الوجبة',
				bodyAr: 'ساخن، بارد، بدون كافيين، صحي، حصة خفيفة، حلو. يفلتر الضيوف قائمة طويلة إلى القائمة المختصرة التي يريدونها فعلًا.'
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
		titleAr: 'رمز واحد. اطبعه مرة واحدة.',
		ledeAr: 'رمز الـQR يشير إلى قائمتك، لا إلى ملف. غيّر القائمة مئة مرة ويبقى الرمز على الطاولة يعمل.',
		items: [
			{
				title: 'A code that never expires',
				body: 'The commonest and most expensive QR mistake is encoding a PDF. Ours resolves to your live menu, permanently.',
				titleAr: 'رمز لا تنتهي صلاحيته أبدًا',
				bodyAr: 'أشيع أخطاء رموز الـQR وأكثرها كلفة هو ترميز ملف PDF. رمزنا يشير إلى قائمتك الحية، بشكل دائم.'
			},
			{
				title: 'Print-ready downloads',
				body: 'PNG for quick jobs, SVG for the printer, PDF for table tents, stickers and window decals.',
				titleAr: 'تنزيلات جاهزة للطباعة',
				bodyAr: 'PNG للمهام السريعة، SVG للمطبعة، PDF لحوامل الطاولات والملصقات وملصقات النوافذ.'
			},
			{
				title: 'A plain link, too',
				body: 'The same menu opens from your Instagram bio, your Google Business profile, a WhatsApp reply or a delivery bag.',
				titleAr: 'ورابط بسيط أيضًا',
				bodyAr: 'نفس القائمة تُفتح من السيرة الذاتية على إنستغرام، أو ملف نشاطك على جوجل، أو رد واتساب، أو كيس توصيل.'
			},
			{
				title: 'Your own venue page',
				body: 'Cover photo, logo, your story, and one-tap call, WhatsApp, Maps, Instagram and Google review buttons.',
				titleAr: 'صفحة مكانك الخاصة',
				bodyAr: 'صورة غلاف وشعار وقصتك، وأزرار اتصال وواتساب وخرائط وإنستغرام وتقييم جوجل بضغطة واحدة.'
			},
			{
				title: 'Wi-Fi password on the menu',
				body: 'The second most common question at any table, answered on the screen already in their hand.',
				titleAr: 'كلمة مرور الواي فاي على القائمة',
				bodyAr: 'ثاني أكثر سؤال شيوعًا على أي طاولة، له إجابة على الشاشة الموجودة في يدهم أصلًا.'
			}
		]
	},
	{
		id: 'dashboard',
		dash: 'dash-sections',
		dashBrief: 'A menu being built: sections added, reordered and filled with items',
		dashBriefAr: 'قائمة قيد الإنشاء: أقسام مضافة ومُعاد ترتيبها ومملوءة بالأصناف',
		eyebrow: 'What you control',
		eyebrowAr: 'ما تتحكم به',
		title: 'The whole menu, from your phone',
		titleAr: 'القائمة كاملة، من هاتفك',
		lede: 'Everything a guest sees is a field you own. Nothing needs a designer, a developer or a support ticket.',
		ledeAr: 'كل ما يراه الضيف هو حقل تملكه أنت. لا شيء يحتاج مصممًا أو مطورًا أو تذكرة دعم.',
		screen: null,
		items: [
			{
				title: 'Unlimited menus',
				titleAr: 'قوائم غير محدودة',
				body: 'Breakfast, lunch, weekend brunch, Ramadan. Build them all, publish the one that applies.',
				bodyAr: 'إفطار، غداء، برنش نهاية الأسبوع، رمضان. ابنِها كلها، ثم انشر ما يناسب اللحظة.'
			},
			{
				title: 'Reorder by dragging',
				titleAr: 'أعد الترتيب بالسحب',
				body: 'Section and item order is a merchandising decision. Make it in ten seconds, as often as you like.',
				bodyAr: 'ترتيب الأقسام والأصناف قرار تسويقي. غيّره خلال عشر ثوانٍ، بقدر ما تشاء.'
			},
			{
				title: 'Sold-out toggle',
				titleAr: 'مفتاح النفاد',
				body: 'Hide a dish the minute it runs out and bring it back tomorrow. No guest orders what you cannot serve.',
				bodyAr: 'أخفِ طبقًا لحظة نفاده وأعده غدًا. لا يطلب أي ضيف ما لا تستطيع تقديمه.'
			},
			{
				title: 'Brand it',
				titleAr: 'اجعلها هويتك',
				body: 'Cover, logo, accent colour. The menu looks like your venue, not like our software.',
				bodyAr: 'غلاف، شعار، لون مميز. تبدو القائمة كمنشأتك، لا كبرنامجنا.'
			},
			{
				title: 'Unlimited updates',
				titleAr: 'تحديثات غير محدودة',
				body: 'There is no edit limit and no publish queue. Save is live.',
				bodyAr: 'لا حد للتعديل ولا قائمة انتظار للنشر. الحفظ يعني النشر فورًا.'
			}
		]
	},
	{
		id: 'analytics',
		dash: 'dash-qr',
		dashBrief: 'The QR panel: total scans, the menu it points at, and the shareable link',
		dashBriefAr: 'لوحة الـQR: إجمالي المسحات، القائمة التي يشير إليها، والرابط القابل للمشاركة',
		eyebrow: 'Evidence',
		eyebrowAr: 'الدليل',
		title: 'Find out what the menu is actually doing',
		titleAr: 'اكتشف ما تفعله القائمة فعليًا',
		lede: 'A printed menu tells you nothing. This one tells you what got opened and what got scrolled past.',
		ledeAr: 'القائمة المطبوعة لا تخبرك بشيء. هذه تخبرك بما فُتح وما تم تجاوزه.',
		screen: null,
		items: [
			{
				title: 'Views and scans',
				titleAr: 'المشاهدات والمسحات',
				body: 'How many people opened the menu, and whether that is going up.',
				bodyAr: 'كم عدد من فتحوا القائمة، وهل هذا العدد في ازدياد.'
			},
			{
				title: 'Popular items',
				titleAr: 'الأصناف الأكثر رواجًا',
				body: 'Which dishes get opened most — and which get ignored, which is the more useful list.',
				bodyAr: 'أي الأطباق يُفتح أكثر — وأيها يُتجاهَل، وهي القائمة الأكثر فائدة فعليًا.'
			},
			{
				title: 'Peak hours',
				titleAr: 'ساعات الذروة',
				body: 'When the scanning happens, so you know when the menu is doing its work.',
				bodyAr: 'متى يحدث المسح، حتى تعرف متى تؤدي القائمة عملها.'
			}
		]
	}
]
