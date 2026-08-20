import { PRICE, SITE } from '../config/site'

export type Faq = { q: string; a: string; qAr: string; aAr: string }
export type FaqGroup = { heading: string; items: Faq[]; headingAr: string }

/**
 * Grouped for /faq, and a subset is pulled onto the home page. Everything here
 * is emitted as FAQPage JSON-LD, so answers are written to stand alone — a
 * search result or an AI answer will quote one without the question around it.
 */
export const FAQ_GROUPS: FaqGroup[] = [
	{
		heading: 'Getting started',
		headingAr: 'البدء',
		items: [
			{
				q: 'How long does it take to set up a QR menu?',
				a: `Building the first menu is real work, and we do it for you. Send us your existing PDF, photos or printed card and we type it in by hand — every section, item, description and price — then hand it back for you to check and correct. How long that takes depends on the size of your menu and how quickly we can settle the details with you. Once it is live you are in control, and every change you make after that appears instantly. There is a ${PRICE.trialDays}-day free trial and no card is needed to start.`,
				qAr: 'كم تستغرق مدة إعداد قائمة QR؟',
				aAr: `إعداد القائمة الأولى عمل حقيقي، ونحن من يقوم به نيابة عنك. أرسل لنا ملف PDF الحالي، أو الصور، أو البطاقة المطبوعة، ونقوم بكتابتها يدويًا — كل قسم وصنف ووصف وسعر — ثم نعيدها لك لمراجعتها وتصحيحها. المدة تعتمد على حجم قائمتك وسرعة تأكيد التفاصيل معك. بمجرد أن تصبح مباشرة، تكون أنت المتحكم، وكل تغيير تجريه بعد ذلك يظهر فورًا. هناك فترة تجريبية مجانية مدتها ${PRICE.trialDays} يومًا، ولا حاجة لبطاقة للبدء.`
			},
			{
				q: 'Do I need to be technical to use it?',
				a: 'No. Everything is a form field in a dashboard — item name, price, description, photo. If you can post to Instagram you can run an Astro-Menu menu. There is nothing to install and nothing to host.',
				qAr: 'هل أحتاج إلى خبرة تقنية لاستخدامه؟',
				aAr: 'لا. كل شيء عبارة عن حقل في نموذج داخل لوحة التحكم — اسم الصنف، السعر، الوصف، الصورة. إن كنت تستطيع النشر على إنستغرام، فأنت قادر على إدارة قائمة Astro-Menu. لا شيء لتثبيته ولا شيء لاستضافته.'
			},
			{
				q: 'What do you need from me to build the first menu?',
				a: 'Your current menu in any form — a PDF, a photo of the printed card, or a spreadsheet — plus your logo and a cover photo of the venue. Dish photos are optional at the start and can be added item by item afterwards. Expect a little back and forth while we check prices and spellings with you — that is normal, and it is how the menu ends up right.',
				qAr: 'ماذا تحتاجون مني لإعداد القائمة الأولى؟',
				aAr: 'قائمتك الحالية بأي شكل — ملف PDF، صورة للبطاقة المطبوعة، أو جدول بيانات — بالإضافة إلى شعارك وصورة غلاف للمطعم. صور الأطباق اختيارية في البداية ويمكن إضافتها صنفًا بصنف لاحقًا. توقع بعض التواصل ذهابًا وإيابًا للتأكد من الأسعار والتهجئة معك — هذا أمر طبيعي، وهو ما يجعل القائمة صحيحة في النهاية.'
			},
			{
				q: 'Can I try it before paying?',
				a: `Yes. Every account starts with a ${PRICE.trialDays}-day free trial and no card is required. You can build the whole menu, print the code and put it on tables during the trial.`,
				qAr: 'هل يمكنني تجربته قبل الدفع؟',
				aAr: `نعم. يبدأ كل حساب بفترة تجريبية مجانية مدتها ${PRICE.trialDays} يومًا دون الحاجة لبطاقة. يمكنك إعداد القائمة كاملة، وطباعة الرمز، ووضعه على الطاولات خلال الفترة التجريبية.`
			}
		]
	},
	{
		heading: 'Pricing',
		headingAr: 'التسعير',
		items: [
			{
				q: 'How much does Astro-Menu cost?',
				a: `Astro-Menu is ${PRICE.monthly} per month, or ${PRICE.annualPerMonth} per month when you pay ${PRICE.annualTotal} for the year — a saving of ${PRICE.annualSaving}, about ${PRICE.annualSavingPercent}%. That is one price for everything: unlimited menus, unlimited items, unlimited views, every language and all updates. In dirhams it is ${PRICE.monthlyAed} a month or ${PRICE.annualTotalAed} a year.`,
				qAr: 'كم تبلغ تكلفة Astro-Menu؟',
				aAr: `يبلغ سعر Astro-Menu ${PRICE.monthly} شهريًا، أو ${PRICE.annualPerMonth} شهريًا عند الدفع ${PRICE.annualTotal} سنويًا — بتوفير قدره ${PRICE.annualSaving}، أي نحو ${PRICE.annualSavingPercent}٪. هذا سعر واحد لكل شيء: قوائم غير محدودة، أصناف غير محدودة، مشاهدات غير محدودة، جميع اللغات وكل التحديثات. بالدرهم، السعر ${PRICE.monthlyAed} شهريًا أو ${PRICE.annualTotalAed} سنويًا.`
			},
			{
				q: 'Do you take a commission on orders?',
				a: 'No, and we could not — Astro-Menu does not process orders or payments at all. It is a menu. Your staff take orders the way they always have, and every dirham your customer spends goes straight to you.',
				qAr: 'هل تأخذون عمولة على الطلبات؟',
				aAr: 'لا، ولا يمكننا ذلك أصلًا — لا تعالج Astro-Menu أي طلبات أو مدفوعات على الإطلاق. إنها قائمة طعام فقط. يستقبل طاقمك الطلبات كما اعتادوا دائمًا، وكل درهم ينفقه عميلك يذهب إليك مباشرة.'
			},
			{
				q: 'Are there setup fees, hardware costs or contracts?',
				a: 'None. There is no setup fee, nothing to buy and no minimum term. A printed QR code is the only hardware involved, and you can cancel from the dashboard whenever you like.',
				qAr: 'هل هناك رسوم إعداد، أو تكاليف أجهزة، أو عقود؟',
				aAr: 'لا شيء من ذلك. لا رسوم إعداد، ولا شيء لشرائه، ولا مدة تعاقد دنيا. رمز QR المطبوع هو الجهاز الوحيد المطلوب، ويمكنك الإلغاء من لوحة التحكم متى شئت.'
			},
			{
				q: 'Is there a limit on scans or menu views?',
				a: 'No. Menu views are unlimited, whether you get fifty scans a month or fifty thousand.',
				qAr: 'هل هناك حد لعدد المسحات أو مشاهدات القائمة؟',
				aAr: 'لا. مشاهدات القائمة غير محدودة، سواء حصلت على خمسين مسحًا في الشهر أو خمسين ألفًا.'
			},
			{
				q: 'What happens if I cancel?',
				a: 'Your menu stops being served and the QR code stops resolving. Nothing else happens — there is no exit fee and no notice period. Come back later and your menu is still there.',
				qAr: 'ماذا يحدث إذا ألغيت الاشتراك؟',
				aAr: 'تتوقف قائمتك عن العمل ويتوقف رمز QR عن الفتح. لا يحدث شيء آخر — لا رسوم إنهاء ولا فترة إشعار. عد لاحقًا وستجد قائمتك ما زالت موجودة.'
			}
		]
	},
	{
		heading: 'How the menu works',
		headingAr: 'كيف تعمل القائمة',
		items: [
			{
				q: 'Do my customers need to download an app?',
				a: 'No. The menu opens in whatever browser is already on the phone. Point the camera at the code and it opens — no download, no account, no sign-in.',
				qAr: 'هل يحتاج عملائي إلى تحميل تطبيق؟',
				aAr: 'لا. تُفتح القائمة في أي متصفح موجود بالفعل على الهاتف. وجّه الكاميرا نحو الرمز فتفتح القائمة — بلا تحميل، بلا حساب، بلا تسجيل دخول.'
			},
			{
				q: 'Will I have to reprint the QR code when the menu changes?',
				a: 'No, and this is the single most important thing to get right. The code points at your menu, not at a file. Change prices, add dishes, rebuild the whole menu — the printed code on the table keeps working. Codes that encode a PDF have to be reprinted every time, which is what forces most venues to start over.',
				qAr: 'هل سأحتاج لإعادة طباعة رمز QR عند تغيير القائمة؟',
				aAr: 'لا، وهذه هي النقطة الأهم على الإطلاق. الرمز يشير إلى قائمتك، وليس إلى ملف. غيّر الأسعار، أضف أطباقًا، أعد بناء القائمة بالكامل — يبقى الرمز المطبوع على الطاولة يعمل. الرموز التي تشفّر ملف PDF يجب إعادة طباعتها في كل مرة، وهذا ما يضطر معظم المطاعم لإعادة البدء من جديد.'
			},
			{
				q: 'Can I show the menu in Arabic?',
				a: 'Yes. Add Arabic in the dashboard and the whole menu is translated and laid out right-to-left. Guests switch language from the header. Any language works the same way, and you can override an individual translation if a dish name comes back wrong.',
				qAr: 'هل يمكنني عرض القائمة بالعربية؟',
				aAr: 'نعم. أضف اللغة العربية في لوحة التحكم وتُترجم القائمة بأكملها وتُعرض من اليمين إلى اليسار. يبدّل الضيوف اللغة من الرأس العلوي. أي لغة أخرى تعمل بنفس الطريقة، ويمكنك تعديل ترجمة معينة يدويًا إذا جاء اسم طبق بشكل غير صحيح.'
			},
			{
				q: 'Can I hide a dish that has sold out?',
				a: 'Yes — one toggle. The item disappears from the live menu immediately and comes back whenever you switch it on again, so nobody orders something you cannot serve.',
				qAr: 'هل يمكنني إخفاء طبق نفدت كميته؟',
				aAr: 'نعم، بزر واحد. يختفي الصنف من القائمة المباشرة فورًا ويعود عندما تُفعّله مجددًا، بحيث لا يطلب أحد ما لا يمكنك تقديمه.'
			},
			{
				q: 'Can I show calories, macros and allergens?',
				a: 'Yes. Calories, carbs, fat and protein can be shown per item, and dietary and allergen tags attach to the item so they travel with it. Both are optional — switch them off for the whole menu if you would rather not display them.',
				qAr: 'هل يمكنني عرض السعرات الحرارية والعناصر الغذائية ومسببات الحساسية؟',
				aAr: 'نعم. يمكن عرض السعرات الحرارية والكربوهيدرات والدهون والبروتين لكل صنف، كما تُلحق علامات النظام الغذائي والحساسية بالصنف فترافقه أينما ظهر. كلاهما اختياري — يمكنك إيقافهما للقائمة بأكملها إن فضّلت عدم عرضهما.'
			},
			{
				q: 'Can guests filter a long menu?',
				a: 'Yes. Guests filter by meal type — hot, cold, decaf, healthy, light portion, sweet — and jump between sections from chips pinned at the top of the screen. On a 120-item menu that is the difference between finding a drink in seconds and giving up.',
				qAr: 'هل يستطيع الضيوف تصفية قائمة طويلة؟',
				aAr: 'نعم. يصفّي الضيوف حسب نوع الوجبة — ساخن، بارد، منزوع الكافيين، صحي، حصة خفيفة، حلو — وينتقلون بين الأقسام عبر أزرار مثبتة أعلى الشاشة. في قائمة من 120 صنفًا، هذا هو الفرق بين إيجاد مشروب خلال ثوانٍ والاستسلام.'
			},
			{
				q: 'Does it work without an internet connection?',
				a: 'The guest needs a connection to load the menu the first time, the same as opening any web page. Most venues put their Wi-Fi password on the menu page itself for exactly this reason.',
				qAr: 'هل تعمل دون اتصال بالإنترنت؟',
				aAr: 'يحتاج الضيف إلى اتصال لتحميل القائمة في المرة الأولى، تمامًا كأي صفحة ويب. لهذا السبب بالتحديد، تضع معظم المطاعم كلمة مرور الواي فاي على صفحة القائمة نفسها.'
			}
		]
	},
	{
		heading: 'Sharing and search',
		headingAr: 'المشاركة والبحث',
		items: [
			{
				q: 'Can I use the menu outside the restaurant?',
				a: 'Yes, and most of the value is there. Every menu has a plain link as well as a QR code, so the same menu opens from your Google Business profile, Google Maps, your Instagram bio, a WhatsApp reply or a printed flyer. People decide where to eat before they leave the house.',
				qAr: 'هل يمكنني استخدام القائمة خارج المطعم؟',
				aAr: 'نعم، وهناك تكمن معظم قيمتها. لكل قائمة رابط بسيط إلى جانب رمز QR، بحيث تفتح نفس القائمة من صفحة نشاطك التجاري على جوجل، أو خرائط جوجل، أو سيرتك الذاتية على إنستغرام، أو رد على واتساب، أو منشور مطبوع. يقرر الناس أين سيأكلون قبل أن يغادروا المنزل.'
			},
			{
				q: 'Will my menu show up on Google?',
				a: 'A hosted menu page can be crawled and indexed, which a PDF or a photograph of a menu effectively cannot. Adding your menu link to your Google Business profile is the highest-return thing you can do with it.',
				qAr: 'هل ستظهر قائمتي في نتائج جوجل؟',
				aAr: 'يمكن لصفحة قائمة مستضافة أن تُزحف إليها وتُفهرس، بعكس ملف PDF أو صورة قائمة اللذين لا يمكن فهرستهما فعليًا. إضافة رابط قائمتك إلى صفحة نشاطك التجاري على جوجل هو أفضل استثمار يمكنك القيام به.'
			},
			{
				q: 'Can I use it across several branches?',
				a: `Each branch gets its own menu, its own QR code and its own venue page, so prices and availability can differ between them. Email ${SITE.email} for a multi-branch setup.`,
				qAr: 'هل يمكنني استخدامه عبر عدة فروع؟',
				aAr: `يحصل كل فرع على قائمته الخاصة، ورمز QR الخاص به، وصفحته الخاصة، بحيث يمكن أن تختلف الأسعار والتوفر بينها. راسلنا على ${SITE.email} لإعداد نظام متعدد الفروع.`
			}
		]
	},
	{
		heading: 'What Astro-Menu is not',
		headingAr: 'ما لا تقدمه Astro-Menu',
		items: [
			{
				q: 'Is there a POS or till system?',
				a: 'No. Astro-Menu is a digital menu and nothing else. Keep whatever till you already use — we do not replace it, integrate with it, or sit between you and your customer.',
				qAr: 'هل يوجد نظام نقاط بيع أو صندوق كاشير؟',
				aAr: 'لا. Astro-Menu هي قائمة طعام رقمية ولا شيء غير ذلك. احتفظ بأي صندوق تستخدمه بالفعل — نحن لا نستبدله، ولا نتكامل معه، ولا نقف بينك وبين عميلك.'
			},
			{
				q: 'Can customers order and pay from the menu?',
				a: 'No. There is no cart, no ordering and no payment. That is deliberate: it keeps the product simple, keeps the price at one flat fee, and means we never take a commission.',
				qAr: 'هل يستطيع العملاء الطلب والدفع من خلال القائمة؟',
				aAr: 'لا. لا توجد سلة شراء، ولا استقبال طلبات، ولا دفع. هذا مقصود: فهو يبقي المنتج بسيطًا، ويبقي السعر رسمًا ثابتًا واحدًا، ويعني أننا لا نأخذ أي عمولة على الإطلاق.'
			},
			{
				q: 'Do you supply tablets, printers or stands?',
				a: 'No hardware at all. You print the QR code on whatever you already use — a table tent, a sticker, a window decal, the back of a business card.',
				qAr: 'هل توفرون أجهزة لوحية أو طابعات أو حوامل؟',
				aAr: 'لا أجهزة على الإطلاق. تطبع رمز QR على أي وسيلة تستخدمها بالفعل — بطاقة طاولة، ملصق، ملصق نافذة، أو ظهر بطاقة عملك.'
			}
		]
	}
]

export const ALL_FAQS: Faq[] = FAQ_GROUPS.flatMap((g) => g.items)

/** The subset shown on the home page — the questions that actually block a sale. */
const HOME_FAQ_QUESTIONS = [
	'How much does Astro-Menu cost?',
	'Will I have to reprint the QR code when the menu changes?',
	'Do my customers need to download an app?',
	'Do you take a commission on orders?',
	'Can I show the menu in Arabic?',
	'How long does it take to set up a QR menu?'
]

export const HOME_FAQS: Faq[] = HOME_FAQ_QUESTIONS.map((q) => {
	const found = ALL_FAQS.find((f) => f.q === q)
	// Fails the build rather than silently dropping a question if one is renamed.
	if (!found) throw new Error(`HOME_FAQ_QUESTIONS names a question missing from FAQ_GROUPS: ${q}`)
	return found
})
